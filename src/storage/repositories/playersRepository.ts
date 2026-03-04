import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../firebase/firebaseConfig';
import { Player, PlayerRole } from '../../types/player';

const COLLECTION = 'players';

export function listenPlayers(
  onData: (players: Player[]) => void,
  onError: (error: unknown) => void
): () => void {
  return onSnapshot(
    collection(db, COLLECTION),
    (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Player))),
    onError
  );
}

export async function createPlayer(
  playerData: Omit<Player, 'id' | 'isActive' | 'profilePictureUrl'>,
  allPlayers: Player[]
): Promise<Player> {
  if (playerData.role === 'Captain' || playerData.role === 'CEO of Patchio') {
    const batch = writeBatch(db);
    allPlayers.forEach((p) => {
      if (p.role === playerData.role) {
        batch.update(doc(db, COLLECTION, p.id), { role: 'Spieler' as PlayerRole });
      }
    });
    await batch.commit();
  }

  const data = { ...playerData, isActive: true, profilePictureUrl: null };
  const refDoc = await addDoc(collection(db, COLLECTION), data);
  return { id: refDoc.id, ...data } as Player;
}

export async function patchPlayer(id: string, updates: Partial<Player>, allPlayers: Player[]): Promise<void> {
  if (updates.role && (updates.role === 'Captain' || updates.role === 'CEO of Patchio')) {
    const batch = writeBatch(db);
    allPlayers.forEach((p) => {
      if (p.id !== id && p.role === updates.role) {
        batch.update(doc(db, COLLECTION, p.id), { role: 'Spieler' as PlayerRole });
      }
    });
    batch.update(doc(db, COLLECTION, id), updates);
    await batch.commit();
    return;
  }
  await updateDoc(doc(db, COLLECTION, id), updates);
}

export async function softDeletePlayer(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { isActive: false });
}

export async function uploadPlayerPhoto(id: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileRef = ref(storage, `players/${id}/profile.${ext}`);
  await uploadBytes(fileRef, file, { contentType: file.type || 'image/jpeg' });
  const downloadURL = await getDownloadURL(fileRef);
  await updateDoc(doc(db, COLLECTION, id), { profilePictureUrl: downloadURL });
  return downloadURL;
}
