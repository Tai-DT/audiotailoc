'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner, LoadingCard } from '@/components/LoadingSpinner';
import { useApi } from '@/hooks/useApi';
import { formatPrice } from '@/lib/utils';
import { ArrowRight, Star, Truck, Shield, Headphones } from 'lucide-react';

interface Product {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  categoryId?: string;
  featured: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

function FeaturedProducts() {
  const { data: productsData, loading, error } = useApi<{ items: Product[] }>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/catalog/products?featured=true&pageSize=6`,
    { revalidate: 300 }
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {Array.from({ length: 6 }, (_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    );
  }

  if (error || !productsData?.items?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Không thể tải sản phẩm nổi bật</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {productsData.items.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              {product.featured && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  ⭐ Nổi bật
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-blue-600">
                  {formatPrice(product.priceCents)}
                </span>
                <Button asChild size="sm">
                  <Link href={`/products/${product.slug}`}>
                    Xem chi tiết
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Categories() {
  const { data: categoriesData, loading, error } = useApi<{ items: Category[] }>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/catalog/categories`,
    { revalidate: 600 }
  );

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !categoriesData?.items?.length) {
    return null; // Hide categories section if error
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {categoriesData.items.slice(0, 4).map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="group text-center p-4 rounded-lg border hover:border-blue-300 hover:shadow-md transition-all duration-300"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-white font-bold text-lg">
              {category.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h3 className="font-medium text-sm">{category.name}</h3>
        </Link>
      ))}
    </div>
  );
}

function Features() {
  const features = [
    {
      icon: Truck,
      title: 'Giao hàng nhanh',
      description: 'Giao hàng trong 24h tại TP.HCM'
    },
    {
      icon: Shield,
      title: 'Bảo hành chính hãng',
      description: 'Bảo hành lên đến 12 tháng'
    },
    {
      icon: Star,
      title: 'Sản phẩm chất lượng',
      description: '100% sản phẩm chính hãng'
    },
    {
      icon: Headphones,
      title: 'Hỗ trợ 24/7',
      description: 'Tư vấn chuyên nghiệp'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {features.map((feature, index) => (
        <div key={index} className="text-center p-6 rounded-lg border bg-gradient-to-br from-white to-gray-50">
          <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
          <p className="text-gray-600 text-sm">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}

export default function HomePageContent() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Nâng Tầm Trải Nghiệm Âm Thanh
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Khám phá bộ sưu tập tai nghe, loa, ampli chất lượng cao với giá tốt nhất thị trường
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/products">
                Mua sắm ngay <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/about">
                Tìm hiểu thêm
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Danh Mục Sản Phẩm</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá các danh mục sản phẩm audio chất lượng cao của chúng tôi
            </p>
          </div>
          <Categories />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Sản Phẩm Nổi Bật</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những sản phẩm được yêu thích nhất và bán chạy nhất tại Audio Tài Lộc
            </p>
          </div>
          <FeaturedProducts />
          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/products">
                Xem tất cả sản phẩm <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tại Sao Chọn Audio Tài Lộc?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng
            </p>
          </div>
          <Features />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng nâng tầm trải nghiệm âm thanh?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Hãy khám phá ngay bộ sưu tập sản phẩm chất lượng cao của chúng tôi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/products">
                Bắt đầu mua sắm
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/contact">
                Liên hệ tư vấn
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

