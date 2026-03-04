import { getApp, getApps, initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getMessaging, Messaging, isSupported } from 'firebase/messaging';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const defaultFirebaseConfig = {
  apiKey: 'AIzaSyClAfUw97U3wtOUKqIYwzdEfjSoUSyhTpo',
  authDomain: 'gemschihub.firebaseapp.com',
  projectId: 'gemschihub',
  storageBucket: 'gemschihub.firebasestorage.app',
  messagingSenderId: '654765415480',
  appId: '1:654765415480:web:5dce1aa3ae54e02a8a9acd',
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultFirebaseConfig.appId,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let messaging: Messaging | null = null;

app = getApps().length ? getApp() : initializeApp(firebaseConfig);
auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

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

export { app, auth, db, storage };
