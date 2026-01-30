'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ServicesHeroProps {
 totalServices?: number;
}

export function ServicesHero({ totalServices = 0 }: ServicesHeroProps) {
 return (
 <section className="py-8 md:py-10 border-b border-border/50">
 <div className="container mx-auto px-4">
 <div className="max-w-2xl">
 <h1 className={cn(
 "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight",
 "bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
 )}>
 Dịch vụ của chúng tôi
 </h1>
 <p className="text-muted-foreground mt-2 text-sm sm:text-base">
 {totalServices > 0 ? `${totalServices} dịch vụ chuyên nghiệp về âm thanh`
 : 'Tư vấn, lắp đặt và bảo trì hệ thống âm thanh'
 }
 </p>
 </div>
 </div>
 </section>
 );
}
