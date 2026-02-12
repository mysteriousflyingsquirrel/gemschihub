"use strict";
/**
 * GemschiHub — Firestore Trigger: Interclub Score Notifications
 *
 * Fires when an event document is updated. Detects:
 *   1. Newly completed individual games → sends per-game score update
 *   2. All 9 games completed (matchStatus → "Gespielt") → sends final score
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.onEventUpdated = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const notificationMessages_1 = require("./notificationMessages");
const send_1 = require("./send");
// ─── Helpers ─────────────────────────────────────────────────────
/** Calculate game winner from set scores (best of 3). */
function calculateGameWinner(game) {
    if (!game.set1)
        return null;
    let ourWins = 0;
    let opponentWins = 0;
    for (const set of [game.set1, game.set2, game.set3]) {
        if (!set)
            continue;
        if (set.ourScore > set.opponentScore)
            ourWins++;
        else if (set.opponentScore > set.ourScore)
            opponentWins++;
    }
    if (ourWins >= 2)
        return 'our';
    if (opponentWins >= 2)
        return 'opponent';
    return null;
}
/** Check if a game has a completed result (has at least set1). */
function isGameCompleted(game) {
    return calculateGameWinner(game) !== null;
}
/** Get human-readable game label. */
function getGameLabel(game) {
    if (game.gameNumber <= 6)
        return `Einzel ${game.gameNumber}`;
    return `Doppel ${game.gameNumber - 6}`;
}
// ─── Firestore Trigger ───────────────────────────────────────────
exports.onEventUpdated = (0, firestore_1.onDocumentUpdated)('events/{eventId}', async (event) => {
    var _a, _b;
    const before = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before.data();
    const after = (_b = event.data) === null || _b === void 0 ? void 0 : _b.after.data();
    if (!before || !after)
        return;
    // Only care about Interclub events with interclub data
    if (after.type !== 'Interclub')
        return;
    if (!after.interclub || !before.interclub)
        return;
    const beforeIC = before.interclub;
    const afterIC = after.interclub;
    const eventId = event.params.eventId;
    const eventTitle = after.title || `Interclub vs. ${afterIC.opponent}`;
    // ── 1. Check for final score (all games completed) ───────────
    if (afterIC.matchStatus === 'Gespielt' &&
        beforeIC.matchStatus !== 'Gespielt') {
        const { ourScore, opponentScore } = afterIC.totalScore;
        const template = ourScore > opponentScore ? notificationMessages_1.INTERCLUB_FINAL_WON : notificationMessages_1.INTERCLUB_FINAL_LOST;
        const { title, body } = (0, notificationMessages_1.fillTemplate)(template, {
            title: eventTitle,
            ourScore: String(ourScore),
            oppScore: String(opponentScore),
        });
        console.log(`[InterclubScore] Final score for ${eventId}: ${ourScore}:${opponentScore}`);
        await (0, send_1.sendToAll)(title, body, { type: 'interclub_final', eventId });
        // Don't also send individual game updates when match completes
        return;
    }
    // ── 2. Check for newly completed individual games (delta) ────
    const allGamesBefore = [...(beforeIC.singlesGames || []), ...(beforeIC.doublesGames || [])];
    const allGamesAfter = [...(afterIC.singlesGames || []), ...(afterIC.doublesGames || [])];
    for (const gameAfter of allGamesAfter) {
        // Find corresponding game before
        const gameBefore = allGamesBefore.find(g => g.gameNumber === gameAfter.gameNumber);
        const wasCompleted = gameBefore ? isGameCompleted(gameBefore) : false;
        const isNowCompleted = isGameCompleted(gameAfter);
        // Only notify about newly completed games
        if (isNowCompleted && !wasCompleted) {
            const winner = calculateGameWinner(gameAfter);
            const gameLabel = getGameLabel(gameAfter);
            const { ourScore, opponentScore } = afterIC.totalScore;
            const template = winner === 'our' ? notificationMessages_1.INTERCLUB_GAME_WON : notificationMessages_1.INTERCLUB_GAME_LOST;
            const { title, body } = (0, notificationMessages_1.fillTemplate)(template, {
                title: eventTitle,
                gameLabel,
                ourScore: String(ourScore),
                oppScore: String(opponentScore),
            });
            console.log(`[InterclubScore] Game ${gameAfter.gameNumber} completed for ${eventId}: ${winner}`);
            await (0, send_1.sendToAll)(title, body, {
                type: 'interclub_score',
                eventId,
                gameNumber: String(gameAfter.gameNumber),
            });
        }
    }
});
//# sourceMappingURL=onEventUpdated.js.map