'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Product } from '@/lib/types';
import { parseImages } from '@/lib/utils';
import { useIsInWishlist, useToggleWishlist } from '@/lib/hooks/use-wishlist';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onViewProduct?: (productSlug: string) => void;
  /** When true, image loads with higher priority (for above-the-fold products) */
  priority?: boolean;
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  onViewProduct,
  priority = false,
}: ProductCardProps) {
  // Defer wishlist check to avoid blocking initial render
  // Increased delay + randomization to prevent thundering herd on mobile
  const [shouldCheckWishlist, setShouldCheckWishlist] = useState(false);
  
  useEffect(() => {
    // Longer delay (2.5s) + random spread (0-500ms) to reduce TBT
    const delay = 2500 + Math.random() * 500;
    const timer = setTimeout(() => setShouldCheckWishlist(true), delay);
    return () => clearTimeout(timer);
  }, []);
  
  const { data: isInWishlistData } = useIsInWishlist(
    shouldCheckWishlist ? product.id : ''
  );
  const { toggleWishlist, isLoading: isWishlistLoading } = useToggleWishlist();
  const isInWishlist = isInWishlistData?.isInWishlist || false;
  
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(cents);
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
  const isLowStock = product.stockQuantity < 10;

  // Get the primary image URL - prefer images array, fallback to imageUrl
  const getProductImage = () => {
    const images = parseImages(product.images, product.imageUrl);
    return images.length > 0 ? images[0] : '/placeholder-product.svg';
  };

  return (
    <article 
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80 backdrop-blur-md ring-1 ring-border/30 shadow-[0_30px_100px_-70px_rgba(0,0,0,0.75)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_40px_120px_-70px_rgba(0,0,0,0.85)] focus-within:ring-2 focus-within:ring-primary"
      aria-label={`Sản phẩm: ${product.name}`}
    >
      {/* Product Image with AspectRatio for consistent sizing */}
      <div className="relative overflow-hidden bg-muted/15">
        <AspectRatio ratio={1} className="relative">
          <Link 
            href={`/products/${product.slug}`} 
            className="relative block w-full h-full focus-visible:outline-none"
            aria-label={`Xem chi tiết ${product.name}`}
          >
            <Image
              src={getProductImage()}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-all duration-700 group-hover:scale-[1.03] group-hover:brightness-[1.05] group-hover:contrast-105"
              loading={priority ? "eager" : "lazy"}
              priority={priority}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-product.svg';
              }}
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/75 via-background/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Subtle shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Link>
        </AspectRatio>

        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
          {product.featured && (
            <Badge variant="default" className="text-[10px] sm:text-xs bg-gradient-primary text-primary-foreground shadow-sm">
              ⭐ Nổi bật
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive" className="text-[10px] sm:text-xs bg-tertiary text-tertiary-foreground shadow-sm">
              -{discount}% OFF
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="secondary" className="text-[10px] sm:text-xs bg-destructive/10 text-destructive border-destructive/20">
              Hết hàng
            </Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge variant="outline" className="text-[10px] sm:text-xs border-warning text-warning bg-warning/10">
              ⚠️ Sắp hết
            </Badge>
          )}
        </div>

        {/* Quick Actions - Hidden on mobile, visible on hover on desktop */}
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
          <div className="flex flex-col space-y-1">
            <Button
              variant="secondary"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8"
              onClick={() => onViewProduct?.(product.slug)}
              aria-label={`Xem nhanh ${product.name}`}
            >
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8"
              disabled={isWishlistLoading}
              onClick={async () => {
                try {
                  await toggleWishlist(product.id, isInWishlist);
                } catch (error) {
                  console.error('Toggle wishlist error:', error);
                }
              }}
              aria-label={isInWishlist ? `Xóa ${product.name} khỏi yêu thích` : `Thêm ${product.name} vào yêu thích`}
              aria-pressed={isInWishlist}
            >
              <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isInWishlist ? 'fill-red-500 text-destructive' : ''}`} aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Mobile Wishlist Button - Always visible on mobile */}
        <div className="absolute top-2 right-2 z-10 sm:hidden">
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7 bg-background/80 backdrop-blur-sm"
            disabled={isWishlistLoading}
            onClick={async () => {
              try {
                await toggleWishlist(product.id, isInWishlist);
              } catch (error) {
                console.error('Toggle wishlist error:', error);
              }
            }}
            aria-label={isInWishlist ? `Xóa khỏi yêu thích` : `Thêm vào yêu thích`}
            aria-pressed={isInWishlist}
          >
            <Heart className={`h-3.5 w-3.5 ${isInWishlist ? 'fill-red-500 text-destructive' : ''}`} aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <CardContent className="p-4 sm:p-5 transition-colors duration-300 group-hover:bg-card/90">
        {/* Category */}
        {product.category && (
          <Link 
            href={`/products?category=${product.category.slug}`}
            className="text-[10px] sm:text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {product.category.name}
          </Link>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-xs sm:text-sm mt-1 mb-2 line-clamp-2 hover:text-primary transition-colors min-h-[2.5rem] sm:min-h-[2.8rem]">
            {product.name}
          </h3>
        </Link>

        {/* Brand - Hidden on small mobile */}
        {product.brand && (
          <p className="hidden sm:block text-xs text-muted-foreground mb-2">
            Thương hiệu: {product.brand}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center space-x-2 mb-2">
          <span className="font-semibold text-sm sm:text-base text-primary">
            {formatPrice(product.priceCents)}
          </span>
          {product.originalPriceCents && product.originalPriceCents > product.priceCents && (
            <span className="text-xs sm:text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPriceCents)}
            </span>
          )}
        </div>

        {/* Rating - Compact on mobile */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-tertiary text-tertiary"
              />
            ))}
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground truncate">
            (4.5) • {product.viewCount} xem
          </span>
        </div>

        {/* Stock Status */}
        <div className="text-[10px] sm:text-xs mb-2">
          {isOutOfStock ? (
            <span className="text-destructive font-medium">Hết hàng</span>
          ) : isLowStock ? (
            <span className="text-warning font-medium">Còn {product.stockQuantity}</span>
          ) : (
            <span className="text-accent font-medium">Còn {product.stockQuantity}</span>
          )}
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="p-4 sm:p-5 pt-0 border-t border-border/50">
        <Button
          className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 text-xs sm:text-sm h-9 sm:h-10 group/btn"
          disabled={isOutOfStock}
          onClick={() => onAddToCart?.(product.id)}
          aria-label={isOutOfStock ? `${product.name} đã hết hàng` : `Thêm ${product.name} vào giỏ hàng`}
        >
          <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 transition-transform group-hover/btn:scale-110 group-hover/btn:rotate-12" aria-hidden="true" />
          {isOutOfStock ? 'Hết hàng' : 'Thêm giỏ'}
        </Button>
      </CardFooter>
    </article>
  );
}
