/**
 * Only two access levels: Public (no login) and Admin (Captain).
 * No "member" role exists.
 */
export interface AppUser {
  uid: string;
  email: string;
  isAdmin: boolean; // true if email is in CAPTAIN_EMAILS allowlist
}
