'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Wrench, Settings, Search, Clock, CheckCircle2, Sparkles, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlurFade } from '@/components/ui/blur-fade';
import { useContactInfo } from '@/lib/hooks/use-contact-info';
import { parseImages } from '@/lib/utils';

interface Service {
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    shortDescription?: string | null;
    price?: number;
    basePriceCents?: number;
    duration?: number;
    isFeatured?: boolean;
    images?: string[] | null;
    type?: {
        id: string;
        name: string;
        slug: string;
        icon?: string;
        color?: string;
    } | null;
    features?: string[] | null;
}

interface ServicesSectionProps {
    services: Service[];
}

// Icon mapping
const serviceIcons: Record<string, React.ReactNode> = {
    'Wrench': <Wrench className="w-6 h-6" />,
    'Settings': <Settings className="w-6 h-6" />,
    'Search': <Search className="w-6 h-6" />,
};

export function ServicesSection({ services }: ServicesSectionProps) {
    const { data: contactInfo } = useContactInfo();
    const hotlineNumber = contactInfo?.phone?.hotline
        || contactInfo?.phone?.display?.replace(/\s+/g, '')
        || '';
    const hotlineDisplay = contactInfo?.phone?.display || contactInfo?.phone?.hotline || '';

    // Filter active and featured services
    const displayServices = services
        .filter(s => !s.name.toLowerCase().includes('test'))
        .slice(0, 4);

    if (displayServices.length === 0) return null;

    return (
        <section className="py-10 md:py-20 relative overflow-hidden bg-background">
            {/* Background Aesthetic Layers */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,38,0.02),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(220,38,38,0.03),transparent_40%)]" />
            <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <BlurFade delay={0.1} inView>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 md:mb-10">
                        <div className="space-y-6">
                            <div className="section-badge group">
                                <Sparkles className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform" />
                                <span>Dịch vụ kỹ thuật chuyên sâu</span>
                            </div>

                            <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-[1.05] md:leading-[0.85] font-display">
                                Dịch vụ <br />
                                <span className="premium-text-gradient italic">
                                    Âm Thanh Red Elite
                                </span>
                            </h2>

                            <p className="text-sm sm:text-base md:text-xl text-muted-foreground dark:text-zinc-300 max-w-xl font-medium leading-relaxed italic border-l-4 border-primary/30 pl-4 md:pl-8">
                                Đội ngũ kỹ thuật viên tinh hoa, sẵn sàng mang đến trải nghiệm âm thanh hoàn hảo nhất cho không gian của bạn.
                            </p>
                        </div>

                        <Link href="/services" className="h-fit">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-10 border-primary/20 text-foreground hover:bg-primary hover:text-foreground dark:text-foreground dark:text-white dark:hover:bg-red-600 gap-3 rounded-2xl font-display text-xs tracking-[0.14em] font-semibold transition-all duration-300"
                            >
                                Khám phá tinh hoa
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </BlurFade>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {displayServices.map((service, index) => (
                        <BlurFade key={service.id} delay={0.15 + index * 0.05} inView>
                            <ServiceCard service={service} index={index} />
                        </BlurFade>
                    ))}
                </div>

                {/* Quick Contact CTA */}
                <BlurFade delay={0.4} inView>
                    <div className="mt-8 md:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] glass-panel border border-border dark:border-white/10 shadow-2xl relative overflow-hidden group/cta">
                        <div className="absolute inset-0 gold-royal-grain opacity-5 group-hover/cta:opacity-10 transition-opacity" />

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <Phone className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-semibold tracking-wide text-muted-foreground dark:text-zinc-400 font-display">Tư vấn khẩn cấp</p>
                                <p className="text-foreground font-black text-sm font-display">Sẵn sàng 24/7 cho mọi yêu cầu</p>
                            </div>
                        </div>

                        <div className="h-10 w-[1px] bg-border dark:bg-white/10 hidden sm:block relative z-10" />

                        <a href={`tel:${hotlineNumber}`} className="relative z-10">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto red-elite-gradient hover:scale-105 text-foreground dark:text-foreground dark:text-white gap-3 shadow-xl shadow-primary/20 rounded-2xl h-12 md:h-14 px-6 md:px-10 font-display font-semibold tracking-[0.14em] text-xs active:scale-[0.98] transition-all duration-300"
                            >
                                <Phone className="w-5 h-5" />
                                {hotlineDisplay}
                            </Button>
                        </a>
                    </div>
                </BlurFade>
            </div>
        </section>
    );
}

interface ServiceCardProps {
    service: Service;
    index: number;
}

function ServiceCard({ service }: ServiceCardProps) {
    const icon = serviceIcons[service.type?.icon || 'Wrench'] || <Wrench className="w-6 h-6" />;
    const images = parseImages(service.images);
    const featuredImage = images.length > 0 ? images[0] : null;

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(value);
    };

    const price = service.price || (service.basePriceCents ? service.basePriceCents : 0);

    return (
        <Link href={`/services/${service.slug}`} className="block h-full">
            <article
                className="group relative h-full flex flex-col overflow-hidden red-elite-card min-h-[420px]"
            >
                {/* Background Visuals */}
                <div className="absolute inset-0 z-0">
                    {featuredImage ? (
                        <>
                            <Image
                                src={featuredImage}
                                alt={service.name}
                                fill
                                className="object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                    )}
                    <div className="absolute inset-0 gold-royal-grain opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.05)_0%,transparent_50%)] mix-blend-mode-overlay" />
                </div>

                {/* Accent Line */}
                <div className="absolute top-0 left-0 w-full h-1 red-elite-gradient opacity-0 group-hover:opacity-100 transition-opacity z-20" />

                {/* Content */}
                <div className="relative p-5 md:p-10 h-full flex flex-col z-10">
                    {/* Icon */}
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 bg-secondary dark:bg-white/5 text-primary border border-border dark:border-white/10 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-xl">
                        {React.cloneElement(icon as React.ReactElement, { size: 24 })}
                    </div>

                    {/* Category/Type Badge */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-6 h-[2px] bg-primary/30" />
                        <span className="text-[10px] font-semibold tracking-[0.14em] text-primary/80 font-display">
                            {service.type?.name || 'Elite Service'}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-3xl font-black text-foreground mb-3 md:mb-4 group-hover:text-primary transition-colors font-display tracking-tight leading-[1.1]">
                        {service.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs md:text-sm text-foreground/80 dark:text-zinc-300 line-clamp-3 mb-6 md:mb-8 flex-grow leading-relaxed font-medium italic">
                        {service.shortDescription || service.description}
                    </p>

                    {/* Features (compact) */}
                    {service.features && service.features.length > 0 && (
                        <div className="flex flex-wrap gap-2.5 mb-8">
                            {service.features.slice(0, 2).map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-[9px] text-foreground/70 dark:text-white/70 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                    <CheckCircle2 className="w-3 h-3 text-primary" />
                                    <span className="font-semibold tracking-wide font-display">{feature}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Price & Duration */}
                    <div className="pt-8 border-t border-white/10 flex items-center justify-between mt-auto">
                        <div>
                            <div className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground dark:text-zinc-400 mb-1.5 font-display">Tư vấn từ</div>
                            <div className="text-2xl md:text-3xl font-black text-primary tracking-tighter font-display leading-none">
                                {price > 0 ? formatPrice(price) : 'Báo giá tinh hoa'}
                            </div>
                        </div>

                        {service.duration && (
                            <div className="flex items-center gap-2 text-primary text-[10px] font-black font-display bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                <Clock className="w-4 h-4" />
                                <span>{service.duration}P</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Glow */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </article>
        </Link>
    );
}
