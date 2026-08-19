import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../config';
import { UserProfile, UserRole, SesiUnit } from '../../types';

const usersCol = () => collection(db, 'users');

const toUserProfile = (data: any, uid: string): UserProfile => ({
  uid,
  name: data.name ?? '',
  email: data.email ?? '',
  role: data.role as UserRole,
  unit: data.unit as SesiUnit,
  matricula: data.matricula ?? '',
  phone: data.phone ?? '',
  areaOrGrade: data.areaOrGrade ?? '',
  avatarUrl: data.avatarUrl ?? '',
  createdAt: data.createdAt ?? new Date().toISOString(),
});

export const authService = {
  getUsers: async (): Promise<UserProfile[]> => {
    const snap = await getDocs(query(usersCol()));
    return snap.docs.map(d => toUserProfile(d.data(), d.id));
  },

  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return toUserProfile(snap.data(), uid);
  },

  login: async (email: string, password?: string): Promise<UserProfile> => {
    const pwd = password || 'sesi@123456';
    const cred = await signInWithEmailAndPassword(auth, email, pwd);
    const profile = await authService.getUserProfile(cred.user.uid);
    if (!profile) {
      await signOut(auth);
      throw new Error('Usuário não encontrado no sistema escolar.');
    }
    return profile;
  },

  logout: async (): Promise<void> => {
    await signOut(auth);
  },

  onAuthChanged: (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  createUser: async (userData: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    unit: SesiUnit;
    matricula: string;
    phone?: string;
    areaOrGrade?: string;
  }): Promise<UserProfile> => {
    const password = userData.password || 'sesi@123456';
    let uid = '';
    try {
      const cred = await createUserWithEmailAndPassword(auth, userData.email, password);
      await updateProfile(cred.user, { displayName: userData.name });
      uid = cred.user.uid;
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        const cred = await signInWithEmailAndPassword(auth, userData.email, password);
        uid = cred.user.uid;
      } else {
        // Fallback: se não conseguir criar no auth imediatamente, cria ID único
        uid = 'user_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
      }
    }

    const newProfile: UserProfile = {
      uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      unit: userData.unit,
      matricula: userData.matricula || `SESI-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: userData.phone || '',
      areaOrGrade: userData.areaOrGrade || '',
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', uid), {
      ...newProfile,
      createdAt: serverTimestamp(),
    });

    return newProfile;
  },

  updateUser: async (uid: string, updates: Partial<UserProfile>): Promise<UserProfile> => {
    const ref = doc(db, 'users', uid);
    await updateDoc(ref, updates);
    const snap = await getDoc(ref);
    return toUserProfile(snap.data()!, uid);
  },

  deleteUser: async (uid: string): Promise<void> => {
    await deleteDoc(doc(db, 'users', uid));
  },

  getCurrentUser: (): UserProfile | null => null,
  setCurrentUser: (_user: UserProfile | null): void => {},
};
