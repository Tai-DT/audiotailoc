'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear cart after successful payment
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart-storage');
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center text-2xl">Thanh toán thành công!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
            </p>
            <p className="text-sm text-gray-500">
              Bạn sẽ nhận được email xác nhận trong vài phút tới.
            </p>
            <div className="flex gap-3 justify-center pt-4">
              <Button onClick={() => router.push('/account/orders')}>
                Xem đơn hàng
              </Button>
              <Button variant="outline" onClick={() => router.push('/products')}>
                Tiếp tục mua sắm
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
