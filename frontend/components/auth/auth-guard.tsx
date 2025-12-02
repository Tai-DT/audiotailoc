'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { authStorage } from '@/lib/auth-storage';

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
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth-guard.tsx:22',message:'AuthGuard checking auth',data:{hasToken:!!hasToken,hasStoredUser:!!storedUser,hasUser:!!user,isLoading},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'G'})}).catch(()=>{});
      // #endregion
      
      console.log('[AuthGuard] Checking auth:', { hasToken: !!hasToken, storedUser: !!storedUser, user: !!user, isLoading });
      
      // If we have a token but no user data, try to refetch
      // This can happen after a redirect from login page
      if (hasToken && !user && !isLoading && !hasAttemptedRefetch) {
        setHasAttemptedRefetch(true);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth-guard.tsx:34',message:'AuthGuard refetching',data:{hasToken:!!hasToken,hasUser:!!user},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'G'})}).catch(()=>{});
        // #endregion
        console.log('[AuthGuard] Has token but no user, refetching...');
        try {
          await refetch();
          // #region agent log
          const userAfterRefetch = authStorage.getUser();
          fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth-guard.tsx:38',message:'AuthGuard refetch completed',data:{hasUserAfterRefetch:!!userAfterRefetch},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'G'})}).catch(()=>{});
          // #endregion
        } catch (e) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth-guard.tsx:40',message:'AuthGuard refetch failed',data:{errorMessage:(e as Error)?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
          console.log('[AuthGuard] Refetch failed:', e);
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
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth-guard.tsx:74',message:'AuthGuard final auth check',data:{isAuthenticated,hasToken:!!hasToken,hasUser:!!user,hasStoredUser:!!storedUser,hasTokenCookie,hasAttemptedRefetch,isLoading,isChecking},timestamp:Date.now(),sessionId:'debug-session',runId:'run5',hypothesisId:'L'})}).catch(()=>{});
    // #endregion
    
    console.log('[AuthGuard] Final auth check:', { isAuthenticated, hasToken: !!hasToken, user: !!user, storedUser: !!storedUser, hasTokenCookie, hasAttemptedRefetch });

    // CRITICAL FIX: Only redirect if we have NO token AND NO stored user
    // If we have a token (even without user), DO NOT redirect - trust the token
    // This prevents redirect loops when user data hasn't loaded from React Query yet
    if (!hasToken && !storedUser) {
      hasRedirectedRef.current = true;
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const loginUrl = currentPath && currentPath !== '/' 
        ? `/auth/login?redirect=${encodeURIComponent(currentPath)}`
        : '/auth/login';
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth-guard.tsx:90',message:'AuthGuard redirecting to login',data:{currentPath,loginUrl,hasToken:!!hasToken,hasStoredUser:!!storedUser,hasUser:!!user,hasTokenCookie,isAuthenticated},timestamp:Date.now(),sessionId:'debug-session',runId:'run5',hypothesisId:'L'})}).catch(()=>{});
      // #endregion
      
      console.log('[AuthGuard] Redirecting to login:', loginUrl);
      
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push(loginUrl);
      }
    } else {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth-guard.tsx:105',message:'AuthGuard allowing access',data:{hasToken:!!hasToken,hasStoredUser:!!storedUser,hasUser:!!user,hasTokenCookie,isAuthenticated,reason:hasToken ? 'hasToken' : 'hasStoredUser'},timestamp:Date.now(),sessionId:'debug-session',runId:'run5',hypothesisId:'L'})}).catch(()=>{});
      // #endregion
      console.log('[AuthGuard] Allowing access - has token or stored user');
    }
  }, [isLoading, isChecking, user, redirectTo, router, hasAttemptedRefetch]);

  // Final check: if authenticated (from API or localStorage), render children
  // CRITICAL: If we have a token (even without user), allow access - don't redirect
  // This prevents redirect loops when React Query hasn't loaded user data yet
  const hasToken = authStorage.getAccessToken();
  const storedUser = authStorage.getUser();
  const isAuthenticated = !!user || !!storedUser;

  // #region agent log - Log render check (moved to top level to avoid hooks violation)
  React.useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth-guard.tsx:116',message:'AuthGuard render check',data:{hasToken:!!hasToken,hasStoredUser:!!storedUser,hasUser:!!user,isAuthenticated,isLoading,isChecking},timestamp:Date.now(),sessionId:'debug-session',runId:'run5',hypothesisId:'M'})}).catch(()=>{});
  }, [hasToken, storedUser, user, isAuthenticated, isLoading, isChecking]);
  // #endregion

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
