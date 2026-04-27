import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationsContext';
import { NotificationGroup, AppNotification } from '../types/notification';

interface NotificationInboxProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'sidebar' | 'topbar';
}

const TYPE_ICONS: Record<string, string> = {
  reminder: '📅',
  interclub_game: '🎾',
  interclub_final: '🏆',
  custom: '📣',
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMin < 1) return 'Gerade eben';
  if (diffMin < 60) return `vor ${diffMin} Min.`;
  if (diffHours < 24) return `vor ${diffHours} Std.`;
  if (diffDays === 1) return 'Gestern';
  return `vor ${diffDays} Tagen`;
}

const NotificationItem: React.FC<{
  notification: AppNotification;
  onClick?: () => void;
}> = ({ notification, onClick }) => {
  const icon = TYPE_ICONS[notification.type] || '📣';

  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
    >
      <div className="flex items-start gap-2.5">
        <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-gray-900 truncate">
            {notification.title}
          </div>
          <p className="text-xs text-gray-600 mt-0.5 line-clamp-2 leading-relaxed">
            {notification.body}
          </p>
          <div className="text-[10px] text-gray-400 mt-1">
            {formatRelativeTime(notification.createdAt)}
          </div>
        </div>
      </div>
    </button>
  );
};

const GroupedNotifications: React.FC<{
  group: NotificationGroup;
  onNotificationClick: (notification: AppNotification) => void;
}> = ({ group, onNotificationClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMultiple = group.notifications.length > 1;
  const latestNotification = group.notifications[0];

  if (!hasMultiple) {
    return (
      <NotificationItem
        notification={latestNotification}
        onClick={() => onNotificationClick(latestNotification)}
      />
    );
  }

  const icon = TYPE_ICONS[latestNotification.type] || '📣';
  const title = group.eventTitle || latestNotification.title;

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start gap-2.5">
          <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-gray-900 truncate">
              {title}
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              {group.notifications.length} Updates
            </p>
            <div className="text-[10px] text-gray-400 mt-1">
              {formatRelativeTime(group.latestAt)}
            </div>
          </div>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {isExpanded && (
        <div className="bg-gray-50 border-t border-gray-100">
          {group.notifications.map((notification) => (
            <div key={notification.id} className="pl-6">
              <NotificationItem
                notification={notification}
                onClick={() => onNotificationClick(notification)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const NotificationInbox: React.FC<NotificationInboxProps> = ({
  isOpen,
  onClose,
  variant = 'sidebar',
}) => {
  const { groups, loading, count } = useNotifications();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const wrapper = panelRef.current?.parentElement;
      if (wrapper && !wrapper.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleNotificationClick = (notification: AppNotification) => {
    if (notification.eventId) {
      navigate(`/events?highlight=${notification.eventId}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  const positionClasses =
    variant === 'topbar'
      ? 'absolute top-full right-0 mt-2'
      : 'absolute left-0 right-0 top-full mt-1';

  return (
    <div
      ref={panelRef}
      className={`${positionClasses} bg-white rounded-xl shadow-2xl border border-gray-200 z-[100] overflow-hidden`}
      style={{ maxHeight: '400px', minWidth: variant === 'topbar' ? '320px' : undefined }}
    >
      <div className="bg-gradient-to-r from-chnebel-red to-[#c4161e] px-4 py-3">
        <h3 className="text-white font-semibold text-sm">Benachrichtigungen</h3>
        {count > 0 && (
          <p className="text-white/80 text-xs mt-0.5">{count} Nachricht{count !== 1 ? 'en' : ''}</p>
        )}
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: '340px' }}>
        {loading ? (
          <div className="px-4 py-8 text-center text-gray-500 text-sm">
            <div className="animate-pulse">Laden...</div>
          </div>
        ) : count === 0 ? (
          <div className="px-4 py-8 text-center">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-gray-500 text-sm">Keine Benachrichtigungen</p>
            <p className="text-gray-400 text-xs mt-1">
              Aktiviere Push um informiert zu bleiben
            </p>
          </div>
        ) : (
          <div>
            {groups.map((group) => (
              <GroupedNotifications
                key={group.eventId ?? 'ungrouped'}
                group={group}
                onNotificationClick={handleNotificationClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
