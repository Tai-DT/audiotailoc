'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/types';
import { useIsInWishlist, useToggleWishlist } from '@/lib/hooks/use-wishlist';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onViewProduct?: (productId: string) => void;
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  onViewProduct 
}: ProductCardProps) {
  const { data: isInWishlistData } = useIsInWishlist(product.id);
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
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted/20">
        <Link href={`/products/${product.id}`}>
          <Image
            src={getProductImage()}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.svg';
            }}
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.featured && (
            <Badge variant="default" className="text-xs bg-gradient-primary text-primary-foreground shadow-sm">
              ⭐ Nổi bật
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive" className="text-xs bg-tertiary text-tertiary-foreground shadow-sm">
              -{discount}% OFF
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="secondary" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
              Hết hàng
            </Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge variant="outline" className="text-xs border-warning text-warning bg-warning/10">
              ⚠️ Sắp hết hàng
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col space-y-1">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8"
              onClick={() => onViewProduct?.(product.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8"
              disabled={isWishlistLoading}
              onClick={async () => {
                try {
                  await toggleWishlist(product.id, isInWishlist);
                } catch (error) {
                  console.error('Toggle wishlist error:', error);
                }
              }}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <CardContent className="p-4">
        {/* Category */}
        {product.category && (
          <Link 
            href={`/products?category=${product.category.slug}`}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {product.category.name}
          </Link>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-sm mt-1 mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-muted-foreground mb-2">
            Thương hiệu: {product.brand}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center space-x-2 mb-2">
          <span className="font-semibold text-primary">
            {formatPrice(product.priceCents)}
          </span>
          {product.originalPriceCents && product.originalPriceCents > product.priceCents && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPriceCents)}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-3 w-3 fill-tertiary text-tertiary"
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            (4.5) • {product.viewCount} lượt xem
          </span>
        </div>

        {/* Stock Status */}
        <div className="text-xs mb-2">
          {isOutOfStock ? (
            <span className="text-destructive font-medium">Hết hàng</span>
          ) : isLowStock ? (
            <span className="text-warning font-medium">Còn {product.stockQuantity} sản phẩm</span>
          ) : (
            <span className="text-accent font-medium">Còn {product.stockQuantity} sản phẩm</span>
          )}
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium transition-all duration-300 hover-lift hover:shadow-lg"
          disabled={isOutOfStock}
          onClick={() => onAddToCart?.(product.id)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
        </Button>
      </CardFooter>
    </Card>
  );
}
