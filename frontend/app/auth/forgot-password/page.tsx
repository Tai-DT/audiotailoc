'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { DotPattern } from '@/components/ui/dot-pattern';
import { MagicCard } from '@/components/ui/magic-card';
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
        } catch (error: unknown) {
            console.error('Forgot password error:', error);
            const axiosError = error as { response?: { data?: { message?: string } } };
            toast.error(axiosError.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
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
                            <CardTitle className="text-2xl font-bold">Email đã được gửi!</CardTitle>
                            <CardDescription>
                                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến <strong>{email}</strong>.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground text-center">
                                Nếu bạn không nhận được email trong vài phút, vui lòng kiểm tra thư mục spam hoặc thử lại.
                            </p>
                            <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
                                Thử lại với email khác
                            </Button>
                            <Link href="/auth/login" className="block w-full">
                                <Button variant="ghost" className="w-full">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Quay lại đăng nhập
                                </Button>
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
                            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-primary flex items-center mb-4 transition-colors">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Quay lại đăng nhập
                            </Link>
                            <CardTitle className="text-2xl font-bold text-center">Quên mật khẩu?</CardTitle>
                            <CardDescription className="text-center">
                                Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu
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
                                            Đang xử lý...
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-white">
                                            Gửi yêu cầu
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </span>
                                    )}
                                </ShimmerButton>
                            </form>

                            <div className="mt-6 text-center text-sm">
                                <span className="text-muted-foreground">Bạn đã nhớ mật khẩu? </span>
                                <Link href="/auth/login" className="text-primary hover:underline">
                                    Đăng nhập ngay
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </MagicCard>
            </div>
        </div>
    );
}
