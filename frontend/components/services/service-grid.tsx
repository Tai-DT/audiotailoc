'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Service } from '@/lib/types';
import { Clock, Users } from 'lucide-react';

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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
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
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {service.name}
          </CardTitle>
          <Badge variant="secondary">
            {service.serviceType?.name || 'Dịch vụ'}
          </Badge>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{service.duration} phút</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>Dịch vụ chuyên nghiệp</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {service.description}
        </p>

        <div className="space-y-2">
          {service.price && service.priceType === 'FIXED' && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Giá:</span>
              <span className="font-semibold text-primary">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(service.price)}
              </span>
            </div>
          )}

          {service.priceType === 'RANGE' && service.minPrice && service.maxPrice && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Giá:</span>
              <span className="font-semibold text-primary">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(service.minPrice)} - {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(service.maxPrice)}
              </span>
            </div>
          )}

          {service.priceType === 'NEGOTIABLE' && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Giá:</span>
              <span className="font-semibold text-primary">Thỏa thuận</span>
            </div>
          )}

          {service.priceType === 'CONTACT' && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Giá:</span>
              <span className="font-semibold text-primary">Liên hệ</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link href={`/services/${service.slug}`} className="flex-1">
          <Button variant="outline" className="w-full">
            Xem chi tiết
          </Button>
        </Link>
        <Link href={`/services/${service.slug}?action=book`} className="flex-1">
          <Button className="w-full">
            Đặt lịch
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}