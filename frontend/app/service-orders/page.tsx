'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/lib/hooks/use-api';
import { OrderFilters as OrderFiltersType } from '@/lib/types';
import {
 ArrowLeft,
 Calendar,
 MapPin,
 Phone,
 Mail,
 CheckCircle,
 XCircle,
 Clock as PendingIcon,
 Wrench
} from 'lucide-react';

export default function ServiceOrdersPage() {
 const [filters] = React.useState<OrderFiltersType>({
 page: 1,
 pageSize: 10,
 // Note: We'll need to add a type filter to the backend or filter client-side
 });

 const { data, isLoading, error } = useOrders(filters);

 const getStatusIcon = (status: string) => {
 switch (status) {
 case 'COMPLETED':
 return <CheckCircle className="h-4 w-4 text-success" />;
 case 'CANCELLED':
 return <XCircle className="h-4 w-4 text-destructive" />;
 case 'IN_PROGRESS':
 return <Wrench className="h-4 w-4 text-primary" />;
 default:
 return <PendingIcon className="h-4 w-4 text-warning" />;
 }
 };

 const getStatusText = (status: string) => {
 switch (status) {
 case 'PENDING':
 return 'Chờ xác nhận';
 case 'CONFIRMED':
 return 'Đã xác nhận';
 case 'IN_PROGRESS':
 return 'Đang thực hiện';
 case 'COMPLETED':
 return 'Hoàn thành';
 case 'CANCELLED':
 return 'Đã hủy';
 default:
 return status;
 }
 };

 const getStatusColor = (status: string) => {
 switch (status) {
 case 'COMPLETED':
 return 'bg-green-100 text-green-800';
 case 'CANCELLED':
 return 'bg-red-100 text-red-800';
 case 'IN_PROGRESS':
 return 'bg-blue-100 text-blue-800';
 default:
 return 'bg-yellow-100 text-yellow-800';
 }
 };

 if (isLoading) {
 return (
 <div className="min-h-screen bg-background">
 <main className="container mx-auto px-4 py-8">
 <div className="animate-pulse">
 <div className="h-8 bg-muted rounded w-1/4 mb-8" />
 <div className="space-y-4">
 {[...Array(3)].map((_, i) => (
 <div key={i} className="h-32 bg-muted rounded" />
 ))}
 </div>
 </div>
 </main>
 </div>
 );
 }

 if (error) {
 return (
 <div className="min-h-screen bg-background">
 <main className="container mx-auto px-4 py-8">
 <div className="text-center">
 <h1 className="text-2xl font-bold text-destructive mb-4">
 Có lỗi xảy ra khi tải đơn hàng
 </h1>
 <p className="text-muted-foreground mb-8">
 Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
 </p>
 <Link href="/">
 <Button>
 <ArrowLeft className="mr-2 h-4 w-4" />
 Về trang chủ
 </Button>
 </Link>
 </div>
 </main>
 </div>
 );
 }

 // Filter for service orders (this would need backend support for proper filtering)
 const serviceOrders = data?.items?.filter(order =>
 order.items?.some(item => item.product?.category?.name?.includes('Dịch vụ')) ||
 order.items?.some(item => item.product?.name?.includes('Dịch vụ'))
 ) || [];

 return (
 <div className="min-h-screen bg-background">
 <main className="container mx-auto px-4 py-8">
 <div className="max-w-4xl mx-auto">
 {/* Header */}
 <div className="flex items-center gap-4 mb-8">
 <Link href="/">
 <Button variant="outline" size="icon">
 <ArrowLeft className="h-4 w-4" />
 </Button>
 </Link>
 <div>
 <h1 className="text-3xl font-bold">Lịch sử đặt dịch vụ</h1>
 <p className="text-muted-foreground">Theo dõi các đơn hàng dịch vụ của bạn</p>
 </div>
 </div>

 {/* Orders List */}
 {serviceOrders.length === 0 ? (
 <Card>
 <CardContent className="py-16">
 <div className="text-center">
 <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
 <h3 className="text-xl font-semibold mb-2">Chưa có đơn hàng dịch vụ</h3>
 <p className="text-muted-foreground mb-6">
 Bạn chưa đặt bất kỳ dịch vụ nào. Hãy khám phá các dịch vụ của chúng tôi!
 </p>
 <div className="flex gap-4 justify-center">
 <Link href="/services">
 <Button>
 Xem dịch vụ
 </Button>
 </Link>
 <Link href="/products">
 <Button variant="outline">
 Xem sản phẩm
 </Button>
 </Link>
 </div>
 </div>
 </CardContent>
 </Card>
 ) : (
 <div className="space-y-6">
 {serviceOrders.map((order) => (
 <Card key={order.id}>
 <CardHeader>
 <div className="flex items-center justify-between">
 <div>
 <CardTitle className="text-lg">
 Đơn hàng #{order.orderNo || 'N/A'}
 </CardTitle>
 <p className="text-sm text-muted-foreground">
 {new Date(order.createdAt).toLocaleDateString('vi-VN')}
 </p>
 </div>
 <Badge className={getStatusColor(order.status)}>
 {getStatusIcon(order.status)}
 <span className="ml-1">{getStatusText(order.status)}</span>
 </Badge>
 </div>
 </CardHeader>
 <CardContent>
 <div className="space-y-4">
 {/* Order Items */}
 <div className="space-y-3">
 {order.items?.map((item, index) => (
 <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
 <div className="flex-1">
 <h4 className="font-semibold">{item.product?.name}</h4>
 <p className="text-sm text-muted-foreground">
 {item.product?.shortDescription}
 </p>
 <div className="flex items-center gap-4 mt-2 text-sm">
 <span>Số lượng: {item.quantity}</span>
 <span>Giá: {item.price.toLocaleString('vi-VN')}₫</span>
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* Order Details */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
 <div className="space-y-2">
 <h4 className="font-semibold flex items-center gap-2">
 <Calendar className="h-4 w-4" />
 Ngày đặt hàng
 </h4>
 <p className="text-sm text-muted-foreground">
 {new Date(order.createdAt).toLocaleString('vi-VN')}
 </p>
 </div>

 <div className="space-y-2">
 <h4 className="font-semibold flex items-center gap-2">
 <MapPin className="h-4 w-4" />
 Địa chỉ giao hàng
 </h4>
 <p className="text-sm text-muted-foreground">
 {order.shippingAddress || 'Chưa cập nhật'}
 </p>
 </div>
 </div>

 {/* Customer Info */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
 <div className="flex items-center gap-2 text-sm">
 <Mail className="h-4 w-4 text-muted-foreground" />
 <span>{order.user?.email}</span>
 </div>
 {order.user?.phone && (
 <div className="flex items-center gap-2 text-sm">
 <Phone className="h-4 w-4 text-muted-foreground" />
 <span>{order.user.phone}</span>
 </div>
 )}
 </div>

 {/* Total */}
 <div className="flex justify-between items-center pt-4 border-t">
 <span className="font-semibold">Tổng cộng:</span>
 <span className="text-xl font-bold text-primary">
 {order.totalCents.toLocaleString('vi-VN')}₫
 </span>
 </div>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 )}
 </div>
 </main>
 </div>
 );
}