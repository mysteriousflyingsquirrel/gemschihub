import { getToken } from 'firebase/messaging';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getMessagingInstance } from '../firebase/firebaseConfig';
import { app } from '../firebase/firebaseConfig';
import { storage } from '../storage/StorageService';

const PERMISSION_KEY = 'gemschihub_push_permission';
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

/**
 * Check if notifications are supported in the current browser.
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Get the current notification permission status.
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Check if the user has already completed the notification opt-in flow.
 */
export function hasOptedIn(): boolean {
  return storage.get<boolean>(PERMISSION_KEY) === true;
}

/**
 * Request notification permission, get FCM token, and register it server-side.
 * Returns the token if successful, null otherwise.
 */
export async function requestAndRegisterNotifications(): Promise<string | null> {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported in this browser.');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied.');
      return null;
    }

    const messaging = await getMessagingInstance();
    if (!messaging) {
      console.error('FCM messaging not available.');
      return null;
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      // Register token server-side via Cloud Function
      const functions = getFunctions(app, 'us-central1');
      const registerPushToken = httpsCallable(functions, 'registerPushToken');
      await registerPushToken({ token });

      // Mark as opted in locally
      storage.set(PERMISSION_KEY, true);
      console.log('Push token registered successfully.');
    }

    return token;
  } catch (error) {
    console.error('Failed to set up notifications:', error);
    return null;
  }
}

/**
 * Send a custom notification to all subscribed devices.
 * Requires authentication (Captain only).
 */
export async function sendNotificationToAll(title: string, body: string): Promise<{ success: number; failure: number }> {
  const functions = getFunctions(app, 'us-central1');
  const sendNotification = httpsCallable<
    { title: string; body: string },
    { success: number; failure: number }
  >(functions, 'sendNotification');

  const result = await sendNotification({ title, body });
  return result.data;
}
