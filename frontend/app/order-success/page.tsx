'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  XCircle,
  Clock,
  Home,
  ShoppingBag,
  Truck,
  Phone,
  Mail,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PaymentStatus {
  status: string;
  orderId?: string;
  transactionId?: string;
  amount?: number;
  currency?: string;
  createdAt?: string;
  completedAt?: string;
  estimatedDelivery?: string;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const orderId = searchParams.get('orderId');
  const paymentMethod = searchParams.get('method');

  useEffect(() => {
    // If we have orderId and paymentMethod, check payment status
    if (orderId && paymentMethod) {
      checkPaymentStatus();
    }
  }, [orderId, paymentMethod]);

  const checkPaymentStatus = async () => {
    if (!orderId || !paymentMethod) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/payment/status?orderId=${orderId}&paymentMethod=${paymentMethod}`);
      const result = await response.json();

      if (result.success) {
        setPaymentStatus(result.status);

        // Show appropriate message based on status
        if (result.status.status === 'COMPLETED') {
          toast.success('Thanh toán thành công!');
        } else if (result.status.status === 'FAILED') {
          toast.error('Thanh toán thất bại. Vui lòng thử lại.', { icon: '❌' });
        } else if (result.status.status === 'PENDING') {
          toast('Đang xử lý thanh toán...', { icon: '⏳' });
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      toast.error('Không thể kiểm tra trạng thái thanh toán', { icon: '❌' });
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'failed':
      case 'error':
        return <XCircle className="h-8 w-8 text-red-500" />;
      case 'pending':
      case 'processing':
      default:
        return <Clock className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Thành công</Badge>;
      case 'failed':
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Thất bại</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Đang xử lý</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Đang xử lý</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/">
              <Button variant="outline" size="icon" className="mb-4">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Kết quả đặt hàng</h1>
            <p className="text-muted-foreground">
              {paymentMethod === 'cos' ? 'Đặt hàng COD' : 'Kết quả thanh toán PayOS'}
            </p>
          </div>

          {/* Order Status Card */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {paymentStatus ? getStatusIcon(paymentStatus.status) : <Clock className="h-8 w-8 text-gray-400" />}
              </div>
              <CardTitle>
                {paymentMethod === 'cos' ? 'Đặt hàng COD' : 'Thanh toán PayOS'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentStatus && (
                <>
                  <div className="flex justify-center">
                    {getStatusBadge(paymentStatus.status)}
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mã đơn hàng:</span>
                      <span className="font-medium">{orderId}</span>
                    </div>

                    {paymentStatus.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mã giao dịch:</span>
                        <span className="font-medium">{paymentStatus.transactionId}</span>
                      </div>
                    )}

                    {paymentStatus.amount && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Số tiền:</span>
                        <span className="font-medium">{paymentStatus.amount.toLocaleString('vi-VN')}₫</span>
                      </div>
                    )}

                    {paymentStatus.createdAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Thời gian tạo:</span>
                        <span className="font-medium">
                          {new Date(paymentStatus.createdAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    )}

                    {paymentStatus.estimatedDelivery && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dự kiến giao hàng:</span>
                        <span className="font-medium">
                          {new Date(paymentStatus.estimatedDelivery).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status-specific messages */}
                  {paymentStatus.status === 'COMPLETED' && (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-green-800 font-medium">🎉 Thanh toán thành công!</p>
                      <p className="text-green-600 text-sm">Đơn hàng của bạn đã được xử lý thành công.</p>
                    </div>
                  )}

                  {paymentStatus.status === 'PENDING' && (
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-yellow-800 font-medium">⏳ Đang xử lý</p>
                      <p className="text-yellow-600 text-sm">Vui lòng đợi trong giây lát...</p>
                    </div>
                  )}

                  {paymentStatus.status === 'FAILED' && (
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-red-800 font-medium">❌ Thanh toán thất bại</p>
                      <p className="text-red-600 text-sm">Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
                    </div>
                  )}
                </>
              )}

              {!paymentStatus && !isLoading && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Không tìm thấy thông tin đơn hàng</p>
                </div>
              )}

              {isLoading && (
                <div className="text-center p-4">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Đang kiểm tra trạng thái...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={checkPaymentStatus}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Kiểm tra lại
            </Button>

            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto">
                <Home className="h-5 w-5 mr-2" />
                Về trang chủ
              </Button>
            </Link>

            <Link href="/products">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>

          {/* Additional Information */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Nếu có vấn đề với đơn hàng, vui lòng liên hệ:</p>
            <p>📧 support@audiotailoc.com | 📞 1900-XXXX</p>
          </div>
        </div>
      </main>
    </div>
  );
}