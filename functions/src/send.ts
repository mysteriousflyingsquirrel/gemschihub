/**
 * GemschiHub — Shared push notification sender
 *
 * Used by index.ts (manual send), checkEventReminders.ts, and onEventUpdated.ts.
 */

import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * Get all stored FCM tokens from Firestore.
 */
async function getAllTokens(): Promise<string[]> {
  const snapshot = await db.collection('push_tokens').get();
  return snapshot.docs.map(doc => doc.data().token as string).filter(Boolean);
}

/**
 * Send a data-only notification to all subscribed devices.
 * Returns success/failure counts.
 */
export async function sendToAll(
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<{ success: number; failure: number }> {
  const tokens = await getAllTokens();
  if (tokens.length === 0) {
    console.log('[Send] No tokens to send to.');
    return { success: 0, failure: 0 };
  }

  const fcm = admin.messaging();
  const message: admin.messaging.MulticastMessage = {
    data: { title, body, ...(data || {}) },
    tokens,
  };

  const response = await fcm.sendEachForMulticast(message);

  // Clean up invalid tokens
  const invalidTokens: string[] = [];
  response.responses.forEach((resp, idx) => {
    if (!resp.success && resp.error?.code === 'messaging/registration-token-not-registered') {
      invalidTokens.push(tokens[idx]);
    }
  });
  if (invalidTokens.length > 0) {
    const batch = db.batch();
    // Firestore 'in' operator supports max 10 items per query
    for (let i = 0; i < invalidTokens.length; i += 10) {
      const chunk = invalidTokens.slice(i, i + 10);
      const tokenDocs = await db.collection('push_tokens')
        .where('token', 'in', chunk)
        .get();
      tokenDocs.docs.forEach(doc => batch.delete(doc.ref));
    }
    await batch.commit();
    console.log(`[Send] Cleaned up ${invalidTokens.length} invalid token(s).`);
  }

  console.log(`[Send] Sent: ${response.successCount} success, ${response.failureCount} failure.`);
  return { success: response.successCount, failure: response.failureCount };
}
