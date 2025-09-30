'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrderItem } from '@/lib/types';
import { useAuth } from '@/lib/hooks/use-auth';
import { useOrder } from '@/lib/hooks/use-api';
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  CreditCard,
  FileText
} from 'lucide-react';

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const statusConfig = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-500', icon: AlertCircle },
  PROCESSING: { label: 'Đang xử lý', color: 'bg-blue-500', icon: Package },
  COMPLETED: { label: 'Đã hoàn thành', color: 'bg-green-500', icon: CheckCircle },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-500', icon: XCircle },
};

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = React.use(params);
  const { data: user } = useAuth();
  const { data: order, isLoading, error } = useOrder(id);
  const router = useRouter();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="space-y-4">
                <div className="h-32 bg-muted rounded" />
                <div className="h-32 bg-muted rounded" />
                <div className="h-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Không tìm thấy đơn hàng
            </h1>
            <p className="text-muted-foreground mb-8">
              Đơn hàng bạn tìm kiếm có thể đã bị xóa hoặc bạn không có quyền truy cập.
            </p>
            <Link href="/orders">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách đơn hàng
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const StatusIcon = statusConfig[order.status]?.icon || AlertCircle;
  const formatPrice = (price: number) => `${price.toLocaleString('vi-VN')}₫`;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/orders">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">
                  Đơn hàng #{order.orderNo}
                </h1>
                <p className="text-muted-foreground">
                  Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <StatusIcon className="h-5 w-5" />
              <Badge className={statusConfig[order.status]?.color || 'bg-gray-500'}>
                {statusConfig[order.status]?.label || order.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Sản phẩm đã đặt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.items?.map((item: OrderItem) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.imageUrl || '/placeholder-product.svg'}
                          alt={item.name || 'Sản phẩm'}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Số lượng: {item.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Đơn giá: {formatPrice(item.unitPrice || item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Order Timeline - Simplified since statusHistory doesn't exist in current API */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Trạng thái đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <StatusIcon className="h-5 w-5" />
                    <div>
                      <p className="font-medium">
                        {statusConfig[order.status]?.label || order.status}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Cập nhật: {new Date(order.updatedAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary & Details */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Tóm tắt đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(order.subtotalCents / 100)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>
                      {order.shippingCents === 0 ? 'Miễn phí' : formatPrice(order.shippingCents / 100)}
                    </span>
                  </div>

                  {order.discountCents > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá:</span>
                      <span>-{formatPrice(order.discountCents / 100)}</span>
                    </div>
                  )}

                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng cộng:</span>
                    <span>{formatPrice(order.totalCents / 100)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Thông tin thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Phương thức:</span>
                    <span className="font-medium">
                      {order.payments?.[0]?.provider || 'Chưa xác định'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Trạng thái:</span>
                    <span className="font-medium">
                      {order.payments?.[0]?.status || 'Chờ thanh toán'}
                    </span>
                  </div>

                  {order.payments?.[0]?.transactionId && (
                    <div className="flex justify-between">
                      <span>Mã giao dịch:</span>
                      <span className="text-sm font-mono">{order.payments[0].transactionId}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Shipping Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Thông tin giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{order.user?.name || 'Khách hàng'}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.user?.phone || 'Chưa có số điện thoại'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                    <p className="text-sm">
                      {order.shippingAddress || 'Chưa có địa chỉ giao hàng'}
                    </p>
                  </div>

                  {order.promotionCode && (
                    <div className="text-sm text-muted-foreground">
                      <strong>Mã khuyến mãi:</strong> {order.promotionCode}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Cần hỗ trợ?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Liên hệ với chúng tôi nếu bạn có thắc mắc về đơn hàng này.
                  </p>
                  
                  <div className="flex flex-col gap-2">
                    <a 
                      href="tel:+84123456789" 
                      className="flex items-center gap-2 text-sm hover:text-primary"
                    >
                      <Phone className="h-4 w-4" />
                      0123 456 789
                    </a>
                    <a 
                      href="mailto:support@audiotailoc.vn" 
                      className="flex items-center gap-2 text-sm hover:text-primary"
                    >
                      <Mail className="h-4 w-4" />
                      support@audiotailoc.vn
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}