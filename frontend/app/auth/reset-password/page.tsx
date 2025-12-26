'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { DotPattern } from '@/components/ui/dot-pattern';
import { MagicCard } from '@/components/ui/magic-card';
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
        } catch (error: unknown) {
            console.error('Reset password error:', error);
            const axiosError = error as { response?: { data?: { message?: string } } };
            toast.error(axiosError.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
                <DotPattern className="absolute inset-0 opacity-30" width={20} height={20} cx={1} cy={1} cr={1} />
                <div className="w-full max-w-md relative z-10">
                    <Card className="border-0 shadow-2xl">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="bg-red-100 p-3 rounded-full">
                                    <AlertCircle className="w-12 h-12 text-red-600" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold">Lỗi xác thực</CardTitle>
                            <CardDescription>
                                Mã xác thực không tìm thấy hoặc đã hết hạn. Vui lòng yêu cầu lại liên kết đặt lại mật khẩu.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/auth/forgot-password" className="block w-full">
                                <Button className="w-full">Yêu cầu lại liên kết</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
                <DotPattern className="absolute inset-0 opacity-30" width={20} height={20} cx={1} cy={1} cr={1} />
                <div className="w-full max-w-md relative z-10">
                    <Card className="border-0 shadow-2xl">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold">Thành công!</CardTitle>
                            <CardDescription>
                                Mật khẩu của bạn đã được đặt lại thành công. Bạn sẽ được chuyển hướng đến trang đăng nhập trong giây lát.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/auth/login" className="block w-full">
                                <Button className="w-full">Đăng nhập ngay</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
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
                            <CardTitle className="text-2xl font-bold text-center">Đặt lại mật khẩu</CardTitle>
                            <CardDescription className="text-center">
                                Nhập mật khẩu mới cho tài khoản của bạn
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Mật khẩu mới</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Ít nhất 6 ký tự"
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
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Nhập lại mật khẩu"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="pl-10 pr-10"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <ShimmerButton
                                    type="submit"
                                    className="w-full h-10"
                                    disabled={isLoading}
                                    shimmerColor="oklch(0.99 0.005 45)"
                                    shimmerSize="0.1em"
                                    borderRadius="0.5rem"
                                    background="oklch(0.58 0.28 20)"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center text-white">
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Đang cập nhật...
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-white">
                                            Cập nhật mật khẩu
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </span>
                                    )}
                                </ShimmerButton>
                            </form>
                        </CardContent>
                    </Card>
                </MagicCard>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
