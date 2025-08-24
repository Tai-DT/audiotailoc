'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireGuest?: boolean;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = false,
  requireGuest = false,
  redirectTo,
}) => {
  const { isAuthenticated, isLoading, getCurrentUser } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated) {
        await getCurrentUser();
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, getCurrentUser]);

  useEffect(() => {
    if (!isChecking && !isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo || '/login');
      } else if (requireGuest && isAuthenticated) {
        router.push(redirectTo || '/');
      }
    }
  }, [isChecking, isLoading, isAuthenticated, requireAuth, requireGuest, redirectTo, router]);

  // Show loading while checking authentication
  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show children if authentication requirements are met
  if (
    (!requireAuth && !requireGuest) ||
    (requireAuth && isAuthenticated) ||
    (requireGuest && !isAuthenticated)
  ) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
};
