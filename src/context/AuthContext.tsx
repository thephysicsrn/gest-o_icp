import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../firebase/services/authService';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  switchUser: (user: UserProfile) => void;
  refreshUsers: () => Promise<void>;
  reloadUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAllUsers = async () => {
    try {
      const users = await authService.getUsers();
      setAllUsers(users);
    } catch (err) {
      console.warn('Erro ao carregar usuários:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = authService.onAuthChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const profile = await authService.getUserProfile(firebaseUser.uid);
          setCurrentUser(profile);
        } else {
          setCurrentUser(null);
        }
        await loadAllUsers();
      } catch (err) {
        console.error('Erro ao inicializar contexto de autenticação:', err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const profile = await authService.login(email, password);
    setCurrentUser(profile);
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  const switchUser = (user: UserProfile) => {
    setCurrentUser(user);
  };

  const refreshUsers = async () => {
    await loadAllUsers();
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      allUsers,
      isLoading,
      login,
      logout,
      switchUser,
      refreshUsers,
      reloadUsers: refreshUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};
