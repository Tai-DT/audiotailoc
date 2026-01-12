'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { BorderBeam } from '@/components/ui/border-beam';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Mã xác thực không hợp lệ hoặc đã hết hạn.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post('/auth/reset-password', { token, newPassword: password });
      setIsSuccess(true);
      toast.success('Đặt lại mật khẩu thành công!');
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background flex items-center justify-center p-0 md:p-6 lg:p-12 transition-colors duration-500">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-card rounded-none md:rounded-[2rem] border border-border shadow-2xl overflow-hidden min-h-[700px] relative">
        <BorderBeam size={200} duration={12} delay={9} colorFrom="var(--primary)" colorTo="#ff2d2d" className="hidden md:block" />
        
        {/* Left Side: Visual Asset - Dark Premium remains consistent */}
        <div className="hidden md:flex relative flex-col justify-end p-12 bg-zinc-900 group order-2">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/auth-bg.png" 
              alt="Premium Audio Background" 
              fill 
              className="object-cover opacity-60 scale-110 group-hover:scale-100 transition-transform duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative z-10"
          >
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 max-w-sm shadow-2xl">
              <p className="text-white text-lg font-medium italic mb-2 drop-shadow-sm">
                "Bảo mật tài khoản là bước đầu tiên để bảo vệ những trải nghiệm cá nhân hóa của bạn."
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-[2px] bg-primary" />
                <span className="text-xs uppercase tracking-widest text-zinc-300 font-bold">Audio Tài Lộc Security</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form Content — Adaptive to Light/Dark mode */}
        <div className="relative flex flex-col items-center justify-center p-8 md:p-12 lg:p-16 bg-card order-1 transition-colors duration-500">
          <AnimatePresence mode="wait">
            {!token ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm space-y-8 text-center"
              >
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 shadow-xl">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                </div>
                <div className="space-y-4 px-2">
                  <h1 className="text-3xl font-bold text-foreground">Lỗi xác thực</h1>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    Mã xác thực không tìm thấy hoặc đã hết hạn. Vui lòng yêu cầu lại liên kết đặt lại mật khẩu của bạn.
                  </p>
                </div>
                <Link href="/auth/forgot-password" suppressHydrationWarning className="block">
                  <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl mt-4 shadow-lg shadow-primary/20">
                    Yêu cầu lại liên kết
                  </Button>
                </Link>
              </motion.div>
            ) : isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm space-y-8 text-center"
              >
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-xl">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                </div>
                <div className="space-y-4 px-2">
                  <h1 className="text-3xl font-bold text-foreground">Thành công!</h1>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    Mật khẩu của bạn đã được đặt lại thành công. Bạn sẽ được chuyển hướng đến trang đăng nhập trong giây lát.
                  </p>
                </div>
                <Link href="/auth/login" suppressHydrationWarning className="block">
                  <Button className="w-full h-12 bg-background border border-border text-foreground font-bold rounded-xl mt-4 hover:bg-muted transition-all">
                    Đăng nhập ngay
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm space-y-8"
              >
                <div className="space-y-2 text-center md:text-left">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">Đặt lại mật khẩu</h1>
                  <p className="text-muted-foreground font-medium">
                    Tạo một mật khẩu mới mạnh mẽ để bảo vệ tài khoản Audio Tài Lộc của bạn.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-foreground/80 font-bold ml-1">Mật khẩu mới</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Ít nhất 6 ký tự"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-11 pr-12 bg-muted/30 border-border h-12 rounded-xl focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                          disabled={isLoading}
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

                    <div className="space-y-2">
                      <Label className="text-foreground/80 font-bold ml-1">Xác nhận mật khẩu</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Nhập lại mật khẩu"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-11 bg-muted/30 border-border h-12 rounded-xl focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
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
                      <div className="flex items-center gap-2 text-white">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang cập nhật...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-white">
                        <span>Cập nhật mật khẩu</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </ShimmerButton>
                </form>

                <div className="text-center">
                  <Link href="/auth/login" className="inline-flex items-center text-muted-foreground text-sm font-semibold hover:text-foreground transition-colors group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Quay lại đăng nhập
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-8 text-muted-foreground/30 text-[10px] uppercase tracking-widest font-black text-center w-full">
            © 2026 AUDIO TÀI LỘC — PREMIUM EXPERIENCE
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
