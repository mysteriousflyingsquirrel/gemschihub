/**
 * GemschiHub — Firebase Cloud Functions
 *
 * Functions for sending push notifications:
 * 1. sendEventReminder — Callable: sends upcoming event reminders
 * 2. sendLiveUpdate — Callable: sends Interclub live score updates
 * 3. scheduledReminder — Scheduled: runs periodically to check for upcoming events
 */

import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';

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
    notification: { title, body },
    data: data || {},
    tokens,
    webpush: {
      notification: {
        icon: '/favicon.svg',
        badge: '/favicon.svg',
      },
    },
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
      .where('token', 'in', invalidTokens.slice(0, 10)) // Firestore "in" max 10
      .get();
    tokenDocs.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    console.log(`Cleaned up ${tokenDocs.size} invalid tokens.`);
  }

  console.log(`Sent: ${response.successCount} success, ${response.failureCount} failure.`);
  return { success: response.successCount, failure: response.failureCount };
}

/**
 * Callable: Send an event reminder notification.
 * Called by Captain from admin panel.
 */
export const sendEventReminder = onCall(async (request) => {
  // Verify the caller is authenticated
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required.');
  }

  const { title, body, eventId } = request.data as { title: string; body: string; eventId?: string };
  if (!title || !body) {
    throw new HttpsError('invalid-argument', 'Title and body are required.');
  }

  return sendToAll(title, body, { type: 'event_reminder', eventId: eventId || '' });
});

/**
 * Callable: Send a live Interclub score update.
 * Called by Captain when scores change during a match.
 */
export const sendLiveUpdate = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required.');
  }

  const { title, body, eventId, ourScore, opponentScore } = request.data as {
    title: string;
    body: string;
    eventId: string;
    ourScore: string;
    opponentScore: string;
  };

  if (!title || !body) {
    throw new HttpsError('invalid-argument', 'Title and body are required.');
  }

  return sendToAll(title, body, {
    type: 'live_update',
    eventId: eventId || '',
    ourScore: ourScore || '0',
    opponentScore: opponentScore || '0',
  });
});

/**
 * Scheduled: Check for upcoming events and send reminders.
 * Runs every hour.
 */
export const scheduledReminder = onSchedule('every 1 hours', async () => {
  // Get events starting in the next 2 hours
  const now = new Date();
  const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  const eventsSnapshot = await db.collection('events')
    .where('startDateTime', '>=', now.toISOString())
    .where('startDateTime', '<=', twoHoursLater.toISOString())
    .get();

  for (const doc of eventsSnapshot.docs) {
    const event = doc.data();
    // Check if reminder was already sent
    const reminderSent = event.reminderSent || false;
    if (reminderSent) continue;

    const title = `${event.type}: ${event.title}`;
    const body = `Beginnt um ${new Date(event.startDateTime).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })} · ${event.location || ''}`;

    await sendToAll(title, body, { type: 'event_start', eventId: doc.id });

    // Mark reminder as sent
    await doc.ref.update({ reminderSent: true });
  }

  console.log(`Checked ${eventsSnapshot.size} upcoming events.`);
});

/**
 * Store a push token (callable).
 * Called from the client after obtaining FCM permission.
 */
export const registerPushToken = onCall(async (request) => {
  const { token } = request.data as { token: string };
  if (!token) {
    throw new HttpsError('invalid-argument', 'Token is required.');
  }

  // Upsert token
  const existing = await db.collection('push_tokens').where('token', '==', token).get();
  if (existing.empty) {
    await db.collection('push_tokens').add({
      token,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      userId: request.auth?.uid || null,
    });
  }

  return { success: true };
});
