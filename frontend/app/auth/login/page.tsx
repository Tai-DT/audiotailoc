'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useLogin } from '@/lib/hooks/use-auth';
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import { authStorage, TOKEN_KEY } from '@/lib/auth-storage';
import { logger } from '@/lib/logger';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

function LoginPageContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const { data: user } = useAuth();
    const loginMutation = useLogin();
    const searchParams = useSearchParams();

    const isAuthenticated = !!user;
    const redirectParam = searchParams.get('redirect');
    const redirectTo = redirectParam ? decodeURIComponent(redirectParam) : '/';

    React.useEffect(() => {
        const verifySession = async () => {
            const token = authStorage.getAccessToken();

            if (!token) {
                setIsCheckingAuth(false);
                return;
            }

            try {
                await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
                const hasCookieToken = typeof document !== 'undefined' && document.cookie.includes(`${TOKEN_KEY}=`);

                if (hasCookieToken) {
                    window.location.href = redirectTo;
                } else {
                    logger.warn('Token valid but cookie missing - clearing session to fix state');
                    authStorage.clearSession();
                    setIsCheckingAuth(false);
                }
            } catch (error) {
                logger.warn('Token verification failed on login page', { error });
                authStorage.clearSession();
                setIsCheckingAuth(false);
            }
        };

        verifySession();
    }, [redirectTo]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        setIsLoading(true);
        try {
            await loginMutation.mutateAsync({ email, password, rememberMe });
            window.location.href = redirectTo;
        } catch (error: any) {
            logger.error('[LoginPage] Login error', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isCheckingAuth || (isAuthenticated && isCheckingAuth)) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <motion.div initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-[#D00000]" />
                    <p className="text-zinc-500 font-medium tracking-wide">AUTHENTICATING...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <main className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden font-sans">
            {/* Ambient Background Effects */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/grid.svg"
                    alt="Background"
                    fill
                    className="object-cover opacity-20 blur-[2px]"
                    priority
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-[#D00000] opacity-[0.08] blur-[150px] rounded-full mix-blend-screen animate-pulse" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] bg-amber-600 opacity-[0.05] blur-[120px] rounded-full mix-blend-screen" />
            </div>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="relative z-10 w-full max-w-[440px] p-8 md:p-10 mx-4"
            >
                {/* Glass Container */}
                <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-2xl shadow-black/50" />

                <div className="relative z-10 flex flex-col items-center">
                    {/* Brand Logo & Header */}
                    <div className="mb-8 text-center">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="relative w-20 h-20 group-hover:scale-105 transition-transform duration-300">
                                <Image
                                    src="/images/logo/logo-light.svg"
                                    alt="Audio Tài Lộc"
                                    fill
                                    className="object-contain"
                                    priority
                                    unoptimized
                                />
                            </div>
                        </Link>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Audio Tài Lộc</h1>
                        <p className="text-zinc-300 text-sm">Đẳng cấp âm thanh thượng lưu</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="w-full space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-semibold text-zinc-200 ml-1 uppercase tracking-wider">Email</Label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#D00000]/20 to-transparent rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm" />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-zinc-400 group-focus-within:text-[#D00000] transition-colors z-20" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="relative z-10 h-12 pl-11 bg-black/20 border-white/10 text-white rounded-xl focus:border-[#D00000] focus:ring-0 font-medium placeholder:text-zinc-500 transition-all hover:bg-black/30 hover:border-white/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between ml-1">
                                    <Label htmlFor="password" className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Mật khẩu</Label>
                                    <Link href="/auth/forgot-password" className="text-xs font-semibold text-[#D00000] hover:text-[#ff4d4d] transition-colors underline-offset-4 hover:underline">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#D00000]/20 to-transparent rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm" />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-zinc-400 group-focus-within:text-[#D00000] transition-colors z-20" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="relative z-10 h-12 pl-11 pr-11 bg-black/20 border-white/10 text-white rounded-xl focus:border-[#D00000] focus:ring-0 font-medium placeholder:text-zinc-500 transition-all hover:bg-black/30 hover:border-white/20"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors z-20"
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
                                className="border-zinc-600 data-[state=checked]:bg-[#D00000] data-[state=checked]:border-[#D00000] rounded-[4px] h-4 w-4"
                            />
                            <label htmlFor="remember" className="text-sm text-zinc-400 font-medium cursor-pointer select-none hover:text-zinc-200 transition-colors">
                                Giữ tôi đăng nhập
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-[#D00000] to-[#b00000] hover:from-[#e00000] hover:to-[#c00000] text-white text-base font-bold rounded-xl shadow-[0_4px_25px_rgba(208,0,0,0.4)] hover:shadow-[0_6px_30px_rgba(208,0,0,0.5)] transition-all duration-300 scale-100 active:scale-95 border-0"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Đang xác thực...</span>
                                </div>
                            ) : (
                                "Đăng nhập"
                            )}
                        </Button>
                    </form>



                    <div className="mt-8 text-center">
                        <p className="text-zinc-400 text-sm">
                            Chưa là thành viên?{' '}
                            <Link href="/auth/register" className="text-[#D00000] font-bold hover:text-[#ff4d4d] transition-colors relative inline-block group/link">
                                Đăng ký ngay
                                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#D00000] transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300" />
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Footer */}
            <div className="absolute bottom-6 text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold select-none">
                Audio Tài Lộc © 2026
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#D00000]" />
            </div>
        }>
            <LoginPageContent />
        </Suspense>
    );
}
