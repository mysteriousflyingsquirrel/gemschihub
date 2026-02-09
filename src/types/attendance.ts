/**
 * Attendance record: who was present at a given event.
 * For Interclub, attendance is separate from participation in games.
 */
export interface AttendanceRecord {
  id: string;
  eventId: string;
  seasonId: string;
  playerId: string;
}
