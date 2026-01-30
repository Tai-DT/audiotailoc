'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

const getErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error === 'object' && error !== null) {
        const maybeAxios = error as { response?: { data?: { message?: string } } };
        if (maybeAxios.response?.data?.message) {
            return maybeAxios.response.data.message;
        }
    }
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return fallback;
};

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
        } catch (error) {
            console.error('Reset password error:', error);
            toast.error(getErrorMessage(error, 'Có lỗi xảy ra. Vui lòng thử lại sau.'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden font-sans">
            {/* Ambient Background Effects */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/auth-bg.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-20 blur-[2px]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-[#D00000] opacity-[0.08] blur-[150px] rounded-full mix-blend-screen animate-pulse" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] bg-amber-600 opacity-[0.05] blur-[120px] rounded-full mix-blend-screen" />
            </div>

            {/* Reset Password Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="relative z-10 w-full max-w-[440px] p-8 md:p-10 mx-4"
            >
                {/* Glass Container */}
                <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-2xl shadow-black/50" />

                <div className="relative z-10 flex flex-col items-center">
                    {/* Brand Header */}
                    <div className="mb-6 text-center">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="relative w-16 h-16 group-hover:scale-105 transition-transform duration-300">
                                <Image
                                    src="/images/logo/logo-light.svg"
                                    alt="Audio Tài Lộc"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </Link>
                        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Thiết lập mật khẩu mới</h1>
                        <p className="text-zinc-300 text-sm">Bảo vệ tài khoản Elite của bạn</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {!token ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center w-full space-y-6"
                            >
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                                        <AlertCircle className="w-10 h-10 text-red-500" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-bold tracking-tight text-white">Lỗi xác thực</h2>
                                    <p className="text-zinc-300 text-sm mx-auto">
                                        Liên kết không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại.
                                    </p>
                                </div>

                                <Link href="/auth/forgot-password" suppressHydrationWarning className="block w-full">
                                    <Button className="w-full h-12 bg-gradient-to-r from-[#D00000] to-[#b00000] text-white font-bold rounded-xl shadow-[0_4px_25px_rgba(208,0,0,0.4)]">
                                        Yêu cầu lại liên kết
                                    </Button>
                                </Link>
                            </motion.div>
                        ) : isSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center w-full space-y-6"
                            >
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-bold tracking-tight text-white">Thành công!</h2>
                                    <p className="text-zinc-300 text-sm mx-auto">
                                        Mật khẩu đã được cập nhật. Đang chuyển hướng...
                                    </p>
                                </div>

                                <Link href="/auth/login" suppressHydrationWarning className="block w-full">
                                    <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold rounded-xl">
                                        Đăng nhập ngay
                                    </Button>
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full space-y-6"
                            >
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-zinc-200 ml-1 uppercase tracking-wider">Mật khẩu mới</Label>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#D00000]/20 to-transparent rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm" />
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-zinc-400 group-focus-within:text-[#D00000] transition-colors z-20" />
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="relative z-10 h-12 pl-11 bg-black/20 border-white/10 text-white rounded-xl focus:border-[#D00000] focus:ring-0 font-medium placeholder:text-zinc-500 transition-all hover:bg-black/30 hover:border-white/20"
                                                disabled={isLoading}
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

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-zinc-200 ml-1 uppercase tracking-wider">Xác nhận mật khẩu</Label>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#D00000]/20 to-transparent rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm" />
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-zinc-400 group-focus-within:text-[#D00000] transition-colors z-20" />
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="relative z-10 h-12 pl-11 bg-black/20 border-white/10 text-white rounded-xl focus:border-[#D00000] focus:ring-0 font-medium placeholder:text-zinc-500 transition-all hover:bg-black/30 hover:border-white/20"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-gradient-to-r from-[#D00000] to-[#b00000] hover:from-[#e00000] hover:to-[#c00000] text-white text-base font-bold rounded-xl shadow-[0_4px_25px_rgba(208,0,0,0.4)] hover:shadow-[0_6px_30px_rgba(208,0,0,0.5)] transition-all duration-300 scale-100 active:scale-95 border-0"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Đang lưu...</span>
                                            </div>
                                        ) : (
                                            "Cập nhật mật khẩu"
                                        )}
                                    </Button>
                                </form>

                                <div className="text-center">
                                    <Link href="/auth/login" className="inline-flex items-center text-zinc-400 text-sm font-semibold hover:text-white transition-colors group">
                                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                        Quay lại đăng nhập
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Footer */}
            <div className="absolute bottom-6 text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold select-none">
                Audio Tài Lộc © 2026
            </div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#D00000]" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
