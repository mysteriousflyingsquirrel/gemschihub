"use strict";
/**
 * GemschiHub — Scheduled Event Reminder Notifications
 *
 * Runs every 5 minutes. Checks upcoming events and sends reminders:
 *   - Spirit / Training: 6h and 1h before
 *   - Interclub: 1 day, 6h, and 1h before
 *
 * Uses a `notification_log` Firestore collection to avoid duplicate sends.
 *
 * IMPORTANT: All event times are stored in Europe/Zurich local time.
 * The server runs in UTC, so we must convert properly.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEventReminders = void 0;
const admin = __importStar(require("firebase-admin"));
const scheduler_1 = require("firebase-functions/v2/scheduler");
const notificationMessages_1 = require("./notificationMessages");
const send_1 = require("./send");
/** Lazy accessor — avoids calling firestore() before initializeApp(). */
function getDb() {
    return admin.firestore();
}
// ─── Timezone Handling ───────────────────────────────────────────
const TIMEZONE = 'Europe/Zurich';
/**
 * Get current date string (YYYY-MM-DD) in Europe/Zurich timezone.
 */
function getZurichDateString(date) {
    return date.toLocaleDateString('sv-SE', { timeZone: TIMEZONE }); // sv-SE gives YYYY-MM-DD
}
/**
 * Parse an event's start date+time as a Europe/Zurich local time
 * and return a UTC Date object for comparison with Date.now().
 *
 * Events store dates as "YYYY-MM-DD" and times as "HH:MM" in Swiss local time.
 */
function parseEventStartAsUTC(startDate, startTime, allDay) {
    const time = (allDay || !startTime) ? DEFAULT_TIME : startTime;
    // Build an ISO-ish string and use Intl to figure out the UTC offset
    const [hours, minutes] = time.split(':').map(Number);
    const [year, month, day] = startDate.split('-').map(Number);
    // Create a date in UTC first, then find what the offset is for Zurich at that moment
    const roughUtc = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
    // Get the Zurich offset by comparing formatted Zurich time to UTC
    const zurichStr = roughUtc.toLocaleString('en-US', { timeZone: TIMEZONE });
    const zurichDate = new Date(zurichStr);
    const offsetMs = zurichDate.getTime() - roughUtc.getTime();
    // The actual UTC time = local time - offset
    return new Date(roughUtc.getTime() - offsetMs);
}
/**
 * Windows are 15 minutes wide to reliably catch the 5-minute cron.
 * Deduplication (notification_log) prevents double-sends.
 */
const REMINDER_WINDOWS = [
    {
        type: '1d',
        minBefore: 24 * 60 + 10, // 24h10m before
        maxBefore: 24 * 60 - 5, // 23h55m before
        template: notificationMessages_1.REMINDER_1D,
        eventTypes: ['Interclub'],
    },
    {
        type: '6h',
        minBefore: 6 * 60 + 10, // 6h10m before
        maxBefore: 6 * 60 - 5, // 5h55m before
        template: notificationMessages_1.REMINDER_6H,
        eventTypes: ['Training', 'Interclub', 'Spirit'],
    },
    {
        type: '1h',
        minBefore: 60 + 10, // 1h10m before
        maxBefore: 60 - 10, // 50m before (wider: 20 min window)
        template: notificationMessages_1.REMINDER_1H,
        eventTypes: ['Training', 'Interclub', 'Spirit'],
    },
];
// Default start time for all-day events
const DEFAULT_TIME = '09:00';
// ─── Helpers ─────────────────────────────────────────────────────
function formatDate(dateStr) {
    const [y, m, d] = dateStr.split('-');
    return `${d}.${m}.${y}`;
}
async function wasAlreadySent(eventId, reminderType) {
    const snap = await getDb().collection('notification_log')
        .where('eventId', '==', eventId)
        .where('reminderType', '==', reminderType)
        .limit(1)
        .get();
    return !snap.empty;
}
async function markAsSent(eventId, reminderType) {
    await getDb().collection('notification_log').add({
        eventId,
        reminderType,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
    });
}
// ─── Scheduled Function ──────────────────────────────────────────
exports.checkEventReminders = (0, scheduler_1.onSchedule)({ schedule: 'every 5 minutes', timeZone: TIMEZONE }, async () => {
    const now = new Date();
    const nowUtcMs = now.getTime();
    console.log(`[Reminders] Running at ${now.toISOString()} (UTC)`);
    // Get today/tomorrow in Zurich timezone for the Firestore query
    const today = getZurichDateString(now);
    const tomorrowDate = new Date(nowUtcMs + 30 * 60 * 60 * 1000); // +30h to be safe
    const tomorrow = getZurichDateString(tomorrowDate);
    console.log(`[Reminders] Checking events from ${today} to ${tomorrow} (Zurich time)`);
    const snapshot = await getDb().collection('events')
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
        const eventType = event.type || '';
        const eventStartUtc = parseEventStartAsUTC(event.startDate, event.startTime, event.allDay);
        // Minutes until event start (both in UTC, so comparison is correct)
        const diffMs = eventStartUtc.getTime() - nowUtcMs;
        const diffMin = diffMs / (1000 * 60);
        console.log(`[Reminders] Event "${event.title}" (${eventId}): starts ${event.startDate} ${event.startTime || 'all-day'}, diffMin=${diffMin.toFixed(1)}`);
        for (const window of REMINDER_WINDOWS) {
            // Skip if event type doesn't match this reminder
            if (!window.eventTypes.includes(eventType))
                continue;
            // Check if current time falls within the reminder window
            if (diffMin > window.minBefore || diffMin < window.maxBefore)
                continue;
            // Check deduplication
            if (await wasAlreadySent(eventId, window.type)) {
                console.log(`[Reminders] Already sent ${window.type} for event ${eventId}, skipping.`);
                continue;
            }
            // Build notification
            const icon = notificationMessages_1.EVENT_ICONS[eventType] || '📅';
            const time = event.allDay ? DEFAULT_TIME : (event.startTime || DEFAULT_TIME);
            const values = {
                icon,
                title: event.title || eventType,
                type: eventType,
                time,
                date: formatDate(event.startDate),
                location: event.location || '',
            };
            const { title, body } = (0, notificationMessages_1.fillTemplate)(window.template, values);
            console.log(`[Reminders] Sending ${window.type} reminder for "${event.title}" (${eventId}): "${title}" / "${body}"`);
            await (0, send_1.sendToAll)(title, body, { type: 'reminder', eventId });
            await markAsSent(eventId, window.type);
        }
    }
    console.log('[Reminders] Done.');
});
//# sourceMappingURL=checkEventReminders.js.map