export type EventType = 'Training' | 'Interclub' | 'Spirit';

export type EventStatus = 'Upcoming' | 'Ongoing' | 'Completed';

export type MatchStatus = 'Offen' | 'Am Spielen' | 'Gespielt';

export interface GameScore {
  ourScore: number;
  opponentScore: number;
}

export interface SinglesGame {
  gameNumber: number; // 1-6
  playerId: string | null;
  set1: GameScore | null;
  set2: GameScore | null;
  set3: GameScore | null;
}

export interface DoublesGame {
  gameNumber: number; // 7-9
  player1Id: string | null;
  player2Id: string | null;
  set1: GameScore | null;
  set2: GameScore | null;
  set3: GameScore | null;
}

export interface InterclubData {
  opponent: string;
  matchStatus: MatchStatus;
  singlesGames: SinglesGame[];
  doublesGames: DoublesGame[];
  totalScore: { ourScore: number; opponentScore: number };
  instagramLink?: string;
}

export interface AppEvent {
  id: string;
  seasonId: string;
  type: EventType;
  title: string;
  startDateTime: string; // ISO date-time string
  location?: string;
  interclub?: InterclubData; // Only present when type === 'Interclub'
}

/** Derive event status from start time. */
export function deriveEventStatus(startDateTime: string, durationHours: number = 2): EventStatus {
  const now = new Date();
  const start = new Date(startDateTime);
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

  if (now < start) return 'Upcoming';
  if (now >= start && now <= end) return 'Ongoing';
  return 'Completed';
}

/** Calculate game winner from set scores (best of 3). */
export function calculateGameWinner(game: SinglesGame | DoublesGame): 'our' | 'opponent' | null {
  if (!game.set1) return null;

  let ourWins = 0;
  let opponentWins = 0;

  const sets = [game.set1, game.set2, game.set3];
  for (const set of sets) {
    if (!set) continue;
    if (set.ourScore > set.opponentScore) ourWins++;
    else if (set.opponentScore > set.ourScore) opponentWins++;
  }

  if (ourWins >= 2) return 'our';
  if (opponentWins >= 2) return 'opponent';
  return null;
}

/** Calculate total match score from all 9 games. */
export function calculateTotalScore(
  singlesGames: SinglesGame[],
  doublesGames: DoublesGame[]
): { ourScore: number; opponentScore: number } {
  let ourScore = 0;
  let opponentScore = 0;

  for (const game of [...singlesGames, ...doublesGames]) {
    const winner = calculateGameWinner(game);
    if (winner === 'our') ourScore++;
    else if (winner === 'opponent') opponentScore++;
  }

  return { ourScore, opponentScore };
}

/** Derive match status from game completion. */
export function deriveMatchStatus(
  singlesGames: SinglesGame[],
  doublesGames: DoublesGame[]
): MatchStatus {
  const allGames = [...singlesGames, ...doublesGames];
  const completedGames = allGames.filter(g => g.set1 !== null).length;

  if (completedGames === 0) return 'Offen';
  if (completedGames < 9) return 'Am Spielen';
  return 'Gespielt';
}

/** Create empty singles games (1-6). */
export function createEmptySinglesGames(): SinglesGame[] {
  return Array.from({ length: 6 }, (_, i) => ({
    gameNumber: i + 1,
    playerId: null,
    set1: null,
    set2: null,
    set3: null,
  }));
}

/** Create empty doubles games (7-9). */
export function createEmptyDoublesGames(): DoublesGame[] {
  return Array.from({ length: 3 }, (_, i) => ({
    gameNumber: i + 7,
    player1Id: null,
    player2Id: null,
    set1: null,
    set2: null,
    set3: null,
  }));
}
