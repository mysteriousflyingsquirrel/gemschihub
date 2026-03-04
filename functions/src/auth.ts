import { HttpsError } from 'firebase-functions/v2/https';

const CAPTAIN_EMAILS = (process.env.CAPTAIN_EMAILS || '')
  .split(',')
  .map((v) => v.trim().toLowerCase())
  .filter(Boolean);

export function requireCaptainEmail(auth: { token?: { email?: string } } | null | undefined): string {
  if (!auth) {
    throw new HttpsError('unauthenticated', 'Authentication required.');
  }

  const email = auth.token?.email?.toLowerCase();
  if (!email) {
    throw new HttpsError('permission-denied', 'Authenticated email is required.');
  }

  if (CAPTAIN_EMAILS.length === 0) {
    throw new HttpsError('failed-precondition', 'CAPTAIN_EMAILS is not configured on backend.');
  }

  if (!CAPTAIN_EMAILS.includes(email)) {
    throw new HttpsError('permission-denied', 'Captain permissions required.');
  }

  return email;
}
