'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api-client';

function formatVND(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

export default function CheckoutSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.get('id');
    if (!id) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await api.orders.getById(id);
        if (res.success) setOrder(res.data);
      } catch (e) {}
      setLoading(false);
    })();
  }, [params]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="h-40 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Đặt hàng thành công 🎉</CardTitle>
        </CardHeader>
        <CardContent>
          {order ? (
            <div className="space-y-4">
              <p className="text-gray-700">Mã đơn hàng: <span className="font-semibold">{order.orderNumber || order.id}</span></p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Tổng tiền</span>
                  <span className="font-medium">{formatVND(order.total ?? order.subtotal ?? 0)}</span>
                </div>
                {order.itemCount && (
                  <div className="flex justify-between text-sm">
                    <span>Số lượng</span>
                    <span className="font-medium">{order.itemCount}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={() => router.push('/products')}>Tiếp tục mua sắm</Button>
                <Button variant="outline" onClick={() => router.push('/account/orders')}>Xem đơn hàng</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700">Đơn hàng của bạn đã được tạo.</p>
              <div className="flex gap-3">
                <Button onClick={() => router.push('/products')}>Tiếp tục mua sắm</Button>
                <Button variant="outline" onClick={() => router.push('/')}>Về trang chủ</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
