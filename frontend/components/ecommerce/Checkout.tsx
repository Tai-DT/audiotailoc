'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Lock,
  Shield,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutProps {
  items: CheckoutItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  onBackToCart: () => void;
  onCompleteOrder: (orderData: any) => void;
}

export default function Checkout({
  items,
  subtotal,
  discount,
  shipping,
  total,
  onBackToCart,
  onCompleteOrder
}: CheckoutProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Customer Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Shipping Address
    address: '',
    city: '',
    district: '',
    ward: '',
    zipCode: '',
    
    // Payment
    paymentMethod: 'cod',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    cardName: '',
    
    // Order Notes
    notes: '',
    
    // Terms
    acceptTerms: false,
    acceptMarketing: false
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1: // Customer Info
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 2: // Shipping Address
        return formData.address && formData.city && formData.district;
      case 3: // Payment
        return formData.paymentMethod === 'cod' || 
               (formData.cardNumber && formData.cardExpiry && formData.cardCVC && formData.cardName);
      case 4: // Review
        return formData.acceptTerms;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast.error('Vui lòng điền đầy đủ thông tin');
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmitOrder = async () => {
    if (!validateStep(4)) {
      toast.error('Vui lòng chấp nhận điều khoản');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderData = {
        ...formData,
        items,
        subtotal,
        discount,
        shipping,
        total,
        orderNumber: `ATL${Date.now()}`,
        orderDate: new Date().toISOString()
      };
      
      onCompleteOrder(orderData);
      toast.success('Đặt hàng thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đặt hàng');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: 1, title: 'Thông tin khách hàng', icon: User },
    { id: 2, title: 'Địa chỉ giao hàng', icon: MapPin },
    { id: 3, title: 'Thanh toán', icon: CreditCard },
    { id: 4, title: 'Xác nhận đơn hàng', icon: CheckCircle }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id 
                  ? 'bg-blue-500 border-blue-500 text-white' 
                  : 'border-gray-300 text-gray-500'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">{step.title}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Customer Info */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Họ</label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Nhập họ"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tên</label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Nhập tên"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="example@email.com"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Số điện thoại</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="0123456789"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Shipping Address */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Địa chỉ giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Địa chỉ</label>
                  <Textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Số nhà, tên đường, phường/xã"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tỉnh/Thành phố</label>
                    <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hanoi">Hà Nội</SelectItem>
                        <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                        <SelectItem value="danang">Đà Nẵng</SelectItem>
                        <SelectItem value="haiphong">Hải Phòng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Quận/Huyện</label>
                    <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="district1">Quận 1</SelectItem>
                        <SelectItem value="district2">Quận 2</SelectItem>
                        <SelectItem value="district3">Quận 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Phường/Xã</label>
                    <Select value={formData.ward} onValueChange={(value) => handleInputChange('ward', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phường/xã" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ward1">Phường 1</SelectItem>
                        <SelectItem value="ward2">Phường 2</SelectItem>
                        <SelectItem value="ward3">Phường 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Mã bưu điện (tùy chọn)</label>
                  <Input
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="70000"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    />
                    <label htmlFor="cod" className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Thanh toán khi nhận hàng (COD)
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    />
                    <label htmlFor="card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Thẻ tín dụng/ghi nợ
                    </label>
                  </div>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div>
                      <label className="text-sm font-medium">Số thẻ</label>
                      <Input
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Ngày hết hạn</label>
                        <Input
                          value={formData.cardExpiry}
                          onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">CVC</label>
                        <Input
                          value={formData.cardCVC}
                          onChange={(e) => handleInputChange('cardCVC', e.target.value)}
                          placeholder="123"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tên chủ thẻ</label>
                        <Input
                          value={formData.cardName}
                          onChange={(e) => handleInputChange('cardName', e.target.value)}
                          placeholder="NGUYEN VAN A"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Xác nhận đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Customer Info Review */}
                <div>
                  <h3 className="font-medium mb-2">Thông tin khách hàng</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p>{formData.firstName} {formData.lastName}</p>
                    <p>{formData.email}</p>
                    <p>{formData.phone}</p>
                  </div>
                </div>

                {/* Shipping Address Review */}
                <div>
                  <h3 className="font-medium mb-2">Địa chỉ giao hàng</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p>{formData.address}</p>
                    <p>{formData.ward}, {formData.district}, {formData.city}</p>
                    {formData.zipCode && <p>Mã bưu điện: {formData.zipCode}</p>}
                  </div>
                </div>

                {/* Payment Method Review */}
                <div>
                  <h3 className="font-medium mb-2">Phương thức thanh toán</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p>
                      {formData.paymentMethod === 'cod' 
                        ? 'Thanh toán khi nhận hàng (COD)'
                        : 'Thẻ tín dụng/ghi nợ'
                      }
                    </p>
                  </div>
                </div>

                {/* Order Notes */}
                <div>
                  <label className="text-sm font-medium">Ghi chú đơn hàng (tùy chọn)</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Ghi chú về đơn hàng..."
                    rows={3}
                  />
                </div>

                {/* Terms */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => handleInputChange('acceptTerms', checked === true)}
                    />
                    <label htmlFor="terms" className="text-sm">
                      Tôi đồng ý với <a href="/terms" className="text-blue-600 underline">điều khoản sử dụng</a> và{' '}
                      <a href="/privacy" className="text-blue-600 underline">chính sách bảo mật</a>
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="marketing"
                      checked={formData.acceptMarketing}
                      onCheckedChange={(checked) => handleInputChange('acceptMarketing', checked === true)}
                    />
                    <label htmlFor="marketing" className="text-sm">
                      Nhận thông tin khuyến mãi qua email
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? onBackToCart : handlePrevStep}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentStep === 1 ? 'Quay lại giỏ hàng' : 'Quay lại'}
            </Button>
            
            {currentStep < 4 ? (
              <Button onClick={handleNextStep}>
                Tiếp tục
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmitOrder}
                disabled={isProcessing || !formData.acceptTerms}
              >
                {isProcessing ? 'Đang xử lý...' : 'Đặt hàng'}
              </Button>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Số lượng: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-green-600">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
                  </span>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Thanh toán an toàn</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4 text-blue-500" />
                <span>Thông tin được mã hóa</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span>Không lưu thông tin thẻ</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
