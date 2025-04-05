'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/api/types/auth';
import Cookies from 'js-cookie';

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
    console.log('\n=== Auth Context Initial Load ===');
    const token = Cookies.get('token');
    console.log('🔑 Initial token check:', token ? '✅ Present' : '❌ Missing');
    if (token) {
      setUser({ username: Cookies.get('username') || '' });
    }
    setIsLoading(false);
    console.log('=== End Auth Context Initial Load ===\n');
  }, []);

  const login = async (username: string, password: string) => {
    console.log('\n=== Login Attempt ===');
    try {
      console.log('🌐 Making login request...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        console.log('❌ Login failed:', response.status);
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('✅ Login successful, setting cookies...');
      
      // Store token in cookie with secure options
      Cookies.set('token', data.token, { 
        secure: true, 
        sameSite: 'strict',
        path: '/'
      });
      Cookies.set('username', username, { 
        secure: true, 
        sameSite: 'strict',
        path: '/'
      });
      
      console.log('🍪 Cookies set successfully');
      setUser({ username });
      console.log('=== End Login Attempt ===\n');
      router.push('/dashboard');
    } catch (error) {
      console.error('❌ Login error:', error);
      console.log('=== End Login Attempt ===\n');
      throw error;
    }
  };

  const logout = () => {
    console.log('\n=== Logout ===');
    Cookies.remove('token', { path: '/' });
    Cookies.remove('username', { path: '/' });
    console.log('🍪 Cookies removed');
    setUser(null);
    console.log('=== End Logout ===\n');
    router.push('/login');
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