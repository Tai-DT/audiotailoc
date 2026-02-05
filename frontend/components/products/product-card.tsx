'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Download, Eye, Heart, ShoppingCart } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/types';
import { parseImages } from '@/lib/utils';
import { useIsInWishlist, useToggleWishlist } from '@/lib/hooks/use-wishlist';
import { cn, formatPrice } from '@/lib/utils';
import { WatermarkedImage } from '@/components/ui/watermarked-image';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (productId: string) => void;
    onViewProduct?: (productSlug: string) => void;
    /** Base path for product detail links (e.g. /products, /software) */
    basePath?: string;
    /** When true, image loads with higher priority (for above-the-fold products) */
    priority?: boolean;
    /** Index for staggered animations */
    index?: number;
}

export function ProductCard({
    product,
    onAddToCart,
    onViewProduct,
    basePath = '/products',
    priority = false,
    index = 0,
}: ProductCardProps) {
    const router = useRouter();
    const { data: isInWishlistData } = useIsInWishlist(product.id);
    const { toggleWishlist, isLoading: isWishlistLoading } = useToggleWishlist();
    const isInWishlist = isInWishlistData?.isInWishlist || false;

    const handleViewProduct = () => {
        if (onViewProduct) {
            onViewProduct(product.slug);
        } else {
            router.push(`${normalizedBasePath}/${product.slug}`);
        }
    };



    const calculateDiscount = () => {
        if (product.originalPriceCents && product.originalPriceCents > product.priceCents) {
            const discount = ((product.originalPriceCents - product.priceCents) / product.originalPriceCents) * 100;
            return Math.round(discount);
        }
        return 0;
    };

    const discount = calculateDiscount();
    const isOutOfStock = product.stockQuantity === 0;
    const isDigitalProduct = Boolean(product.isDigital);
    const normalizedBasePath = basePath.startsWith('/') ? basePath.replace(/\/$/, '') : `/${basePath.replace(/\/$/, '')}`;
    const productHref = `${normalizedBasePath}/${product.slug}`;
    const hasAddToCart = typeof onAddToCart === 'function';

    const getProductImage = () => {
        const images = parseImages(product.images, product.imageUrl);
        return images.length > 0 ? images[0] : '/placeholder-product.svg';
    };

    return (
        <article
            className="group relative flex h-full flex-col overflow-hidden red-elite-card"
            aria-label={`Sản phẩm: ${product.name}`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Visual Container */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary/30 to-background dark:from-neutral-800/20 dark:to-neutral-900/40">
                {/* Background Layer - Royal Texture */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 gold-royal-grain opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.05)_0%,transparent_50%)] mix-blend-mode-overlay" />
                </div>

                {/* Dynamic Glow Effect on Hover */}
                <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(180,140,50,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <Link href={productHref} className="block w-full h-full relative z-10">
                    <WatermarkedImage
                        src={getProductImage()}
                        alt={product.name}
                        fill
                        className="object-contain p-2 sm:p-4 md:p-8 transition-all duration-700 group-hover:scale-105 group-hover:-rotate-1 drop-shadow-2xl grayscale-[0.3] group-hover:grayscale-0 dark:grayscale-0"
                        priority={priority}
                        logoSize="sm"
                        logoPosition="bottom-right"
                    />
                    {/* Subtle Gradient Fade */}
                    <div className="absolute inset-0 cinematic-overlay" />
                </Link>

                {/* Elegant Tags - Compact on mobile */}
                <div className="absolute top-1.5 left-1.5 md:top-6 md:left-6 z-10 flex flex-col gap-1 md:gap-3">
                    {product.featured && (
                        <Badge className="bg-primary text-foreground dark:text-white font-black text-[7px] md:text-[10px] uppercase tracking-[0.15em] px-1.5 py-0.5 md:px-4 md:py-2 rounded md:rounded-lg shadow-xl border-none">
                            Nổi bật
                        </Badge>
                    )}
                    {discount > 0 && (
                        <Badge className="bg-gradient-to-r from-red-600 to-red-500 text-white font-black text-[7px] md:text-[10px] uppercase tracking-[0.15em] px-1.5 py-0.5 md:px-4 md:py-2 rounded md:rounded-lg shadow-xl border-none">
                            -{discount}%
                        </Badge>
                    )}
                </div>

                {/* Floating Actions - Bottom right on mobile, top right on desktop */}
                <div className="absolute bottom-2 right-2 md:top-6 md:right-6 md:bottom-auto z-20 flex flex-row md:flex-col gap-1.5 md:gap-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 translate-x-0 lg:translate-x-6 lg:group-hover:translate-x-0 transition-all duration-500 ease-out">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7 md:h-11 md:w-11 rounded-lg md:rounded-2xl glass-panel text-foreground dark:text-white hover:bg-primary dark:hover:bg-accent hover:text-foreground dark:text-white dark:hover:text-black transition-all shadow-xl hover:rotate-12"
                        onClick={handleViewProduct}
                        title="Xem nhanh"
                    >
                        <Eye size={14} className="md:size-5" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        className={cn(
                            "h-7 w-7 md:h-11 md:w-11 rounded-lg md:rounded-2xl glass-panel text-foreground dark:text-white transition-all shadow-xl hover:-rotate-12",
                            isInWishlist ? "text-primary dark:text-accent border-primary/50 dark:border-accent/50 bg-primary/5 dark:bg-accent/5" : "hover:text-primary dark:hover:text-accent"
                        )}
                        onClick={() => toggleWishlist(product.id, isInWishlist)}
                        disabled={isWishlistLoading}
                        title="Thêm vào yêu thích"
                    >
                        <Heart size={14} className={cn("md:size-5", isInWishlist ? "fill-current" : "")} />
                    </Button>
                </div>
            </div>

            {/* Content Area - Optimized for spacing */}
            <CardContent className="p-4 md:p-7 flex-1 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 dark:to-primary/10 opacity-50 pointer-events-none" />

                <div className="space-y-3 md:space-y-4 relative z-10">
                    {product.category && (
                        <div className="flex items-center gap-2 md:gap-3">
                            <span className="w-4 md:w-8 h-[2px] bg-primary/30 dark:bg-accent/30" />
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground dark:text-accent/70 truncate font-display">
                                {product.category.name}
                            </span>
                        </div>
                    )}
                    <Link href={productHref} className="block group/title">
                        <h3 className="font-display font-black text-base sm:text-lg md:text-2xl text-foreground group-hover/title:text-primary transition-colors line-clamp-2 leading-[1.35] tracking-tight min-h-[2.7em]">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="space-y-4 md:space-y-8 pt-3 md:pt-4 relative z-10">
                    {/* Price Section - Maximum Visibility */}
                    <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                            {product.originalPriceCents && product.originalPriceCents > product.priceCents && (
                                <span className="text-xs sm:text-sm text-muted-foreground dark:text-zinc-500 line-through font-bold mb-1">
                                    {formatPrice(product.originalPriceCents)}
                                </span>
                            )}
                            <span className="text-lg sm:text-xl md:text-4xl font-black text-primary tracking-tighter leading-none drop-shadow-sm font-display">
                                {formatPrice(product.priceCents)}
                            </span>
                        </div>

                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 dark:bg-white/5 border border-border dark:border-white/10">
                            <Eye size={12} className="text-primary" />
                            <span className="text-[10px] font-black text-foreground/80 dark:text-white/80 uppercase tracking-widest font-display">{product.viewCount}</span>
                        </div>
                    </div>

                    <Button
                        className="w-full h-11 md:h-14 bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:via-red-400 hover:to-red-500 text-white font-black text-[9px] sm:text-[10px] md:text-sm uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/30 border-0 group/btn active:scale-[0.98] relative overflow-hidden"
                        disabled={hasAddToCart ? isOutOfStock : false}
                        onClick={() => {
                            if (hasAddToCart) onAddToCart?.(product.id);
                            else handleViewProduct();
                        }}
                        aria-label={hasAddToCart ? (isOutOfStock ? 'Liên hệ đặt hàng' : 'Thêm vào giỏ') : 'Xem chi tiết'}
                        title={hasAddToCart ? (isOutOfStock ? 'Liên hệ đặt hàng' : 'Thêm vào giỏ') : 'Xem chi tiết'}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                        {hasAddToCart ? (
                            <>
                                <ShoppingCart size={18} className="sm:mr-2 transition-transform group-hover/btn:scale-110 relative z-10" />
                                <span className="relative z-10 hidden sm:inline">
                                    {isOutOfStock ? 'Liên hệ đặt hàng' : 'Thêm vào giỏ'}
                                </span>
                            </>
                        ) : (
                            <>
                                {isDigitalProduct ? (
                                    <Download size={18} className="sm:mr-2 transition-transform group-hover/btn:scale-110 relative z-10" />
                                ) : (
                                    <ShoppingCart size={18} className="sm:mr-2 transition-transform group-hover/btn:scale-110 relative z-10" />
                                )}
                                <span className="relative z-10 hidden sm:inline">
                                    Xem chi tiết
                                </span>
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </article>
    );
}
