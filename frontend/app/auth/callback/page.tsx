'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authStorage } from '@/lib/auth-storage';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const processCallback = async () => {
      // Get tokens from URL parameters
      // Neon Auth (Better Auth) typically provides these after redirect
      const accessToken = searchParams.get('access_token') || searchParams.get('token');
      const refreshToken = searchParams.get('refresh_token');
      const userParam = searchParams.get('user');
      const expiresIn = searchParams.get('expires_in');
      const error = searchParams.get('error');

      if (error) {
        console.error('Auth error from Neon:', error);
        toast.error('Đăng nhập thất bại. Vui lòng thử lại.');
        router.push('/auth/login');
        return;
      }

      if (accessToken) {
        try {
          let user = null;
          if (userParam) {
            user = JSON.parse(decodeURIComponent(userParam));
          }

          authStorage.setSession({
            accessToken,
            refreshToken: refreshToken || undefined,
            user: user || undefined,
            expiresInMs: expiresIn ? parseInt(expiresIn, 10) * 1000 : undefined,
          });

          toast.success('Đăng nhập thành công!');
          
          // Small delay before redirect to ensure storage is updated and user sees success toast
          setTimeout(() => {
            router.push('/');
          }, 500);
        } catch (e) {
          console.error('Error parsing user data:', e);
          toast.error('Có lỗi xảy ra khi xử lý thông tin người dùng.');
          router.push('/auth/login');
        }
      } else {
        // If no token, check if we are already logged in or if there was a silently failed attempt
        const existingToken = authStorage.getAccessToken();
        if (existingToken) {
          router.push('/');
        } else {
          // No tokens found in URL, might be an invalid direct access
          console.warn('No tokens found in callback URL');
          router.push('/auth/login');
        }
      }
    };

    processCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="p-8 bg-card border border-border rounded-3xl shadow-2xl flex flex-col items-center gap-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-foreground">Đang xác thực tài khoản</h2>
          <p className="text-muted-foreground">Vui lòng đợi trong giây lát...</p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
