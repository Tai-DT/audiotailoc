'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Speaker, Mic, Headphones, Zap, Settings, Music, Sparkles, MonitorPlay, TabletSmartphone } from 'lucide-react';

import { motion } from 'framer-motion';
import { cn, getMediaUrl } from '@/lib/utils';
import { EliteSectionHeading } from '@/components/ui/elite-section-heading';

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
}

interface CategoriesSectionProps {
    categories: Category[];
}

// Icon mapping for categories
const categoryIcons: Record<string, React.ReactNode> = {
    'loa-karaoke': <Speaker className="w-7 h-7" />,
    'amply-cuc-day': <Zap className="w-7 h-7" />,
    'microphone': <Mic className="w-7 h-7" />,
    'vang-so-mixer': <Settings className="w-7 h-7" />,
    'dan-karaoke': <Music className="w-7 h-7" />,
    'loa-sub': <Headphones className="w-7 h-7" />,
    'dau-karaoke': <MonitorPlay className="w-7 h-7" />,
    'man-hinh-chon-bai': <TabletSmartphone className="w-7 h-7" />,
};

export function CategoriesSection({ categories }: CategoriesSectionProps) {
    // Use categories from props directly
    const displayCategories = categories || [];

    if (displayCategories.length === 0) {
        return null;
    }

    return (
        <section className="py-10 md:py-20 relative overflow-hidden bg-background">
            {/* Background Aesthetic Layers */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(180,140,50,0.03),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(220,38,38,0.03),transparent_40%)]" />
            <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-end justify-between gap-4 mb-8 md:mb-14">
                    <EliteSectionHeading
                        badge="Danh mục Elite"
                        title="Âm Thanh Thượng Lưu"
                        subtitle="Phân loại tinh hoa theo nhu cầu, mang đến giải pháp âm thanh cá nhân hóa cho từng không gian sống."
                        className="mb-0"
                    />
                    <Link href="/categories" className="pb-4">
                        <button className="w-full sm:w-auto elite-button px-6 py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-primary text-foreground dark:text-foreground dark:text-white hover:scale-105 transition-all">
                            Tất cả bộ sưu tập
                        </button>
                    </Link>
                </div>

                {/* Categories Bento Grid */}
                {/* Dynamic Grid for all categories */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {displayCategories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="h-[180px] sm:h-[200px] md:h-[300px]"
                        >
                            <CategoryCard
                                category={category}
                                className="h-full"
                            // Make the first item slightly distinct if desired, otherwise standard
                            // isLarge={index === 0} 
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

interface CategoryCardProps {
    category: Category;
    className?: string;
    isLarge?: boolean;
    isSmall?: boolean;
}

function CategoryCard({ category, className, isLarge, isSmall }: CategoryCardProps) {
    const icon = categoryIcons[category.slug] || <Speaker className="w-8 h-8" />;
    const imageUrl = category.imageUrl ? getMediaUrl(category.imageUrl) : null;

    return (
        <Link href={`/products?category=${category.slug}`} className={cn("block group h-full", className)}>
            <div className="relative h-full rounded-2xl md:rounded-[3rem] overflow-hidden red-elite-card border border-white/5 dark:border-white/10">
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={category.name}
                            fill
                            className="object-cover transition-transform duration-[3000ms] group-hover:scale-110 opacity-100"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 to-background dark:from-neutral-900/60 dark:to-black opacity-60" />
                    )}
                    {/* Atmospheric Overlays removed for clarity */}
                </div>

                {/* Grid Lining - Technical Aesthetic */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-5 pointer-events-none z-0">
                    <div className="grid grid-cols-4 h-full">
                        <div className="border-r border-white" />
                        <div className="border-r border-white" />
                        <div className="border-r border-white" />
                    </div>
                </div>

                {/* Content Overlay */}
                <div className={cn(
                    "relative z-10 h-full flex flex-col justify-between",
                    isLarge ? "p-10 md:p-12" : isSmall ? "p-3 md:p-6" : "p-4 md:p-8"
                )}>
                    {/* Top Row */}
                    <div className="flex items-start justify-between">
                        <div className={cn(
                            "rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-yellow-400 dark:text-yellow-300 shadow-2xl transition-all duration-700",
                            "group-hover:scale-110 group-hover:bg-yellow-400 dark:group-hover:bg-yellow-300 group-hover:text-black group-hover:rotate-6",
                            isLarge ? "w-20 h-20" : isSmall ? "w-8 h-8 md:w-12 md:h-12" : "w-10 h-10 md:w-16 md:h-16"
                        )}>
                            {React.cloneElement(icon as React.ReactElement, {
                                className: isLarge ? "w-10 h-10" : isSmall ? "w-4 h-4 md:w-6 md:h-6" : "w-5 h-5 md:w-8 md:h-8"
                            })}
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 delay-100">
                            <div className="px-5 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-[9px] font-black uppercase tracking-[0.3em] text-yellow-400 backdrop-blur-md">
                                Xem ngay
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className={cn("space-y-3", isSmall ? "space-y-2" : "space-y-3")}>
                        <div className="flex items-center gap-3">
                            <span className={cn(
                                "h-[2px] bg-yellow-400/40 transition-all duration-700",
                                isLarge ? "w-16 group-hover:w-24" : "w-10 group-hover:w-16"
                            )} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400 font-display">Audio Elite</span>
                        </div>

                        <h3 className={cn(
                            "font-black text-yellow-400 drop-shadow-sm group-hover:text-yellow-300 transition-colors duration-500 leading-none font-display tracking-tighter",
                            isLarge ? "text-3xl md:text-5xl" : isSmall ? "text-base md:text-xl" : "text-lg md:text-3xl"
                        )}>
                            {category.name}
                        </h3>

                        {/* Hidden on mobile to reduce clutter */}
                        {!isSmall && category.description && (
                            <p className={cn(
                                "hidden md:line-clamp-2 text-yellow-200/80 drop-shadow-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity leading-relaxed max-w-sm",
                                isLarge ? "text-base md:text-lg" : "text-sm"
                            )}>
                                {category.description}
                            </p>
                        )}

                        <div className="pt-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-yellow-400/80 group-hover:text-yellow-300 transition-colors font-display drop-shadow-sm">
                            <span className="relative">
                                Khám phá tinh hoa
                                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-yellow-400 transition-all duration-500 group-hover:w-full" />
                            </span>
                            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-all duration-700 text-yellow-400" />
                        </div>
                    </div>
                </div>

                {/* Decorative Elite Symbol */}
                {isLarge && (
                    <div className="absolute -bottom-12 -right-12 w-48 h-48 border border-white/5 rounded-full flex items-center justify-center opacity-20 pointer-events-none group-hover:scale-150 transition-transform duration-[3000ms]">
                        <Sparkles className="w-24 h-24 text-accent/20" />
                    </div>
                )}
            </div>
        </Link>
    );
}
