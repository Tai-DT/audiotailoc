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
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Promotion code state
  interface AppliedPromotion {
    name?: string;
    [key: string]: unknown;
  }

  const [promotionCode, setPromotionCode] = useState('');
  const [appliedPromotion, setAppliedPromotion] = useState<AppliedPromotion | null>(null);
  const [promotionDiscount, setPromotionDiscount] = useState(0);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  const shippingFee = total > 500000 ? 0 : 30000;
  const finalTotal = total + shippingFee - promotionDiscount;

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));

    if (name === 'address') {
      setSelectedPlace(null);
      setShippingCoordinates(null);
    }
  };

  // Redirect to cart immediately if empty (before any renders)
  useEffect(() => {
    if (items.length === 0 && !isRedirecting) {
      setIsRedirecting(true);
      toast.error('Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng.');
      router.push('/cart');
    }
  }, [items.length, router, isRedirecting]);

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

  const handleApplyPromotion = async () => {
    if (!promotionCode.trim()) {
      toast.error('Vui lòng nhập mã khuyến mãi');
      return;
    }

    setIsValidatingPromo(true);
    try {
      // Prepare cart items for promotion validation
      // Frontend cart items only contain basic product info, so we send
      // minimal data (productId, quantity, priceCents) and let backend
      // infer category eligibility.
      const cartItemsForPromo = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        priceCents: item.price,
      }));

      const response = await apiClient.post('/promotions/apply-to-cart', {
        code: promotionCode.toUpperCase(),
        items: cartItemsForPromo
      });

      const promoData = response?.data?.data ?? response?.data;

      if (promoData.valid) {
        setAppliedPromotion(promoData.promotion);
        setPromotionDiscount(promoData.totalDiscount || 0);
        toast.success(`Áp dụng mã ${promotionCode.toUpperCase()} thành công! Giảm ${promoData.totalDiscount.toLocaleString('vi-VN')}₫`);
      } else {
        toast.error(promoData.message || 'Mã khuyến mãi không hợp lệ');
        setAppliedPromotion(null);
        setPromotionDiscount(0);
      }
    } catch (error: unknown) {
      console.error('Failed to apply promotion:', error);

      type ErrorWithResponse = {
        response?: { data?: { message?: string } };
      };

      const err = error as ErrorWithResponse;
      toast.error(err.response?.data?.message || 'Không thể áp dụng mã khuyến mãi');
      setAppliedPromotion(null);
      setPromotionDiscount(0);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromotion = () => {
    setPromotionCode('');
    setAppliedPromotion(null);
    setPromotionDiscount(0);
    toast.success('Đã xóa mã khuyến mãi');
  };

  const handlePlaceOrder = async () => {
    // Prevent multiple submissions
    if (isProcessing || isRedirecting) {
      return;
    }

    if (!agreeToTerms) {
      toast.error('Vui lòng đồng ý với điều khoản và điều kiện');
      return;
    }

    // Kiểm tra giỏ hàng trống trước khi gửi request
    if (!items || items.length === 0) {
      toast.error('Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng.');
      setIsRedirecting(true);
      router.push('/cart');
      return;
    }

    // Kiểm tra thông tin giao hàng
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
      setCurrentStep(1);
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem('token');

      // Log cart items for debugging
      console.log('[Checkout] Cart items:', items.length, 'items');
      console.log('[Checkout] Total:', total);

      // Bước 1: Tạo order từ cart
      console.log('[Checkout] Creating order...');
      
      // Prepare cart items để gửi cho guest checkout
      const cartItems = items.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));
      
      const orderResponse = await apiClient.post('/checkout', {
        promotionCode: appliedPromotion ? promotionCode.toUpperCase() : undefined,
        shippingAddress: {
          fullName: shippingInfo.fullName,
          phone: shippingInfo.phone,
          email: shippingInfo.email,
          address: shippingInfo.address,
          notes: shippingInfo.notes,
          coordinates: shippingCoordinates,
          goongPlaceId: selectedPlace?.place_id || selectedPlace?.placeId,
        },
        items: cartItems  // Gửi cart items cho guest checkout
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });

      // Unwrap backend response which may be wrapped as { success, data }
      const orderData = orderResponse?.data?.data ?? orderResponse?.data ?? {};
      console.log('[Checkout] Order created:', orderData);
      const { id: orderId, orderNo } = orderData;

      // Bước 2: Tạo payment intent dựa trên phương thức thanh toán
      console.log('[Checkout] Creating payment intent...', { 
        orderId, 
        provider: paymentMethod === 'payos' ? 'PAYOS' : 'COD' 
      });
      
      const intentResponse = await apiClient.post('/payments/intents', {
        orderId,
        provider: paymentMethod === 'payos' ? 'PAYOS' : 'COD',
        idempotencyKey: `${orderId}-${Date.now()}`,
        returnUrl: `${window.location.origin}/order-success?orderId=${orderNo}`
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });

      // Unwrap backend response which may be wrapped as { success, data }
      const intentData = intentResponse?.data?.data ?? intentResponse?.data ?? {};
      console.log('[Checkout] Payment intent created:', intentData);
      const redirectUrl =
        intentData.redirectUrl ||
        intentData.url ||
        intentData.paymentUrl ||
        intentData.redirect_url ||
        intentData.payUrl ||
        undefined;

      // Bước 3: Xử lý response dựa trên phương thức thanh toán
      if (paymentMethod === 'payos') {
        if (!redirectUrl) {
          throw new Error('Không nhận được link thanh toán từ PayOS. Vui lòng thử lại.');
        }
        
        console.log('[Checkout] Redirecting to PayOS:', redirectUrl);
        toast.success('Đang chuyển đến trang thanh toán...');
        
        // ✅ FIX: Lưu orderId để clear cart SAU KHI webhook confirm
        // KHÔNG clear cart ở đây để tránh mất data nếu user quay lại
        localStorage.setItem('pending-payos-order', orderNo);
        
        // Đợi 1 giây để user thấy toast message
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000);
        return;
      }

      if (paymentMethod === 'cod') {
        // COD: Đơn hàng đã được xác nhận, redirect đến order success
        toast.success('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
        clearCart();
        router.push(`/order-success?orderId=${orderNo}&method=cod`);
        return;
      }

      throw new Error('Phương thức thanh toán không hợp lệ');

      } catch (error: unknown) {
      console.error('[Checkout] Order creation failed:', error);
      
      // Normalize axios error and include full response for debugging (typed)
      interface AxiosErrorLike {
        response?: { status?: number; data?: unknown };
        message?: string;
      }
      const axiosError = error as AxiosErrorLike;
      const statusCode = axiosError.response?.status;
      const responseData = axiosError.response?.data as Record<string, unknown> | undefined;
      const errorCode = responseData ? (responseData['code'] as string | undefined) : undefined;
      const errorMessage = (responseData && (responseData['message'] as string)) || axiosError.message || 'Có lỗi xảy ra';
      
      // Detailed debug log
      console.error('[Checkout] Error details:', {
        statusCode,
        errorCode,
        errorMessage,
        responseData,
        timestamp: new Date().toISOString()
      });
      
      // ✅ FIX: Handle specific errors
      if (statusCode === 400) {
        if (errorMessage.includes('Giỏ hàng trống') || errorCode === 'EMPTY_CART') {
          toast.error('Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng.');
          setIsRedirecting(true);
          clearCart();
          setTimeout(() => router.push('/cart'), 1500);
          return;
        }
        
        if (errorMessage.includes('thông tin giao hàng') || errorCode === 'INVALID_SHIPPING') {
          toast.error('Thông tin giao hàng không hợp lệ. Vui lòng kiểm tra lại.');
          setCurrentStep(1);
          return;
        }
        
        if (errorCode === 'INVALID_BUYER_EMAIL') {
          toast.error('Email không hợp lệ. Vui lòng kiểm tra lại địa chỉ email.');
          setCurrentStep(1);
          return;
        }
      }
      
      if (statusCode === 500) {
        toast.error('Lỗi hệ thống. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.', { duration: 5000 });
        return;
      }
      
      if (statusCode === 503) {
        toast.error('Hệ thống thanh toán tạm thời không khả dụng. Vui lòng thử lại sau.', { duration: 5000 });
        return;
      }
      
      // ✅ FIX: Generic error with actionable message
      toast.error(
        errorMessage + '\\n\\nNếu lỗi tiếp diễn, vui lòng liên hệ hỗ trợ: support@audiotailoc.com',
        { duration: 5000 }
      );
      
    } finally {
      // Only reset processing if not redirecting
      if (!isRedirecting) {
        setIsProcessing(false);
      }
    }
  };

  // Don't render checkout UI if cart is empty or redirecting
  if (items.length === 0 || isRedirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang chuyển hướng...</p>
        </div>
      </div>
    );
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

                  {/* Promotion Code Section */}
                  <div className="space-y-2">
                    {!appliedPromotion ? (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nhập mã khuyến mãi"
                          value={promotionCode}
                          onChange={(e) => setPromotionCode(e.target.value.toUpperCase())}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') handleApplyPromotion();
                          }}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleApplyPromotion}
                          disabled={isValidatingPromo || !promotionCode.trim()}
                          variant="outline"
                          size="sm"
                        >
                          {isValidatingPromo ? 'Kiểm tra...' : 'Áp dụng'}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-green-600">
                              Mã {promotionCode.toUpperCase()}
                            </p>
                            <p className="text-xs text-green-600/80">
                              {appliedPromotion.name}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={handleRemovePromotion}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Xóa
                        </Button>
                      </div>
                    )}
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
                    {promotionDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Giảm giá</span>
                        <span>-{promotionDiscount.toLocaleString('vi-VN')}₫</span>
                      </div>
                    )}
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
                        disabled={isProcessing || !agreeToTerms || items.length === 0}
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
