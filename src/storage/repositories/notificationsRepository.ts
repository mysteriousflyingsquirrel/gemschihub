import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { AppNotification } from '../../types/notification';

const COLLECTION = 'notifications';
const DEFAULT_LIMIT = 20;

/**
 * Convert Firestore document data to AppNotification.
 */
function toAppNotification(id: string, data: Record<string, unknown>): AppNotification {
  const createdAt = data.createdAt as Timestamp | undefined;
  return {
    id,
    type: (data.type as AppNotification['type']) || 'custom',
    title: (data.title as string) || '',
    body: (data.body as string) || '',
    createdAt: createdAt?.toDate() ?? new Date(),
    eventId: data.eventId as string | undefined,
    gameNumber: data.gameNumber as number | undefined,
  };
}

/**
 * Subscribe to the most recent notifications in real-time.
 * Returns an unsubscribe function.
 */
export function listenNotifications(
  onData: (notifications: AppNotification[]) => void,
  onError: (error: unknown) => void,
  maxCount: number = DEFAULT_LIMIT
): () => void {
  const q = query(
    collection(db, COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(maxCount)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const notifications = snapshot.docs.map((doc) =>
        toAppNotification(doc.id, doc.data())
      );
      onData(notifications);
    },
    onError
  );
}
