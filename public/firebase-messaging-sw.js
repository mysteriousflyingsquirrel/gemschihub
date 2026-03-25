/* eslint-disable no-undef */
// Legacy SW kept only for migration from root-scope registration.
// Push messaging now uses /firebase-sw/firebase-messaging-sw.js so the app SW can own "/" scope.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.registration.unregister());
});
