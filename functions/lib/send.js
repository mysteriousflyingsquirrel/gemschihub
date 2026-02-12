"use strict";
/**
 * GemschiHub — Shared push notification sender
 *
 * Used by index.ts (manual send), checkEventReminders.ts, and onEventUpdated.ts.
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
exports.sendToAll = sendToAll;
const admin = __importStar(require("firebase-admin"));
/** Lazy accessor — avoids calling firestore() before initializeApp(). */
function getDb() {
    return admin.firestore();
}
/**
 * Get all stored FCM tokens from Firestore.
 */
async function getAllTokens() {
    const snapshot = await getDb().collection('push_tokens').get();
    return snapshot.docs.map(doc => doc.data().token).filter(Boolean);
}
/**
 * Send a data-only notification to all subscribed devices.
 * Returns success/failure counts.
 */
async function sendToAll(title, body, data) {
    const tokens = await getAllTokens();
    if (tokens.length === 0) {
        console.log('[Send] No tokens to send to.');
        return { success: 0, failure: 0 };
    }
    const fcm = admin.messaging();
    const message = {
        data: { title, body, ...(data || {}) },
        tokens,
    };
    const response = await fcm.sendEachForMulticast(message);
    // Clean up invalid tokens
    const invalidTokens = [];
    response.responses.forEach((resp, idx) => {
        var _a;
        if (!resp.success && ((_a = resp.error) === null || _a === void 0 ? void 0 : _a.code) === 'messaging/registration-token-not-registered') {
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
    return { success: response.successCount, failure: response.failureCount };
}
//# sourceMappingURL=send.js.map