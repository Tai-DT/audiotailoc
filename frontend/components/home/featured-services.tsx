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
            <Link href="/services">
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
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-accent/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent mb-4">
              <span className="mr-2">🔧</span>
              Dịch vụ chuyên nghiệp
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
              Dịch vụ chuyên nghiệp
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Chưa có dịch vụ nổi bật nào được chọn. Hãy khám phá các dịch vụ khác của chúng tôi!
            </p>
            <Link href="/services">
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
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-accent/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent mb-4">
            <span className="mr-2">🔧</span>
            Dịch vụ chuyên nghiệp
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
            Dịch vụ chuyên nghiệp
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Đội ngũ kỹ thuật viên giàu kinh nghiệm sẵn sàng phục vụ mọi nhu cầu
            về âm thanh của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {services.map((service) => (
            <Card key={service.id} className="group hover:shadow-xl hover:border-accent/30 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-accent/10 text-accent mb-4 mx-auto group-hover:bg-accent/20 group-hover:scale-110 transition-all">
                  <span className="text-xl sm:text-2xl">🔧</span>
                </div>
                <CardTitle className="text-base sm:text-lg font-bold group-hover:text-accent transition-colors">{service.name}</CardTitle>
                <CardDescription className="text-sm">{service.shortDescription || service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {service.description}
                </p>

                {/* Features */}
                {service.features && Array.isArray(service.features) && service.features.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center text-xs sm:text-sm">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2 flex-shrink-0"></div>
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Price */}
                <div className="mb-4">
                  {service.priceType === 'FIXED' && (
                    <p className="text-base sm:text-lg font-bold text-accent">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(service.price)}
                    </p>
                  )}
                  {service.priceType === 'RANGE' && (
                    <p className="text-base sm:text-lg font-bold text-accent">
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
                    <p className="text-base sm:text-lg font-bold text-accent">Thỏa thuận</p>
                  )}
                  {service.priceType === 'CONTACT' && (
                    <p className="text-base sm:text-lg font-bold text-accent">Liên hệ</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced CTA */}
        <div className="text-center">
          <Link href="/services">
            <Button size="lg" className="px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
              Xem tất cả dịch vụ
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">Hơn 20+ loại dịch vụ chuyên nghiệp</p>
        </div>
      </div>
    </section>
  );
}


