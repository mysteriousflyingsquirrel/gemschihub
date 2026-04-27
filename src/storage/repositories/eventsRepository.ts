import {
  addDoc,
  collection,
  deleteField,
  DocumentData,
  doc,
  getDocs,
  onSnapshot,
  query,
  UpdateData,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { AppEvent } from '../../types/event';

const COLLECTION = 'events';

export function listenEvents(
  onData: (events: AppEvent[]) => void,
  onError: (error: unknown) => void
): () => void {
  return onSnapshot(
    collection(db, COLLECTION),
    (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as AppEvent))),
    onError
  );
}

export async function createEvent(eventData: Omit<AppEvent, 'id'>): Promise<AppEvent> {
  const ref = await addDoc(collection(db, COLLECTION), eventData);
  return { id: ref.id, ...eventData };
}

export async function patchEvent(id: string, updates: Partial<AppEvent>): Promise<void> {
  const { id: _id, ...cleanUpdates } = updates as AppEvent;
  const firestoreUpdates: UpdateData<DocumentData> = {};
  for (const [key, value] of Object.entries(cleanUpdates)) {
    firestoreUpdates[key] = value === undefined ? deleteField() : value;
  }
  await updateDoc(doc(db, COLLECTION, id), firestoreUpdates);
}

export async function removeEventCascade(id: string): Promise<void> {
  const attendanceSnap = await getDocs(
    query(collection(db, 'attendance'), where('eventId', '==', id))
  );
  const batch = writeBatch(db);
  attendanceSnap.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(doc(db, COLLECTION, id));
  await batch.commit();
}

export async function getEventAttendancePlayerIds(eventId: string): Promise<Set<string>> {
  const attendanceSnap = await getDocs(
    query(collection(db, 'attendance'), where('eventId', '==', eventId))
  );
  return new Set<string>(
    attendanceSnap.docs
      .map((d) => (d.data() as { playerId?: string }).playerId)
      .filter(Boolean) as string[]
  );
}
