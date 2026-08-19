import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { authService } from '../firebase/services/authService';
import { initLocalStorage } from '../firebase/services/storageHelper';

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  switchUser: (user: UserProfile) => void;
  refreshCurrentUser: () => Promise<void>;
  allUsers: UserProfile[];
  reloadUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    initLocalStorage();
    const users = await authService.getUsers();
    setAllUsers(users);
    
    const current = authService.getCurrentUser();
    if (current) {
      // Find latest updated version of current user
      const found = users.find(u => u.uid === current.uid) || current;
      setCurrentUser(found);
    } else if (users.length > 0) {
      setCurrentUser(users[0]); // Default to first user (Admin)
      authService.setCurrentUser(users[0]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const user = await authService.login(email, password);
      setCurrentUser(user);
      await reloadUsers();
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  const switchUser = (user: UserProfile) => {
    authService.setCurrentUser(user);
    setCurrentUser(user);
  };

  const refreshCurrentUser = async () => {
    const users = await authService.getUsers();
    setAllUsers(users);
    if (currentUser) {
      const updated = users.find(u => u.uid === currentUser.uid);
      if (updated) setCurrentUser(updated);
    }
  };

  const reloadUsers = async () => {
    const users = await authService.getUsers();
    setAllUsers(users);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isLoading,
        login,
        logout,
        switchUser,
        refreshCurrentUser,
        allUsers,
        reloadUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
