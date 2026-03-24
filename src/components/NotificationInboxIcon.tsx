import React from 'react';
import { useNotifications } from '../contexts/NotificationsContext';

interface NotificationInboxIconProps {
  onClick: () => void;
  isOpen: boolean;
  variant?: 'sidebar' | 'topbar';
}

const InboxIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
    />
  </svg>
);

export const NotificationInboxIcon: React.FC<NotificationInboxIconProps> = ({
  onClick,
  isOpen,
  variant = 'sidebar',
}) => {
  const { count, loading } = useNotifications();

  if (variant === 'topbar') {
    return (
      <button
        onClick={onClick}
        className={`relative p-2.5 rounded-lg transition-all duration-200 active:scale-95 ${
          isOpen
            ? 'bg-chnebel-red/30 text-white'
            : 'bg-white/20 text-white hover:bg-white/30'
        }`}
        aria-label="Benachrichtigungen"
      >
        <InboxIcon className={`w-6 h-6 ${loading ? 'animate-pulse' : ''}`} />
        {count > 0 && !loading && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-chnebel-red text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-[#1a1a1a]">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 active:scale-[0.98] ${
        isOpen
          ? 'bg-chnebel-red/20 text-white'
          : 'text-white hover:bg-white/10'
      }`}
    >
      <InboxIcon className={`w-5 h-5 flex-shrink-0 ${loading ? 'animate-pulse' : ''}`} />
      <span className="flex-1 text-left">Benachrichtigungen</span>
      {count > 0 && !loading && (
        <span className="min-w-[20px] h-5 bg-chnebel-red text-white text-xs font-semibold rounded-full flex items-center justify-center px-1.5">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};
