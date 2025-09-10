'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ProductImage } from './product-image';
import { Product, ProductService } from '@/lib/product-service';
import { cn } from '@/lib/utils';
import { 
  Star, 
  ShoppingCart, 
  Eye, 
  Heart,
  Package,
  Zap,
  TrendingUp
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  className?: string;
  showDescription?: boolean;
  showStock?: boolean;
  showBrand?: boolean;
  variant?: 'default' | 'compact' | 'featured';
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isInWishlist?: boolean;
}

export function ProductCard({
  product,
  className,
  showDescription = true,
  showStock = true,
  showBrand = true,
  variant = 'default',
  onAddToCart,
  onViewDetails,
  onToggleWishlist,
  isInWishlist = false,
}: ProductCardProps) {
  const mainImage = ProductService.getMainImage(product);
  const formattedPrice = ProductService.formatPrice(product.priceCents);
  const isOnSale = ProductService.isOnSale(product);
  const discountPercentage = ProductService.getDiscountPercentage(product);
  const isInStock = ProductService.isInStock(product);
  const originalPrice = product.originalPriceCents 
    ? ProductService.formatPrice(product.originalPriceCents)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleViewDetails = () => {
    onViewDetails?.(product);
    // Also increment view count
    ProductService.incrementView(product.id).catch(console.error);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist?.(product);
  };

  const cardSizeClasses = {
    default: 'w-full',
    compact: 'w-full max-w-sm',
    featured: 'w-full max-w-md',
  };

  const imageHeightClasses = {
    default: 'aspect-square',
    compact: 'aspect-[4/3]',
    featured: 'aspect-[3/2]',
  };

  return (
    <Card className={cn(
      'group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
      cardSizeClasses[variant],
      !product.isActive && 'opacity-75',
      className
    )}>
      {/* Product Link */}
      <Link 
        href={`/products/${product.slug || product.id}`}
        onClick={handleViewDetails}
        className="block"
      >
        {/* Image Container */}
        <div className={cn(
          'relative overflow-hidden bg-gray-50',
          imageHeightClasses[variant]
        )}>
          <ProductImage
            src={mainImage}
            alt={product.name}
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
            width={variant === 'featured' ? 600 : 400}
            height={variant === 'featured' ? 400 : 400}
            priority={product.featured}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isOnSale && discountPercentage && (
              <Badge variant="destructive" className="text-xs">
                -{discountPercentage}%
              </Badge>
            )}
            {product.featured && (
              <Badge variant="secondary" className="text-xs">
                <Star className="w-3 h-3 mr-1" />
                Nổi bật
              </Badge>
            )}
            {!isInStock && (
              <Badge variant="outline" className="text-xs bg-white/90">
                Hết hàng
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          {onToggleWishlist && (
            <button
              onClick={handleToggleWishlist}
              className={cn(
                'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100',
                isInWishlist
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white/90 text-gray-700 hover:bg-white hover:text-red-500'
              )}
            >
              <Heart className={cn('w-4 h-4', isInWishlist && 'fill-current')} />
            </button>
          )}

          {/* Quick Actions */}
          <div className="absolute inset-x-2 bottom-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onAddToCart && isInStock && (
              <Button
                size="sm"
                onClick={handleAddToCart}
                className="flex-1 h-8 text-xs"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Thêm vào giỏ
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                handleViewDetails();
              }}
              className="h-8 px-2 bg-white/90"
            >
              <Eye className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <CardContent className="p-4">
          {/* Brand */}
          {showBrand && product.brand && (
            <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
          )}

          {/* Title */}
          <h3 className={cn(
            'font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors',
            variant === 'featured' ? 'text-lg mb-2' : 'text-sm mb-2'
          )}>
            {product.name}
          </h3>

          {/* Description */}
          {showDescription && product.shortDescription && variant !== 'compact' && (
            <p className="text-xs text-gray-600 line-clamp-2 mb-3">
              {product.shortDescription}
            </p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className={cn(
              'font-bold text-blue-600',
              variant === 'featured' ? 'text-lg' : 'text-sm'
            )}>
              {formattedPrice}
            </span>
            {isOnSale && originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                {originalPrice}
              </span>
            )}
          </div>

          {/* Stock & Stats */}
          {showStock && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                {isInStock ? (
                  <span className="flex items-center text-green-600">
                    <Package className="w-3 h-3 mr-1" />
                    Còn hàng ({product.stockQuantity})
                  </span>
                ) : (
                  <span className="flex items-center text-red-500">
                    <Package className="w-3 h-3 mr-1" />
                    Hết hàng
                  </span>
                )}
              </div>
              
              {product.viewCount && product.viewCount > 0 && (
                <span className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {product.viewCount}
                </span>
              )}
            </div>
          )}

          {/* Features/Tags */}
          {product.tags && variant === 'featured' && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.tags.split(',').slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Link>

      {/* Footer Actions */}
      {variant === 'featured' && (
        <CardFooter className="p-4 pt-0">
          <div className="flex gap-2 w-full">
            {isInStock ? (
              <Button 
                onClick={handleAddToCart}
                className="flex-1"
                disabled={!onAddToCart}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Thêm vào giỏ hàng
              </Button>
            ) : (
              <Button variant="outline" className="flex-1" disabled>
                <Package className="w-4 h-4 mr-2" />
                Hết hàng
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

// Loading Skeleton for ProductCard
export function ProductCardSkeleton({ 
  variant = 'default' 
}: { 
  variant?: 'default' | 'compact' | 'featured' 
}) {
  return (
    <Card className="w-full animate-pulse">
      <div className={cn(
        'bg-gray-200',
        variant === 'default' && 'aspect-square',
        variant === 'compact' && 'aspect-[4/3]',
        variant === 'featured' && 'aspect-[3/2]'
      )} />
      <CardContent className="p-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-1/4" />
          <div className="h-3 bg-gray-200 rounded w-1/6" />
        </div>
      </CardContent>
    </Card>
  );
}
