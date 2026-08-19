import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAHnDmlVftPYd8KwNl5p0IO2zZIKkcKd1I",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sesi-icp-rn.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sesi-icp-rn",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sesi-icp-rn.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "455141586793",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:455141586793:web:ef57fcbc3144fab1b06ff8",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
