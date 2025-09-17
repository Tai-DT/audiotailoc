'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/components/providers/auth-provider';
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

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const statusConfig = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-500', icon: Clock },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-500', icon: Package },
  processing: { label: 'Đang xử lý', color: 'bg-orange-500', icon: Package },
  shipped: { label: 'Đang giao', color: 'bg-purple-500', icon: Truck },
  delivered: { label: 'Đã giao', color: 'bg-green-500', icon: CheckCircle },
  cancelled: { label: 'Đã hủy', color: 'bg-red-500', icon: XCircle }
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: orders, isLoading, error } = useOrders();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Đang tải...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Đang tải đơn hàng...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Có lỗi xảy ra</h1>
            <p className="text-muted-foreground">Không thể tải danh sách đơn hàng</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
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
              {orders.items.map((order: any) => {
                const status = statusConfig[order.status as OrderStatus];
                const StatusIcon = status.icon;

                return (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
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
                          <div className="text-lg font-semibold text-green-600">
                            {formatPrice(order.totalAmount)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Mã đơn: #{order.id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {/* Order Items */}
                      <div className="space-y-4 mb-6">
                        {order.items?.map((item: any) => (
                          <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                              <Package className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{item.product?.name || 'Sản phẩm'}</h4>
                              <p className="text-sm text-muted-foreground">
                                Số lượng: {item.quantity}
                              </p>
                              <p className="text-sm font-medium">
                                {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
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
                            <span>{order.paymentMethod || 'Thanh toán khi nhận hàng'}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/orders/${order.id}`}>
                              <Eye className="w-4 h-4 mr-1" />
                              Chi tiết
                            </Link>
                          </Button>
                          {order.status === 'delivered' && (
                            <Button variant="outline" size="sm">
                              Đánh giá
                            </Button>
                          )}
                          {['pending', 'confirmed'].includes(order.status) && (
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
          {orders && orders.items.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{orders.items.length}</div>
                  <div className="text-sm text-muted-foreground">Tổng đơn hàng</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {orders.items.filter((o: any) => o.status === 'delivered').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Đã giao</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {orders.items.filter((o: any) => ['pending', 'confirmed', 'processing'].includes(o.status)).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Đang xử lý</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {orders.items.filter((o: any) => o.status === 'cancelled').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Đã hủy</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}