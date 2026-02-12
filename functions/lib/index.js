"use strict";
/**
 * GemschiHub — Firebase Cloud Functions
 *
 * 1. registerPushToken — Stores an FCM token in Firestore
 * 2. sendNotification  — Sends a custom notification to all subscribers (Captain only)
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
exports.sendNotification = exports.registerPushToken = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
admin.initializeApp();
const db = admin.firestore();
const fcm = admin.messaging();
/**
 * Get all stored FCM tokens from Firestore.
 */
async function getAllTokens() {
    const snapshot = await db.collection('push_tokens').get();
    return snapshot.docs.map(doc => doc.data().token).filter(Boolean);
}
/**
 * Send a notification to all subscribed devices.
 */
async function sendToAll(title, body, data) {
    const tokens = await getAllTokens();
    if (tokens.length === 0) {
        console.log('No tokens to send to.');
        return { success: 0, failure: 0 };
    }
    const message = {
        notification: { title, body },
        data: data || {},
        tokens,
        webpush: {
            notification: {
                icon: '/icon-192.png',
                badge: '/favicon-32.png',
            },
        },
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
 * Upserts by userId (logged-in) to ensure one token per user.
 * Also cleans up any stale tokens for the same user.
 */
exports.registerPushToken = (0, https_1.onCall)(async (request) => {
    var _a;
    const { token } = request.data;
    if (!token) {
        throw new https_1.HttpsError('invalid-argument', 'Token is required.');
    }
    const userId = ((_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid) || null;
    const batch = db.batch();
    // If user is logged in, remove all their previous tokens (handles token refresh)
    if (userId) {
        const userTokens = await db.collection('push_tokens')
            .where('userId', '==', userId)
            .get();
        userTokens.docs.forEach(doc => batch.delete(doc.ref));
    }
    // Also remove any existing doc with this exact token (from any user)
    const exactMatch = await db.collection('push_tokens')
        .where('token', '==', token)
        .get();
    exactMatch.docs.forEach(doc => batch.delete(doc.ref));
    // Add the new token
    const newRef = db.collection('push_tokens').doc();
    batch.set(newRef, {
        token,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        userId,
    });
    await batch.commit();
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
    return sendToAll(title, body, { type: 'custom' });
});
//# sourceMappingURL=index.js.map