import { getToken } from 'firebase/messaging';
import { getMessagingInstance } from '../firebase/firebaseConfig';
import { storage } from '../storage/StorageService';

const TOKENS_STORAGE_KEY = 'gemschihub_push_tokens';
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

export interface StoredPushToken {
  token: string;
  createdAt: string;
}

/**
 * Check if notifications are supported in the current browser.
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Check if the user is on iOS running inside a PWA.
 */
export function isIOSPWA(): boolean {
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isStandalone = 'standalone' in window.navigator && (window.navigator as any).standalone;
  return isIOS && isStandalone;
}

/**
 * Get the current notification permission status.
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Request notification permission and get FCM token.
 * Returns the token if permission is granted, null otherwise.
 */
export async function requestNotificationPermission(): Promise<string | null> {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported.');
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

    // Register service worker if not already registered
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      // Store token locally
      const existing = storage.get<StoredPushToken[]>(TOKENS_STORAGE_KEY) || [];
      if (!existing.find(t => t.token === token)) {
        existing.push({ token, createdAt: new Date().toISOString() });
        storage.set(TOKENS_STORAGE_KEY, existing);
      }
    }

    return token;
  } catch (error) {
    console.error('Failed to get notification token:', error);
    return null;
  }
}

/**
 * Get all stored push tokens for this device.
 */
export function getStoredTokens(): StoredPushToken[] {
  return storage.get<StoredPushToken[]>(TOKENS_STORAGE_KEY) || [];
}
