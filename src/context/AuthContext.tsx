import React, { createContext, useState, useContext, ReactNode } from 'react';
import { login, saveUserData, logout as logoutService } from '../services/authService';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const loginUser = async (username: string, password: string): Promise<boolean> => {
    try {
      const userData = await login(username, password);
      setUser(userData);
      saveUserData(userData);
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const logoutUser = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login: loginUser, logout: logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
