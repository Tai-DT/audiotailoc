"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  priceCents: number;
  quantity: number;
}

interface Order {
  id: string;
  orderNo: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

const statusConfig = {
  PENDING: {
    label: 'Chờ xác nhận',
    color: 'bg-yellow-100 text-yellow-800',
    icon: <Clock className="h-4 w-4" />
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    color: 'bg-blue-100 text-blue-800',
    icon: <CheckCircle className="h-4 w-4" />
  },
  PROCESSING: {
    label: 'Đang xử lý',
    color: 'bg-purple-100 text-purple-800',
    icon: <Package className="h-4 w-4" />
  },
  SHIPPED: {
    label: 'Đang giao hàng',
    color: 'bg-orange-100 text-orange-800',
    icon: <Truck className="h-4 w-4" />
  },
  DELIVERED: {
    label: 'Đã giao hàng',
    color: 'bg-green-100 text-green-800',
    icon: <CheckCircle className="h-4 w-4" />
  },
  CANCELLED: {
    label: 'Đã hủy',
    color: 'bg-red-100 text-red-800',
    icon: <XCircle className="h-4 w-4" />
  }
};

const paymentStatusConfig = {
  PENDING: {
    label: 'Chờ thanh toán',
    color: 'bg-yellow-100 text-yellow-800'
  },
  PAID: {
    label: 'Đã thanh toán',
    color: 'bg-green-100 text-green-800'
  },
  FAILED: {
    label: 'Thanh toán thất bại',
    color: 'bg-red-100 text-red-800'
  },
  REFUNDED: {
    label: 'Đã hoàn tiền',
    color: 'bg-gray-100 text-gray-800'
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!base) {
          setError('API không khả dụng');
          setLoading(false);
          return;
        }

        const response = await fetch(`${base}/orders`, {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data.items || []);
        } else if (response.status === 401) {
          setError('Vui lòng đăng nhập để xem đơn hàng');
        } else {
          setError('Không thể tải danh sách đơn hàng');
        }
      } catch (error) {
        setError('Lỗi kết nối');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          {error.includes('đăng nhập') && (
            <Link href="/login">
              <Button>Đăng nhập</Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Đơn hàng của tôi</h1>
          <p className="text-gray-600">
            Theo dõi trạng thái và lịch sử đơn hàng của bạn
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-2">Chưa có đơn hàng nào</h2>
            <p className="text-gray-600 mb-6">
              Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
            </p>
            <Link href="/products">
              <Button>Mua sắm ngay</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Đơn hàng #{order.orderNo}
                      </CardTitle>
                      <CardDescription>
                        Đặt hàng lúc {formatDate(order.createdAt)}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`flex items-center gap-1 ${statusConfig[order.status].color}`}>
                        {statusConfig[order.status].icon}
                        {statusConfig[order.status].label}
                      </Badge>
                      <Badge className={paymentStatusConfig[order.paymentStatus].color}>
                        {paymentStatusConfig[order.paymentStatus].label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Order Items Preview */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Sản phẩm:</h4>
                    <div className="space-y-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded flex-shrink-0"></div>
                            <div>
                              <p className="font-medium">{item.productName}</p>
                              <p className="text-gray-500">Số lượng: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-medium">{formatPrice(item.priceCents * item.quantity)}</p>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-sm text-gray-500 text-center">
                          Và {order.items.length - 3} sản phẩm khác...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Tổng cộng:</p>
                        <p className="text-lg font-bold">{formatPrice(order.totalCents)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Phương thức thanh toán:</p>
                        <p className="font-medium">{order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Địa chỉ giao hàng:</h4>
                    <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                    <p className="text-sm text-gray-600">
                      {order.customerName} - {order.customerPhone}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link href={`/orders/${order.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </Link>
                    {order.status === 'PENDING' && (
                      <Button variant="danger" className="flex-1">
                        Hủy đơn hàng
                      </Button>
                    )}
                    {order.status === 'DELIVERED' && (
                      <Button variant="outline" className="flex-1">
                        Đánh giá sản phẩm
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
