'use client';

import React from 'react';
import { PageBanner } from '@/components/ui/page-banner';
import { usePromotions } from '@/lib/hooks/use-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Gift, Percent, Truck, Calendar, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Promotion } from '@/lib/types';

export default function PromotionsPage() {
  const { data, isLoading, error } = usePromotions({ active: true });

  return (
    <div className="min-h-screen bg-background">
      {/* Page Banner */}
      <PageBanner
        page="promotions"
        title="Chương trình khuyến mãi"
        subtitle="Ưu đãi đặc biệt"
        description="Khám phá các chương trình khuyến mãi hấp dẫn từ Audio Tài Lộc. Giảm giá đặc biệt, quà tặng kèm theo và nhiều ưu đãi khác đang chờ đón bạn."
        showStats={true}
      />
export default function PromotionsPage() {
  const { data, isLoading, error } = usePromotions({ active: true });

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Đã sao chép mã khuyến mãi!');
    } catch {
      toast.error('Không thể sao chép mã');
    }
  };

  const getPromotionIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="h-5 w-5" />;
      case 'fixed':
        return <Gift className="h-5 w-5" />;
      case 'free_shipping':
        return <Truck className="h-5 w-5" />;
      default:
        return <Gift className="h-5 w-5" />;
    }
  };

  const getPromotionTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'Giảm theo %';
      case 'fixed':
        return 'Giảm cố định';
      case 'free_shipping':
        return 'Miễn phí vận chuyển';
      default:
        return 'Khuyến mãi';
    }
  };

  const formatDiscount = (promotion: Promotion) => {
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.value}%`;
      case 'fixed':
        return `${(promotion.value / 1000).toLocaleString('vi-VN')}k`;
      case 'free_shipping':
        return 'Miễn phí';
      default:
        return promotion.value;
    }
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();

    if (diffTime <= 0) return 'Đã hết hạn';

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 30) {
      const months = Math.floor(diffDays / 30);
      return `Còn ${months} tháng`;
    } else if (diffDays > 7) {
      const weeks = Math.floor(diffDays / 7);
      return `Còn ${weeks} tuần`;
    } else {
      return `Còn ${diffDays} ngày`;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">
              Có lỗi xảy ra khi tải khuyến mãi
            </h1>
            <p className="text-muted-foreground">
              Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Khuyến mãi & Ưu đãi
              </h1>
              <p className="text-xl text-muted-foreground">
                Khám phá các chương trình khuyến mãi hấp dẫn từ Audio Tài Lộc.
                Tiết kiệm ngay với mã giảm giá và ưu đãi đặc biệt.
              </p>
            </div>
          </div>
        </section>

        {/* Promotions Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Khuyến mãi đang hoạt động</h2>
              <p className="text-muted-foreground">
                Áp dụng ngay các mã khuyến mãi để nhận ưu đãi tốt nhất
              </p>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-muted rounded mb-4"></div>
                      <div className="h-10 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : data?.items && data.items.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.items.map((promotion: Promotion) => (
                  <Card key={promotion.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getPromotionIcon(promotion.type)}
                          <Badge variant="secondary">
                            {getPromotionTypeLabel(promotion.type)}
                          </Badge>
                        </div>
                        {isExpired(promotion.endDate) && (
                          <Badge variant="destructive">Hết hạn</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{promotion.name}</CardTitle>
                      <div className="text-2xl font-bold text-primary">
                        {formatDiscount(promotion)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {promotion.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        {promotion.minOrderAmount && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Đơn tối thiểu:</span>
                            <span>{(promotion.minOrderAmount / 1000).toLocaleString('vi-VN')}k</span>
                          </div>
                        )}
                        {promotion.usageLimit && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Giới hạn:</span>
                            <span>{promotion.usageLimit - promotion.usageCount} lượt</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3" />
                          <span>{getTimeRemaining(promotion.endDate)}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            value={promotion.code}
                            readOnly
                            className="text-center font-mono"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyCode(promotion.code)}
                            className="shrink-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>

                        <Link href="/products" className="w-full">
                          <Button className="w-full">
                            Mua sắm ngay
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Không có khuyến mãi nào</h3>
                <p className="text-muted-foreground mb-6">
                  Hiện tại chưa có chương trình khuyến mãi nào đang hoạt động.
                  Hãy quay lại sau để nhận ưu đãi hấp dẫn!
                </p>
                <Link href="/products">
                  <Button>
                    Xem sản phẩm
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* How to Use Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Cách sử dụng mã khuyến mãi</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Áp dụng mã khuyến mãi đơn giản chỉ với vài bước
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Chọn sản phẩm</h3>
                <p className="text-sm text-muted-foreground">
                  Thêm sản phẩm bạn muốn mua vào giỏ hàng
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">Nhập mã</h3>
                <p className="text-sm text-muted-foreground">
                  Nhập mã khuyến mãi vào ô &quot;Mã giảm giá&quot; khi thanh toán
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Áp dụng</h3>
                <p className="text-sm text-muted-foreground">
                  Nhấn &quot;Áp dụng&quot; để nhận ưu đãi và hoàn tất đơn hàng
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Terms & Conditions */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Điều kiện & Điều khoản</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      Thời hạn sử dụng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">• Mỗi mã khuyến mãi có thời hạn sử dụng riêng</p>
                    <p className="text-sm">• Không áp dụng cho sản phẩm đã giảm giá</p>
                    <p className="text-sm">• Một đơn hàng chỉ sử dụng được một mã</p>
                    <p className="text-sm">• Không áp dụng đồng thời với chương trình khác</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-green-500" />
                      Quyền lợi khách hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">• Giảm giá trực tiếp trên tổng tiền đơn hàng</p>
                    <p className="text-sm">• Miễn phí vận chuyển cho đơn hàng đủ điều kiện</p>
                    <p className="text-sm">• Ưu đãi đặc biệt cho khách hàng thân thiết</p>
                    <p className="text-sm">• Thông báo sớm các chương trình khuyến mãi</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}