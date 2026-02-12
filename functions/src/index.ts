/**
 * GemschiHub — Firebase Cloud Functions
 *
 * 1. registerPushToken — Stores an FCM token in Firestore
 * 2. sendNotification  — Sends a custom notification to all subscribers (Captain only)
 */

import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

admin.initializeApp();

const db = admin.firestore();
const fcm = admin.messaging();

/**
 * Get all stored FCM tokens from Firestore.
 */
async function getAllTokens(): Promise<string[]> {
  const snapshot = await db.collection('push_tokens').get();
  return snapshot.docs.map(doc => doc.data().token as string).filter(Boolean);
}

/**
 * Send a notification to all subscribed devices.
 */
async function sendToAll(title: string, body: string, data?: Record<string, string>) {
  const tokens = await getAllTokens();
  if (tokens.length === 0) {
    console.log('No tokens to send to.');
    return { success: 0, failure: 0 };
  }

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
    const tokenDocs = await db.collection('push_tokens')
      .where('token', 'in', invalidTokens.slice(0, 10))
      .get();
    tokenDocs.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    console.log(`Cleaned up ${tokenDocs.size} invalid tokens.`);
  }

  console.log(`Sent: ${response.successCount} success, ${response.failureCount} failure.`);
  return { success: response.successCount, failure: response.failureCount };
}

/**
 * Store a push token (callable from client).
 * One user can have multiple devices, so we only deduplicate by exact token.
 */
export const registerPushToken = onCall(async (request) => {
  const { token } = request.data as { token: string };
  if (!token) {
    throw new HttpsError('invalid-argument', 'Token is required.');
  }

  // Deduplicate by token — one entry per device
  const existing = await db.collection('push_tokens')
    .where('token', '==', token)
    .get();

  if (existing.empty) {
    await db.collection('push_tokens').add({
      token,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  return { success: true };
});

/**
 * Send a custom notification to all subscribers (Captain only).
 */
export const sendNotification = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required.');
  }

  const { title, body } = request.data as { title: string; body: string };
  if (!title || !body) {
    throw new HttpsError('invalid-argument', 'Title and body are required.');
  }

  return sendToAll(title, body, { type: 'custom' });
});
