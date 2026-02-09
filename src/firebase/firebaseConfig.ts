import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getMessaging, Messaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Check if Firebase config is valid
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn('Firebase configuration is missing. Please set up your .env file with Firebase credentials.');
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let messaging: Messaging | null = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  const fallbackConfig = {
    apiKey: 'demo-key',
    authDomain: 'demo.firebaseapp.com',
    projectId: 'demo-project',
    storageBucket: 'demo-project.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:demo',
  };
  app = initializeApp(fallbackConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

/** Get FCM messaging instance (only if supported by current browser). */
export async function getMessagingInstance(): Promise<Messaging | null> {
  if (messaging) return messaging;
  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn('FCM is not supported in this browser.');
      return null;
    }
    messaging = getMessaging(app);
    return messaging;
  } catch (error) {
    console.error('Failed to initialize FCM:', error);
    return null;
  }
}

export { app, auth, db };
