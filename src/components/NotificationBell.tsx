import React, { useState, useEffect } from 'react';
import {
  isNotificationSupported,
  getNotificationPermission,
  hasOptedIn,
  requestAndRegisterNotifications,
} from '../services/notifications';

interface NotificationBellProps {
  /** "sidebar" = full button row in sidebar, "topbar" = compact icon for mobile topbar */
  variant?: 'sidebar' | 'topbar';
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ variant = 'sidebar' }) => {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    getNotificationPermission()
  );
  const [loading, setLoading] = useState(false);
  const [justEnabled, setJustEnabled] = useState(false);

  // Re-check on mount (e.g. user changed browser settings)
  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  const supported = isNotificationSupported();
  const alreadyGranted = permission === 'granted' && hasOptedIn();

  const handleEnable = async () => {
    if (loading || alreadyGranted) return;
    setLoading(true);
    try {
      const token = await requestAndRegisterNotifications();
      if (token) {
        setPermission('granted');
        setJustEnabled(true);
        setTimeout(() => setJustEnabled(false), 3000);
      } else {
        setPermission(getNotificationPermission());
      }
    } catch {
      setPermission(getNotificationPermission());
    } finally {
      setLoading(false);
    }
  };

  // Don't show anything if not supported
  if (!supported) return null;

  // Topbar variant (compact icon)
  if (variant === 'topbar') {
    if (alreadyGranted) {
      return (
        <div className="text-white/60 p-2.5 rounded-lg bg-white/10" title="Benachrichtigungen aktiv">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
      );
    }

    return (
      <button
        onClick={handleEnable}
        disabled={loading}
        className="text-white p-2.5 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 active:scale-95 relative"
        title="Benachrichtigungen aktivieren"
      >
        <svg className={`w-6 h-6 ${loading ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {/* Dot indicator that notifications are not yet enabled */}
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-yellow-400 rounded-full animate-pulse border-2 border-[#c4161e]" />
      </button>
    );
  }

  // Sidebar variant (full button row)
  if (alreadyGranted) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/60 text-sm">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="flex-1">
          {justEnabled ? 'Aktiviert!' : 'Benachrichtigungen an'}
        </span>
        <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/40 text-sm">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <span className="flex-1">Push blockiert</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleEnable}
      disabled={loading}
      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-white text-sm hover:bg-white/10 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
    >
      <svg className={`w-5 h-5 flex-shrink-0 ${loading ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <span className="flex-1 text-left">
        {loading ? 'Aktiviere...' : '🔔 Push aktivieren'}
      </span>
      <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse flex-shrink-0" />
    </button>
  );
};
