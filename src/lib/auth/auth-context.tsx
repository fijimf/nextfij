'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/api/types/auth';
import Cookies from 'js-cookie';
import { apiClient } from '@/lib/api/client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setUser({ username: Cookies.get('username') || '' });
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.post('/api/authenticate', { username, password });
      const { token } = response.data;

      if (!token) {
        throw new Error('No token received from server');
      }

      // Store token and username in cookies
      Cookies.set('token', token, { 
        secure: false, //process.env.NODE_ENV === 'production',
        //TODO: change to strict in production, figure out how to runn https
        sameSite: 'lax',
        path: '/'
      });
      Cookies.set('username', username, { 
        secure: false, //process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      
      setUser({ username });
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
      Cookies.remove('token', { path: '/' });
      Cookies.remove('username', { path: '/' });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if server logout fails
      Cookies.remove('token', { path: '/' });
      Cookies.remove('username', { path: '/' });
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 