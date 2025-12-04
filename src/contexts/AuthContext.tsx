import React, { createContext, useContext, useState } from 'react';
import { AppUser, UserRole } from '../types/auth';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, invitationCode: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock user - always logged in as admin for frontend development
  const [user] = useState<AppUser | null>({
    uid: 'mock-user-id',
    email: 'demo@example.com',
    role: 'admin' as UserRole,
  });
  const [loading] = useState(false);

  const login = async (email: string, _password: string) => {
    // Mock login - no-op for frontend only
    console.log('Mock login:', email);
  };

  const signup = async (email: string, _password: string, invitationCode: string) => {
    // Mock signup - no-op for frontend only
    console.log('Mock signup:', email, invitationCode);
  };

  const logout = async () => {
    // Mock logout - no-op for frontend only
    console.log('Mock logout');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

