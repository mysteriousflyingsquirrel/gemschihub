import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app, db } from '../../firebase/firebaseConfig';
import { Season } from '../../types/season';

const COLLECTION = 'seasons';

export function listenSeasons(
  onData: (seasons: Season[]) => void,
  onError: (error: unknown) => void
): () => void {
  return onSnapshot(
    collection(db, COLLECTION),
    (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Season))),
    onError
  );
}

export async function createSeason(name: string): Promise<Season> {
  const data = { name, isActive: false, createdAt: new Date().toISOString() };
  const ref = await addDoc(collection(db, COLLECTION), data);
  return { id: ref.id, ...data };
}

export async function patchSeason(id: string, updates: Partial<Omit<Season, 'id'>>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), updates);
}

export async function activateSeason(id: string, seasons: Season[]): Promise<void> {
  const batch = writeBatch(db);
  seasons.forEach((season) => {
    batch.update(doc(db, COLLECTION, season.id), { isActive: season.id === id });
  });
  await batch.commit();
}

export async function deleteSeasonSafely(id: string): Promise<void> {
  const existing = await getDocs(
    query(collection(db, 'events'), where('seasonId', '==', id), limit(1))
  );
  if (!existing.empty) {
    throw new Error('Saison kann nicht gelöscht werden, solange Events vorhanden sind.');
  }

  const functions = getFunctions(app, 'us-central1');
  const deleteSeason = httpsCallable<{ seasonId: string }, { success: boolean }>(functions, 'deleteSeason');
  await deleteSeason({ seasonId: id });
}
