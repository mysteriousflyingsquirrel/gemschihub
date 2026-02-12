import React, { useState, useEffect, useCallback } from 'react';
import { onMessage } from 'firebase/messaging';
import { getMessagingInstance } from '../firebase/firebaseConfig';

interface Toast {
  id: number;
  title: string;
  body: string;
}

let toastId = 0;

/**
 * Listens for FCM messages while the app is in the foreground
 * and shows them as in-app toast notifications.
 */
export const ForegroundNotifications: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    async function setup() {
      const messaging = await getMessagingInstance();
      if (!messaging) return;

      unsubscribe = onMessage(messaging, (payload) => {
        console.log('[Foreground] Push received:', payload);

        const data = payload.data || {};
        const title = data.title || payload.notification?.title || 'GemschiHub';
        const body = data.body || payload.notification?.body || '';
        const id = ++toastId;

        setToasts(prev => [...prev, { id, title, body }]);

        // Auto-dismiss after 6 seconds
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, 6000);
      });
    }

    setup();
    return () => { unsubscribe?.(); };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 left-4 lg:left-auto lg:right-8 lg:top-8 lg:w-96 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 flex items-start gap-3 animate-slide-up pointer-events-auto"
        >
          <div className="w-10 h-10 rounded-full bg-chnebel-red/10 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🔔</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-chnebel-black text-sm">{toast.title}</div>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{toast.body}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 -mt-1 -mr-1 p-1"
            aria-label="Schliessen"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};
