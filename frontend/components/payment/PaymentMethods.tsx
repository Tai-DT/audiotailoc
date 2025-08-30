'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/cadge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Shield, 
  CheckCircle,
  Lock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  type: 'card' | 'bank' | 'ewallet' | 'cod';
  enabled: boolean;
  processingFee?: number;
  minAmount?: number;
  maxAmount?: number;
}

interface PaymentMethodsProps {
  amount: number;
  onPaymentSelect: (method: PaymentMethod) => void;
  selectedMethod?: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'vnpay',
    name: 'VNPAY',
    description: 'Thanh toán qua cổng VNPAY',
    icon: <Building2 className="w-6 h-6 text-blue-600" />,
    type: 'bank',
    enabled: true,
    processingFee: 0,
    minAmount: 10000,
    maxAmount: 100000000
  },
  {
    id: 'momo',
    name: 'MOMO',
    description: 'Thanh toán qua ví MOMO',
    icon: <Smartphone className="w-6 h-6 text-pink-600" />,
    type: 'ewallet',
    enabled: true,
    processingFee: 0,
    minAmount: 10000,
    maxAmount: 20000000
  },
  {
    id: 'payos',
    name: 'PayOS',
    description: 'Thanh toán qua PayOS',
    icon: <CreditCard className="w-6 h-6 text-green-600" />,
    type: 'bank',
    enabled: true,
    processingFee: 0,
    minAmount: 10000,
    maxAmount: 50000000
  },
  {
    id: 'cod',
    name: 'Thanh toán khi nhận hàng',
    description: 'Thanh toán tiền mặt khi giao hàng',
    icon: <Shield className="w-6 h-6 text-orange-600" />,
    type: 'cod',
    enabled: true,
    processingFee: 0,
    minAmount: 0,
    maxAmount: 10000000
  }
];

export default function PaymentMethods({ 
  amount, 
  onPaymentSelect, 
  selectedMethod 
}: PaymentMethodsProps) {
  const [selectedPayment, setSelectedPayment] = useState(selectedMethod || '');
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handlePaymentSelect = (methodId: string) => {
    setSelectedPayment(methodId);
    const method = paymentMethods.find(m => m.id === methodId);
    if (method) {
      onPaymentSelect(method);
    }
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate card form
    if (!cardForm.cardNumber || !cardForm.expiryDate || !cardForm.cvv || !cardForm.cardholderName) {
      toast.error('Vui lòng điền đầy đủ thông tin thẻ');
      return;
    }
    
    toast.success('Thông tin thẻ đã được xác thực');
    setShowCardForm(false);
  };

  const isMethodAvailable = (method: PaymentMethod) => {
    if (!method.enabled) return false;
    if (amount < (method.minAmount || 0)) return false;
    if (amount > (method.maxAmount || Infinity)) return false;
    return true;
  };

  const getMethodStatus = (method: PaymentMethod) => {
    if (!method.enabled) return { available: false, reason: 'Tạm thời không khả dụng' };
    if (amount < (method.minAmount || 0)) return { available: false, reason: `Tối thiểu ${method.minAmount?.toLocaleString('vi-VN')}₫` };
    if (amount > (method.maxAmount || Infinity)) return { available: false, reason: `Tối đa ${method.maxAmount?.toLocaleString('vi-VN')}₫` };
    return { available: true, reason: '' };
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Chọn phương thức thanh toán</h3>
        <p className="text-gray-600">Chọn cách thanh toán phù hợp với bạn</p>
      </div>

      <RadioGroup value={selectedPayment} onValueChange={handlePaymentSelect}>
        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const status = getMethodStatus(method);
            const isAvailable = status.available;
            
            return (
              <div
                key={method.id}
                className={`border rounded-lg p-4 transition-all ${
                  selectedPayment === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${!isAvailable ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem
                    value={method.id}
                    id={method.id}
                    disabled={!isAvailable}
                    className="mt-1"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {method.icon}
                        <div>
                          <Label
                            htmlFor={method.id}
                            className={`text-base font-medium cursor-pointer ${
                              !isAvailable ? 'text-gray-400' : ''
                            }`}
                          >
                            {method.name}
                          </Label>
                          <p className={`text-sm ${!isAvailable ? 'text-gray-400' : 'text-gray-600'}`}>
                            {method.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {method.processingFee === 0 ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Miễn phí
                          </Badge>
                        ) : (
                          <span className="text-sm text-gray-600">
                            Phí: {method.processingFee?.toLocaleString('vi-VN')}₫
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {!isAvailable && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>{status.reason}</span>
                      </div>
                    )}
                    
                    {method.type === 'cod' && isAvailable && (
                      <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                        <div className="flex items-center gap-2 text-sm text-orange-800">
                          <Shield className="w-4 h-4" />
                          <span>Chỉ áp dụng cho đơn hàng dưới 10 triệu đồng</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </RadioGroup>

      {/* Security Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-gray-600 mt-0.5" />
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Thông tin thanh toán được bảo mật</p>
            <p>Tất cả thông tin thanh toán của bạn đều được mã hóa và bảo mật theo tiêu chuẩn PCI DSS</p>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      {selectedPayment && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Tóm tắt thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Giá trị đơn hàng:</span>
              <span className="font-medium">{amount.toLocaleString('vi-VN')}₫</span>
            </div>
            
            {selectedPayment !== 'cod' && (
              <div className="flex justify-between text-sm">
                <span>Phí xử lý:</span>
                <span className="font-medium text-green-600">Miễn phí</span>
              </div>
            )}
            
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold">
                <span>Tổng thanh toán:</span>
                <span className="text-blue-900">{amount.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                const method = paymentMethods.find(m => m.id === selectedPayment);
                if (method) {
                  onPaymentSelect(method);
                }
              }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Tiến hành thanh toán
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}