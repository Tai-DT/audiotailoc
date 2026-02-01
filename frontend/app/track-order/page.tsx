'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Package,
    Search,
    Truck,
    CheckCircle2,
    Clock,
    MapPin,
    Phone,
    Mail,
    ArrowRight,
    AlertCircle
} from 'lucide-react';
import { apiClient, handleApiResponse } from '@/lib/api';
import { toast } from 'sonner';

interface OrderStatus {
    id: string;
    orderNumber: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    totalCents: number;
    shippingAddress?: string;
    items: Array<{
        id: string;
        quantity: number;
        product: {
            name: string;
            imageUrl?: string;
        };
    }>;
    timeline?: Array<{
        status: string;
        timestamp: string;
        note?: string;
    }>;
}

const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-500', icon: <Clock className="w-4 h-4" /> },
    CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-500', icon: <CheckCircle2 className="w-4 h-4" /> },
    PROCESSING: { label: 'Đang xử lý', color: 'bg-orange-500', icon: <Package className="w-4 h-4" /> },
    SHIPPED: { label: 'Đang vận chuyển', color: 'bg-purple-500', icon: <Truck className="w-4 h-4" /> },
    DELIVERED: { label: 'Đã giao hàng', color: 'bg-green-500', icon: <CheckCircle2 className="w-4 h-4" /> },
    CANCELLED: { label: 'Đã hủy', color: 'bg-red-500', icon: <AlertCircle className="w-4 h-4" /> },
};

export default function TrackOrderPage() {
    const [orderCode, setOrderCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [order, setOrder] = useState<OrderStatus | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!orderCode.trim()) {
            toast.error('Vui lòng nhập mã đơn hàng');
            return;
        }

        setIsLoading(true);
        setSearched(true);

        try {
            const response = await apiClient.get(`/orders/track/${orderCode}`, {
                params: phoneNumber ? { phone: phoneNumber } : undefined,
            });
            const data = handleApiResponse<OrderStatus>(response);
            if (data) {
                setOrder(data);
            } else {
                setOrder(null);
            }
        } catch {
            setOrder(null);
            toast.error('Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn hàng.');
        } finally {
            setIsLoading(false);
        }
    };

    const statusInfo = order ? statusMap[order.status] || statusMap.PENDING : null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-12">
            <div className="container max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                        <Truck className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-4">
                        Theo Dõi Đơn Hàng
                    </h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Nhập mã đơn hàng để kiểm tra tình trạng giao hàng của bạn
                    </p>
                </div>

                {/* Search Form */}
                <Card className="mb-8 bg-card/80 backdrop-blur border-border/60">
                    <CardHeader>
                        <CardTitle>Tra cứu đơn hàng</CardTitle>
                        <CardDescription>
                            Nhập mã đơn hàng được gửi trong email xác nhận hoặc tin nhắn SMS
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Mã đơn hàng (VD: ORD-XXXXXX)"
                                    value={orderCode}
                                    onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                                    className="h-12"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <div className="flex-1">
                                <Input
                                    placeholder="Số điện thoại (tùy chọn)"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="h-12"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <Button
                                size="lg"
                                className="h-12 px-8"
                                onClick={handleSearch}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Clock className="w-5 h-5 mr-2 animate-spin" />
                                ) : (
                                    <Search className="w-5 h-5 mr-2" />
                                )}
                                Tra cứu
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Result */}
                {searched && !order && !isLoading && (
                    <Card className="bg-card/80 backdrop-blur border-destructive/30">
                        <CardContent className="py-12 text-center">
                            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Không tìm thấy đơn hàng</h3>
                            <p className="text-muted-foreground mb-6">
                                Vui lòng kiểm tra lại mã đơn hàng hoặc liên hệ hotline để được hỗ trợ.
                            </p>
                            <div className="flex justify-center gap-4">
                                <Button variant="outline" asChild>
                                    <a href="tel:0768426262">
                                        <Phone className="w-4 h-4 mr-2" />
                                        0768 426 262
                                    </a>
                                </Button>
                                <Button variant="outline" asChild>
                                    <a href="mailto:hotro@audiotailoc.com">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Email hỗ trợ
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {order && statusInfo && (
                    <div className="space-y-6">
                        {/* Order Status Card */}
                        <Card className="bg-card/80 backdrop-blur border-border/60 overflow-hidden">
                            <div className={`h-2 ${statusInfo.color}`} />
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-2xl">Đơn hàng #{order.orderNumber}</CardTitle>
                                        <CardDescription>
                                            Đặt ngày: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                        </CardDescription>
                                    </div>
                                    <Badge className={`${statusInfo.color} text-white px-4 py-2 text-sm`}>
                                        {statusInfo.icon}
                                        <span className="ml-2">{statusInfo.label}</span>
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Progress Timeline */}
                                <div className="relative">
                                    <div className="flex justify-between items-center">
                                        {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status) => {
                                            const stepInfo = statusMap[status];
                                            const isCompleted = ['DELIVERED', 'SHIPPED', 'PROCESSING', 'CONFIRMED', 'PENDING']
                                                .indexOf(order.status) <= ['DELIVERED', 'SHIPPED', 'PROCESSING', 'CONFIRMED', 'PENDING'].indexOf(status);
                                            const isCurrent = order.status === status;

                                            return (
                                                <div key={status} className="flex flex-col items-center relative z-10">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCurrent
                                                            ? `${stepInfo.color} text-white ring-4 ring-offset-2 ring-offset-background ring-${stepInfo.color.replace('bg-', '')}/30`
                                                            : isCompleted
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-muted text-muted-foreground'
                                                        }`}>
                                                        {stepInfo.icon}
                                                    </div>
                                                    <span className={`text-xs mt-2 text-center max-w-[60px] ${isCurrent ? 'font-bold' : 'text-muted-foreground'}`}>
                                                        {stepInfo.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {/* Progress Line */}
                                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-0">
                                        <div
                                            className="h-full bg-green-500 transition-all duration-500"
                                            style={{
                                                width: order.status === 'DELIVERED' ? '100%'
                                                    : order.status === 'SHIPPED' ? '75%'
                                                        : order.status === 'PROCESSING' ? '50%'
                                                            : order.status === 'CONFIRMED' ? '25%'
                                                                : '0%'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Order Info */}
                                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
                                    <div>
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            Địa chỉ giao hàng
                                        </h4>
                                        <p className="text-muted-foreground">
                                            {order.shippingAddress || 'Chưa cập nhật'}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <Package className="w-4 h-4 text-primary" />
                                            Tổng giá trị
                                        </h4>
                                        <p className="text-2xl font-bold text-primary">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                                .format(order.totalCents)}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                {order.items && order.items.length > 0 && (
                                    <div className="pt-6 border-t">
                                        <h4 className="font-semibold mb-4">Sản phẩm trong đơn ({order.items.length})</h4>
                                        <div className="space-y-3">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                                                    <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center">
                                                        <Package className="w-8 h-8 text-muted-foreground" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{item.product.name}</p>
                                                        <p className="text-sm text-muted-foreground">Số lượng: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Need Help */}
                        <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="py-6">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div>
                                        <h4 className="font-bold">Cần hỗ trợ về đơn hàng?</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Liên hệ ngay để được tư vấn và giải đáp thắc mắc
                                        </p>
                                    </div>
                                    <Button asChild>
                                        <a href="tel:0768426262">
                                            <Phone className="w-4 h-4 mr-2" />
                                            Gọi Hotline
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
