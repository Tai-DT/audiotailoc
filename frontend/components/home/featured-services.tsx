'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFeaturedServices } from '@/lib/hooks/use-api';
import { Skeleton } from '@/components/ui/skeleton';

export function FeaturedServices() {
  const { data: services, isLoading, error } = useFeaturedServices(4);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <Skeleton className="h-8 w-8 mx-auto mb-4" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Skeleton className="h-12 w-48 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dịch vụ chuyên nghiệp
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Không thể tải dữ liệu dịch vụ. Vui lòng thử lại sau.
            </p>
            <Link href="/dich-vu">
              <Button variant="outline" size="lg">
                Xem tất cả dịch vụ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // No services state
  if (!services || services.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dịch vụ chuyên nghiệp
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Chưa có dịch vụ nổi bật nào được chọn. Hãy khám phá các dịch vụ khác của chúng tôi!
            </p>
            <Link href="/dich-vu">
              <Button variant="outline" size="lg">
                Xem tất cả dịch vụ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Dịch vụ chuyên nghiệp
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Đội ngũ kỹ thuật viên giàu kinh nghiệm sẵn sàng phục vụ mọi nhu cầu
            về âm thanh của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {services.map((service) => (
            <Card key={service.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 mx-auto group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl">🔧</span>
                </div>
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <CardDescription>{service.shortDescription || service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {service.description}
                </p>

                {/* Features */}
                {service.features && Array.isArray(service.features) && service.features.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Price */}
                <div className="mb-4">
                  {service.priceType === 'FIXED' && (
                    <p className="text-lg font-semibold text-primary">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(service.price)}
                    </p>
                  )}
                  {service.priceType === 'RANGE' && (
                    <p className="text-lg font-semibold text-primary">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(service.minPrice || 0)} - {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(service.maxPrice || 0)}
                    </p>
                  )}
                  {service.priceType === 'NEGOTIABLE' && (
                    <p className="text-lg font-semibold text-primary">Thỏa thuận</p>
                  )}
                  {service.priceType === 'CONTACT' && (
                    <p className="text-lg font-semibold text-primary">Liên hệ</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/dich-vu">
            <Button variant="outline" size="lg">
              Xem tất cả dịch vụ
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}


