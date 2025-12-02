'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth, useLogin } from '@/lib/hooks/use-auth';
import { authStorage } from '@/lib/auth-storage';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

function LoginPageContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const { data: user, isLoading: isAuthLoading } = useAuth();
  const loginMutation = useLogin();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isAuthenticated = !!user;
  // Decode the redirect URL (e.g., %2Fprofile -> /profile)
  const redirectParam = searchParams.get('redirect');
  const redirectTo = redirectParam ? decodeURIComponent(redirectParam) : '/';

  // Redirect if already authenticated - check immediately on mount
  // Use sessionStorage to prevent redirect loops across page reloads
  const REDIRECT_KEY = 'login_redirected';
  const hasRedirected = typeof window !== 'undefined' ? sessionStorage.getItem(REDIRECT_KEY) === 'true' : false;
  
  React.useEffect(() => {
    // Check localStorage immediately
    const token = authStorage.getAccessToken();
    const storedUser = authStorage.getUser();
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:37',message:'LoginPage auth check',data:{hasToken:!!token,hasStoredUser:!!storedUser,isAuthenticated,isAuthLoading,redirectTo,hasRedirected},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'J'})}).catch(()=>{});
    // #endregion
    
    console.log('[LoginPage] Auth check:', { 
      hasToken: !!token, 
      hasStoredUser: !!storedUser, 
      isAuthenticated, 
      isAuthLoading,
      redirectTo,
      hasRedirected
    });
    
    // If already authenticated, verify cookies before redirecting
    // Only redirect if we have BOTH token AND storedUser to avoid redirect loop
    // Use sessionStorage to prevent multiple redirects in the same session
    if (!hasRedirected && token && storedUser) {
      // Verify cookies are set before redirecting
      const verifyCookiesAndRedirect = async () => {
        let cookieCheckAttempts = 0;
        const maxAttempts = 10;
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:60',message:'useEffect: Starting cookie verification loop',data:{redirectTo,hasToken:!!token,hasStoredUser:!!storedUser},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'J'})}).catch(()=>{});
        // #endregion
        
        while (cookieCheckAttempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          const cookies = document.cookie;
          const hasTokenCookie = cookies.includes('audiotailoc_token=');
          const hasUserCookie = cookies.includes('audiotailoc_user=');
          
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:68',message:'useEffect: Cookie check attempt',data:{attempt:cookieCheckAttempts+1,maxAttempts,hasTokenCookie,hasUserCookie,cookiesLength:cookies.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'J'})}).catch(()=>{});
          // #endregion
          
          if (hasTokenCookie && hasUserCookie) {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem(REDIRECT_KEY, 'true');
            }
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:75',message:'useEffect: Redirecting (cookies verified)',data:{redirectTo,hasToken:!!token,hasStoredUser:!!storedUser,hasTokenCookie,hasUserCookie,attempts:cookieCheckAttempts+1},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'J'})}).catch(()=>{});
            // #endregion
            console.log('[LoginPage] Already authenticated, cookies verified, redirecting to:', redirectTo);
            // Wait longer to ensure cookies are fully set and browser has time to send them
            await new Promise(resolve => setTimeout(resolve, 500));
            // #region agent log
            const preRedirectToken = authStorage.getAccessToken();
            const preRedirectUser = authStorage.getUser();
            fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:88',message:'About to redirect (already auth) with window.location.href',data:{redirectTo,hasToken:!!preRedirectToken,hasUser:!!preRedirectUser},timestamp:Date.now(),sessionId:'debug-session',runId:'run8',hypothesisId:'P'})}).catch(()=>{});
            // #endregion
            window.location.href = redirectTo;
            return;
          }
          cookieCheckAttempts++;
        }
        
        // If cookies still not set after max attempts, redirect anyway
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(REDIRECT_KEY, 'true');
        }
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:90',message:'useEffect: Redirecting (cookies not verified)',data:{redirectTo,hasToken:!!token,hasStoredUser:!!storedUser,attempts:cookieCheckAttempts},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'J'})}).catch(()=>{});
        // #endregion
        console.warn('[LoginPage] Cookies not verified after max attempts, redirecting anyway to', redirectTo);
        await new Promise(resolve => setTimeout(resolve, 500));
        window.location.href = redirectTo;
      };
      
      verifyCookiesAndRedirect();
      return;
    }
    
    // Clear redirect flag if we don't have auth (user logged out)
    if (!token && !storedUser && typeof window !== 'undefined') {
      sessionStorage.removeItem(REDIRECT_KEY);
    }
    
    // Done checking
    if (!isAuthLoading) {
      setIsCheckingAuth(false);
    }
  }, [isAuthenticated, isAuthLoading, redirectTo, hasRedirected]);

  // Show loading while checking auth
  if (isCheckingAuth && isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    setIsLoading(true);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:76',message:'Login form submitted',data:{email,hasPassword:!!password,rememberMe,redirectTo},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

    try {
      await loginMutation.mutateAsync({ email, password, rememberMe });
      // #region agent log
      const tokenAfterLogin = authStorage.getAccessToken();
      const userAfterLogin = authStorage.getUser();
      console.log('[DEBUG] Login mutation completed', { hasToken: !!tokenAfterLogin, hasUser: !!userAfterLogin, userId: userAfterLogin?.id, isAuthenticated, redirectTo });
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:108',message:'Login mutation completed',data:{hasToken:!!tokenAfterLogin,hasUser:!!userAfterLogin,userId:userAfterLogin?.id,isAuthenticated,redirectTo},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'K'})}).catch(()=>{});
      // #endregion
      
      // Verify token and user are stored before redirecting
      if (!tokenAfterLogin || !userAfterLogin) {
        console.error('[DEBUG] Token or user not stored after login!', { tokenAfterLogin, userAfterLogin });
        setIsLoading(false);
        return;
      }
      
      // Clear redirect flag before redirecting (so we can redirect after successful login)
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(REDIRECT_KEY);
      }
      
      // Verify cookies are set before redirecting
      // Wait a bit to ensure cookies are set and available for server-side proxy.ts
      let cookieCheckAttempts = 0;
      const maxAttempts = 10;
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:129',message:'Starting cookie verification loop',data:{redirectTo,hasToken:!!tokenAfterLogin,hasUser:!!userAfterLogin},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'K'})}).catch(()=>{});
      // #endregion
      while (cookieCheckAttempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const cookies = document.cookie;
        const hasTokenCookie = cookies.includes('audiotailoc_token=');
        const hasUserCookie = cookies.includes('audiotailoc_user=');
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:135',message:'Cookie check attempt',data:{attempt:cookieCheckAttempts+1,maxAttempts,hasTokenCookie,hasUserCookie,cookiesLength:cookies.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'K'})}).catch(()=>{});
        // #endregion
        
        if (hasTokenCookie && hasUserCookie) {
          // #region agent log
          console.log('[DEBUG] Cookies verified, redirecting to', redirectTo);
          const finalTokenCheck = authStorage.getAccessToken();
          const finalUserCheck = authStorage.getUser();
          const finalCookies = document.cookie;
          fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:142',message:'Redirecting after login (cookies verified)',data:{redirectTo,hasToken:!!tokenAfterLogin,hasUser:!!userAfterLogin,hasTokenCookie,hasUserCookie,attempts:cookieCheckAttempts+1,finalTokenCheck:!!finalTokenCheck,finalUserCheck:!!finalUserCheck,finalCookiesLength:finalCookies.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run8',hypothesisId:'P'})}).catch(()=>{});
          // #endregion
          // Use window.location.href for full page reload to ensure cookies are sent to server
          // This is necessary because proxy.ts runs server-side and needs cookies in the request
          // Wait longer to ensure cookies are fully set and browser has time to send them
          await new Promise(resolve => setTimeout(resolve, 500));
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:193',message:'About to redirect with window.location.href',data:{redirectTo,hasToken:!!finalTokenCheck,hasUser:!!finalUserCheck},timestamp:Date.now(),sessionId:'debug-session',runId:'run8',hypothesisId:'P'})}).catch(()=>{});
          // #endregion
          window.location.href = redirectTo;
          return;
        }
        cookieCheckAttempts++;
      }
      
      // If cookies still not set after max attempts, redirect anyway
      // #region agent log
      console.warn('[DEBUG] Cookies not verified after max attempts, redirecting anyway to', redirectTo);
      const finalTokenCheck2 = authStorage.getAccessToken();
      const finalUserCheck2 = authStorage.getUser();
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:150',message:'Redirecting after login (cookies not verified)',data:{redirectTo,hasToken:!!tokenAfterLogin,hasUser:!!userAfterLogin,attempts:cookieCheckAttempts,finalTokenCheck:!!finalTokenCheck2,finalUserCheck:!!finalUserCheck2},timestamp:Date.now(),sessionId:'debug-session',runId:'run8',hypothesisId:'P'})}).catch(()=>{});
      // #endregion
      // Use window.location.href for full page reload to ensure cookies are sent to server
      await new Promise(resolve => setTimeout(resolve, 500));
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:206',message:'About to redirect (cookies not verified) with window.location.href',data:{redirectTo,hasToken:!!finalTokenCheck2,hasUser:!!finalUserCheck2},timestamp:Date.now(),sessionId:'debug-session',runId:'run8',hypothesisId:'P'})}).catch(()=>{});
      // #endregion
      window.location.href = redirectTo;
    } catch (error) {
      // Error is handled by the mutation
      console.error('[DEBUG] Login error caught in handleSubmit', error);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:93',message:'Login error caught',data:{errorMessage:(error as Error)?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync({ email: 'demo@audiotailoc.com', password: 'demo123', rememberMe: true });
      // Verify token and user are stored before redirecting
      const tokenAfterLogin = authStorage.getAccessToken();
      const userAfterLogin = authStorage.getUser();
      if (!tokenAfterLogin || !userAfterLogin) {
        console.error('[DEBUG] Token or user not stored after demo login!', { tokenAfterLogin, userAfterLogin });
        setIsLoading(false);
        return;
      }
      // Clear redirect flag before redirecting (so we can redirect after successful login)
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(REDIRECT_KEY);
      }
      
      // Verify cookies are set before redirecting
      // Wait a bit to ensure cookies are set and available for server-side proxy.ts
      let cookieCheckAttempts = 0;
      const maxAttempts = 10;
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:180',message:'Demo login: Starting cookie verification loop',data:{redirectTo,hasToken:!!tokenAfterLogin,hasUser:!!userAfterLogin},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'K'})}).catch(()=>{});
      // #endregion
      while (cookieCheckAttempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const cookies = document.cookie;
        const hasTokenCookie = cookies.includes('audiotailoc_token=');
        const hasUserCookie = cookies.includes('audiotailoc_user=');
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:186',message:'Demo login: Cookie check attempt',data:{attempt:cookieCheckAttempts+1,maxAttempts,hasTokenCookie,hasUserCookie,cookiesLength:cookies.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'K'})}).catch(()=>{});
        // #endregion
        
        if (hasTokenCookie && hasUserCookie) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:193',message:'Demo login redirecting (cookies verified)',data:{redirectTo,hasToken:!!tokenAfterLogin,hasUser:!!userAfterLogin,hasTokenCookie,hasUserCookie,attempts:cookieCheckAttempts+1},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'K'})}).catch(()=>{});
          // #endregion
          // Use window.location.href for full page reload to ensure cookies are sent to server
          // Wait longer to ensure cookies are fully set and browser has time to send them
          await new Promise(resolve => setTimeout(resolve, 500));
          window.location.href = redirectTo;
          return;
        }
        cookieCheckAttempts++;
      }
      
      // If cookies still not set after max attempts, redirect anyway
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:175',message:'Demo login redirecting (cookies not verified)',data:{redirectTo,hasToken:!!tokenAfterLogin,hasUser:!!userAfterLogin,attempts:cookieCheckAttempts},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'K'})}).catch(()=>{});
      // #endregion
      // Use window.location.href for full page reload to ensure cookies are sent to server
      await new Promise(resolve => setTimeout(resolve, 500));
      window.location.href = redirectTo;
    } catch (error) {
      // Error is handled by the mutation
      console.error('Demo login error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Đăng nhập</CardTitle>
            <CardDescription className="text-center">
              Nhập thông tin tài khoản để tiếp tục
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                    Ghi nhớ đăng nhập
                  </Label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2">Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    Đăng nhập
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">HOẶC</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-6"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                Tài khoản demo
              </Button>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Chưa có tài khoản? </span>
              <Link href="/auth/register" className="text-primary hover:underline">
                Đăng ký ngay
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Tại sao nên đăng ký?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Theo dõi đơn hàng dễ dàng</li>
              <li>• Nhận ưu đãi đặc biệt</li>
              <li>• Tư vấn kỹ thuật chuyên nghiệp</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Đang tải...</h1>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
