'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Service } from '@/lib/types';
import { parseImages, cn } from '@/lib/utils';
import { Clock, ArrowRight, Calendar } from 'lucide-react';

interface ServiceCardNewProps {
  service: Service;
}

export function ServiceCardNew({ service }: ServiceCardNewProps) {
  const [imageError, setImageError] = useState(false);

  const getServiceImage = () => {
    const images = parseImages(service.images);
    return images.length > 0 ? images[0] : '/placeholder-service.svg';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
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
    return 'Liên hệ';
  };

  const imageUrl = imageError ? '/placeholder-service.svg' : getServiceImage();

  return (
    <Card className={cn(
      "group flex flex-col h-full overflow-hidden",
      "bg-card border border-border/60",
      "rounded-xl transition-all duration-300",
      "hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5"
    )}>
      {/* Image */}
      <Link href={`/services/${service.slug}`} className="block relative aspect-[16/10] overflow-hidden">
        <Image
          src={imageUrl}
          alt={service.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
        
        {/* Service Type Badge */}
        <Badge className="absolute top-3 left-3 bg-background/90 text-foreground text-xs">
          {service.serviceType?.name || 'Dịch vụ'}
        </Badge>
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 space-y-3">
        {/* Title */}
        <Link href={`/services/${service.slug}`}>
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
            {service.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-muted-foreground text-sm line-clamp-2 flex-1">
          {service.shortDescription || service.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {service.duration || 60} phút
          </span>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-3">
          <span className="font-bold text-primary">
            {getPriceDisplay()}
          </span>
          <Link href={`/services/${service.slug}`}>
            <Button size="sm" variant="ghost" className="h-8 px-3 gap-1 text-xs">
              Chi tiết
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
