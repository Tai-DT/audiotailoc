'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Service } from '@/lib/types';
import { parseImages } from '@/lib/utils';
import { Clock, Users, ArrowRight, Star, Wrench, Calendar } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';

interface ServiceGridProps {
  services: Service[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function ServiceGrid({
  services,
  isLoading,
  totalPages,
  currentPage,
  onPageChange
}: ServiceGridProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔧</div>
        <h3 className="text-xl font-semibold mb-2">Không tìm thấy dịch vụ</h3>
        <p className="text-muted-foreground">
          Hiện tại chưa có dịch vụ nào phù hợp với tiêu chí tìm kiếm của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Dịch vụ ({services.length})
        </h2>
        <div className="text-sm text-muted-foreground">
          Trang {currentPage} / {totalPages}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {services.map((service, index) => (
          <BlurFade key={service.id} delay={0.05 * index} inView>
            <ServiceCard service={service} />
          </BlurFade>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Trước
          </Button>

          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const page = i + Math.max(1, currentPage - 2);
            if (page > totalPages) return null;

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            );
          })}

          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}

interface ServiceCardProps {
  service: Service;
}

function ServiceCard({ service }: ServiceCardProps) {
  // Get the service image
  const getServiceImage = () => {
    const images = parseImages(service.images);
    return images.length > 0 ? images[0] : '/placeholder-service.svg';
  };

  // Format price display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getPriceDisplay = () => {
    if (service.price && service.priceType === 'FIXED') {
      return formatPrice(service.price);
    }
    if (service.priceType === 'RANGE' && service.minPrice && service.maxPrice) {
      return `${formatPrice(service.minPrice)} - ${formatPrice(service.maxPrice)}`;
    }
    if (service.priceType === 'NEGOTIABLE') return 'Thỏa thuận';
    if (service.priceType === 'CONTACT') return 'Liên hệ';
    return 'Liên hệ';
  };

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80 backdrop-blur-md ring-1 ring-border/30 shadow-[0_30px_100px_-70px_rgba(0,0,0,0.75)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_40px_120px_-70px_rgba(0,0,0,0.85)]">
      {/* Service Image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 h-40 sm:h-48">
        <Link href={`/services/${service.slug}`} className="relative block w-full h-full">
          <Image
            src={getServiceImage()}
            alt={service.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-all duration-700 group-hover:scale-[1.03] group-hover:brightness-[1.05]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-service.svg';
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </Link>

        {/* Service Type Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-gradient-primary text-primary-foreground shadow-lg text-[10px] sm:text-xs">
            <Wrench className="h-3 w-3 mr-1" />
            {service.serviceType?.name || 'Dịch vụ'}
          </Badge>
        </div>

        {/* Featured Badge */}
        {service.isFeatured && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-tertiary text-tertiary-foreground shadow-lg text-[10px] sm:text-xs">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Nổi bật
            </Badge>
          </div>
        )}

        {/* Quick book button overlay */}
        <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link href={`/services/${service.slug}?action=book`}>
            <Button size="sm" className="bg-primary/90 backdrop-blur-sm hover:bg-primary text-xs shadow-lg">
              <Calendar className="h-3 w-3 mr-1" />
              Đặt lịch
            </Button>
          </Link>
        </div>
      </div>

      {/* Service Info */}
      <CardContent className="flex-1 p-4 sm:p-5 space-y-3">
        {/* Title */}
        <Link href={`/services/${service.slug}`}>
          <h3 className="font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
            {service.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 leading-relaxed">
          {service.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>{service.duration} phút</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-accent" />
            <span>Chuyên nghiệp</span>
          </div>
        </div>

        {/* Price */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Giá dịch vụ:</span>
            <span className="font-bold text-primary text-sm sm:text-base">
              {getPriceDisplay()}
            </span>
          </div>
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="p-4 sm:p-5 pt-0 flex gap-2">
        <Link href={`/services/${service.slug}`} className="flex-1">
          <Button variant="outline" className="w-full text-xs sm:text-sm h-9 sm:h-10 group/btn">
            Xem chi tiết
            <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
        <Link href={`/services/${service.slug}?action=book`} className="flex-1">
          <Button className="w-full bg-gradient-primary hover:opacity-90 text-xs sm:text-sm h-9 sm:h-10 group/btn">
            <Calendar className="h-3.5 w-3.5 mr-1 transition-transform group-hover/btn:scale-110" />
            Đặt lịch
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}