'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useBanners } from '@/lib/hooks/use-banners';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { BlurFade } from '@/components/ui/blur-fade';
import { cn } from '@/lib/utils';

export function BannerCarousel() {
  const { data: banners, isLoading } = useBanners({ page: 'home', activeOnly: true });
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Custom Autoplay
  useEffect(() => {
    if (!api) return;
    
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => clearInterval(intervalId);
  }, [api]);

  const activeBanners = banners || [];

  if (isLoading) {
    return (
      <div className="w-full h-[500px] bg-muted animate-pulse rounded-xl" />
    );
  }

  if (activeBanners.length === 0) {
    return null; 
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {activeBanners.map((banner, index) => (
            <CarouselItem key={banner.id} className="relative h-[500px] md:h-[600px] w-full">
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
                <div className="max-w-2xl space-y-6 pl-4 md:pl-12">
                  {banner.subtitle && (
                    <BlurFade delay={0.1}>
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                        <span>{banner.subtitle}</span>
                      </div>
                    </BlurFade>
                  )}

                  <BlurFade delay={0.2}>
                    <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                      {banner.title}
                    </h2>
                  </BlurFade>

                  {banner.description && (
                    <BlurFade delay={0.3}>
                      <p className="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed">
                        {banner.description}
                      </p>
                    </BlurFade>
                  )}

                  <BlurFade delay={0.4}>
                    <div className="flex flex-wrap gap-4 pt-4">
                      <Button 
                        size="lg" 
                        className="bg-primary hover:bg-primary/90 text-white border-none h-12 px-8 text-base"
                        asChild
                      >
                        <Link href={banner.linkUrl || '/products'}>
                          Xem chi tiết <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-12 px-8 text-base backdrop-blur-sm"
                        asChild
                      >
                        <Link href="/contact">
                          Liên hệ ngay
                        </Link>
                      </Button>
                    </div>
                  </BlurFade>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="absolute bottom-8 right-8 flex gap-2 z-20 hidden md:flex">
          <CarouselPrevious className="static translate-y-0 bg-white/10 hover:bg-white/20 border-white/20 text-white" />
          <CarouselNext className="static translate-y-0 bg-white/10 hover:bg-white/20 border-white/20 text-white" />
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                current === index ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
              )}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}
