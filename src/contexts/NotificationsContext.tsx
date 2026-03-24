import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { AppNotification, NotificationGroup } from '../types/notification';
import { listenNotifications } from '../storage/repositories/notificationsRepository';
import { useEvents } from './EventsContext';

interface NotificationsContextType {
  /** All notifications (most recent first). */
  notifications: AppNotification[];
  /** Notifications grouped by eventId. */
  groups: NotificationGroup[];
  /** Total notification count. */
  count: number;
  /** Loading state. */
  loading: boolean;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

/**
 * Group notifications by eventId for display.
 * Notifications without eventId are grouped under null.
 */
function groupNotifications(
  notifications: AppNotification[],
  getEventTitle: (eventId: string) => string | undefined
): NotificationGroup[] {
  const groupMap = new Map<string | null, AppNotification[]>();

  for (const notification of notifications) {
    const key = notification.eventId ?? null;
    const existing = groupMap.get(key) || [];
    existing.push(notification);
    groupMap.set(key, existing);
  }

  const groups: NotificationGroup[] = [];
  for (const [eventId, notifs] of groupMap.entries()) {
    const sorted = notifs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    groups.push({
      eventId,
      eventTitle: eventId ? getEventTitle(eventId) : undefined,
      notifications: sorted,
      latestAt: sorted[0]?.createdAt ?? new Date(0),
    });
  }

  return groups.sort((a, b) => b.latestAt.getTime() - a.latestAt.getTime());
}

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const { getEvent } = useEvents();

  useEffect(() => {
    const unsubscribe = listenNotifications(
      (incoming) => {
        setNotifications(incoming);
        setLoading(false);
      },
      (error) => {
        console.error('Notifications listener error:', error);
        setLoading(false);
      },
      20
    );
    return unsubscribe;
  }, []);

  const groups = useMemo(() => {
    return groupNotifications(notifications, (eventId) => getEvent(eventId)?.title);
  }, [notifications, getEvent]);

  const value = useMemo(
    () => ({
      notifications,
      groups,
      count: notifications.length,
      loading,
    }),
    [notifications, groups, loading]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
