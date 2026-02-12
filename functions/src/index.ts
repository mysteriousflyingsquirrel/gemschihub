/**
 * GemschiHub — Firebase Cloud Functions
 *
 * Callable:
 *   1. registerPushToken   — Stores an FCM token in Firestore
 *   2. unregisterPushToken — Removes an FCM token from Firestore
 *   3. sendNotification    — Sends a custom notification (Captain only)
 *
 * Automated:
 *   4. checkEventReminders — Scheduled: sends reminders before events
 *   5. onEventUpdated      — Firestore trigger: Interclub score notifications
 */

import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { sendToAll } from './send';

admin.initializeApp();

const db = admin.firestore();

// ─── Callable Functions ──────────────────────────────────────────

/**
 * Store a push token (callable from client).
 * One user can have multiple devices, so we only deduplicate by exact token.
 */
export const registerPushToken = onCall(async (request) => {
  const { token } = request.data as { token: string };
  if (!token) {
    throw new HttpsError('invalid-argument', 'Token is required.');
  }

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
 * Remove a push token (callable from client when user opts out).
 */
export const unregisterPushToken = onCall(async (request) => {
  const { token } = request.data as { token: string };
  if (!token) {
    throw new HttpsError('invalid-argument', 'Token is required.');
  }

  const existing = await db.collection('push_tokens')
    .where('token', '==', token)
    .get();

  if (!existing.empty) {
    const batch = db.batch();
    existing.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
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

// ─── Automated Functions (re-exported) ───────────────────────────

export { checkEventReminders } from './checkEventReminders';
export { onEventUpdated } from './onEventUpdated';
