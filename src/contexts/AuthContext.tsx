import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { AppUser } from '../types/auth';

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getCaptainEmails(): string[] {
  const raw = import.meta.env.VITE_CAPTAIN_EMAILS || '';
  return raw
    .split(',')
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);
}

function isEmailAdmin(email: string | null): boolean {
  if (!email) return false;
  const allowlist = getCaptainEmails();
  // If no allowlist configured, fall back to allowing any authenticated user (dev mode)
  if (allowlist.length === 0) return true;
  return allowlist.includes(email.toLowerCase());
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser && fbUser.email) {
        const admin = isEmailAdmin(fbUser.email);
        setFirebaseUser(fbUser);
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          isAdmin: admin,
        });
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const isAdmin = user?.isAdmin ?? false;

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
