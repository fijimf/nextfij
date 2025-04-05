'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button onClick={logout} variant="outline">
      Logout
    </Button>
  );
} 