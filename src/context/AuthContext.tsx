// src/context/authContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { login, saveUserData, logout as logoutService } from '../services/authService';

interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  token: string;
}

interface AuthContextType {
  user: User | any;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user from localStorage if available
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const loginUser = async (email: string, password: string): Promise<boolean | any> => {
    try {
      const userData = await login(email, password);
      console.log("userData: ",userData)
      setUser(userData);
      saveUserData(userData); // Assuming this saves to localStorage
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const logoutUser = () => {
    logoutService(); // Assuming this clears localStorage
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