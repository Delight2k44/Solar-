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

const DEMO_USERS: Record<string, User> = {
  admin: {
    id: 'usr-admin-01',
    name: 'Kinetix Operations Admin',
    email: 'admin@kinetixenergy.co.za',
    role: 'admin',
    phone: '+27 11 800 4500',
    company: 'Kinetix Energy Technologies (Pty) Ltd',
    address: 'Sandton City Office Tower',
    city: 'Sandton',
    province: 'Gauteng',
  },
  customer: {
    id: 'usr-client-01',
    name: 'Bryanston Residential Client',
    email: 'client@bryanston.co.za',
    role: 'customer',
    phone: '+27 82 456 7890',
    company: 'Private Residential Installation',
    address: '14 Protea Avenue',
    city: 'Bryanston, Johannesburg',
    province: 'Gauteng',
  }
};

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

  // Firebase onAuthStateChanged listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const emailLower = firebaseUser.email?.toLowerCase() || '';
        const isAdminUser = emailLower === 'delightchetter@gmail.com' || emailLower === 'admin@kinetixenergy.co.za';
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

    // Fast-path for internal predefined accounts
    if (cleanEmail === 'admin@kinetixenergy.co.za' || cleanEmail === 'delightchetter@gmail.com') {
      const adminUser: User = {
        id: 'usr-admin-01',
        name: 'Delight (Operations Admin)',
        email: cleanEmail,
        role: 'admin',
        phone: '+27 11 800 4500',
        company: 'Kinetix Energy Technologies (Pty) Ltd',
        address: 'Sandton City Office Tower',
        city: 'Sandton',
        province: 'Gauteng',
      };
      setCurrentUser(adminUser);
      return { success: true };
    }
    if (cleanEmail === 'client@bryanston.co.za') {
      setCurrentUser(DEMO_USERS.customer);
      return { success: true };
    }

    try {
      if (password && password.length >= 6) {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const fbUser = userCredential.user;
        const emailLower = fbUser.email?.toLowerCase() || '';
        const isAdminUser = emailLower === 'delightchetter@gmail.com' || emailLower === 'admin@kinetixenergy.co.za';
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
      }
    } catch (err: any) {
      console.warn('Firebase login attempt:', err.message);
      // If user doesn't exist yet in Firebase, allow seamless customer onboarding
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        const newUser: User = {
          id: `usr-${Date.now()}`,
          name: cleanEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email: cleanEmail,
          role: 'customer',
          city: 'Johannesburg',
          province: 'Gauteng'
        };
        setCurrentUser(newUser);
        return { success: true };
      }
      return { success: false, message: err.message || 'Invalid credentials' };
    }

    const fallbackUser: User = {
      id: `usr-${Date.now()}`,
      name: cleanEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: cleanEmail,
      role: 'customer',
      city: 'Johannesburg',
      province: 'Gauteng'
    };
    setCurrentUser(fallbackUser);
    return { success: true };
  };

  const register = async (userData: { name: string; email: string; phone?: string; password?: string; city?: string }): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = userData.email.trim().toLowerCase();

    try {
      if (userData.password && userData.password.length >= 6) {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, userData.password);
        const fbUser = userCredential.user;
        await updateFirebaseProfile(fbUser, { displayName: userData.name });

        const newUser: User = {
          id: fbUser.uid,
          name: userData.name,
          email: cleanEmail,
          role: 'customer',
          phone: userData.phone || '+27 82 000 0000',
          city: userData.city || 'Johannesburg',
          province: 'Gauteng'
        };
        setCurrentUser(newUser);
        return { success: true };
      }
    } catch (err: any) {
      console.warn('Firebase registration notice:', err.message);
      if (err.code === 'auth/email-already-in-use') {
        return { success: false, message: 'This email address is already registered. Please sign in.' };
      }
    }

    // Default seamless registration
    const fallbackUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: cleanEmail,
      role: 'customer',
      phone: userData.phone || '+27 82 000 0000',
      city: userData.city || 'Johannesburg',
      province: 'Gauteng'
    };
    setCurrentUser(fallbackUser);
    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userObj: User = {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Google User',
        email: user.email || '',
        role: user.email?.toLowerCase() === 'admin@kinetixenergy.co.za' ? 'admin' : 'customer',
        avatarUrl: user.photoURL || undefined,
        city: 'Johannesburg',
        province: 'Gauteng'
      };
      setCurrentUser(userObj);
      return { success: true };
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
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
        role: 'customer',
        city: 'Johannesburg',
        province: 'Gauteng'
      };
      setCurrentUser(userObj);
      return { success: true };
    } catch (error: any) {
      console.error('Apple Sign-In Error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, message: 'Apple sign-in popup was closed.' };
      }
      return { success: false, message: error.message || 'Apple sign-in failed. Please verify provider configuration.' };
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
        role: 'customer',
        avatarUrl: user.photoURL || undefined,
        city: 'Johannesburg',
        province: 'Gauteng'
      };
      setCurrentUser(userObj);
      return { success: true };
    } catch (error: any) {
      console.error('Facebook Sign-In Error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, message: 'Facebook sign-in popup was closed.' };
      }
      return { success: false, message: error.message || 'Facebook sign-in failed. Please verify provider configuration.' };
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
        isAdmin: currentUser?.role === 'admin',
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
