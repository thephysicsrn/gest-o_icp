import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração flexível: pode vir de import.meta.env ou chave padrão
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeySesiIcp2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sesi-icp-gestao.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sesi-icp-gestao",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sesi-icp-gestao.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "882729230788",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:882729230788:web:sesi-icp-app"
};

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

try {
  if (isFirebaseConfigured) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  }
} catch (error) {
  console.warn("Firebase não inicializado com credenciais remotas. Usando camada de dados local sincronizada.", error);
}

export { app, auth, db, storage };
