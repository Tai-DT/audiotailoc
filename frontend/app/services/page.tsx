'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Headphones, Settings, Home, Wrench, Calendar, Users, Shield, Zap, Target, Star, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useServiceStore } from '@/lib/store';

export default function ServicesPage() {
  const { services, getServices, isLoading } = useServiceStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    getServices();
  }, [getServices]);

  // Build dynamic categories from backend data
  const dynamicCategories = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    for (const s of services) {
      const cat = (s as any).category;
      if (cat?.slug && cat?.name && !map.has(cat.slug)) {
        map.set(cat.slug, { id: cat.slug, name: cat.name });
      }
    }
    return Array.from(map.values());
  }, [services]);

  const filtered = useMemo(() => {
    if (selectedCategory === 'all') return services;
    return services.filter((s: any) => s?.category?.slug === selectedCategory);
  }, [services, selectedCategory]);

  const formatPrice = (cents?: number, fallback?: number) => {
    const value = typeof cents === 'number' ? cents : (typeof fallback === 'number' ? fallback * 100 : 0);
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value / 100);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">Dịch vụ chuyên nghiệp</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Dịch Vụ Âm Thanh Toàn Diện</h1>
            <p className="text-xl mb-8 text-white/90">Từ tư vấn, lắp đặt đến bảo trì - Chúng tôi đồng hành cùng bạn trong mọi nhu cầu âm thanh</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/booking">Đặt lịch tư vấn</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-orange-600">
                Gọi ngay: 0901 234 567
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Danh Mục Dịch Vụ</h2>
            <p className="text-xl text-gray-600">Khám phá các dịch vụ chuyên nghiệp của chúng tôi</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${selectedCategory === 'all' ? 'ring-2 ring-orange-500' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 mx-auto mb-3 text-orange-600" />
                <h3 className="font-semibold text-sm">Tất cả</h3>
              </CardContent>
            </Card>
            {dynamicCategories.map((cat) => (
              <Card
                key={cat.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${selectedCategory === cat.id ? 'ring-2 ring-orange-500' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <CardContent className="p-6 text-center">
                  <Headphones className="h-10 w-10 mx-auto mb-3 text-orange-600" />
                  <h3 className="font-semibold text-sm">{cat.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full max-w-4xl mx-auto mb-8">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              {dynamicCategories.slice(0, 5).map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id}>{cat.name}</TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((service: any) => {
                  const img = service.images || service.imageUrl || '/images/services/placeholder.jpg';
                  const priceText = formatPrice(service.basePriceCents, service.price);
                  const durationMins = service.duration || service.durationMinutes || service.estimatedDuration;
                  return (
                    <Card key={service.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="relative h-48 bg-gray-200">
                        <Image src={img} alt={service.name} fill className="object-cover" />
                        {service.isFeatured && (
                          <Badge className="absolute top-4 right-4 bg-orange-500">Nổi bật</Badge>
                        )}
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{service.category?.name || 'Dịch vụ'}</Badge>
                          <div className="flex items-center text-sm">
                            <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                            <span className="font-medium">4.9</span>
                          </div>
                        </div>
                        <CardTitle className="line-clamp-2">{service.name}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center justify_between mt-2">
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-1 text-gray-400" />
                              {durationMins ? `${durationMins} phút` : 'Thời lượng linh hoạt'}
                            </div>
                            <div className="text-lg font-bold text-orange-600">{priceText}</div>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {service.shortDescription && (
                          <p className="text-sm text-gray-600 line-clamp-2">{service.shortDescription}</p>
                        )}
                      </CardContent>
                      <CardFooter className="gap-2">
                        <Button className="flex-1" asChild>
                          <Link href={`/services/${service.slug || service.id}`}>Xem chi tiết</Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href={`/booking?service=${service.id}`}>Đặt lịch</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Lý do chọn */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tại Sao Chọn Chúng Tôi?</h2>
            <p className="text-xl text-gray-600">Cam kết mang đến dịch vụ tốt nhất cho khách hàng</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center"><CardContent className="pt-6"><div className="bg-orange-100 w-16 h-16 rounded_full flex items-center justify-center mx-auto mb-4"><Users className="h-8 w-8 text-orange-600" /></div><h3 className="font-semibold mb-2">Đội Ngũ Chuyên Nghiệp</h3><p className="text-sm text-gray-600">Kỹ thuật viên được đào tạo bài bản với nhiều năm kinh nghiệm</p></CardContent></Card>
            <Card className="text-center"><CardContent className="pt-6"><div className="bg-blue-100 w-16 h-16 rounded_full flex items-center justify-center mx-auto mb-4"><Shield className="h-8 w-8 text-blue-600" /></div><h3 className="font-semibold mb-2">Bảo Hành Dài Hạn</h3><p className="text-sm text-gray-600">Chế độ bảo hành lên đến 24 tháng cho mọi dịch vụ</p></CardContent></Card>
            <Card className="text_center"><CardContent className="pt-6"><div className="bg-green-100 w-16 h-16 rounded_full flex items-center justify_center mx-auto mb-4"><Zap className="h-8 w-8 text-green-600" /></div><h3 className="font-semibold mb-2">Phản Hồi Nhanh</h3><p className="text-sm text-gray-600">Có mặt trong vòng 2 giờ cho các trường hợp khẩn cấp</p></CardContent></Card>
            <Card className="text-center"><CardContent className="pt-6"><div className="bg-purple-100 w-16 h-16 rounded_full flex items-center justify-center mx-auto mb-4"><Target className="h-8 w-8 text-purple-600" /></div><h3 className="font-semibold mb-2">Giá Cả Minh Bạch</h3><p className="text-sm text-gray-600">Báo giá rõ ràng, không phát sinh chi phí ngoài dự kiến</p></CardContent></Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sẵn Sàng Nâng Cấp Hệ Thống Âm Thanh?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Đặt lịch tư vấn miễn phí ngay hôm nay để được tư vấn giải pháp phù hợp nhất</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild><Link href="/booking">Đặt lịch ngay</Link></Button>
            <Button size="lg" variant="outline" className="bg-transparent text_white border_white hover:bg-white hover:text-orange-600">Xem portfolio</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
