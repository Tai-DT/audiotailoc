'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { BorderBeam } from '@/components/ui/border-beam';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await apiClient.post('/auth/forgot-password', { email });
      setIsSubmitted(true);
      toast.success('Yêu cầu đã được gửi. Vui lòng kiểm tra email của bạn.');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
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
              Khôi phục quyền truy cập <br />
              <span className="text-primary italic">Vào không gian âm nhạc.</span>
            </h2>
            <p className="text-zinc-300 text-lg max-w-md font-medium">
              Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền sở hữu những thiết bị âm thanh đỉnh cao chỉ trong vài bước.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Form Content - Adaptable to Light/Dark mode */}
        <div className="relative flex flex-col items-center justify-center p-8 md:p-12 lg:p-16 bg-card transition-colors duration-500">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm space-y-8"
              >
                <div className="space-y-2 text-center md:text-left">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">Quên mật khẩu?</h1>
                  <p className="text-muted-foreground font-medium">
                    Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu của Audio Tài Lộc.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        <span>Đang gửi yêu cầu...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-white">
                        <span>Gửi yêu cầu</span>
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
            ) : (
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
                
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">Thành công!</h1>
                  <p className="text-muted-foreground font-medium px-2">
                    Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email của bạn: <br />
                    <span className="text-foreground font-bold mt-2 inline-block">{email}</span>
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-2xl border border-border">
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    Bạn không nhận được email? Hãy kiểm tra thư mục <span className="text-foreground font-bold">Spam</span> hoặc thử lại sau vài phút.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full bg-background border-border text-foreground h-12 rounded-xl hover:bg-muted transition-all font-bold"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Sử dụng email khác
                  </Button>
                  
                  <Link href="/auth/login" className="block">
                    <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground h-12 rounded-xl font-bold">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Quay lại đăng nhập
                    </Button>
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
