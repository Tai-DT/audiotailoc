/**
 * StaticHeroBanner - Zero-hydration hero banner for maximum performance
 * 
 * This component renders only the first banner as a static image with CSS-only effects.
 * It has ZERO JavaScript and does not require hydration, significantly reducing TBT.
 * 
 * Use this for homepage when LCP and TBT are critical.
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Banner } from '@/lib/types';

interface StaticHeroBannerProps {
  banner: Banner;
}

export function StaticHeroBanner({ banner }: StaticHeroBannerProps) {
  if (!banner) {
    return null;
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-xl">
      {/* Background Image - Priority loading for LCP */}
      <Image
        src={banner.imageUrl}
        alt={banner.title}
        fill
        className="object-cover"
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgIBAwQDAAAAAAAAAAAAAQIDBAAFESExBhJBYXGR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQEAAgMAAAAAAAAAAAAAAAABAAIDESH/2gAMAwEAAhEDEEA="
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Content - Pure CSS animations */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 sm:px-8 lg:px-12">
          <div className="animate-fade-in-up max-w-2xl space-y-6" style={{ animationDuration: '0.8s' }}>
            {/* Badge */}
            {banner.subtitle && (
              <div 
                className="inline-flex items-center gap-2 rounded-full bg-primary/20 backdrop-blur-sm px-4 py-2 text-sm text-white/90 border border-white/20 animate-fade-in-up"
                style={{ animationDelay: '0.1s', animationDuration: '0.6s' }}
              >
                <span className="text-yellow-400">⭐</span>
                {banner.subtitle}
              </div>
            )}

            {/* Title */}
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight animate-fade-in-up"
              style={{ animationDelay: '0.2s', animationDuration: '0.6s' }}
            >
              {banner.title}
            </h1>

            {/* Description */}
            {banner.description && (
              <p 
                className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed animate-fade-in-up"
                style={{ animationDelay: '0.3s', animationDuration: '0.6s' }}
              >
                {banner.description}
              </p>
            )}

            {/* CTA Button */}
            {banner.linkUrl && (
              <div 
                className="animate-fade-in-up"
                style={{ animationDelay: '0.4s', animationDuration: '0.6s' }}
              >
                <Link href={banner.linkUrl}>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-8 py-6 text-lg font-semibold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
                  >
                    {banner.buttonLabel || 'Xem ngay'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust indicators - CSS only */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 text-white/90 text-sm animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <span className="flex items-center gap-2" aria-label="Bảo hành chính hãng">
          <span className="text-yellow-400" aria-hidden="true">✓</span>
          Bảo hành chính hãng
        </span>
        <span className="flex items-center gap-2" aria-label="Giao hàng toàn quốc">
          <span className="text-yellow-400" aria-hidden="true">✓</span>
          Giao hàng toàn quốc
        </span>
        <span className="flex items-center gap-2 hidden md:flex" aria-label="Hỗ trợ 24/7">
          <span className="text-yellow-400" aria-hidden="true">✓</span>
          Hỗ trợ 24/7
        </span>
      </div>
    </div>
  );
}
