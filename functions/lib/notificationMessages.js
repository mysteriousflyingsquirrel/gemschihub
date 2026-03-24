"use strict";
/**
 * GemschiHub — Notification Message Templates
 *
 * Edit these templates to change push notification wording.
 * Use {placeholders} for dynamic values.
 *
 * Available placeholders:
 *   {title}      — Event title (e.g. "Interclub vs. TC Thun")
 *   {type}       — Event type (Training, Interclub, Spirit)
 *   {time}       — Start time (e.g. "18:30")
 *   {date}       — Start date (e.g. "15.03.2026")
 *   {location}   — Event location
 *   {opponent}   — Interclub opponent name
 *   {ourScore}   — Our total score
 *   {oppScore}   — Opponent total score
 *   {gameLabel}  — Game label (e.g. "Einzel 3", "Doppel 1")
 *   {gameResult} — Game result word ("gewonnen" / "verloren")
 *   {result}     — Final result word ("gewonnen!" / "verloren" / "unentschieden")
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTERCLUB_FINAL_LOST = exports.INTERCLUB_FINAL_WON = exports.INTERCLUB_GAME_LOST = exports.INTERCLUB_GAME_WON = exports.EVENT_START = exports.REMINDER_1H = exports.REMINDER_6H = exports.REMINDER_1D = exports.EVENT_ICONS = void 0;
exports.fillTemplate = fillTemplate;
// ─── Event Type Icons ────────────────────────────────────────────
exports.EVENT_ICONS = {
    Training: '🏃',
    Interclub: '🏆',
    Spirit: '🎉',
};
// ─── Time-based Reminders ────────────────────────────────────────
exports.REMINDER_1D = {
    title: '{icon} Morgen: {title}',
    body: '{date}, {time} Uhr — {location}',
};
exports.REMINDER_6H = {
    title: '{icon} Heute: {title}',
    body: 'Um {time} Uhr — {location}',
};
exports.REMINDER_1H = {
    title: '{icon} In 1 Stunde: {title}',
    body: '{time} Uhr — {location}',
};
exports.EVENT_START = {
    title: '{icon} Jetzt geht es los: {title}',
    body: '{time} Uhr — {location}',
};
// ─── Interclub Score Updates ─────────────────────────────────────
exports.INTERCLUB_GAME_WON = {
    title: '🏆 {title}',
    body: 'Geile Scheisse! {gameLabel} zlataniert! Stand: {ourScore}:{oppScore}',
};
exports.INTERCLUB_GAME_LOST = {
    title: '🏆 {title}',
    body: 'Irgend e Pfiffa het z {gameLabel} verlore! Stand: {ourScore}:{oppScore}',
};
exports.INTERCLUB_FINAL_WON = {
    title: '🏆 {title} - Sieg! 🎉',
    body: '{ourScore}:{oppScore} - Ab id Möscht!',
};
exports.INTERCLUB_FINAL_LOST = {
    title: '🏆 {title} - Niederlage',
    body: '{ourScore}:{oppScore} - No bueno bro!',
};
// ─── Helper: Fill placeholders ───────────────────────────────────
function fillTemplate(template, values) {
    let title = template.title;
    let body = template.body;
    for (const [key, val] of Object.entries(values)) {
        const placeholder = `{${key}}`;
        title = title.split(placeholder).join(val || '');
        body = body.split(placeholder).join(val || '');
    }
    // Clean up double spaces and trailing dashes from empty placeholders
    title = title.replace(/\s{2,}/g, ' ').replace(/\s*—\s*$/, '').trim();
    body = body.replace(/\s{2,}/g, ' ').replace(/\s*—\s*$/, '').trim();
    return { title, body };
}
//# sourceMappingURL=notificationMessages.js.map