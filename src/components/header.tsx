'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { LogoutButton } from '@/components/logout-button';
import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useRandomQuote } from '@/lib/api/hooks';
import { useTeamSlug } from '@/lib/hooks/use-team-slug';

export function Header() {
  const { user } = useAuth();
  const teamSlug = useTeamSlug();
  const { data: quote, isLoading: quoteLoading } = useRandomQuote(teamSlug || undefined);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Logo />
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">{user.username}</span>
              <ThemeToggle />
              <LogoutButton />
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link href="/login" className="text-sm hover:underline transition-colors">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Quote section */}
      {quote && !quoteLoading && (
        <div className="border-t bg-muted/30 animate-fade-in">
          <div className="container mx-auto px-4 py-2">
            <div className="text-center text-sm text-muted-foreground">
              <span className="italic">&ldquo;{quote.quote}&rdquo;</span>
              <span className="ml-2">— {quote.source}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 