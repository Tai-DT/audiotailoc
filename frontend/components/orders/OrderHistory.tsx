'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Download,
  RefreshCw,
  MapPin,
  Calendar,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  notes?: string;
}

interface OrderHistoryProps {
  userId: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ATL-2024-001',
    status: 'delivered',
    totalAmount: 2500000,
    items: [
      {
        id: '1',
        productId: 'prod-1',
        name: 'Tai nghe Sony WH-1000XM4',
        imageUrl: '/images/products/headphones-1.jpg',
        price: 2500000,
        quantity: 1,
        total: 2500000
      }
    ],
    shippingAddress: {
      fullName: 'Nguyễn Văn A',
      phone: '0123456789',
      address: '123 Đường ABC',
      city: 'Hà Nội',
      district: 'Cầu Giấy'
    },
    paymentMethod: 'VNPAY',
    paymentStatus: 'paid',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-18T15:30:00Z',
    estimatedDelivery: '2024-01-20T00:00:00Z',
    trackingNumber: 'VN123456789'
  },
  {
    id: '2',
    orderNumber: 'ATL-2024-002',
    status: 'shipped',
    totalAmount: 1800000,
    items: [
      {
        id: '2',
        productId: 'prod-2',
        name: 'Loa Bluetooth JBL Flip 6',
        imageUrl: '/images/products/speaker-1.jpg',
        price: 1800000,
        quantity: 1,
        total: 1800000
      }
    ],
    shippingAddress: {
      fullName: 'Nguyễn Văn A',
      phone: '0123456789',
      address: '123 Đường ABC',
      city: 'Hà Nội',
      district: 'Cầu Giấy'
    },
    paymentMethod: 'MOMO',
    paymentStatus: 'paid',
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-01-22T09:15:00Z',
    estimatedDelivery: '2024-01-25T00:00:00Z',
    trackingNumber: 'VN987654321'
  }
];

export default function OrderHistory({ userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders(mockOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Không thể tải lịch sử đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: Order['status']) => {
    const statusConfig = {
      pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      processing: { label: 'Đang xử lý', color: 'bg-purple-100 text-purple-800', icon: Package },
      shipped: { label: 'Đang giao', color: 'bg-orange-100 text-orange-800', icon: Truck },
      delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: AlertCircle },
      refunded: { label: 'Đã hoàn tiền', color: 'bg-gray-100 text-gray-800', icon: RefreshCw }
    };
    return statusConfig[status];
  };

  const getPaymentStatusInfo = (status: Order['paymentStatus']) => {
    const statusConfig = {
      pending: { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800' },
      paid: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800' },
      failed: { label: 'Thanh toán thất bại', color: 'bg-red-100 text-red-800' },
      refunded: { label: 'Đã hoàn tiền', color: 'bg-gray-100 text-gray-800' }
    };
    return statusConfig[status];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
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

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  const handleTrackOrder = (order: Order) => {
    if (order.trackingNumber) {
      // Open tracking modal or redirect to tracking page
      toast.success(`Mã theo dõi: ${order.trackingNumber}`);
    } else {
      toast.info('Đơn hàng chưa có mã theo dõi');
    }
  };

  const handleDownloadInvoice = (order: Order) => {
    toast.success(`Đang tải hóa đơn cho đơn hàng ${order.orderNumber}`);
    // Implement invoice download logic
  };

  const handleReorder = (order: Order) => {
    toast.success(`Đang thêm sản phẩm từ đơn hàng ${order.orderNumber} vào giỏ hàng`);
    // Implement reorder logic
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Đang tải lịch sử đơn hàng...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Bạn chưa có đơn hàng nào</h3>
        <p className="text-gray-600 mb-6">Bắt đầu mua sắm để có đơn hàng đầu tiên</p>
        <Button onClick={() => window.location.href = '/products'}>
          Khám phá sản phẩm
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lịch sử đơn hàng</h2>
          <p className="text-gray-600">Theo dõi trạng thái và quản lý đơn hàng của bạn</p>
        </div>
        <Button onClick={fetchOrders} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Làm mới
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
          <TabsTrigger value="confirmed">Đã xác nhận</TabsTrigger>
          <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
          <TabsTrigger value="shipped">Đang giao</TabsTrigger>
          <TabsTrigger value="delivered">Đã giao</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const paymentStatusInfo = getPaymentStatusInfo(order.paymentStatus);
            const StatusIcon = statusInfo.icon;

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="w-5 h-5" />
                        <Badge className={statusInfo.color}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <Badge variant="outline" className={paymentStatusInfo.color}>
                        {paymentStatusInfo.label}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Đơn hàng</p>
                      <p className="font-medium">{order.orderNumber}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            Số lượng: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(item.total)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Địa chỉ giao hàng
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.phone}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.district}, {order.shippingAddress.city}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Thông tin thanh toán
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Phương thức: {order.paymentMethod}</p>
                        <p>Tổng tiền: {formatPrice(order.totalAmount)}</p>
                        <p>Ngày đặt: {formatDate(order.createdAt)}</p>
                        {order.estimatedDelivery && (
                          <p>Dự kiến giao: {formatDate(order.estimatedDelivery)}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    <Button
                      onClick={() => handleTrackOrder(order)}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Theo dõi
                    </Button>

                    <Button
                      onClick={() => handleDownloadInvoice(order)}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Tải hóa đơn
                    </Button>

                    {order.status === 'delivered' && (
                      <Button
                        onClick={() => handleReorder(order)}
                        variant="outline"
                        size="sm"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Đặt lại
                      </Button>
                    )}

                    {order.status === 'pending' && (
                      <Button variant="destructive" size="sm">
                        Hủy đơn hàng
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}