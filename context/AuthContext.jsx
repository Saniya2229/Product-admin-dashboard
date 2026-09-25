'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import authApi from '@/services/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from storage on initial mount
  useEffect(() => {
    try {
      const storedUser = authApi.getCurrentUser();
      const hasToken = authApi.isAuthenticated();
      if (storedUser && hasToken) {
        setUser(storedUser);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }

    // Listen to unauthorized event dispatched from Axios interceptor
    const handleUnauthorized = () => {
      setUser(null);
      router.push('/login?session_expired=true');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [router]);

  // Login handler
  const login = useCallback(
    async (credentials) => {
      const data = await authApi.login(credentials);
      setUser(data);
      return data;
    },
    []
  );

  // Logout handler
  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    router.push('/login');
  }, [router]);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
