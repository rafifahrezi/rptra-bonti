import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import {
  checkUserIsAdmin,
  getAdminData,
  createOrUpdateAdminRecord,
  isAllowedAdminEmail,
  AdminData,
  AdminError,
} from '../utils/adminUtils';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  adminData: AdminData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [operationLoading, setOperationLoading] = useState<boolean>(false);

  // Centralized error handler for Firebase Auth errors
  const handleAuthError = (error: any): string => {
    if (error instanceof AdminError) {
      return error.message;
    }
    switch (error.code) {
      case 'auth/user-not-found':
        return 'Email tidak terdaftar dalam sistem';
      case 'auth/wrong-password':
        return 'Password salah';
      case 'auth/invalid-email':
        return 'Format email tidak valid';
      case 'auth/user-disabled':
        return 'Akun telah dinonaktifkan';
      case 'auth/too-many-requests':
        return 'Terlalu banyak percobaan login. Coba lagi nanti';
      default:
        return 'Gagal masuk. Periksa email dan password Anda';
    }
  };

  const signIn = async (email: string, password: string) => {
    setOperationLoading(true);
    try {
      // Check if email is allowed
      if (!isAllowedAdminEmail(email)) {
        throw new AdminError('Email tidak terdaftar sebagai admin', 'ADMIN_NOT_ALLOWED');
      }

      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create or update admin record
      await createOrUpdateAdminRecord(user, true);

      // Update state
      setCurrentUser(user);
      const isUserAdmin = await checkUserIsAdmin(user.uid);
      setIsAdmin(isUserAdmin);
      if (isUserAdmin) {
        const userData = await getAdminData(user.uid);
        setAdminData(userData);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error(handleAuthError(error));
    } finally {
      setOperationLoading(false);
    }
  };

  const signOut = async () => {
    setOperationLoading(true);
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setIsAdmin(false);
      setAdminData(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Gagal keluar dari sistem');
    } finally {
      setOperationLoading(false);
    }
  };

  const checkAndSetAdminStatus = async (user: User) => {
    try {
      if (!user.email || !isAllowedAdminEmail(user.email)) {
        setIsAdmin(false);
        setAdminData(null);
        return;
      }

      const isUserAdmin = await checkUserIsAdmin(user.uid);
      setIsAdmin(isUserAdmin);

      if (isUserAdmin) {
        const userData = await getAdminData(user.uid);
        setAdminData(userData);
      } else {
        setAdminData(null);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setAdminData(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await checkAndSetAdminStatus(user);
      } else {
        setIsAdmin(false);
        setAdminData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    currentUser,
    isAdmin,
    adminData,
    loading: loading || operationLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};