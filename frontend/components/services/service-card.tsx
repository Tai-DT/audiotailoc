'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Service } from '@/lib/types';
import { parseImages } from '@/lib/utils';
import { Clock, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { WatermarkedImage } from '@/components/ui/watermarked-image';

interface ServiceCardProps {
       service: Service;
       index?: number;
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
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
                     return `${formatPrice(service.minPrice)}`;
              }
              if (service.priceType === 'NEGOTIABLE') return 'Thỏa thuận';
              return 'Liên hệ';
       };

       const imageUrl = getServiceImage();

       return (
              <article
                     className="group relative flex h-full flex-col overflow-hidden red-elite-card"
                     style={{ animationDelay: `${index * 100}ms` }}
              >
                     {/* Visual Container */}
                     <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary/50 to-background dark:from-neutral-900/40 dark:to-black">
                            {/* Background Layer - Royal Texture */}
                            <div className="absolute inset-0 z-0">
                                   <div className="absolute inset-0 gold-royal-grain opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700" />
                                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.05)_0%,transparent_50%)] mix-blend-mode-overlay" />
                            </div>

                            {/* Dynamic Glow Effect on Hover */}
                            <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(180,140,50,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <Link href={`/services/${service.slug}`} className="block w-full h-full relative z-10">
                                   <WatermarkedImage
                                          src={imageUrl}
                                          alt={service.name}
                                          fill
                                          className="object-cover transition-all duration-1000 group-hover:scale-110 drop-shadow-2xl grayscale-[0.3] group-hover:grayscale-0 dark:grayscale-0"
                                          logoSize="sm"
                                          logoPosition="bottom-right"
                                   />
                                   {/* Subtle Gradient Fade */}
                                   <div className="absolute inset-0 cinematic-overlay" />
                            </Link>

                            {/* Elegant Tags */}
                            <div className="absolute top-6 left-6 z-10 flex flex-col gap-3">
                                   <Badge className="bg-primary text-foreground dark:text-white font-black text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded-lg shadow-xl border-none">
                                          <Zap className="w-3 h-3 mr-1.5" />
                                          {service.serviceType?.name || 'Dịch vụ'}
                                   </Badge>
                            </div>

                            {/* Floating Actions */}
                            <div className="absolute top-6 right-6 z-20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 translate-x-0 lg:translate-x-6 lg:group-hover:translate-x-0 transition-all duration-500 ease-out">
                                   <Link href={`/services/${service.slug}`}>
                                          <Button
                                                 variant="secondary"
                                                 size="icon"
                                                 className="h-11 w-11 rounded-2xl glass-panel text-foreground dark:text-white hover:bg-primary dark:hover:bg-accent hover:text-black transition-all shadow-xl hover:rotate-12"
                                                 title="Xem chi tiết"
                                          >
                                                 <ArrowRight size={20} />
                                          </Button>
                                   </Link>
                            </div>
                     </div>

                     {/* Content Area */}
                     <div className="p-7 flex-1 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 dark:to-primary/10 opacity-50 pointer-events-none" />

                            <div className="space-y-4 relative z-10">
                                   <div className="flex items-center gap-3">
                                          <span className="w-8 h-[2px] bg-primary/30 dark:bg-accent/30" />
                                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground dark:text-accent/80 truncate font-display">
                                                 Elite Services
                                          </span>
                                   </div>

                                   <Link href={`/services/${service.slug}`} className="block group/title">
                                          <h3 className="font-display font-black text-xl md:text-2xl text-foreground group-hover/title:text-primary transition-colors line-clamp-2 leading-[1.2] tracking-tight min-h-[2.4em] uppercase">
                                                 {service.name}
                                          </h3>
                                   </Link>

                                   <p className="text-muted-foreground/80 dark:text-zinc-300 text-sm font-medium italic leading-relaxed line-clamp-2">
                                          {service.shortDescription || service.description}
                                   </p>
                            </div>

                            <div className="space-y-8 pt-6 relative z-10">
                                   {/* Price Section */}
                                   <div className="flex items-end justify-between">
                                          <div className="flex flex-col">
                                                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground dark:text-zinc-400 mb-1.5 font-display">
                                                        {service.priceType === 'RANGE' ? 'Giá từ' : 'Phí dịch vụ'}
                                                 </span>
                                                 <span className="text-3xl md:text-4xl font-black text-primary tracking-tighter leading-none drop-shadow-sm font-display">
                                                        {getPriceDisplay()}
                                                 </span>
                                          </div>

                                          {service.duration && (
                                                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 dark:bg-white/5 border border-border dark:border-white/10">
                                                        <Clock size={12} className="text-primary" />
                                                        <span className="text-[10px] font-black text-foreground/80 dark:text-white/80 uppercase tracking-widest font-display">
                                                               {service.duration}P
                                                        </span>
                                                 </div>
                                          )}
                                   </div>

                                   <Link href={`/services/${service.slug}`} className="block">
                                          <Button
                                                 className="w-full h-14 red-elite-gradient hover:scale-[1.02] text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl transition-all duration-500 shadow-xl hover:shadow-primary/40 dark:hover:shadow-primary/60 border border-primary/20 group/btn active:scale-95 relative overflow-hidden"
                                          >
                                                 <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                                                 <Sparkles size={20} className="mr-3 transition-transform group-hover/btn:scale-110 relative z-10" />
                                                 <span className="relative z-10">Đăng ký ngay</span>
                                          </Button>
                                   </Link>
                            </div>
                     </div>
              </article>
       );
}
