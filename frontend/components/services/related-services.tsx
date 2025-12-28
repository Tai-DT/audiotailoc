'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Service } from '@/lib/types';
import { useServices } from '@/lib/hooks/use-api';
import { parseImages, cn } from '@/lib/utils';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RelatedServicesProps {
  currentServiceId: string;
  serviceTypeId?: string;
  limit?: number;
}

function RelatedServiceCard({ service, index }: { service: Service; index: number }) {
  const images = parseImages(service.images);
  const imageUrl = images.length > 0 ? images[0] : '/placeholder-service.svg';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/services/${service.slug}`}>
        <Card className={cn(
          "group relative overflow-hidden",
          "bg-card/60 backdrop-blur-md",
          "border border-border/50 hover:border-primary/30",
          "rounded-xl transition-all duration-300",
          "hover:-translate-y-1 hover:shadow-lg"
        )}>
          <div className="flex gap-4 p-3">
            {/* Image */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={imageUrl}
                alt={service.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {service.isFeatured && (
                <Badge className="absolute top-1 left-1 bg-amber-500/90 text-white text-[10px] px-1.5 py-0.5">
                  <Sparkles className="h-2.5 w-2.5" />
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {service.name}
              </h4>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{service.duration || 60} phút</span>
              </div>

              <div className="font-semibold text-sm text-primary">
                {service.price ? formatPrice(service.price) : 'Liên hệ'}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

function RelatedServiceSkeleton() {
  return (
    <Card className="p-3">
      <div className="flex gap-4">
        <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    </Card>
  );
}

export function RelatedServices({ currentServiceId, serviceTypeId, limit = 4 }: RelatedServicesProps) {
  const { data, isLoading } = useServices({
    typeId: serviceTypeId,
    pageSize: limit + 1, // Fetch one extra to account for current service
    page: 1
  });

  // Filter out current service
  const relatedServices = data?.items
    ?.filter(service => service.id !== currentServiceId)
    .slice(0, limit) || [];

  if (isLoading) {
    return (
      <section className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <RelatedServiceSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (relatedServices.length === 0) {
    return null;
  }

  return (
    <section className="py-12 border-t border-border/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Dịch vụ liên quan</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Các dịch vụ khác bạn có thể quan tâm
              </p>
            </div>
            <Link href="/services">
              <Button variant="ghost" className="gap-1.5 text-primary hover:text-primary/80">
                Xem tất cả
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Related Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedServices.map((service, index) => (
              <RelatedServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
