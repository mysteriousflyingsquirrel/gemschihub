"use strict";
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
exports.onEventUpdated = exports.checkEventReminders = exports.sendNotification = exports.unregisterPushToken = exports.registerPushToken = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const send_1 = require("./send");
admin.initializeApp();
const db = admin.firestore();
// ─── Callable Functions ──────────────────────────────────────────
/**
 * Store a push token (callable from client).
 * One user can have multiple devices, so we only deduplicate by exact token.
 */
exports.registerPushToken = (0, https_1.onCall)(async (request) => {
    const { token } = request.data;
    if (!token) {
        throw new https_1.HttpsError('invalid-argument', 'Token is required.');
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
exports.unregisterPushToken = (0, https_1.onCall)(async (request) => {
    const { token } = request.data;
    if (!token) {
        throw new https_1.HttpsError('invalid-argument', 'Token is required.');
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
exports.sendNotification = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Authentication required.');
    }
    const { title, body } = request.data;
    if (!title || !body) {
        throw new https_1.HttpsError('invalid-argument', 'Title and body are required.');
    }
    return (0, send_1.sendToAll)(title, body, { type: 'custom' });
});
// ─── Automated Functions (re-exported) ───────────────────────────
var checkEventReminders_1 = require("./checkEventReminders");
Object.defineProperty(exports, "checkEventReminders", { enumerable: true, get: function () { return checkEventReminders_1.checkEventReminders; } });
var onEventUpdated_1 = require("./onEventUpdated");
Object.defineProperty(exports, "onEventUpdated", { enumerable: true, get: function () { return onEventUpdated_1.onEventUpdated; } });
//# sourceMappingURL=index.js.map