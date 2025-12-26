'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AuthGuard } from '@/components/auth/auth-guard';
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Calendar,
  DollarSign,
  MapPin
} from 'lucide-react';
import { useOrders } from '@/lib/hooks/use-api';
import { Order, OrderItem } from '@/lib/types';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-500', icon: Clock },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-500', icon: Package },
  PROCESSING: { label: 'Đang xử lý', color: 'bg-orange-500', icon: Package },
  SHIPPED: { label: 'Đang giao', color: 'bg-purple-500', icon: Truck },
  DELIVERED: { label: 'Đã giao', color: 'bg-success', icon: CheckCircle },
  CANCELLED: { label: 'Đã hủy', color: 'bg-destructive', icon: XCircle },
};

function OrdersPageContent() {
  const { data: orders, isLoading, error } = useOrders();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Đang tải đơn hàng...</h1>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    // Check if it's a 403 Forbidden error (user doesn't have permission)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isForbidden = (error as any)?.response?.status === 403;
    
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-destructive">
              {isForbidden ? 'Không có quyền truy cập' : 'Có lỗi xảy ra'}
            </h1>
            <p className="text-muted-foreground mb-4">
              {isForbidden 
                ? 'Bạn không có quyền truy cập vào danh sách đơn hàng. Vui lòng liên hệ quản trị viên nếu bạn cần hỗ trợ.'
                : 'Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.'}
            </p>
            {!isForbidden && (
              <Button onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Đơn hàng của tôi</h1>
              <p className="text-muted-foreground">
                Quản lý và theo dõi tất cả đơn hàng của bạn
              </p>
            </div>
            <Button asChild>
              <Link href="/products">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Tiếp tục mua sắm
              </Link>
            </Button>
          </div>

          {/* Orders List */}
          {!orders?.items || orders.items.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Chưa có đơn hàng nào</h3>
                <p className="text-muted-foreground mb-6">
                  Bạn chưa đặt đơn hàng nào. Hãy khám phá sản phẩm của chúng tôi!
                </p>
                <Button asChild size="lg">
                  <Link href="/products">
                    Khám phá sản phẩm
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.items.map((order: Order) => {
                const normalizedStatus = (order.status?.toUpperCase?.() || 'PENDING') as OrderStatus;
                const status = statusConfig[normalizedStatus] ?? statusConfig.PENDING;
                const StatusIcon = status.icon;
                const orderId = order?.id || '';
                const orderTotalCents = order?.totalCents || 0;
                const orderItems = order?.items || [];

                return (
                  <Card key={orderId} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <StatusIcon className={`w-5 h-5 ${status.color} text-white rounded-full p-1`} />
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <span>{status.label}</span>
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-success">
                            {formatPrice(orderTotalCents / 100)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Mã đơn: #{order.orderNo || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {/* Order Items */}
                      <div className="space-y-4 mb-6">
                        {orderItems.length > 0 ? (
                          orderItems.map((item: OrderItem) => {
                            const itemId = item?.id || '';
                            const itemQuantity = item?.quantity || 0;
                            const itemPrice = item?.price || 0;
                            const productName = item?.product?.name || 'Sản phẩm';
                            
                            return (
                              <div key={itemId} className="flex items-center space-x-4 p-4 border rounded-lg">
                                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                                  <Package className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold">{productName}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Số lượng: {itemQuantity}
                                  </p>
                                  <p className="text-sm font-medium">
                                    {formatPrice(itemPrice)}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            Không có sản phẩm nào trong đơn hàng này
                          </div>
                        )}
                      </div>

                      <Separator className="mb-4" />

                      {/* Order Actions */}
                        <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          {order.shippingAddress && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{order.shippingAddress}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>Thanh toán khi nhận hàng</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          {orderId && (
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/orders/${orderId}`}>
                                <Eye className="w-4 h-4 mr-1" />
                                Chi tiết
                              </Link>
                            </Button>
                          )}
                          {order.status === 'COMPLETED' && (
                            <Button variant="outline" size="sm">
                              Đánh giá
                            </Button>
                          )}
                          {order.status && ['PENDING', 'PROCESSING'].includes(order.status) && (
                            <Button variant="outline" size="sm" className="text-destructive hover:text-red-700">
                              Hủy đơn
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Order Statistics */}
          {orders && orders.items && orders.items.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{orders.items.length}</div>
                  <div className="text-sm text-muted-foreground">Tổng đơn hàng</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success">
                    {orders.items.filter((o: Order) => o?.status === 'COMPLETED').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Đã giao</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-warning">
                    {orders.items.filter((o: Order) => o?.status && ['PENDING', 'PROCESSING', 'CONFIRMED'].includes(o.status)).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Đang xử lý</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-destructive">
                    {orders.items.filter((o: Order) => o?.status === 'CANCELLED').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Đã hủy</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <OrdersPageContent />
    </AuthGuard>
  );
}
