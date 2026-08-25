import React, { createContext, useContext, useState, useEffect } from 'react';

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
  loginWithDemo: (role: 'customer' | 'admin') => void;
  register: (userData: { name: string; email: string; phone?: string; password?: string; city?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
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

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kinetix_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('kinetix_auth_user');
    }
  }, [currentUser]);

  const login = async (email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    
    if (cleanEmail === 'admin@kinetixenergy.co.za' || cleanEmail === 'admin') {
      setCurrentUser(DEMO_USERS.admin);
      return { success: true };
    }

    if (cleanEmail === 'client@bryanston.co.za' || cleanEmail === 'client') {
      setCurrentUser(DEMO_USERS.customer);
      return { success: true };
    }

    // Dynamic login for any user
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: cleanEmail,
      role: cleanEmail.includes('admin') ? 'admin' : 'customer',
      city: 'Johannesburg',
      province: 'Gauteng'
    };

    setCurrentUser(newUser);
    return { success: true };
  };

  const loginWithDemo = (role: 'customer' | 'admin') => {
    setCurrentUser(DEMO_USERS[role]);
  };

  const register = async (userData: { name: string; email: string; phone?: string; city?: string }): Promise<{ success: boolean; message?: string }> => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email.trim().toLowerCase(),
      role: 'customer',
      phone: userData.phone || '+27 82 000 0000',
      city: userData.city || 'Johannesburg',
      province: 'Gauteng',
    };

    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
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
        loginWithDemo,
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
