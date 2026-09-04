import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  appleProvider, 
  facebookProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateFirebaseProfile
} from '../services/firebase';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'technician';
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  province?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  loginWithApple: () => Promise<{ success: boolean; message?: string }>;
  loginWithFacebook: () => Promise<{ success: boolean; message?: string }>;
  register: (userData: { name: string; email: string; phone?: string; password?: string; city?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
}

const ADMIN_EMAILS = ['form@kinetixes.com', 'delightchetter@gmail.com'];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('kinetix_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kinetix_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('kinetix_auth_user');
    }
  }, [currentUser]);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const emailLower = firebaseUser.email?.toLowerCase() || '';
        const isAdminUser = ADMIN_EMAILS.includes(emailLower);
        const userObj: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Valued Client',
          email: firebaseUser.email || '',
          role: isAdminUser ? 'admin' : 'customer',
          avatarUrl: firebaseUser.photoURL || undefined,
          phone: firebaseUser.phoneNumber || undefined,
          city: 'Johannesburg',
          province: 'Gauteng'
        };
        setCurrentUser(userObj);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    if (!password || password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const fbUser = userCredential.user;
      const emailLower = fbUser.email?.toLowerCase() || '';
      const isAdminUser = ADMIN_EMAILS.includes(emailLower);

      const userObj: User = {
        id: fbUser.uid,
        name: fbUser.displayName || cleanEmail.split('@')[0],
        email: fbUser.email || cleanEmail,
        role: isAdminUser ? 'admin' : 'customer',
        city: 'Johannesburg',
        province: 'Gauteng'
      };
      setCurrentUser(userObj);
      return { success: true };
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        return { success: false, message: 'Invalid email address or password. Please try again.' };
      }
      if (err.code === 'auth/too-many-requests') {
        return { success: false, message: 'Access temporarily locked due to multiple failed attempts. Please try again later.' };
      }
      return { success: false, message: err.message || 'Authentication failed.' };
    }
  };

  const register = async (userData: { name: string; email: string; phone?: string; password?: string; city?: string }): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = userData.email.trim().toLowerCase();

    if (!userData.password || userData.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, userData.password);
      const fbUser = userCredential.user;
      await updateFirebaseProfile(fbUser, { displayName: userData.name });

      const isAdminUser = ADMIN_EMAILS.includes(cleanEmail);

      const newUser: User = {
        id: fbUser.uid,
        name: userData.name,
        email: cleanEmail,
        role: isAdminUser ? 'admin' : 'customer',
        phone: userData.phone || '+27 82 000 0000',
        city: userData.city || 'Johannesburg',
        province: 'Gauteng'
      };
      setCurrentUser(newUser);
      return { success: true };
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        return { success: false, message: 'This email address is already registered. Please sign in.' };
      }
      if (err.code === 'auth/weak-password') {
        return { success: false, message: 'Password should be at least 6 characters with letters and numbers.' };
      }
      return { success: false, message: err.message || 'Account creation failed.' };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const emailLower = user.email?.toLowerCase() || '';
      const isAdminUser = ADMIN_EMAILS.includes(emailLower);

      const userObj: User = {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Google User',
        email: user.email || '',
        role: isAdminUser ? 'admin' : 'customer',
        avatarUrl: user.photoURL || undefined,
        city: 'Johannesburg',
        province: 'Gauteng'
      };
      setCurrentUser(userObj);
      return { success: true };
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, message: 'Google sign-in popup was closed.' };
      }
      return { success: false, message: error.message || 'Google sign-in failed.' };
    }
  };

  const loginWithApple = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      const user = result.user;
      const userObj: User = {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Apple User',
        email: user.email || '',
        role: ADMIN_EMAILS.includes(user.email?.toLowerCase() || '') ? 'admin' : 'customer',
        city: 'Johannesburg',
        province: 'Gauteng'
      };
      setCurrentUser(userObj);
      return { success: true };
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, message: 'Apple sign-in popup was closed.' };
      }
      return { success: false, message: error.message || 'Apple sign-in failed.' };
    }
  };

  const loginWithFacebook = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      const userObj: User = {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Facebook User',
        email: user.email || '',
        role: ADMIN_EMAILS.includes(user.email?.toLowerCase() || '') ? 'admin' : 'customer',
        avatarUrl: user.photoURL || undefined,
        city: 'Johannesburg',
        province: 'Gauteng'
      };
      setCurrentUser(userObj);
      return { success: true };
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, message: 'Facebook sign-in popup was closed.' };
      }
      return { success: false, message: error.message || 'Facebook sign-in failed.' };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    setCurrentUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin' && ADMIN_EMAILS.includes(currentUser?.email?.toLowerCase() || ''),
        login,
        loginWithGoogle,
        loginWithApple,
        loginWithFacebook,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
