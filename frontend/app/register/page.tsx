'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth, useRegister } from '@/lib/hooks/use-auth';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { DotPattern } from '@/components/ui/dot-pattern';
import { MagicCard } from '@/components/ui/magic-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { ShimmerButton } from '@/components/ui/shimmer-button';

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      agreeToTerms: checked
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return 'Vui lòng nhập họ và tên';
    }
    if (!formData.email.includes('@')) {
      return 'Email không hợp lệ';
    }
    if (!/^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) {
      return 'Số điện thoại không hợp lệ';
    }
    if (formData.password.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Mật khẩu xác nhận không khớp';
    }
    if (!formData.agreeToTerms) {
      return 'Vui lòng đồng ý với điều khoản và điều kiện';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
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
      router.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      // Error is handled by the mutation
    } finally {
      setIsLoading(false);
    }
  };

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
              <CardTitle className="text-2xl font-bold text-center" id="register-title">Đăng ký tài khoản</CardTitle>
              <CardDescription className="text-center">
                Tạo tài khoản để trải nghiệm đầy đủ dịch vụ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="register-title">
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Họ và tên <span className="text-destructive" aria-hidden="true">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Nhập họ và tên"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                      autoComplete="name"
                      aria-required="true"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive" aria-hidden="true">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Nhập địa chỉ email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                      autoComplete="email"
                      aria-required="true"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Số điện thoại <span className="text-destructive" aria-hidden="true">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                      autoComplete="tel"
                      aria-required="true"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Mật khẩu <span className="text-destructive" aria-hidden="true">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                      autoComplete="new-password"
                      aria-required="true"
                      aria-describedby="password-hint"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  <p id="password-hint" className="text-xs text-muted-foreground">Tối thiểu 6 ký tự</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Xác nhận mật khẩu <span className="text-destructive" aria-hidden="true">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Nhập lại mật khẩu"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                      autoComplete="new-password"
                      aria-required="true"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <div className="text-sm">
                    <Label htmlFor="agreeToTerms" className="cursor-pointer">
                      Tôi đồng ý với{' '}
                      <Link href="/terms" className="text-primary hover:underline">
                        điều khoản và điều kiện
                      </Link>{' '}
                      và{' '}
                      <Link href="/privacy" className="text-primary hover:underline">
                        chính sách bảo mật
                      </Link>{' '}
                      của Audio Tài Lộc
                    </Label>
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
                      <span className="mr-2">Đang đăng ký...</span>
                    </span>
                  ) : (
                    <span className="flex items-center text-white">
                      Đăng ký
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </ShimmerButton>
              </form>

              <div className="text-center text-sm">
                Đã có tài khoản?{' '}
                <Link href="/login" className="text-primary hover:underline">
                  Đăng nhập ngay
                </Link>
              </div>
            </CardContent>
          </Card>
        </MagicCard>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-muted/80 backdrop-blur-sm rounded-lg border border-border/50">
          <h3 className="font-medium mb-2">Lợi ích khi đăng ký</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Miễn phí vận chuyển cho đơn hàng từ 500k</li>
            <li>• Nhận ưu đãi đặc biệt và voucher</li>
            <li>• Tư vấn kỹ thuật chuyên nghiệp 24/7</li>
            <li>• Bảo hành sản phẩm lên đến 12 tháng</li>
          </ul>
        </div>
      </div>
    </div>
  );
}