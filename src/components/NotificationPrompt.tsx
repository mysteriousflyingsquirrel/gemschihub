import React, { useState, useEffect } from 'react';
import {
  isNotificationSupported,
  getNotificationPermission,
  hasOptedIn,
  hasSeenPrompt,
  dismissPrompt,
  requestAndRegisterNotifications,
} from '../services/notifications';

/**
 * First-visit banner that prompts the user to enable push notifications.
 * Only shows once — dismissed permanently after interaction.
 */
export const NotificationPrompt: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show only if: supported, not yet opted in, not yet dismissed, not already denied
    if (
      isNotificationSupported() &&
      !hasOptedIn() &&
      !hasSeenPrompt() &&
      getNotificationPermission() !== 'denied'
    ) {
      // Small delay so it doesn't flash immediately on page load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleEnable = async () => {
    setLoading(true);
    try {
      await requestAndRegisterNotifications();
    } catch {
      // ignore
    } finally {
      dismissPrompt();
      setVisible(false);
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    dismissPrompt();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 lg:left-auto lg:right-8 lg:bottom-8 lg:max-w-sm z-[90] animate-slide-up">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-chnebel-red/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🔔</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-chnebel-black text-sm">Benachrichtigungen aktivieren?</div>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Erhalte Updates zu Events, Live-Ergebnissen und Team-News direkt auf dein Gerät.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 -mt-1 -mr-1 p-1"
            aria-label="Schliessen"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDismiss}
            className="flex-1 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Später
          </button>
          <button
            onClick={handleEnable}
            disabled={loading}
            className="flex-1 px-3 py-2 text-sm text-white bg-chnebel-red rounded-lg hover:bg-[#c4161e] transition-colors font-semibold disabled:opacity-50"
          >
            {loading ? 'Aktiviere...' : 'Aktivieren'}
          </button>
        </div>
      </div>
    </div>
  );
};
