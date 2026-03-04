import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { SpiritValue } from '../../types/spirit';

const COLLECTION = 'spirit';

export function listenSpirit(
  onData: (items: SpiritValue[]) => void,
  onError: (error: unknown) => void
): () => void {
  return onSnapshot(
    collection(db, COLLECTION),
    (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as SpiritValue))),
    onError
  );
}

export async function upsertSpiritValue(playerId: string, seasonId: string, value: number): Promise<void> {
  const clamped = Math.max(0, Math.min(100, value));
  await setDoc(doc(db, COLLECTION, `${playerId}_${seasonId}`), { playerId, seasonId, value: clamped });
}
