'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';

export interface UserSession {
  id: string;
  accountId: string;
  fullName: string;
  email?: string;
  phoneNumber: string;
  role: string;
  preferredLanguage: string;
  isVerified: boolean;
  assignedLlgId?: string;
  citizenProfileId?: string;
}

interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: UserSession) => void;
  logout: () => void;
  isCitizen: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isMpOffice: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  isCitizen: false,
  isAdmin: false,
  isStaff: false,
  isMpOffice: false
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('bulolo_token');
    const storedUser = localStorage.getItem('bulolo_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('bulolo_token');
        localStorage.removeItem('bulolo_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: UserSession) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('bulolo_token', newToken);
    localStorage.setItem('bulolo_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('bulolo_token');
    localStorage.removeItem('bulolo_user');
    window.location.href = '/';
  };

  const role = user?.role || 'PUBLIC_VISITOR';
  const isCitizen = role === 'CITIZEN';
  const isAdmin = role === 'SUPER_ADMIN' || role === 'DISTRICT_ADMIN';
  const isStaff = isAdmin || role === 'OFFICE_STAFF' || role === 'LLG_ADMIN';
  const isMpOffice = role === 'MP_OFFICE_REP' || role === 'SUPER_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        isCitizen,
        isAdmin,
        isStaff,
        isMpOffice
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
