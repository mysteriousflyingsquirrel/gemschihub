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
}

export interface AppEvent {
  id: string;
  seasonId: string;
  type: EventType;
  title: string;
  startDate: string;        // "YYYY-MM-DD"
  startTime?: string;        // "HH:MM" — omitted for all-day events
  endDate?: string;          // "YYYY-MM-DD" — omitted for single-day events
  allDay: boolean;           // true when no time is specified
  location?: string;
  instagramLink?: string;
  interclub?: InterclubData; // Only present when type === 'Interclub'
}

/** Build a comparable Date from an event's start fields. */
export function getEventStartDate(event: Pick<AppEvent, 'startDate' | 'startTime' | 'allDay'>): Date {
  if (event.allDay || !event.startTime) {
    return new Date(`${event.startDate}T00:00:00`);
  }
  return new Date(`${event.startDate}T${event.startTime}:00`);
}

/** Derive event status from date fields. */
export function deriveEventStatus(event: Pick<AppEvent, 'startDate' | 'startTime' | 'endDate' | 'allDay'>, durationHours: number = 2): EventStatus {
  const now = new Date();
  const start = getEventStartDate(event);

  let end: Date;
  if (event.endDate) {
    end = new Date(`${event.endDate}T23:59:59`);
  } else if (event.allDay) {
    end = new Date(`${event.startDate}T23:59:59`);
  } else {
    end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
  }

  if (now < start) return 'Upcoming';
  if (now <= end) return 'Ongoing';
  return 'Completed';
}

/** Format an event's date/time for display. */
export function formatEventDateDisplay(event: Pick<AppEvent, 'startDate' | 'startTime' | 'endDate' | 'allDay'>): string {
  const fmtDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}.${m}.${y}`;
  };

  const startStr = fmtDate(event.startDate);

  if (event.endDate && event.endDate !== event.startDate) {
    return `${startStr} – ${fmtDate(event.endDate)}`;
  }
  if (event.allDay) {
    return `${startStr} (Ganztägig)`;
  }
  return `${startStr}, ${event.startTime}`;
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
