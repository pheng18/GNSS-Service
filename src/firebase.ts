import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth, Auth, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

let appInstance;
if (!getApps().length) {
  appInstance = initializeApp(firebaseConfig);
} else {
  appInstance = getApp();
}

export const app = appInstance;
// Initialize Firestore using the specified custom firestoreDatabaseId
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Background anonymous authentication to satisfy firestore security rules
signInAnonymously(auth).catch((err) => {
  console.warn("Firestore auth initialization notice:", err?.message || err);
});

export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'system', 'connection_probe'));
    return true;
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('the client is offline')) {
      console.warn("Firestore probe: client is offline or network restricted. Local persistence active.");
    }
    return false;
  }
}
