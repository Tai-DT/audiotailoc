"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface Order {
  id: string;
  orderNo: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  totalCents: number;
  items: any[];
  createdAt: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!base) {
          setError('API không khả dụng');
          setLoading(false);
          return;
        }

        const response = await fetch(`${base}/orders/${orderId}`, {
          credentials: 'include'
        });

        if (response.ok) {
          const orderData = await response.json();
          setOrder(orderData);
        } else {
          setError('Không thể tải thông tin đơn hàng');
        }
      } catch (error) {
        setError('Lỗi kết nối');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{error || 'Không tìm thấy đơn hàng'}</p>
          <Link href="/orders">
            <Button>Quay lại danh sách đơn hàng</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/orders">
            <Button variant="ghost" className="mb-4">← Quay lại danh sách đơn hàng</Button>
          </Link>
          <h1 className="text-3xl font-bold">Đơn hàng #{order.orderNo}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm đã đặt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.productName}</h4>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatPrice(item.priceCents * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span>{formatPrice(order.totalCents)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin khách hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm"><strong>Tên:</strong> {order.customerName}</p>
                <p className="text-sm"><strong>Điện thoại:</strong> {order.customerPhone}</p>
                <p className="text-sm"><strong>Địa chỉ:</strong> {order.shippingAddress}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trạng thái</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Trạng thái đơn hàng:</p>
                  <Badge variant="outline">{order.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng thái thanh toán:</p>
                  <Badge variant="outline">{order.paymentStatus}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phương thức thanh toán:</p>
                  <p className="font-medium">{order.paymentMethod}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
