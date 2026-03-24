"use strict";
/**
 * GemschiHub — Scheduled Cleanup for Old Notifications
 *
 * Runs daily and deletes notifications older than 7 days
 * to keep the in-app inbox clean and performant.
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
exports.cleanupOldNotifications = void 0;
const admin = __importStar(require("firebase-admin"));
const scheduler_1 = require("firebase-functions/v2/scheduler");
function getDb() {
    return admin.firestore();
}
const RETENTION_DAYS = 7;
const TIMEZONE = 'Europe/Zurich';
exports.cleanupOldNotifications = (0, scheduler_1.onSchedule)({ schedule: 'every day 03:00', timeZone: TIMEZONE }, async () => {
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
});
//# sourceMappingURL=cleanupOldNotifications.js.map