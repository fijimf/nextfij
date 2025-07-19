'use client';

import { usePathname } from 'next/navigation';

export function useTeamSlug(): string | null {
  const pathname = usePathname();
  
  // Match pattern /team/{teamId}
  const teamMatch = pathname.match(/^\/team\/([^\/]+)$/);
  
  if (teamMatch) {
    return teamMatch[1];
  }
  
  return null;
}