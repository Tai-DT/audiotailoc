'use client';

import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-center text-2xl">Thanh toán đã bị hủy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Thanh toán của bạn đã bị hủy. Đơn hàng vẫn được lưu và bạn có thể thanh toán lại bất kỳ lúc nào.
            </p>
            <div className="flex gap-3 justify-center pt-4">
              <Button onClick={() => router.push('/cart')}>
                Quay lại giỏ hàng
              </Button>
              <Button variant="outline" onClick={() => router.push('/')}>
                Về trang chủ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
