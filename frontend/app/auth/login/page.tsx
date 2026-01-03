'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth, useLogin } from '@/lib/hooks/use-auth';
import { authStorage } from '@/lib/auth-storage';
import { logger } from '@/lib/logger';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { DotPattern } from '@/components/ui/dot-pattern';
import { MagicCard } from '@/components/ui/magic-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { ShimmerButton } from '@/components/ui/shimmer-button';

function LoginPageContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const { data: user, isLoading: isAuthLoading } = useAuth();
  const loginMutation = useLogin();
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

    logger.debug('[LoginPage] Auth check', {
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

        while (cookieCheckAttempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          const cookies = document.cookie;
          const hasTokenCookie = cookies.includes('audiotailoc_token=');
          const hasUserCookie = cookies.includes('audiotailoc_user=');

          if (hasTokenCookie && hasUserCookie) {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem(REDIRECT_KEY, 'true');
            }
            logger.debug('[LoginPage] Already authenticated, cookies verified, redirecting', { redirectTo });
            // Wait longer to ensure cookies are fully set and browser has time to send them
            await new Promise(resolve => setTimeout(resolve, 500));
            window.location.href = redirectTo;
            return;
          }
          cookieCheckAttempts++;
        }

        // If cookies still not set after max attempts, redirect anyway
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(REDIRECT_KEY, 'true');
        }
        logger.warn('[LoginPage] Cookies not verified after max attempts, redirecting anyway', { redirectTo, attempts: maxAttempts });
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
      <div className="min-h-screen bg-background flex items-center justify-center" role="status" aria-label="Đang kiểm tra đăng nhập">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" aria-hidden="true" />
          <p className="text-muted-foreground">Đang kiểm tra đăng nhập...</p>
          <span className="sr-only">Đang tải</span>
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

    try {
      await loginMutation.mutateAsync({ email, password, rememberMe });

      // Verify token and user are stored before redirecting
      const tokenAfterLogin = authStorage.getAccessToken();
      const userAfterLogin = authStorage.getUser();
      if (!tokenAfterLogin || !userAfterLogin) {
        logger.error('[LoginPage] Token or user not stored after login', undefined, { hasToken: !!tokenAfterLogin, hasUser: !!userAfterLogin });
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
      while (cookieCheckAttempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const cookies = document.cookie;
        const hasTokenCookie = cookies.includes('audiotailoc_token=');
        const hasUserCookie = cookies.includes('audiotailoc_user=');

        if (hasTokenCookie && hasUserCookie) {
          // Use window.location.href for full page reload to ensure cookies are sent to server
          // This is necessary because proxy.ts runs server-side and needs cookies in the request
          // Wait longer to ensure cookies are fully set and browser has time to send them
          await new Promise(resolve => setTimeout(resolve, 500));
          window.location.href = redirectTo;
          return;
        }
        cookieCheckAttempts++;
      }

      // If cookies still not set after max attempts, redirect anyway
      // Use window.location.href for full page reload to ensure cookies are sent to server
      await new Promise(resolve => setTimeout(resolve, 500));
      window.location.href = redirectTo;
    } catch (error) {
      // Error is handled by the mutation
      logger.error('[LoginPage] Login error caught in handleSubmit', error, { email });
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
        logger.error('[LoginPage] Token or user not stored after demo login', undefined, { hasToken: !!tokenAfterLogin, hasUser: !!userAfterLogin });
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
      while (cookieCheckAttempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const cookies = document.cookie;
        const hasTokenCookie = cookies.includes('audiotailoc_token=');
        const hasUserCookie = cookies.includes('audiotailoc_user=');

        if (hasTokenCookie && hasUserCookie) {
          // Use window.location.href for full page reload to ensure cookies are sent to server
          // Wait longer to ensure cookies are fully set and browser has time to send them
          await new Promise(resolve => setTimeout(resolve, 500));
          window.location.href = redirectTo;
          return;
        }
        cookieCheckAttempts++;
      }

      // If cookies still not set after max attempts, redirect anyway
      // Use window.location.href for full page reload to ensure cookies are sent to server
      await new Promise(resolve => setTimeout(resolve, 500));
      window.location.href = redirectTo;
    } catch (error) {
      // Error is handled by the mutation
      logger.error('[LoginPage] Demo login error', error);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden" role="main" aria-labelledby="login-title">
      <DotPattern className="absolute inset-0 opacity-30" width={20} height={20} cx={1} cy={1} cr={1} />
      <div className="w-full max-w-md relative z-10">
        <MagicCard gradientColor="oklch(0.97 0.008 45)" className="p-0 border-none shadow-none">
          <Card className="border-0 shadow-2xl relative overflow-hidden">
            <BorderBeam
              size={100}
              duration={10}
              colorFrom="oklch(0.58 0.28 20)"
              colorTo="oklch(0.70 0.22 40)"
              borderWidth={2}
            />
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center" id="login-title">Đăng nhập</CardTitle>
              <CardDescription className="text-center">
                Nhập thông tin tài khoản để tiếp tục
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="login-title">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                      autoComplete="email"
                      aria-required="true"
                      aria-label="Địa chỉ email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                      autoComplete="current-password"
                      aria-required="true"
                      aria-label="Mật khẩu"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
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
                      aria-label="Ghi nhớ đăng nhập"
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

                <ShimmerButton
                  type="submit"
                  className="w-full h-10"
                  disabled={isLoading}
                  shimmerColor="oklch(0.99 0.005 45)"
                  shimmerSize="0.1em"
                  borderRadius="0.5rem"
                  background="oklch(0.58 0.28 20)"
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center text-white">
                      <span className="mr-2">Đang xử lý...</span>
                    </span>
                  ) : (
                    <span className="flex items-center text-white">
                      Đăng nhập
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </ShimmerButton>
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
                  aria-label="Đăng nhập bằng tài khoản Demo"
                  aria-busy={isLoading}
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
        </MagicCard>

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
    </main>
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
