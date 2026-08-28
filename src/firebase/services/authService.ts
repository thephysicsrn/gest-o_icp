import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
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
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, firebaseConfig } from '../config';
import { UserProfile, UserRole, SesiUnit } from '../../types';

const usersCol = () => collection(db, 'users');

const getSecondaryAuth = () => {
  const name = 'SecondaryAuthApp';
  const existingApp = getApps().find(app => app.name === name);
  const app = existingApp || initializeApp(firebaseConfig, name);
  return getAuth(app);
};

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
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pwd);
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
    const defaultPassword = userData.role === 'student' ? 'sesi@aluno2026' : userData.role === 'teacher' ? 'sesi@prof2026' : 'sesi@admin2026';
    const password = userData.password || defaultPassword;
    const cleanEmail = userData.email.trim().toLowerCase();
    let uid = '';
    
    // Usa instância secundária para não deslogar o Administrador logado
    const secondaryAuth = getSecondaryAuth();

    try {
      const cred = await createUserWithEmailAndPassword(secondaryAuth, cleanEmail, password);
      await updateProfile(cred.user, { displayName: userData.name.trim() });
      uid = cred.user.uid;
      await signOut(secondaryAuth);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        // Se a conta já existe no Auth (ex: recadastro de usuário excluído), localiza ou gera ID consistente
        const snap = await getDocs(query(collection(db, 'users'), where('email', '==', cleanEmail)));
        if (!snap.empty) {
          uid = snap.docs[0].id;
        } else {
          uid = `usr_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;
        }
      } else if (err.code === 'auth/invalid-email') {
        throw new Error('E-mail institucional informado é inválido.');
      } else if (err.code === 'auth/weak-password') {
        throw new Error('A senha deve conter no mínimo 6 caracteres.');
      } else {
        throw new Error(err.message || 'Erro ao registrar credencial de acesso.');
      }
    }

    const newProfile: UserProfile = {
      uid,
      name: userData.name.trim(),
      email: cleanEmail,
      role: userData.role,
      unit: userData.unit,
      matricula: userData.matricula.trim() || `SESI-${Math.floor(1000 + Math.random() * 9000)}`,
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

  deleteUser: async (uid: string, email?: string): Promise<void> => {
    // 1. Remove do Firestore
    await deleteDoc(doc(db, 'users', uid));

    // 2. Remove o aluno das linhas de pesquisa onde estiver matriculado
    try {
      const linesSnap = await getDocs(collection(db, 'lines'));
      for (const lineDoc of linesSnap.docs) {
        const lineData = lineDoc.data();
        if (Array.isArray(lineData.studentIds) && lineData.studentIds.includes(uid)) {
          const updatedStudentIds = lineData.studentIds.filter((id: string) => id !== uid);
          await updateDoc(doc(db, 'lines', lineDoc.id), {
            studentIds: updatedStudentIds,
          });
        }
      }
    } catch {
      // Continua caso ocorra aviso nas linhas
    }

    // 3. Tenta exclusão definitiva no Firebase Auth via API Serverless
    try {
      await fetch('/api/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, email }),
      });
    } catch {
      // Ignora caso api serverless não esteja ativa localmente
    }
  },

  getCurrentUser: (): UserProfile | null => null,
  setCurrentUser: (_user: UserProfile | null): void => {},
};
