/**
 * Spirit value: manually assigned per player per season by the Captain.
 * Value is 0-100 (percentage).
 */
export interface SpiritValue {
  id: string;
  playerId: string;
  seasonId: string;
  value: number; // 0-100
}
