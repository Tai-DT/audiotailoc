'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Calendar, CreditCard, MapPin, ChevronRight, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore, useOrderStore } from '@/lib/store';

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  PROCESSING: { label: 'Đang xử lý', color: 'bg-indigo-100 text-indigo-800', icon: Package },
  SHIPPED: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800', icon: Truck },
  DELIVERED: { label: 'Đã giao hàng', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XCircle },
};

function formatVND(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { orders, getOrders, isLoading } = useOrderStore();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/account/orders');
      return;
    }
    getOrders();
  }, [isAuthenticated, router, getOrders]);

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter((order: any) => {
        if (activeTab === 'processing') return ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status);
        if (activeTab === 'shipped') return order.status === 'SHIPPED';
        if (activeTab === 'delivered') return order.status === 'DELIVERED';
        if (activeTab === 'cancelled') return order.status === 'CANCELLED';
        return true;
      });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Đơn hàng của tôi</h1>
        <p className="text-gray-600">Quản lý và theo dõi trạng thái đơn hàng</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
          <TabsTrigger value="shipped">Đang giao</TabsTrigger>
          <TabsTrigger value="delivered">Đã giao</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-48 bg-gray-200 rounded mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Chưa có đơn hàng nào</p>
                <Button asChild>
                  <Link href="/products">Mua sắm ngay</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order: any) => {
                const status = statusMap[order.status] || statusMap.PENDING;
                const StatusIcon = status.icon;
                
                return (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            Đơn hàng #{order.orderNumber || order.id.slice(-8)}
                          </CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(order.createdAt)}
                          </CardDescription>
                        </div>
                        <Badge className={status.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-2">
                        {order.items?.slice(0, 2).map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <div className="flex-1">
                              <p className="font-medium">{item.product?.name || item.name}</p>
                              <p className="text-gray-500">Số lượng: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatVND(item.price * item.quantity)}</p>
                            </div>
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <p className="text-sm text-gray-500">+{order.items.length - 2} sản phẩm khác</p>
                        )}
                      </div>

                      {/* Order Info */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            {order.shippingAddress?.district}, {order.shippingAddress?.province}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <CreditCard className="h-4 w-4 mr-1" />
                            {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Tổng cộng</p>
                          <p className="text-lg font-bold text-orange-600">{formatVND(order.total)}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/account/orders/${order.id}`}>
                            Xem chi tiết
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                        <div className="space-x-2">
                          {order.status === 'DELIVERED' && (
                            <Button size="sm" variant="outline">Đánh giá</Button>
                          )}
                          {['PENDING', 'CONFIRMED'].includes(order.status) && (
                            <Button size="sm" variant="destructive">Hủy đơn</Button>
                          )}
                          {order.status === 'DELIVERED' && (
                            <Button size="sm">Mua lại</Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
