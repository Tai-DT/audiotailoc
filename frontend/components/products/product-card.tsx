'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Product } from '@/lib/types';
import { useIsInWishlist, useToggleWishlist } from '@/lib/hooks/use-wishlist';
import { formatPrice, calculateDiscountPercentage } from '@/lib/utils';
import { ProductPromotionBadge } from './product-promotion-badge';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onViewProduct?: (productSlug: string) => void;
}

export function ProductCard({
  product,
  onAddToCart,
  onViewProduct
}: ProductCardProps) {
  const { isInWishlist } = useIsInWishlist(product.id);
  const toggleWishlistMutation = useToggleWishlist();

  const discount = calculateDiscountPercentage(product.originalPriceCents, product.priceCents);
  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity < 10;

  // Get the primary image URL - prefer images array, fallback to imageUrl
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.imageUrl) {
      return product.imageUrl;
    }
    return '/placeholder-product.svg';
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover-lift bg-card/80 backdrop-blur-sm border-border/50">
      {/* Product Image with AspectRatio for consistent sizing */}
      <div className="relative overflow-hidden bg-muted/20">
        <AspectRatio ratio={1}>
          <Link href={`/products/${product.slug}`}>
            <Image
              src={getProductImage()}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-product.svg';
              }}
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
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
          <ProductPromotionBadge
            productId={product.id}
            categoryId={product.category?.id}
            price={product.priceCents}
          />
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
            >
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8"
              disabled={toggleWishlistMutation.isPending}
              onClick={async () => {
                try {
                  await toggleWishlistMutation.mutateAsync(product.id);
                } catch (error) {
                  console.error('Toggle wishlist error:', error);
                }
              }}
            >
              <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Mobile Wishlist Button - Always visible on mobile */}
        <div className="absolute top-2 right-2 z-10 sm:hidden">
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7 bg-background/80 backdrop-blur-sm"
            disabled={toggleWishlistMutation.isPending}
            onClick={async () => {
              try {
                await toggleWishlistMutation.mutateAsync(product.id);
              } catch (error) {
                console.error('Toggle wishlist error:', error);
              }
            }}
          >
            <Heart className={`h-3.5 w-3.5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <CardContent className="p-3 sm:p-4">
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
      <CardFooter className="p-3 sm:p-4 pt-0">
        <Button
          className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium transition-all duration-300 hover-lift hover:shadow-lg text-xs sm:text-sm h-8 sm:h-10"
          disabled={isOutOfStock}
          onClick={() => onAddToCart?.(product.id)}
        >
          <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
          {isOutOfStock ? 'Hết hàng' : 'Thêm giỏ'}
        </Button>
      </CardFooter>
    </Card>
  );
}
