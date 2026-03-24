/**
 * Push subscription stored per device.
 */
export interface PushSubscriptionRecord {
  id: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt: string; // ISO date string
}

/**
 * Notification type for in-app inbox.
 */
export type NotificationType = 'reminder' | 'interclub_game' | 'interclub_final' | 'custom';

/**
 * In-app notification stored in Firestore.
 */
export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: Date;
  eventId?: string;
  gameNumber?: number;
}

/**
 * Group of notifications for the same event (used for UI grouping).
 */
export interface NotificationGroup {
  eventId: string | null;
  eventTitle?: string;
  notifications: AppNotification[];
  latestAt: Date;
}
