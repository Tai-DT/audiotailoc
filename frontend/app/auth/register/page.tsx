'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth, useRegister } from '@/lib/hooks/use-auth';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Loader2, Chrome, Github } from 'lucide-react';
import { BorderBeam } from '@/components/ui/border-beam';
import { ShimmerButton } from '@/components/ui/shimmer-button';
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

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLogin = (provider: string) => {
    const neonAuthUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL || 'https://ep-holy-star-a18js5u8.ap-southeast-1.aws.neon.tech/auth';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const providerPath = provider.toLowerCase();
    
    // Construct the Neon Auth login URL
    const loginUrl = `${neonAuthUrl}/login/${providerPath}?redirect_uri=${encodeURIComponent(`${siteUrl}/auth/callback`)}`;
    
    toast.success(`Đang chuyển hướng đến ${provider}...`);
    window.location.href = loginUrl;
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Vui lòng nhập họ và tên';
    if (!formData.email.includes('@')) return 'Email không hợp lệ';
    if (!/^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) return 'Số điện thoại không hợp lệ';
    if (formData.password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
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
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background flex items-center justify-center p-0 md:p-6 lg:p-12 transition-colors duration-500">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-card rounded-none md:rounded-[2rem] border border-border shadow-2xl overflow-hidden min-h-[800px] relative">
        <BorderBeam size={300} duration={12} delay={9} colorFrom="var(--primary)" colorTo="#ff2d2d" className="hidden md:block" />
        
        {/* Left Side: Register Form (Form on the left, Visual on the right for registration for variety) */}
        <div className="relative flex flex-col items-center justify-center p-8 md:p-12 lg:p-16 bg-card order-2 md:order-1 transition-colors duration-500">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-sm space-y-7"
          >
            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Tạo tài khoản</h1>
              <p className="text-muted-foreground font-medium">
                Tham gia cộng đồng Audio Tài Lộc ngay hôm nay.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="bg-background border-border hover:bg-muted text-foreground h-12 rounded-xl transition-all"
                onClick={() => handleSocialLogin('Google')}
              >
                <Chrome className="mr-2 h-5 w-5 text-red-500" />
                <span className="font-semibold">Google</span>
              </Button>
              <Button 
                variant="outline" 
                className="bg-background border-border hover:bg-muted text-foreground h-12 rounded-xl transition-all"
                onClick={() => handleSocialLogin('GitHub')}
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
                <span className="bg-card px-3 text-muted-foreground font-bold tracking-widest">Hoặc điền thông tin</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground/80 font-bold ml-1">Họ và tên</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      name="fullName"
                      placeholder="Nguyễn Văn A"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="pl-11 bg-muted/30 border-border h-12 rounded-xl focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground/80 font-bold ml-1">Số điện thoại</Label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      name="phone"
                      placeholder="0912345678"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-11 bg-muted/30 border-border h-12 rounded-xl focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground/80 font-bold ml-1">Địa chỉ Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-11 bg-muted/30 border-border h-12 rounded-xl focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground/80 font-bold ml-1">Mật khẩu</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
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

              <div className="space-y-2">
                <Label className="text-foreground/80 font-bold ml-1">Xác nhận mật khẩu</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-11 bg-muted/30 border-border h-12 rounded-xl focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 py-2 px-1">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleCheckboxChange(checked === true)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-[4px]"
                />
                <label htmlFor="terms" className="text-xs text-muted-foreground font-semibold leading-relaxed cursor-pointer select-none">
                  Tôi đồng ý với các <Link href="/terms" className="text-primary hover:underline underline-offset-2">điều khoản dịch vụ</Link> và chính sách bảo mật.
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
                  <div className="flex items-center gap-2 text-white">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang tạo tài khoản...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-white">
                    <span>Đăng ký ngay</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </ShimmerButton>
            </form>

            <div className="text-center">
              <p className="text-muted-foreground font-medium">
                Đã có tài khoản?{' '}
                <Link href="/auth/login" className="text-primary font-bold hover:underline underline-offset-4 decoration-2">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Visual Asset */}
        <div className="hidden md:flex relative flex-col justify-end p-12 bg-zinc-900 group order-1 md:order-2">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/auth-bg.png" 
              alt="Premium Audio Background" 
              fill 
              className="object-cover opacity-60 scale-110 group-hover:scale-100 transition-transform duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative z-10"
          >
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 max-w-sm shadow-2xl">
              <p className="text-white text-lg font-medium italic mb-2 drop-shadow-sm">
                "Âm thanh không chỉ là nghe, mà là cảm nhận từng rung động của tâm hồn."
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-[2px] bg-primary" />
                <span className="text-xs uppercase tracking-widest text-zinc-300 font-bold">Audio Tài Lộc Team</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );

  function handleCheckboxChange(checked: boolean) {
    setFormData(prev => ({ ...prev, agreeToTerms: checked }));
  }
}
