'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/components/providers/cart-provider';
import {
  ArrowLeft,
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  notes: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'cod',
    name: 'Thanh toán khi nhận hàng',
    description: 'Thanh toán bằng tiền mặt khi nhận hàng',
    icon: '💰'
  },
  {
    id: 'bank',
    name: 'Chuyển khoản ngân hàng',
    description: 'Thanh toán qua chuyển khoản ngân hàng',
    icon: '🏦'
  },
  {
    id: 'momo',
    name: 'Ví MoMo',
    description: 'Thanh toán nhanh qua ví điện tử MoMo',
    icon: '📱'
  },
  {
    id: 'zalopay',
    name: 'ZaloPay',
    description: 'Thanh toán tiện lợi qua ZaloPay',
    icon: '💳'
  }
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, itemCount, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<string>('cod');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingFee = total > 500000 ? 0 : 30000;
  const finalTotal = total + shippingFee;

  // Redirect if cart is empty
  React.useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate shipping info
      const required = ['fullName', 'email', 'phone', 'address', 'city', 'district'];
      const missing = required.filter(field => !shippingInfo[field as keyof ShippingInfo]);

      if (missing.length > 0) {
        toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
        return;
      }

      if (!shippingInfo.email.includes('@')) {
        toast.error('Email không hợp lệ');
        return;
      }

      if (!/^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/.test(shippingInfo.phone)) {
        toast.error('Số điện thoại không hợp lệ');
        return;
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePlaceOrder = async () => {
    if (!agreeToTerms) {
      toast.error('Vui lòng đồng ý với điều khoản và điều kiện');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Clear cart after successful order
      clearCart();

      toast.success('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
      router.push('/order-success');
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/cart">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Thanh toán</h1>
              <p className="text-muted-foreground">Hoàn tất đơn hàng của bạn</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <User className="h-5 w-5" />
              </div>
              <div className={`h-1 w-16 ${
                currentStep >= 2 ? 'bg-primary' : 'bg-muted'
              }`} />
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <CreditCard className="h-5 w-5" />
              </div>
              <div className={`h-1 w-16 ${
                currentStep >= 3 ? 'bg-primary' : 'bg-muted'
              }`} />
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Thông tin giao hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Họ và tên *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={shippingInfo.fullName}
                          onChange={handleShippingInfoChange}
                          placeholder="Nhập họ và tên"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={shippingInfo.email}
                          onChange={handleShippingInfoChange}
                          placeholder="Nhập địa chỉ email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={shippingInfo.phone}
                          onChange={handleShippingInfoChange}
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Tỉnh/Thành phố *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleShippingInfoChange}
                          placeholder="Nhập tỉnh/thành phố"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Địa chỉ *</Label>
                        <Input
                          id="address"
                          name="address"
                          value={shippingInfo.address}
                          onChange={handleShippingInfoChange}
                          placeholder="Nhập địa chỉ chi tiết"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district">Quận/Huyện *</Label>
                        <Input
                          id="district"
                          name="district"
                          value={shippingInfo.district}
                          onChange={handleShippingInfoChange}
                          placeholder="Nhập quận/huyện"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={shippingInfo.notes}
                        onChange={handleShippingInfoChange}
                        placeholder="Ghi chú về đơn hàng hoặc địa chỉ giao hàng"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Phương thức thanh toán
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-4">
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <div className="flex-1">
                              <Label htmlFor={method.id} className="flex items-center gap-3 cursor-pointer">
                                <span className="text-2xl">{method.icon}</span>
                                <div>
                                  <div className="font-medium">{method.name}</div>
                                  <div className="text-sm text-muted-foreground">{method.description}</div>
                                </div>
                              </Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Order Confirmation */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Xác nhận đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Shipping Info Summary */}
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Thông tin giao hàng
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>{shippingInfo.fullName}</strong></p>
                        <p>{shippingInfo.address}, {shippingInfo.district}, {shippingInfo.city}</p>
                        <p className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {shippingInfo.phone}
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {shippingInfo.email}
                        </p>
                        {shippingInfo.notes && (
                          <p className="text-muted-foreground">Ghi chú: {shippingInfo.notes}</p>
                        )}
                      </div>
                    </div>

                    {/* Payment Method Summary */}
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Phương thức thanh toán
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {paymentMethods.find(m => m.id === paymentMethod)?.icon}
                        </span>
                        <div>
                          <p className="font-medium">
                            {paymentMethods.find(m => m.id === paymentMethod)?.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {paymentMethods.find(m => m.id === paymentMethod)?.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Terms Agreement */}
                    <div className="flex items-start space-x-3 p-4 border rounded-lg">
                      <Checkbox
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                      />
                      <div className="text-sm">
                        <Label htmlFor="terms" className="cursor-pointer">
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
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-xs font-medium">
                          {item.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} x {item.price.toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tạm tính</span>
                      <span>{total.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Phí vận chuyển</span>
                      <span className={shippingFee === 0 ? 'text-green-600' : ''}>
                        {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')}₫`}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Tổng cộng</span>
                      <span>{finalTotal.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    {currentStep < 3 ? (
                      <div className="flex gap-3">
                        {currentStep > 1 && (
                          <Button variant="outline" onClick={handlePrevStep} className="flex-1">
                            Quay lại
                          </Button>
                        )}
                        <Button onClick={handleNextStep} className="flex-1">
                          Tiếp tục
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing || !agreeToTerms}
                        className="w-full"
                        size="lg"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Đặt hàng
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground text-center">
                    <Truck className="h-3 w-3 inline mr-1" />
                    Giao hàng trong 2-3 ngày làm việc
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}