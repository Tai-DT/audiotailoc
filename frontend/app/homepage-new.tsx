'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Users, Award, ShoppingBag } from 'lucide-react';
import HeroBanner from '@/components/marketing/HeroBanner';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductStore } from '@/lib/store';

export default function HomePage() {
  const { products, getFeaturedProducts, isLoading } = useProductStore();

  useEffect(() => {
    getFeaturedProducts();
  }, [getFeaturedProducts]);

  return (
    <div>
      {/* Hero Section */}
      <HeroBanner />

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Sản phẩm nổi bật
              </h2>
              <p className="text-xl text-gray-600">
                Khám phá những thiết bị âm thanh được yêu thích nhất
              </p>
            </div>
            <Button asChild variant="outline" size="lg">
              <Link href="/products">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-[450px]"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} variant="featured" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Danh mục sản phẩm
            </h2>
            <p className="text-xl text-gray-600">
              Tìm kiếm theo từng loại thiết bị âm thanh
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Tai nghe',
                description: 'Tai nghe cao cấp, chính hãng',
                href: '/categories/tai-nghe',
                image: '/images/categories/headphones.jpg',
                count: '500+'
              },
              {
                name: 'Loa',
                description: 'Loa bluetooth, loa di động',
                href: '/categories/loa',
                image: '/images/categories/speakers.jpg',
                count: '300+'
              },
              {
                name: 'Ampli',
                description: 'Ampli đèn, ampli số',
                href: '/categories/ampli',
                image: '/images/categories/amplifiers.jpg',
                count: '200+'
              },
              {
                name: 'Phụ kiện',
                description: 'Cáp, adapter, phụ kiện âm thanh',
                href: '/categories/phu-kien',
                image: '/images/categories/accessories.jpg',
                count: '1000+'
              },
            ].map((category) => (
              <Link key={category.name} href={category.href}>
                <Card className="group cursor-pointer transition-all hover:shadow-lg">
                  <CardContent className="p-0">
                    <div 
                      className="h-48 bg-cover bg-center rounded-t-lg"
                      style={{
                        backgroundImage: `url(${category.image})`,
                      }}
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{category.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-orange-600 font-medium">{category.count} sản phẩm</span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dịch vụ chuyên nghiệp
            </h2>
            <p className="text-xl text-gray-600">
              Hỗ trợ tư vấn và setup hệ thống âm thanh hoàn hảo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Tư vấn setup âm thanh',
                description: 'Tư vấn miễn phí giải pháp âm thanh phù hợp với nhu cầu và ngân sách',
                icon: Users,
                href: '/services/tu-van-setup'
              },
              {
                title: 'Thiết kế phòng nghe',
                description: 'Thiết kế và thi công phòng nghe chuyên nghiệp với âm học tối ưu',
                icon: Award,
                href: '/services/thiet-ke-phong-nghe'
              },
              {
                title: 'Sửa chữa & bảo hành',
                description: 'Dịch vụ sửa chữa và bảo hành thiết bị âm thanh uy tín',
                icon: ShoppingBag,
                href: '/services/sua-chua'
              },
            ].map((service) => (
              <Card key={service.title} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <service.icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <Button asChild variant="outline">
                    <Link href={service.href}>Tìm hiểu thêm</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng nâng tầm trải nghiệm âm thanh?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí về giải pháp âm thanh hoàn hảo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/services/tu-van-setup">
                Tư vấn miễn phí
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600" asChild>
              <Link href="/contact">
                Liên hệ ngay
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
