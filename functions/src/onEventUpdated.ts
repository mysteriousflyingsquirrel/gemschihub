/**
 * GemschiHub — Firestore Trigger: Interclub Score Notifications
 *
 * Fires when an event document is updated. Detects:
 *   1. Newly completed individual games → sends per-game score update
 *   2. All 9 games completed (matchStatus → "Gespielt") → sends final score
 */

import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import {
  INTERCLUB_GAME_WON,
  INTERCLUB_GAME_LOST,
  INTERCLUB_FINAL_WON,
  INTERCLUB_FINAL_LOST,
  fillTemplate,
} from './notificationMessages';
import { sendToAll } from './send';

// ─── Types (mirrored from client — only what we need) ────────────

interface GameScore {
  ourScore: number;
  opponentScore: number;
}

interface SinglesGame {
  gameNumber: number;
  set1: GameScore | null;
  set2: GameScore | null;
  set3: GameScore | null;
}

interface DoublesGame {
  gameNumber: number;
  set1: GameScore | null;
  set2: GameScore | null;
  set3: GameScore | null;
}

interface InterclubData {
  opponent: string;
  matchStatus: string;
  singlesGames: SinglesGame[];
  doublesGames: DoublesGame[];
  totalScore: { ourScore: number; opponentScore: number };
}

// ─── Helpers ─────────────────────────────────────────────────────

/** Calculate game winner from set scores (best of 3). */
function calculateGameWinner(game: SinglesGame | DoublesGame): 'our' | 'opponent' | null {
  if (!game.set1) return null;

  let ourWins = 0;
  let opponentWins = 0;
  for (const set of [game.set1, game.set2, game.set3]) {
    if (!set) continue;
    if (set.ourScore > set.opponentScore) ourWins++;
    else if (set.opponentScore > set.ourScore) opponentWins++;
  }

  if (ourWins >= 2) return 'our';
  if (opponentWins >= 2) return 'opponent';
  return null;
}

/** Check if a game has a completed result (has at least set1). */
function isGameCompleted(game: SinglesGame | DoublesGame): boolean {
  return calculateGameWinner(game) !== null;
}

/** Get human-readable game label. */
function getGameLabel(game: SinglesGame | DoublesGame): string {
  if (game.gameNumber <= 6) return `Einzel ${game.gameNumber}`;
  return `Doppel ${game.gameNumber - 6}`;
}

// ─── Firestore Trigger ───────────────────────────────────────────

export const onEventUpdated = onDocumentUpdated(
  'events/{eventId}',
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;

    // Only care about Interclub events with interclub data
    if (after.type !== 'Interclub') return;
    if (!after.interclub || !before.interclub) return;

    const beforeIC: InterclubData = before.interclub;
    const afterIC: InterclubData = after.interclub;
    const eventId = event.params.eventId;
    const eventTitle = after.title || `Interclub vs. ${afterIC.opponent}`;

    // ── 1. Check for final score (all games completed) ───────────
    if (
      afterIC.matchStatus === 'Gespielt' &&
      beforeIC.matchStatus !== 'Gespielt'
    ) {
      const { ourScore, opponentScore } = afterIC.totalScore;
      const template = ourScore > opponentScore ? INTERCLUB_FINAL_WON : INTERCLUB_FINAL_LOST;

      const { title, body } = fillTemplate(template, {
        title: eventTitle,
        ourScore: String(ourScore),
        oppScore: String(opponentScore),
      });

      console.log(`[InterclubScore] Final score for ${eventId}: ${ourScore}:${opponentScore}`);
      await sendToAll(title, body, { type: 'interclub_final', eventId });
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

        const template = winner === 'our' ? INTERCLUB_GAME_WON : INTERCLUB_GAME_LOST;
        const { title, body } = fillTemplate(template, {
          title: eventTitle,
          gameLabel,
          ourScore: String(ourScore),
          oppScore: String(opponentScore),
        });

        console.log(`[InterclubScore] Game ${gameAfter.gameNumber} completed for ${eventId}: ${winner}`);
        await sendToAll(title, body, {
          type: 'interclub_score',
          eventId,
          gameNumber: String(gameAfter.gameNumber),
        });
      }
    }
  }
);
