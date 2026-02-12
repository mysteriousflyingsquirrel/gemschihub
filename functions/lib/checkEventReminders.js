"use strict";
/**
 * GemschiHub — Scheduled Event Reminder Notifications
 *
 * Runs every 5 minutes. Checks upcoming events and sends reminders:
 *   - Spirit / Training: 6h and 1h before
 *   - Interclub: 1 day, 6h, and 1h before
 *
 * Uses a `notification_log` Firestore collection to avoid duplicate sends.
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
const db = admin.firestore();
const REMINDER_WINDOWS = [
    {
        type: '1d',
        minBefore: 24 * 60 + 10, // 24h10m
        maxBefore: 24 * 60 - 5, // 23h55m
        template: notificationMessages_1.REMINDER_1D,
        eventTypes: ['Interclub'],
    },
    {
        type: '6h',
        minBefore: 6 * 60 + 10, // 6h10m
        maxBefore: 6 * 60 - 5, // 5h55m
        template: notificationMessages_1.REMINDER_6H,
        eventTypes: ['Training', 'Interclub', 'Spirit'],
    },
    {
        type: '1h',
        minBefore: 60 + 10, // 1h10m
        maxBefore: 60 - 5, // 55m
        template: notificationMessages_1.REMINDER_1H,
        eventTypes: ['Training', 'Interclub', 'Spirit'],
    },
];
// Default start time for all-day events
const DEFAULT_TIME = '09:00';
// ─── Helpers ─────────────────────────────────────────────────────
function parseEventStart(startDate, startTime, allDay) {
    const time = (allDay || !startTime) ? DEFAULT_TIME : startTime;
    return new Date(`${startDate}T${time}:00`);
}
function formatDate(dateStr) {
    const [y, m, d] = dateStr.split('-');
    return `${d}.${m}.${y}`;
}
async function wasAlreadySent(eventId, reminderType) {
    const snap = await db.collection('notification_log')
        .where('eventId', '==', eventId)
        .where('reminderType', '==', reminderType)
        .limit(1)
        .get();
    return !snap.empty;
}
async function markAsSent(eventId, reminderType) {
    await db.collection('notification_log').add({
        eventId,
        reminderType,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
    });
}
// ─── Scheduled Function ──────────────────────────────────────────
exports.checkEventReminders = (0, scheduler_1.onSchedule)({ schedule: 'every 5 minutes', timeZone: 'Europe/Zurich' }, async () => {
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
        const eventType = event.type || '';
        const eventStart = parseEventStart(event.startDate, event.startTime, event.allDay);
        // Minutes until event start
        const diffMs = eventStart.getTime() - now.getTime();
        const diffMin = diffMs / (1000 * 60);
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
            console.log(`[Reminders] Sending ${window.type} reminder for "${event.title}" (${eventId})`);
            await (0, send_1.sendToAll)(title, body, { type: 'reminder', eventId });
            await markAsSent(eventId, window.type);
        }
    }
    console.log('[Reminders] Done.');
});
//# sourceMappingURL=checkEventReminders.js.map