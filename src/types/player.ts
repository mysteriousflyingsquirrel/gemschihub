export type Gemschigrad = 'Ehrengemschi' | 'Kuttengemschi' | 'Bandanagemschi' | 'Gitzi';
export type Klassierung = 'N1' | 'N2' | 'N3' | 'N4' | 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7' | 'R8' | 'R9';
export type PlayerRole = 'Spieler' | 'Captain' | 'CEO of Patchio';

/**
 * Player entity — persistent across seasons.
 * Seasonal data (stats, spirit) is stored separately.
 */
export interface Player {
  id: string;
  name: string;
  alias?: string;
  role: PlayerRole;
  gemschigrad: Gemschigrad;
  klassierung: Klassierung;
  profilePictureUrl: string | null; // URL or null (upload deferred to Firebase Storage)
  email?: string;
  phone?: string;
  joinDate?: string;
  isActive: boolean; // false = removed from active roster but historical data preserved
}
