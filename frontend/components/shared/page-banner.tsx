
'use client';

import React from 'react';
import Image from 'next/image';
import { useBanners } from '@/lib/hooks/use-banners';
import { BlurFade } from '@/components/ui/blur-fade';
import { cn, getMediaUrl } from '@/lib/utils';

interface PageBannerProps {
 page: string;
 fallbackTitle: string;
 fallbackSubtitle?: string;
 className?: string;
}

export function PageBanner({ page, fallbackTitle, fallbackSubtitle, className }: PageBannerProps) {
 const { data: banners, isLoading } = useBanners({ page, activeOnly: true });

 const activeBanner = banners && banners.length > 0 ? banners[0] : null;
 const bannerImageUrl = activeBanner?.imageUrl?.trim()
 ? getMediaUrl(activeBanner.imageUrl)
 : null;

 if (isLoading) {
 return <div className={cn("w-full h-[300px] md:h-[400px] bg-muted animate-pulse", className)} />;
 }

 if (!activeBanner) {
 return (
 <div className={cn("bg-gradient-to-b from-primary/5 to-background border-b", className)}>
 <div className="container mx-auto px-4 py-12">
 <BlurFade delay={0.1}>
 <h1 className="text-3xl md:text-5xl font-bold mb-4">{fallbackTitle}</h1>
 {fallbackSubtitle && <p className="text-muted-foreground text-lg">{fallbackSubtitle}</p>}
 </BlurFade>
 </div>
 </div>
 );
 }

 return (
 <div className={cn("relative w-full h-[300px] md:h-[400px] overflow-hidden", className)}>
 {/* Background Image */}
 <div className="absolute inset-0 w-full h-full">
 {bannerImageUrl ? (
 <Image
 src={bannerImageUrl}
 alt={activeBanner.title}
 fill
 className="object-cover"
 priority
 />
 ) : (
 <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black" />
 )}
 {/* Overlay */}
 <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
 </div>

 {/* Content */}
 <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
 <div className="max-w-2xl space-y-4">
 {activeBanner.subtitle && (
 <BlurFade delay={0.1}>
 <span className="inline-block text-primary-foreground/90 font-medium px-3 py-1 bg-primary/20 backdrop-blur-sm rounded-md border border-white/10 text-sm">
 {activeBanner.subtitle}
 </span>
 </BlurFade>
 )}

 <BlurFade delay={0.2}>
 <h1 className="text-3xl md:text-5xl font-bold text-foreground dark:text-white leading-tight">
 {activeBanner.title}
 </h1>
 </BlurFade>

 {activeBanner.description && (
 <BlurFade delay={0.3}>
 <p className="text-foreground/80 dark:text-white/80 text-base md:text-lg max-w-xl line-clamp-2">
 {activeBanner.description}
 </p>
 </BlurFade>
 )}
 </div>
 </div>
 </div>
 );
}
