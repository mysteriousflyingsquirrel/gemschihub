/* eslint-disable no-undef */
// Firebase messaging service worker.
// This file MUST be at the root of /public so it's served from /.
// It handles background push notifications.

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase config — keep in sync with firebaseConfig.ts
// These values are NOT secrets (they are public identifiers).
firebase.initializeApp({
  apiKey: self.__FIREBASE_CONFIG__?.apiKey || '',
  authDomain: self.__FIREBASE_CONFIG__?.authDomain || '',
  projectId: self.__FIREBASE_CONFIG__?.projectId || '',
  storageBucket: self.__FIREBASE_CONFIG__?.storageBucket || '',
  messagingSenderId: self.__FIREBASE_CONFIG__?.messagingSenderId || '',
  appId: self.__FIREBASE_CONFIG__?.appId || '',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'GemschiHub';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification?.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
