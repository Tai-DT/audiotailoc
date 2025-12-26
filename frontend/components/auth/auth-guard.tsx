'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { authStorage } from '@/lib/auth-storage';
import { logger } from '@/lib/logger';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children, fallback, redirectTo }: AuthGuardProps) {
  const { data: user, isLoading, refetch } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = React.useState(true);
  const [hasAttemptedRefetch, setHasAttemptedRefetch] = React.useState(false);
  const hasRedirectedRef = React.useRef(false);

  // Check authentication status and refetch if needed
  React.useEffect(() => {
    const checkAuth = async () => {
      // Wait a bit for localStorage to be available
      await new Promise(resolve => setTimeout(resolve, 100));

      const hasToken = authStorage.getAccessToken();
      const storedUser = authStorage.getUser();

      logger.debug('[AuthGuard] Checking auth', { hasToken: !!hasToken, storedUser: !!storedUser, user: !!user, isLoading });

      // If we have a token but no user data, try to refetch
      // This can happen after a redirect from login page
      if (hasToken && !user && !isLoading && !hasAttemptedRefetch) {
        setHasAttemptedRefetch(true);
        logger.debug('[AuthGuard] Has token but no user, refetching');
        try {
          await refetch();
        } catch (e) {
          logger.warn('[AuthGuard] Refetch failed', { error: e });
        }
      }

      // Wait a bit more if we just refetched to ensure state is updated
      if (hasAttemptedRefetch) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [user, isLoading, refetch, hasAttemptedRefetch]);

  // Auto redirect to login if not authenticated
  // CRITICAL: Only redirect if we have NO token AND NO stored user
  // If we have a token (even without user data yet), DO NOT redirect - allow access
  // This prevents redirect loops when React Query hasn't loaded user data yet
  React.useEffect(() => {
    if (isLoading || isChecking || hasRedirectedRef.current) return;

    const hasToken = authStorage.getAccessToken();
    const storedUser = authStorage.getUser();
    const isAuthenticated = !!user || !!storedUser;
    const cookies = typeof document !== 'undefined' ? document.cookie : '';
    const hasTokenCookie = cookies.includes('audiotailoc_token=');

    logger.debug('[AuthGuard] Final auth check', { isAuthenticated, hasToken: !!hasToken, user: !!user, storedUser: !!storedUser, hasTokenCookie, hasAttemptedRefetch });

    // CRITICAL FIX: Only redirect if we have NO token AND NO stored user
    // If we have a token (even without user), DO NOT redirect - trust the token
    // This prevents redirect loops when user data hasn't loaded from React Query yet
    if (!hasToken && !storedUser) {
      hasRedirectedRef.current = true;
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const loginUrl = currentPath && currentPath !== '/'
        ? `/auth/login?redirect=${encodeURIComponent(currentPath)}`
        : '/auth/login';

      logger.debug('[AuthGuard] Redirecting to login', { loginUrl, currentPath });

      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push(loginUrl);
      }
    } else {
      logger.debug('[AuthGuard] Allowing access - has token or stored user', { hasToken: !!hasToken, hasStoredUser: !!storedUser });
    }
  }, [isLoading, isChecking, user, redirectTo, router, hasAttemptedRefetch]);

  // Final check: if authenticated (from API or localStorage), render children
  // CRITICAL: If we have a token (even without user), allow access - don't redirect
  // This prevents redirect loops when React Query hasn't loaded user data yet
  const hasToken = authStorage.getAccessToken();
  const storedUser = authStorage.getUser();
  const _isAuthenticated = !!user || !!storedUser;

  // Show loading while checking or loading
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  // CRITICAL FIX: Only block if we have NO token AND NO stored user
  // If we have a token (even without user), allow access - trust the token
  if (!hasToken && !storedUser) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Show loading while redirecting
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Đang chuyển hướng đến trang đăng nhập...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
