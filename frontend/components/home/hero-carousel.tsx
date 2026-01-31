'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Volume2, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Banner } from '@/lib/types';
import { cn, getMediaUrl } from '@/lib/utils';

interface HeroCarouselProps {
    banners: Banner[];
}

export function HeroCarousel({ banners }: HeroCarouselProps) {
    const [current, setCurrent] = useState(0);
    const [isAutoPlaying] = useState(true);
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fallback banners if API returns 404 or empty
    const defaultBanners: Banner[] = [
        {
            id: 'd1',
            title: 'Ông Hoàng Âm Thanh',
            subtitle: 'HIỆU SUẤT VƯỢT TRỘI',
            description: 'Trải nghiệm đỉnh cao âm thanh với hệ thống loa và amply hi-end từ những thương hiệu hàng đầu thế giới.',
            imageUrl: 'https://placehold.co/1920x1080/000000/FFFFFF/png?text=Master+Sound',
            linkUrl: '/catalog',
            page: 'home',
            position: 1,
            isActive: true,
            isDeleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'd2',
            title: 'Karaoke Thượng Lưu',
            subtitle: 'TRẢI NGHIỆM HOÀNG GIA',
            description: 'Giải pháp karaoke gia đình đẳng cấp, kết hợp hoàn hảo giữa công nghệ âm thanh tối tân và thiết kế sang trọng.',
            imageUrl: 'https://placehold.co/1920x1080/1a1a1a/c0a062/png?text=Luxury+Karaoke',
            linkUrl: '/catalog',
            page: 'home',
            position: 2,
            isActive: true,
            isDeleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'd3',
            title: 'Sức Mạnh Sân Khấu',
            subtitle: 'CHẤT LƯỢNG ĐỈNH CAO',
            description: 'Hệ thống âm thanh sân khấu chuyên nghiệp, bền bỉ, đáp ứng mọi quy mô sự kiện với hiệu suất không tưởng.',
            imageUrl: 'https://placehold.co/1920x1080/2a0a0a/ff0000/png?text=Pro+Stage',
            linkUrl: '/catalog',
            page: 'home',
            position: 3,
            isActive: true,
            isDeleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];

    const displayBanners = banners.length > 0 ? banners : defaultBanners;

    useEffect(() => {
        if (!isAutoPlaying || displayBanners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % displayBanners.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [isAutoPlaying, displayBanners.length]);

    if (!displayBanners.length) return null;

    return (
        <section className="relative h-[85vh] md:h-screen w-full overflow-hidden bg-background pt-16 md:pt-20 transition-colors duration-1000">
            {/* Background Ambience */}
            {/* Background Ambience removed for maximum image clarity */}

            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 h-full w-full"
                >
                    {/* Main Banner Image */}
                    <div className="absolute inset-0 select-none">
                        <Image
                            src={getMediaUrl(
                                mounted && resolvedTheme === 'dark' && displayBanners[current].darkImageUrl
                                    ? displayBanners[current].darkImageUrl
                                    : displayBanners[current].imageUrl
                            )}
                            alt={displayBanners[current].title}
                            fill
                            className="object-cover opacity-100 transition-opacity duration-1000"
                            priority={current === 0}
                            sizes="100vw"
                            quality={100}
                        />
                        {/* Overlays removed for clarity */}
                    </div>

                    {/* Content Overlay */}
                    <div className="container relative h-full mx-auto px-4 md:px-6 flex flex-col justify-center">
                        <div className="max-w-4xl space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="flex items-center gap-3"
                            >
                                <div className="h-0.5 w-12 bg-primary" />
                                <span className="text-xs md:text-sm font-black uppercase tracking-[0.4em] text-primary">
                                    {displayBanners[current].subtitle || 'Trải Nghiệm Âm Thanh Đẳng Cấp'}
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[9rem] font-black tracking-tight leading-[1.1] md:leading-[0.95] uppercase transition-colors duration-1000 flex flex-wrap gap-x-4 md:gap-x-8 gap-y-2"
                            >
                                {displayBanners[current].title.split(' ').map((word, i) => (
                                    <span key={i} className={cn(i % 2 === 0 ? "text-primary" : "text-hollow text-foreground opacity-90")}>
                                        {word}
                                    </span>
                                ))}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                                className="text-lg md:text-xl text-muted-foreground font-light max-w-xl leading-[1.6] transition-colors duration-1000"
                            >
                                {displayBanners[current].description || 'Khám phá thế giới âm thanh đẳng cấp với những thiết bị hàng đầu từ các thương hiệu danh tiếng.'}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9, duration: 0.8 }}
                                className="flex flex-col sm:flex-row items-center sm:items-center gap-4 md:gap-6 pt-4 md:pt-6"
                            >
                                <a
                                    href={displayBanners[current].linkUrl || '/catalog/products'}
                                    className="w-full sm:w-auto text-center group relative px-8 py-4 md:px-10 md:py-5 bg-primary text-foreground dark:text-white text-[10px] md:text-xs font-black uppercase tracking-widest overflow-hidden rounded-full transition-all hover:scale-105 active:scale-95"
                                >
                                    <span className="relative z-10">Khám phá ngay</span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                </a>

                                <div className="hidden sm:flex items-center gap-4 px-6 py-4 rounded-full border border-primary/10 backdrop-blur-md bg-background/40 transition-all duration-1000">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                                        <Volume2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest">
                                        <p className="text-foreground">Âm Thanh Trong Trẻo</p>
                                        <p className="text-muted-foreground">Trí Tuệ Thuần Khiết</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Decorative Floating Elements */}
            <div className="absolute top-1/2 left-10 -translate-y-1/2 hidden 2xl:flex flex-col gap-8 transition-opacity duration-1000">
                <div className="flex flex-col items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest rotate-90 translate-y-8 text-muted-foreground/30">Cuộn</span>
                    <div className="w-px h-32 bg-gradient-to-t from-primary/50 to-transparent" />
                </div>
            </div>

            {/* Controls & Mini Thumbnails */}
            <div className="absolute bottom-6 md:bottom-12 right-4 md:right-12 flex items-center gap-6 md:gap-12 z-20">
                <div className="hidden md:flex items-center gap-4">
                    {displayBanners.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className="group flex items-end gap-2"
                        >
                            <div className={cn(
                                "h-1 transition-all duration-700 rounded-full",
                                current === i ? "w-12 bg-primary" : "w-6 bg-muted/20 group-hover:bg-primary/30"
                            )} />
                            <span className={cn(
                                "text-[10px] font-black transition-colors duration-1000",
                                current === i ? "text-foreground" : "text-muted-foreground/30"
                            )}>0{i + 1}</span>
                        </button>
                    ))}
                </div>

                <div className="flex gap-2 scale-90 md:scale-100">
                    <button
                        onClick={() => setCurrent((prev) => (prev - 1 + displayBanners.length) % displayBanners.length)}
                        className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-foreground dark:text-foreground dark:text-white transition-all duration-300"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setCurrent((prev) => (prev + 1) % displayBanners.length)}
                        className="w-12 h-12 rounded-full bg-primary text-foreground dark:text-foreground dark:text-white flex items-center justify-center hover:bg-red-700 transition-all duration-300"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="absolute bottom-6 md:bottom-12 left-4 md:left-12 flex items-center gap-3 md:gap-4 z-20 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-default scale-75 md:scale-100 origin-left">
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">Tài Lộc Elite</span>
            </div>
        </section>
    );
}
