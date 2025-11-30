'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useBanners } from '@/lib/hooks/use-banners';

interface HeroStat {
  label: string;
  value: string;
  description: string;
}

export function Hero() {
  const { data: banners, isLoading } = useBanners({ page: 'home', activeOnly: true });
  const banner = banners?.[0];

  const title = banner?.title ?? 'Thiết bị âm thanh chất lượng cao';
  const subtitle = banner?.subtitle ?? 'Giải pháp âm thanh toàn diện cho doanh nghiệp của bạn';
  const description =
    banner?.description ??
    'Chuyên cung cấp thiết bị âm thanh chuyên nghiệp, dịch vụ kỹ thuật và giải pháp âm thanh toàn diện cho mọi nhu cầu.';
  const primaryLabel = banner?.buttonLabel ?? 'Khám phá sản phẩm';
  const primaryHref = banner?.linkUrl ?? '/products';
  const secondaryLabel = banner?.secondaryButtonLabel ?? 'Xem dịch vụ';
  const secondaryHref = banner?.secondaryButtonUrl ?? '/services';
  const stats: HeroStat[] = (() => {
    if (banner?.stats) {
      try {
        const parsedStats = typeof banner.stats === 'string'
          ? JSON.parse(banner.stats)
          : banner.stats;
        return Array.isArray(parsedStats) ? parsedStats : [];
      } catch {
        return [];
      }
    }
    return [
      {
        label: 'Sản phẩm',
        value: '500+',
        description: 'Đa dạng thiết bị âm thanh chuyên nghiệp'
      },
      {
        label: 'Khách hàng',
        value: '1000+',
        description: 'Đối tác tin tưởng và đồng hành'
      },
      {
        label: 'Kinh nghiệm',
        value: '5+ năm',
        description: 'Thiết kế và thi công giải pháp âm thanh'
      }
    ];
  })();

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-16 w-full max-w-xl" />
              <Skeleton className="h-12 w-full max-w-2xl" />
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-12 w-full sm:w-40" />
                <Skeleton className="h-12 w-full sm:w-32" />
              </div>
              <div className="grid grid-cols-3 gap-8 pt-8">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            </div>
            <Skeleton className="h-[320px] w-full rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="absolute inset-0 pointer-events-none">
        {banner?.imageUrl && (
          <div className="relative w-full h-full">
            <Image
              src={banner.imageUrl}
              alt={banner.title ?? 'Audio Tài Lộc'}
              fill
              priority
              className="object-cover opacity-30"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/80" />
      </div>

      <div className="relative container mx-auto px-4 py-16 lg:py-28">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1 text-sm font-medium text-primary border-primary/30 backdrop-blur">
                <Sparkles className="h-4 w-4" />
                {subtitle}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                {title}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                {description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={primaryHref}>
                <Button size="lg" className="w-full sm:w-auto">
                  {primaryLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href={secondaryHref}>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <Play className="mr-2 h-4 w-4" />
                  {secondaryLabel}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border bg-background/80 backdrop-blur-sm p-5 text-center shadow-sm">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm font-medium text-foreground mt-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Hơn 98% khách hàng hài lòng với dịch vụ của Audio Tài Lộc
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-square rounded-[28px] bg-gradient-to-br from-primary/15 via-secondary/10 to-background p-5 overflow-hidden shadow-lg">
              {banner?.imageUrl ? (
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title ?? 'Audio Tài Lộc banner'}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="h-full w-full rounded-xl bg-background/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Hệ thống âm thanh</h3>
                    <p className="text-sm text-muted-foreground">
                      Chuyên nghiệp & Chất lượng cao
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-background/95 border shadow-xl rounded-2xl p-4 min-w-[180px] flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <ChevronRight className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">Hỗ trợ 24/7</div>
                <div className="text-xs text-muted-foreground">Đội ngũ kỹ thuật viên luôn sẵn sàng</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


