export type Gemschigrad = 'Ehrengemschi' | 'Kuttengemschi' | 'Bandanagemschi' | 'Gitzi';
export type Klassierung = 'N1' | 'N2' | 'N3' | 'N4' | 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7' | 'R8' | 'R9';
export type PlayerRole = 'Spieler' | 'Captain' | 'CEO of Patchio';

export interface Player {
  id: string;
  name: string;
  alias?: string;
  gemschigrad: Gemschigrad;
  klassierung: Klassierung;
  email?: string;
  phone?: string;
  joinDate?: string;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  winRate: number;
  role: PlayerRole;
  interclubanwesenheit: number; // Percentage (0-100)
  gewinnrateEinzel: number; // Percentage (0-100)
  gewinnrateDoppel: number; // Percentage (0-100)
  trainingsanwesenheit: number; // Percentage (0-100)
  spirit: number; // Percentage (0-100)
}

