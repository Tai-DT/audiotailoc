'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth, useRegister } from '@/lib/hooks/use-auth';
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { data: user } = useAuth();
    const registerMutation = useRegister();
    const router = useRouter();

    const isAuthenticated = !!user;

    React.useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, agreeToTerms: checked }));
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) return 'Vui lòng nhập họ và tên';
        if (!formData.email.includes('@')) return 'Email không hợp lệ';
        if (!/^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) return 'Số điện thoại không hợp lệ';
        if (formData.password.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
        if (formData.password !== formData.confirmPassword) return 'Mật khẩu xác nhận không khớp';
        if (!formData.agreeToTerms) return 'Vui lòng đồng ý với điều khoản';
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const error = validateForm();
        if (error) {
            toast.error(error);
            return;
        }
        setIsLoading(true);
        try {
            await registerMutation.mutateAsync({
                email: formData.email,
                password: formData.password,
                name: formData.fullName,
                phone: formData.phone,
            });
            toast.success('Đăng ký thành công!');
            // Consider redirecting to login or home, usually auto-login happens or user goes to login
            router.push('/');
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Đăng ký thất bại. Vui lòng thử lại.');
            }
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

            {/* Register Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="relative z-10 w-full max-w-[520px] p-6 mx-4 my-8"
            >
                {/* Glass Container */}
                <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-2xl shadow-black/50" />

                <div className="relative z-10 flex flex-col items-center">
                    {/* Brand Header */}
                    <div className="mb-6 text-center">
                        <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
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
                        <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Tạo tài khoản mới</h1>
                        <p className="text-zinc-300 text-sm">Trở thành thành viên Elite</p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="fullName" className="text-xs font-semibold text-zinc-200 ml-1 uppercase tracking-wider">Họ và tên</Label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-zinc-400 group-focus-within:text-[#D00000] transition-colors z-20" />
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        placeholder="Nguyễn Văn A"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="h-11 pl-11 bg-black/20 border-white/10 text-white rounded-xl focus:border-[#D00000] focus:ring-0 font-medium placeholder:text-zinc-500 transition-all hover:bg-black/30 hover:border-white/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="phone" className="text-xs font-semibold text-zinc-200 ml-1 uppercase tracking-wider">Số điện thoại</Label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-zinc-400 group-focus-within:text-[#D00000] transition-colors z-20" />
                                    <Input
                                        id="phone"
                                        name="phone"
                                        placeholder="0912..."
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="h-11 pl-11 bg-black/20 border-white/10 text-white rounded-xl focus:border-[#D00000] focus:ring-0 font-medium placeholder:text-zinc-500 transition-all hover:bg-black/30 hover:border-white/20"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-semibold text-zinc-200 ml-1 uppercase tracking-wider">Email</Label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-zinc-400 group-focus-within:text-[#D00000] transition-colors z-20" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="h-11 pl-11 bg-black/20 border-white/10 text-white rounded-xl focus:border-[#D00000] focus:ring-0 font-medium placeholder:text-zinc-500 transition-all hover:bg-black/30 hover:border-white/20"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="password" title="Mật khẩu" className="text-xs font-semibold text-zinc-200 ml-1 uppercase tracking-wider">Mật khẩu</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-zinc-400 group-focus-within:text-[#D00000] transition-colors z-20" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="h-11 pl-11 pr-10 bg-black/20 border-white/10 text-white rounded-xl focus:border-[#D00000] focus:ring-0 font-medium placeholder:text-zinc-500 transition-all hover:bg-black/30 hover:border-white/20"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors z-20"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="confirmPassword" title="Xác nhận" className="text-xs font-semibold text-zinc-200 ml-1 uppercase tracking-wider">Xác nhận</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-zinc-400 group-focus-within:text-[#D00000] transition-colors z-20" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="h-11 pl-11 bg-black/20 border-white/10 text-white rounded-xl focus:border-[#D00000] focus:ring-0 font-medium placeholder:text-zinc-500 transition-all hover:bg-black/30 hover:border-white/20"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 px-1">
                            <Checkbox
                                id="terms"
                                checked={formData.agreeToTerms}
                                onCheckedChange={(checked) => handleCheckboxChange(checked === true)}
                                className="mt-1 border-zinc-600 data-[state=checked]:bg-[#D00000] data-[state=checked]:border-[#D00000] rounded-[4px] h-4 w-4"
                            />
                            <Label htmlFor="terms" className="text-xs text-zinc-400 font-medium cursor-pointer select-none leading-relaxed">
                                Tôi đồng ý với <Link href="/terms" className="text-[#D00000] hover:text-[#ff4d4d] hover:underline">Điều khoản</Link> & <Link href="/privacy" className="text-[#D00000] hover:text-[#ff4d4d] hover:underline">Chính sách</Link>
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-[#D00000] to-[#b00000] hover:from-[#e00000] hover:to-[#c00000] text-white text-base font-bold rounded-xl shadow-[0_4px_25px_rgba(208,0,0,0.4)] hover:shadow-[0_6px_30px_rgba(208,0,0,0.5)] transition-all duration-300 scale-100 active:scale-95 border-0 mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Đang đăng ký...</span>
                                </div>
                            ) : (
                                "Tạo tài khoản"
                            )}
                        </Button>
                    </form>



                    <div className="mt-6 text-center">
                        <p className="text-zinc-400 text-sm">
                            Đã là thành viên?{' '}
                            <Link href="/auth/login" className="text-[#D00000] font-bold hover:text-[#ff4d4d] transition-colors relative inline-block group/link">
                                Đăng nhập
                                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#D00000] transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300" />
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
            {/* Footer */}
            <div className="absolute bottom-4 text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold select-none">
                Audio Tài Lộc © 2026
            </div>
        </main>
    );
}
