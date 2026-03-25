import React, { useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Shows a non-blocking in-app prompt when a new app version is available.
 */
export const AppUpdatePrompt: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      registration?.update();
    },
  });

  if (!needRefresh || dismissed) return null;

  const handleUpdateNow = async () => {
    await updateServiceWorker(true);
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 lg:left-auto lg:right-8 lg:bottom-8 lg:max-w-sm z-[95] animate-slide-up">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 flex flex-col gap-3">
        <div className="font-semibold text-chnebel-black text-sm">Neue Version verfugbar</div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Eine aktualisierte Version von GemschiHub ist bereit. Jetzt aktualisieren, um die neuesten Anderungen zu sehen.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setDismissed(true)}
            className="flex-1 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Spater
          </button>
          <button
            onClick={handleUpdateNow}
            className="flex-1 px-3 py-2 text-sm text-white bg-chnebel-red rounded-lg hover:bg-[#c4161e] transition-colors font-semibold"
          >
            Jetzt aktualisieren
          </button>
        </div>
      </div>
    </div>
  );
};
