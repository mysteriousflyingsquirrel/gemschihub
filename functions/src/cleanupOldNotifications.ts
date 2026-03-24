/**
 * GemschiHub — Scheduled Cleanup for Old Notifications
 *
 * Runs daily and deletes notifications older than 7 days
 * to keep the in-app inbox clean and performant.
 */

import * as admin from 'firebase-admin';
import { onSchedule } from 'firebase-functions/v2/scheduler';

function getDb() {
  return admin.firestore();
}

const RETENTION_DAYS = 7;
const TIMEZONE = 'Europe/Zurich';

export const cleanupOldNotifications = onSchedule(
  { schedule: 'every day 03:00', timeZone: TIMEZONE },
  async () => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);

    console.log(`[Cleanup] Deleting notifications older than ${cutoffDate.toISOString()}`);

    const snapshot = await getDb()
      .collection('notifications')
      .where('createdAt', '<', cutoffDate)
      .get();

    if (snapshot.empty) {
      console.log('[Cleanup] No old notifications to delete.');
      return;
    }

    const batch = getDb().batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    console.log(`[Cleanup] Deleted ${snapshot.size} old notification(s).`);
  }
);
