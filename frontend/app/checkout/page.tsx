'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useCart as useCartContext } from '@/components/providers/cart-provider';
import {
  ArrowLeft,
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api';

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

type AddressSuggestion = {
  description?: string;
  place_id?: string;
  placeId?: string;
  name?: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
};

const paymentMethods: PaymentMethod[] = [
  {
    id: 'payos',
    name: 'PayOS (VNPay)',
    description: 'Thanh toán nhanh chóng qua PayOS với VNPay',
    icon: '💳'
  },
  {
    id: 'cos',
    name: 'Thanh toán COD',
    description: 'Thanh toán bằng tiền mặt khi nhận hàng',
    icon: '💰'
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, totalPrice, clearCart } = useCartContext();

  const items = cartItems;
  const total = totalPrice;
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<string>('cod');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<AddressSuggestion | null>(null);
  const [shippingCoordinates, setShippingCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const shippingFee = total > 500000 ? 0 : 30000;
  const finalTotal = total + shippingFee;

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));

    if (name === 'address') {
      setSelectedPlace(null);
      setShippingCoordinates(null);
    }
  };

  useEffect(() => {
    const query = shippingInfo.address.trim();
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsSearchingAddress(true);
        const response = await apiClient.get('/maps/geocode', { params: { query } });

        // Handle backend response structure: { success: true, data: { predictions: [...] } }
        const responseData = response.data;
        let suggestions: AddressSuggestion[] = [];

        if (responseData?.success && responseData?.data) {
          // Backend returns { success: true, data: { predictions: [...] } }
          suggestions = responseData.data.predictions || [];
        } else if (responseData?.predictions) {
          // Direct API response: { predictions: [...] }
          suggestions = responseData.predictions || [];
        } else if (Array.isArray(responseData)) {
          // Fallback for array response
          suggestions = responseData;
        }

        setAddressSuggestions(suggestions);
      } catch (error) {
        console.error('Failed to fetch address suggestions', error);
        setAddressSuggestions([]);
      } finally {
        setIsSearchingAddress(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [shippingInfo.address]);

  const handleSelectSuggestion = async (suggestion: AddressSuggestion) => {
    const description = suggestion.description || suggestion.name || '';
    const placeId = suggestion.place_id || suggestion.placeId;

    setShippingInfo((prev) => ({ ...prev, address: description }));
    setSelectedPlace(suggestion);
    setAddressSuggestions([]);

    if (!placeId) return;

    try {
      const response = await apiClient.get('/maps/place-detail', { params: { placeId } });

      // Handle backend response structure: { success: true, data: { result: {...} } }
      const responseData = response.data;
      let detail = null;

      if (responseData?.success && responseData?.data) {
        // Backend returns { success: true, data: { result: {...} } }
        detail = responseData.data.result || responseData.data;
      } else if (responseData?.result) {
        // Direct API response: { result: {...} }
        detail = responseData.result;
      } else {
        // Fallback to responseData itself
        detail = responseData;
      }

      const location = detail?.geometry?.location;
      if (location && typeof location.lat === 'number' && typeof location.lng === 'number') {
        setShippingCoordinates({ lat: location.lat, lng: location.lng });
      }
    } catch (error) {
      console.error('Failed to fetch place detail', error);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      const required = ['fullName', 'email', 'phone', 'address'];
      const missing = required.filter((field) => !shippingInfo[field as keyof ShippingInfo]);
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

    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handlePlaceOrder = async () => {
    if (!agreeToTerms) {
      toast.error('Vui lòng đồng ý với điều khoản và điều kiện');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        customerName: shippingInfo.fullName,
        customerPhone: shippingInfo.phone,
        customerEmail: shippingInfo.email,
        shippingAddress: shippingInfo.address,
        notes: shippingInfo.notes,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
          name: item.name,
        })),
        shippingCoordinates: shippingCoordinates ?? undefined,
        goongPlaceId: selectedPlace?.place_id || selectedPlace?.placeId,
        finalTotal,
      };

      // Process payment based on method
      if (paymentMethod === 'payos') {
        const response = await fetch('/api/payment/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderData,
            paymentMethod: 'payos'
          }),
        });

        const result = await response.json();

        if (result.success && result.paymentUrl) {
          toast.success('Đang chuyển hướng đến PayOS...');
          // Redirect to PayOS payment page in the same window
          window.location.href = result.paymentUrl;
          return;
        } else {
          throw new Error(result.error || 'PayOS payment failed');
        }
      }

      if (paymentMethod === 'cod') {
        const response = await fetch('/api/payment/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderData,
            paymentMethod: 'cod'
          }),
        });

        const result = await response.json();

        if (result.success) {
          toast.success('Đặt hàng COD thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
          clearCart();
          router.push(`/order-success?orderId=${result.orderId}&method=cos`);
          return;
        } else {
          throw new Error(result.error || 'COD order failed');
        }
      }

      throw new Error('Invalid payment method');

    } catch (error) {
      console.error('Order creation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
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

          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                <User className="h-5 w-5" />
              </div>
              <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                <CreditCard className="h-5 w-5" />
              </div>
              <div className={`h-1 w-16 ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
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
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="phone">Số điện thoại *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={shippingInfo.phone}
                          onChange={handleShippingInfoChange}
                          placeholder="Nhập số điện thoại"
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
                        {isSearchingAddress && (
                          <p className="text-xs text-muted-foreground">Đang tìm kiếm địa chỉ...</p>
                        )}
                        {!isSearchingAddress && addressSuggestions.length > 0 && (
                          <div className="border rounded-lg mt-2 divide-y bg-background overflow-hidden">
                            {addressSuggestions.map((suggestion, index) => (
                              <button
                                key={`${suggestion.place_id || suggestion.placeId || index}`}
                                type="button"
                                className="w-full text-left px-3 py-2 hover:bg-muted"
                                onClick={() => handleSelectSuggestion(suggestion)}
                              >
                                <div className="text-sm font-medium">
                                  {suggestion.structured_formatting?.main_text || suggestion.description || suggestion.name}
                                </div>
                                {suggestion.structured_formatting?.secondary_text && (
                                  <div className="text-xs text-muted-foreground">
                                    {suggestion.structured_formatting.secondary_text}
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
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

              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Xác nhận đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Thông tin giao hàng
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>{shippingInfo.fullName}</strong></p>
                        <p>{shippingInfo.address}</p>
                        <p className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {shippingInfo.phone}
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {shippingInfo.email}
                        </p>
                        {shippingInfo.notes && <p className="text-muted-foreground">Ghi chú: {shippingInfo.notes}</p>}
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Phương thức thanh toán
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {paymentMethods.find((m) => m.id === paymentMethod)?.icon}
                        </span>
                        <div>
                          <p className="font-medium">
                            {paymentMethods.find((m) => m.id === paymentMethod)?.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {paymentMethods.find((m) => m.id === paymentMethod)?.description}
                          </p>
                        </div>
                      </div>
                    </div>

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

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
    </div>
  );
}
