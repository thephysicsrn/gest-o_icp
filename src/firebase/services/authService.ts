import { UserProfile, UserRole, SesiUnit } from '../../types';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from './storageHelper';
import { INITIAL_USERS } from '../seedData';

export const authService = {
  getUsers: async (): Promise<UserProfile[]> => {
    return getFromStorage<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  getCurrentUser: (): UserProfile | null => {
    return getFromStorage<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null);
  },

  setCurrentUser: (user: UserProfile | null): void => {
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
  },

  login: async (email: string, _password?: string): Promise<UserProfile> => {
    const users = await authService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error('Usuário não encontrado. Verifique o e-mail ou contate o administrador.');
    }

    authService.setCurrentUser(user);
    return user;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  createUser: async (userData: {
    name: string;
    email: string;
    role: UserRole;
    unit: SesiUnit;
    matricula: string;
    phone?: string;
    areaOrGrade?: string;
  }): Promise<UserProfile> => {
    const users = await authService.getUsers();
    
    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('Já existe um usuário cadastrado com este e-mail.');
    }

    const newUser: UserProfile = {
      uid: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      unit: userData.unit,
      matricula: userData.matricula || `SESI-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: userData.phone || '',
      areaOrGrade: userData.areaOrGrade || '',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  updateUser: async (uid: string, updates: Partial<UserProfile>): Promise<UserProfile> => {
    const users = await authService.getUsers();
    const index = users.findIndex(u => u.uid === uid);
    if (index === -1) throw new Error('Usuário não encontrado.');

    users[index] = { ...users[index], ...updates };
    saveToStorage(STORAGE_KEYS.USERS, users);

    // If updating current user, update session as well
    const current = authService.getCurrentUser();
    if (current && current.uid === uid) {
      authService.setCurrentUser(users[index]);
    }

    return users[index];
  },

  deleteUser: async (uid: string): Promise<void> => {
    let users = await authService.getUsers();
    users = users.filter(u => u.uid !== uid);
    saveToStorage(STORAGE_KEYS.USERS, users);
  }
};
