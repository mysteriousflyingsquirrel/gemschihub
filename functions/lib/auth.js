"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireCaptainEmail = requireCaptainEmail;
const https_1 = require("firebase-functions/v2/https");
const CAPTAIN_EMAILS = (process.env.CAPTAIN_EMAILS || '')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
function requireCaptainEmail(auth) {
    var _a, _b;
    if (!auth) {
        throw new https_1.HttpsError('unauthenticated', 'Authentication required.');
    }
    const email = (_b = (_a = auth.token) === null || _a === void 0 ? void 0 : _a.email) === null || _b === void 0 ? void 0 : _b.toLowerCase();
    if (!email) {
        throw new https_1.HttpsError('permission-denied', 'Authenticated email is required.');
    }
    if (CAPTAIN_EMAILS.length === 0) {
        throw new https_1.HttpsError('failed-precondition', 'CAPTAIN_EMAILS is not configured on backend.');
    }
    if (!CAPTAIN_EMAILS.includes(email)) {
        throw new https_1.HttpsError('permission-denied', 'Captain permissions required.');
    }
    return email;
}
//# sourceMappingURL=auth.js.map