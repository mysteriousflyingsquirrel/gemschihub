import { getToken } from 'firebase/messaging';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getMessagingInstance } from '../firebase/firebaseConfig';
import { app } from '../firebase/firebaseConfig';
import { storage } from '../storage/StorageService';

const PERMISSION_KEY = 'gemschihub_push_permission';
const DISMISSED_KEY = 'gemschihub_push_dismissed';
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

export interface NotificationResult {
  success: boolean;
  error?: string;
}

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
 * Opt out of notifications (local toggle — doesn't revoke browser permission).
 */
export function optOutNotifications(): void {
  storage.set(PERMISSION_KEY, false);
}

/**
 * Check if the user has dismissed the first-visit notification prompt.
 */
export function hasSeenPrompt(): boolean {
  return storage.get<boolean>(DISMISSED_KEY) === true;
}

/**
 * Mark the first-visit notification prompt as seen/dismissed.
 */
export function dismissPrompt(): void {
  storage.set(DISMISSED_KEY, true);
}

/**
 * Wait for a service worker to be ready (active).
 */
async function waitForSWReady(timeoutMs = 10000): Promise<ServiceWorkerRegistration> {
  const ready = navigator.serviceWorker.ready;
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Service Worker wurde nicht rechtzeitig aktiv (Timeout).')), timeoutMs)
  );
  return Promise.race([ready, timeout]);
}

/**
 * Request notification permission, get FCM token, and register it server-side.
 * Returns a structured result with success/error info.
 */
export async function requestAndRegisterNotifications(): Promise<NotificationResult> {
  // Step 1: Check browser support
  if (!isNotificationSupported()) {
    return { success: false, error: 'Dein Browser unterstützt keine Push-Benachrichtigungen.' };
  }

  // Step 2: Check VAPID key
  if (!VAPID_KEY) {
    console.error('VAPID key is missing from environment variables.');
    return { success: false, error: 'Server-Konfiguration fehlt (VAPID Key). Bitte Admin kontaktieren.' };
  }

  // Step 3: Request permission
  let permission: NotificationPermission;
  try {
    permission = await Notification.requestPermission();
  } catch (err) {
    console.error('Permission request failed:', err);
    return { success: false, error: 'Berechtigungsanfrage fehlgeschlagen. Prüfe deine Browser-Einstellungen.' };
  }

  if (permission === 'denied') {
    return {
      success: false,
      error: 'Push-Berechtigung wurde verweigert. Erlaube Benachrichtigungen in den Browser-Einstellungen (Schloss-Symbol in der Adressleiste).',
    };
  }

  if (permission !== 'granted') {
    return { success: false, error: 'Push-Berechtigung wurde nicht erteilt.' };
  }

  // Step 4: Get FCM messaging instance
  let messaging;
  try {
    messaging = await getMessagingInstance();
  } catch (err) {
    console.error('FCM init failed:', err);
    return { success: false, error: 'Firebase Messaging konnte nicht initialisiert werden.' };
  }

  if (!messaging) {
    return { success: false, error: 'Firebase Messaging wird in diesem Browser nicht unterstützt.' };
  }

  // Step 5: Register service worker and wait for it to become active
  let registration: ServiceWorkerRegistration;
  try {
    await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    registration = await waitForSWReady();
  } catch (err: any) {
    console.error('Service Worker registration failed:', err);
    return {
      success: false,
      error: `Service Worker konnte nicht gestartet werden: ${err?.message || 'Unbekannter Fehler'}`,
    };
  }

  // Step 6: Get FCM token
  let token: string;
  try {
    token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
  } catch (err: any) {
    console.error('FCM token request failed:', err);
    const msg = err?.message || '';
    if (msg.includes('permission denied') || msg.includes('NotAllowed')) {
      return {
        success: false,
        error: 'Push-Berechtigung vom System blockiert. Prüfe: Windows Einstellungen → System → Benachrichtigungen → Browser aktivieren.',
      };
    }
    if (msg.includes('applicationServerKey')) {
      return { success: false, error: 'Ungültiger VAPID-Key. Bitte Admin kontaktieren.' };
    }
    return {
      success: false,
      error: `Push-Token konnte nicht erstellt werden: ${msg || 'Unbekannter Fehler'}`,
    };
  }

  if (!token) {
    return { success: false, error: 'Kein Push-Token erhalten. Bitte erneut versuchen.' };
  }

  // Step 7: Register token server-side
  try {
    const functions = getFunctions(app, 'us-central1');
    const registerPushToken = httpsCallable(functions, 'registerPushToken');
    await registerPushToken({ token });
  } catch (err: any) {
    console.error('Token registration with server failed:', err);
    return {
      success: false,
      error: `Token konnte nicht am Server registriert werden: ${err?.message || 'Netzwerkfehler'}`,
    };
  }

  // Success!
  storage.set(PERMISSION_KEY, true);
  console.log('Push token registered successfully.');
  return { success: true };
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
