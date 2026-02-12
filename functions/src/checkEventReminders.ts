/**
 * GemschiHub — Scheduled Event Reminder Notifications
 *
 * Runs every 5 minutes. Checks upcoming events and sends reminders:
 *   - Spirit / Training: 6h and 1h before
 *   - Interclub: 1 day, 6h, and 1h before
 *
 * Uses a `notification_log` Firestore collection to avoid duplicate sends.
 */

import * as admin from 'firebase-admin';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import {
  REMINDER_1D,
  REMINDER_6H,
  REMINDER_1H,
  EVENT_ICONS,
  fillTemplate,
} from './notificationMessages';
import { sendToAll } from './send';

const db = admin.firestore();

// ─── Reminder Windows (in minutes) ──────────────────────────────

interface ReminderWindow {
  type: '1d' | '6h' | '1h';
  minBefore: number; // earliest (larger number = further ahead)
  maxBefore: number; // latest  (smaller number = closer to event)
  template: { title: string; body: string };
  eventTypes: string[]; // which event types get this reminder
}

const REMINDER_WINDOWS: ReminderWindow[] = [
  {
    type: '1d',
    minBefore: 24 * 60 + 10, // 24h10m
    maxBefore: 24 * 60 - 5,  // 23h55m
    template: REMINDER_1D,
    eventTypes: ['Interclub'],
  },
  {
    type: '6h',
    minBefore: 6 * 60 + 10,  // 6h10m
    maxBefore: 6 * 60 - 5,   // 5h55m
    template: REMINDER_6H,
    eventTypes: ['Training', 'Interclub', 'Spirit'],
  },
  {
    type: '1h',
    minBefore: 60 + 10,      // 1h10m
    maxBefore: 60 - 5,       // 55m
    template: REMINDER_1H,
    eventTypes: ['Training', 'Interclub', 'Spirit'],
  },
];

// Default start time for all-day events
const DEFAULT_TIME = '09:00';

// ─── Helpers ─────────────────────────────────────────────────────

function parseEventStart(startDate: string, startTime?: string, allDay?: boolean): Date {
  const time = (allDay || !startTime) ? DEFAULT_TIME : startTime;
  return new Date(`${startDate}T${time}:00`);
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${d}.${m}.${y}`;
}

async function wasAlreadySent(eventId: string, reminderType: string): Promise<boolean> {
  const snap = await db.collection('notification_log')
    .where('eventId', '==', eventId)
    .where('reminderType', '==', reminderType)
    .limit(1)
    .get();
  return !snap.empty;
}

async function markAsSent(eventId: string, reminderType: string): Promise<void> {
  await db.collection('notification_log').add({
    eventId,
    reminderType,
    sentAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

// ─── Scheduled Function ──────────────────────────────────────────

export const checkEventReminders = onSchedule(
  { schedule: 'every 5 minutes', timeZone: 'Europe/Zurich' },
  async () => {
    const now = new Date();
    console.log(`[Reminders] Running at ${now.toISOString()}`);

    // Fetch events starting today or tomorrow (covers 1-day-ahead reminders)
    const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const tomorrow = new Date(now.getTime() + 26 * 60 * 60 * 1000)
      .toISOString().slice(0, 10);

    const snapshot = await db.collection('events')
      .where('startDate', '>=', today)
      .where('startDate', '<=', tomorrow)
      .get();

    if (snapshot.empty) {
      console.log('[Reminders] No upcoming events found.');
      return;
    }

    console.log(`[Reminders] Found ${snapshot.size} event(s) to check.`);

    for (const doc of snapshot.docs) {
      const event = doc.data();
      const eventId = doc.id;
      const eventType: string = event.type || '';
      const eventStart = parseEventStart(event.startDate, event.startTime, event.allDay);

      // Minutes until event start
      const diffMs = eventStart.getTime() - now.getTime();
      const diffMin = diffMs / (1000 * 60);

      for (const window of REMINDER_WINDOWS) {
        // Skip if event type doesn't match this reminder
        if (!window.eventTypes.includes(eventType)) continue;

        // Check if current time falls within the reminder window
        if (diffMin > window.minBefore || diffMin < window.maxBefore) continue;

        // Check deduplication
        if (await wasAlreadySent(eventId, window.type)) {
          console.log(`[Reminders] Already sent ${window.type} for event ${eventId}, skipping.`);
          continue;
        }

        // Build notification
        const icon = EVENT_ICONS[eventType] || '📅';
        const time = event.allDay ? DEFAULT_TIME : (event.startTime || DEFAULT_TIME);
        const values: Record<string, string> = {
          icon,
          title: event.title || eventType,
          type: eventType,
          time,
          date: formatDate(event.startDate),
          location: event.location || '',
        };

        const { title, body } = fillTemplate(window.template, values);

        console.log(`[Reminders] Sending ${window.type} reminder for "${event.title}" (${eventId})`);
        await sendToAll(title, body, { type: 'reminder', eventId });
        await markAsSent(eventId, window.type);
      }
    }

    console.log('[Reminders] Done.');
  }
);
