'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth, useLogin } from '@/lib/hooks/use-auth';
import { authStorage } from '@/lib/auth-storage';
import { logger } from '@/lib/logger';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, Chrome, Github } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
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
  const redirectParam = searchParams.get('redirect');
  const redirectTo = redirectParam ? decodeURIComponent(redirectParam) : '/';

  React.useEffect(() => {
    const token = authStorage.getAccessToken();
    const storedUser = authStorage.getUser();

    if (token && storedUser) {
      window.location.href = redirectTo;
      return;
    }

    if (!isAuthLoading) {
      setIsCheckingAuth(false);
    }
  }, [isAuthenticated, isAuthLoading, redirectTo]);

  if (isCheckingAuth && isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">Đang chuẩn bị không gian âm nhạc...</p>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync({ email, password, rememberMe });
      window.location.href = redirectTo;
    } catch (error) {
      logger.error('[LoginPage] Login error', error);
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    const neonAuthUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL || 'https://ep-holy-star-a18js5u8.ap-southeast-1.aws.neon.tech/auth';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const providerPath = provider.toLowerCase();
    
    // Construct the Neon Auth login URL
    const loginUrl = `${neonAuthUrl}/login/${providerPath}?redirect_uri=${encodeURIComponent(`${siteUrl}/auth/callback`)}`;
    
    logger.info(`Redirecting to Neon Auth ${provider} via: ${loginUrl}`);
    window.location.href = loginUrl;
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background flex items-center justify-center p-0 md:p-6 lg:p-12 transition-colors duration-500">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-card rounded-none md:rounded-[2rem] border border-border shadow-2xl overflow-hidden min-h-[700px] relative">
        <BorderBeam size={200} duration={12} delay={9} colorFrom="var(--primary)" colorTo="#ff2d2d" className="hidden md:block" />
        
        {/* Left Side: Visual Asset - We keep this dark as it's a premium visual feature */}
        <div className="hidden md:flex relative flex-col justify-between p-12 bg-zinc-900 group">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/auth-bg.png" 
              alt="Premium Audio Background" 
              fill 
              className="object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                <span className="text-white font-bold text-xl font-sans">A</span>
              </div>
              <span className="text-2xl font-bold tracking-tighter text-white uppercase font-sans">Audio Tài Lộc</span>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative z-10"
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
              Trải nghiệm âm thanh <br />
              <span className="text-primary italic">Xứng tầm nghệ thuật.</span>
            </h2>
            <p className="text-zinc-300 text-lg max-w-md font-medium">
              Chạm vào cảm xúc thông qua những thiết bị âm thanh đỉnh cao nhất.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Login Form - Adaptable to Light/Dark mode */}
        <div className="relative flex flex-col items-center justify-center p-8 md:p-12 lg:p-16 bg-card transition-colors duration-500">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm space-y-8"
          >
            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Đăng nhập</h1>
              <p className="text-muted-foreground font-medium">
                Chào mừng bạn trở lại với Audio Tài Lộc.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="bg-background border-border hover:bg-muted text-foreground h-12 rounded-xl transition-all"
                onClick={() => handleSocialLogin('google')}
              >
                <Chrome className="mr-2 h-5 w-5 text-red-500" />
                <span className="font-semibold">Google</span>
              </Button>
              <Button 
                variant="outline" 
                className="bg-background border-border hover:bg-muted text-foreground h-12 rounded-xl transition-all"
                onClick={() => handleSocialLogin('github')}
              >
                <Github className="mr-2 h-5 w-5 text-foreground dark:text-white" />
                <span className="font-semibold">GitHub</span>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground font-bold tracking-widest">Hoặc điền Email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground/80 font-bold ml-1">Địa chỉ Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 bg-muted/30 border-border h-12 rounded-xl focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="password" title="passwordLabel" className="text-foreground/80 font-bold">Mật khẩu</Label>
                    <Link href="/auth/forgot-password" title="forgotPassword" className="text-xs font-bold text-primary hover:underline underline-offset-2">
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-12 bg-muted/30 border-border h-12 rounded-xl focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 px-1">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-[4px]"
                />
                <label 
                  htmlFor="remember" 
                  className="text-sm text-muted-foreground font-semibold cursor-pointer select-none hover:text-foreground transition-colors"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <ShimmerButton
                type="submit"
                className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20"
                disabled={isLoading}
                shimmerColor="#ffffff"
                shimmerSize="0.1em"
                borderRadius="0.75rem"
                background="var(--primary)"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang xác thực...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-white">
                    <span>Đăng nhập</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </ShimmerButton>
            </form>

            <div className="text-center pt-2">
              <p className="text-muted-foreground font-medium">
                Bạn chưa có tài khoản?{' '}
                <Link href="/auth/register" className="text-primary font-bold hover:underline underline-offset-4 decoration-2">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </motion.div>

          <div className="absolute bottom-8 text-muted-foreground/30 text-[10px] uppercase tracking-widest font-black text-center w-full">
            © 2026 AUDIO TÀI LỘC — PREMIUM EXPERIENCE
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
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
