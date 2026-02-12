import React, { useState, useEffect, useCallback } from 'react';
import {
  isNotificationSupported,
  getNotificationPermission,
  hasOptedIn,
  requestAndRegisterNotifications,
  optOutNotifications,
} from '../services/notifications';

interface NotificationBellProps {
  /** "sidebar" = full button row in sidebar, "topbar" = compact icon for mobile topbar */
  variant?: 'sidebar' | 'topbar';
}

/** Bell icon (outline) */
const BellIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

/** Bell with slash (muted/off) */
const BellOffIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4l1.405-1.405A2.032 2.032 0 006 12.158V9a6.002 6.002 0 014-5.659V3a2 2 0 114 0v.341c.465.15.9.357 1.3.612M9 21h6M17.7 13.7A7.97 7.97 0 0018 11V9M3 3l18 18" />
  </svg>
);

export const NotificationBell: React.FC<NotificationBellProps> = ({ variant = 'sidebar' }) => {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    getNotificationPermission()
  );
  const [optedIn, setOptedIn] = useState(hasOptedIn());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPermission(getNotificationPermission());
    setOptedIn(hasOptedIn());
  }, []);

  // Auto-clear error after 8 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const supported = isNotificationSupported();
  const isActive = permission === 'granted' && optedIn;

  const handleToggle = useCallback(async () => {
    if (loading) return;
    setError(null);

    if (isActive) {
      optOutNotifications();
      setOptedIn(false);
      return;
    }

    setLoading(true);
    try {
      const result = await requestAndRegisterNotifications();
      if (result.success) {
        setPermission('granted');
        setOptedIn(true);
      } else {
        setPermission(getNotificationPermission());
        setError(result.error || 'Unbekannter Fehler');
      }
    } catch (err: any) {
      setPermission(getNotificationPermission());
      setError(err?.message || 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  }, [loading, isActive]);

  if (!supported) return null;

  // ── Topbar variant (compact) ──
  if (variant === 'topbar') {
    if (permission === 'denied') {
      return (
        <div className="p-2.5 rounded-lg text-white/30" title="Push blockiert im Browser">
          <BellOffIcon className="w-6 h-6" />
        </div>
      );
    }

    return (
      <div className="relative">
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`p-2.5 rounded-lg transition-all duration-200 active:scale-95 relative ${
            isActive
              ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
          title={isActive ? 'Benachrichtigungen aus' : 'Benachrichtigungen an'}
        >
          {isActive ? (
            <BellIcon className={`w-6 h-6 ${loading ? 'animate-pulse' : ''}`} />
          ) : (
            <BellOffIcon className={`w-6 h-6 ${loading ? 'animate-pulse' : ''}`} />
          )}
          {!isActive && !loading && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-yellow-400 rounded-full animate-pulse border-2 border-[#c4161e]" />
          )}
        </button>
        {/* Error tooltip for topbar */}
        {error && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-red-600 text-white text-xs rounded-lg p-3 shadow-xl z-50">
            <div className="font-semibold mb-0.5">Fehler</div>
            {error}
            <div className="absolute -top-1 right-4 w-2 h-2 bg-red-600 rotate-45" />
          </div>
        )}
      </div>
    );
  }

  // ── Sidebar variant (full row) ──
  if (permission === 'denied') {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/30 text-sm">
        <BellOffIcon className="w-5 h-5 flex-shrink-0" />
        <span className="flex-1">Push blockiert</span>
        <span className="text-[10px] text-white/20">Browser</span>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 ${
          isActive
            ? 'bg-green-500/15 text-green-400 hover:bg-green-500/25'
            : 'text-white hover:bg-white/10'
        }`}
      >
        {isActive ? (
          <BellIcon className={`w-5 h-5 flex-shrink-0 ${loading ? 'animate-pulse' : ''}`} />
        ) : (
          <BellOffIcon className={`w-5 h-5 flex-shrink-0 ${loading ? 'animate-pulse' : ''}`} />
        )}
        <span className="flex-1 text-left">
          {loading
            ? 'Aktiviere...'
            : isActive
              ? 'Push an'
              : 'Push aus'
          }
        </span>
        {/* Toggle pill */}
        <div className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors duration-200 ${
          isActive ? 'bg-green-500' : 'bg-white/20'
        }`}>
          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            isActive ? 'translate-x-4' : 'translate-x-0'
          }`} />
        </div>
      </button>
      {/* Error message for sidebar */}
      {error && (
        <div className="mx-2 mt-1.5 bg-red-500/20 text-red-300 text-xs rounded-lg px-3 py-2 leading-relaxed">
          {error}
        </div>
      )}
    </div>
  );
};
