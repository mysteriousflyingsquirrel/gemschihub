import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { TenueData } from '../../types/info';

const DOC_PATH = 'settings/tenue';

export function listenTenue(
  onData: (data: TenueData | null) => void,
  onError: (error: unknown) => void
): () => void {
  return onSnapshot(
    doc(db, ...DOC_PATH.split('/') as [string, string]),
    (snapshot) => onData(snapshot.exists() ? (snapshot.data() as TenueData) : null),
    onError
  );
}

export async function saveTenue(data: TenueData): Promise<void> {
  await setDoc(doc(db, ...DOC_PATH.split('/') as [string, string]), data);
}
