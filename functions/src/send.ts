/**
 * GemschiHub — Shared push notification sender
 *
 * Used by index.ts (manual send), checkEventReminders.ts, and onEventUpdated.ts.
 * Also persists notifications to Firestore for the in-app notification inbox.
 */

import * as admin from 'firebase-admin';

/** Lazy accessor — avoids calling firestore() before initializeApp(). */
function getDb() {
  return admin.firestore();
}

/** Notification metadata for persistence. */
export interface NotificationMetadata {
  type: 'reminder' | 'interclub_game' | 'interclub_final' | 'custom';
  eventId?: string;
  gameNumber?: number;
}

/**
 * Persist a notification to Firestore for the in-app inbox.
 */
async function saveNotification(
  title: string,
  body: string,
  metadata: NotificationMetadata
): Promise<void> {
  const doc: Record<string, unknown> = {
    type: metadata.type,
    title,
    body,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  if (metadata.eventId) doc.eventId = metadata.eventId;
  if (metadata.gameNumber !== undefined) doc.gameNumber = metadata.gameNumber;

  await getDb().collection('notifications').add(doc);
  console.log(`[Send] Notification persisted: ${metadata.type}`);
}

/**
 * Get all stored FCM tokens from Firestore.
 */
async function getAllTokens(): Promise<string[]> {
  const snapshot = await getDb().collection('push_tokens').get();
  return snapshot.docs.map(doc => doc.data().token as string).filter(Boolean);
}

/**
 * Send a data-only notification to all subscribed devices.
 * Also persists the notification to Firestore for the in-app inbox.
 * Returns success/failure counts.
 */
export async function sendToAll(
  title: string,
  body: string,
  data?: Record<string, string>,
  metadata?: NotificationMetadata
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
    const db = getDb();
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

  // Persist notification to Firestore for in-app inbox
  if (metadata) {
    try {
      await saveNotification(title, body, metadata);
    } catch (err) {
      console.error('[Send] Failed to persist notification:', err);
    }
  }

  return { success: response.successCount, failure: response.failureCount };
}
