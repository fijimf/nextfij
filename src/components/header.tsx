'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/auth-context';
import { LogoutButton } from '@/components/logout-button';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 relative">
            {/* Placeholder for logo - replace with actual logo later */}
            <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-white font-bold">
              DF
            </div>
          </div>
          <Link href="/" className="text-xl font-bold">
            Deep Fij
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">{user.username}</span>
              <LogoutButton />
            </>
          ) : (
            <Link href="/login" className="text-sm hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
} 