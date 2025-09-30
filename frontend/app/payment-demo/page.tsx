'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  XCircle,
  CreditCard,
  ArrowLeft,
  Smartphone,
  Shield,
  Lock,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PaymentData {
  orderCode: string;
  amount: number;
  description: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  returnUrl: string;
  cancelUrl: string;
}

export default function PaymentDemoPage() {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get URL parameters manually since useSearchParams might not work in SSR
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);

      const orderCode = urlParams.get('orderCode');
      const amount = urlParams.get('amount');
      const description = urlParams.get('description');
      const buyerName = urlParams.get('buyerName');
      const buyerEmail = urlParams.get('buyerEmail');
      const buyerPhone = urlParams.get('buyerPhone');
      const returnUrl = urlParams.get('returnUrl');
      const cancelUrl = urlParams.get('cancelUrl');

      console.log('Manual URL parsing:', { orderCode, amount, description, buyerName, buyerEmail, buyerPhone, returnUrl, cancelUrl });

      // Only require essential fields for payment processing
      if (orderCode && amount && description && buyerName) {
        const newData = {
          orderCode,
          amount: parseInt(amount),
          description: decodeURIComponent(description),
          buyerName: decodeURIComponent(buyerName),
          buyerEmail: buyerEmail ? decodeURIComponent(buyerEmail) : '',
          buyerPhone: buyerPhone ? decodeURIComponent(buyerPhone) : '',
          returnUrl: returnUrl || '/order-success',
          cancelUrl: cancelUrl || '/checkout',
        };
        console.log('Setting payment data:', newData);
        setPaymentData(newData);
      } else {
        console.log('Missing required fields');
      }

      setIsLoading(false);
    }
  }, []);

  // Show loading while parsing URL
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin thanh toán...</p>
        </div>
      </div>
    );
  }

  const handlePayment = async (method: string) => {
    setIsProcessing(true);
    setSelectedMethod(method);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate different payment outcomes
    const outcomes = ['success', 'failed', 'pending'];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

    // Redirect based on outcome
    if (outcome === 'success') {
      toast.success('Thanh toán thành công!');
      router.push(`${paymentData?.returnUrl}?method=payos&orderId=${paymentData?.orderCode}&status=success`);
    } else if (outcome === 'failed') {
      toast.error('Thanh toán thất bại');
      router.push(`${paymentData?.cancelUrl}?error=payment_failed`);
    } else {
      toast('Thanh toán đang xử lý...', { icon: '⏳' });
      router.push(`${paymentData?.returnUrl}?method=payos&orderId=${paymentData?.orderCode}&status=pending`);
    }
  };

  if (!paymentData) {
    console.log('No payment data, showing error');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Thông tin thanh toán không hợp lệ</h2>
            <p className="text-gray-600 mb-4">Không thể tìm thấy thông tin đơn hàng.</p>
            <Link href="/checkout">
              <Button>Quay lại thanh toán</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('Payment data exists, rendering form:', paymentData);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/checkout">
              <Button variant="outline" size="icon" className="mb-4">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Thanh toán PayOS</h1>
            <p className="text-gray-600">Chọn phương thức thanh toán</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Thông tin đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium">{paymentData.orderCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Khách hàng:</span>
                  <span className="font-medium">{paymentData.buyerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{paymentData.buyerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số điện thoại:</span>
                  <span className="font-medium">{paymentData.buyerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mô tả:</span>
                  <span className="font-medium">{paymentData.description}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng tiền:</span>
                    <span className="text-green-600">{paymentData.amount.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* QR Code Payment */}
                <div className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">QR Code (VNPay)</h3>
                      <p className="text-sm text-gray-600">Quét mã QR để thanh toán</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handlePayment('qr')}
                    disabled={isProcessing}
                    className="w-full"
                    variant="outline"
                  >
                    {isProcessing && selectedMethod === 'qr' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Đang xử lý...
                      </>
                    ) : (
                      'Thanh toán QR'
                    )}
                  </Button>
                </div>

                {/* Bank Transfer */}
                <div className="border rounded-lg p-4 hover:border-green-500 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Chuyển khoản ngân hàng</h3>
                      <p className="text-sm text-gray-600">Thanh toán qua ngân hàng</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handlePayment('bank')}
                    disabled={isProcessing}
                    className="w-full"
                    variant="outline"
                  >
                    {isProcessing && selectedMethod === 'bank' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Đang xử lý...
                      </>
                    ) : (
                      'Chuyển khoản'
                    )}
                  </Button>
                </div>

                {/* Security Notice */}
                <div className="text-center text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Thanh toán an toàn</span>
                  </div>
                  <p>Được bảo vệ bởi PayOS và VNPay</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
