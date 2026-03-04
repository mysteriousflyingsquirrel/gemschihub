import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { AttendanceRecord } from '../../types/attendance';

const COLLECTION = 'attendance';

export function listenAttendance(
  onData: (records: AttendanceRecord[]) => void,
  onError: (error: unknown) => void
): () => void {
  return onSnapshot(
    collection(db, COLLECTION),
    (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as AttendanceRecord))),
    onError
  );
}

export async function replaceEventAttendance(eventId: string, seasonId: string, playerIds: string[]): Promise<void> {
  const existing = await getDocs(query(collection(db, COLLECTION), where('eventId', '==', eventId)));
  const batch = writeBatch(db);
  existing.docs.forEach((d) => batch.delete(d.ref));
  playerIds.forEach((playerId) => {
    batch.set(doc(collection(db, COLLECTION)), { eventId, seasonId, playerId });
  });
  await batch.commit();
}

export async function deleteEventAttendance(eventId: string): Promise<void> {
  const existing = await getDocs(query(collection(db, COLLECTION), where('eventId', '==', eventId)));
  const batch = writeBatch(db);
  existing.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}
