'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, Eye, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/store';
import { Product } from '@/lib/types-prisma';
import { toast } from 'sonner';
import { ProductService } from '@/lib/product-service';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
  showWishlist?: boolean;
  showQuickAdd?: boolean;
}

export default function ProductCard({
  product,
  variant = 'default',
  className,
  showWishlist = true,
  showQuickAdd = true
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCartStore();

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(cents / 100);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    try {
      await addToCart(product.id, 1);
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
    } catch (error) {
      toast.error('Không thể thêm sản phẩm vào giỏ hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted
        ? 'Đã xóa khỏi danh sách yêu thích'
        : 'Đã thêm vào danh sách yêu thích'
    );
  };

  const discountPercentage = product.originalPriceCents
    ? Math.round(((product.originalPriceCents - product.priceCents) / product.originalPriceCents) * 100)
    : null;

  const cardClasses = cn(
    'group relative overflow-hidden transition-all duration-300 hover:shadow-lg',
    {
      'h-[400px]': variant === 'compact',
      'h-[450px]': variant === 'default',
      'h-[500px]': variant === 'featured',
    },
    className
  );

  return (
    <Card className={cardClasses}>
      <Link href={`/products/${product.slug}`} className="block h-full">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Product Image */}
          <div className="relative flex-1 overflow-hidden">
            {(() => {
              // Use ProductService to get optimized image URL
              const mainImage = ProductService.getMainImage(product);

              // If it's a Cloudinary URL, use CldImage
              if (mainImage && ProductService.isCloudinaryUrl(mainImage)) {
                const publicId = ProductService.extractCloudinaryPublicId(mainImage);
                return (
                  <CldImage
                    src={publicId || 'cld-sample-5'}
                    width={400}
                    height={300}
                    crop="fill"
                    gravity="auto"
                    quality="auto"
                    format="auto"
                    alt={product.name}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      console.error('Cloudinary image load error for product:', product.name, product.id);
                    }}
                  />
                );
              }

              // For external URLs or missing images, use regular Image with Cloudinary placeholder
              return (
                <Image
                  src={mainImage && mainImage.startsWith('http') ? mainImage : 'https://res.cloudinary.com/dib7tbv7w/image/upload/cld-sample-5'}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    console.error('Image load error for product:', product.name, product.id);
                    // Fallback to Cloudinary sample on error
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://res.cloudinary.com/dib7tbv7w/image/upload/cld-sample-5';
                  }}
                />
              );
            })()}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-2">
              {product.featured && (
                <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Nổi bật
                </Badge>
              )}
              {discountPercentage && (
                <Badge variant="destructive">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                <Badge variant="secondary" className="bg-yellow-500 text-white">
                  Sắp hết
                </Badge>
              )}
              {product.stockQuantity === 0 && (
                <Badge variant="secondary" className="bg-gray-500 text-white">
                  Hết hàng
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {showWishlist && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                  onClick={handleWishlist}
                >
                  <Heart
                    className={cn(
                      'h-4 w-4',
                      isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    )}
                  />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
              >
                <Eye className="h-4 w-4 text-gray-600" />
              </Button>
            </div>

            {/* Quick Add Button - Shows on hover */}
            {showQuickAdd && product.stockQuantity > 0 && (
              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={handleAddToCart}
                  disabled={isLoading}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isLoading ? 'Đang thêm...' : 'Thêm giỏ hàng'}
                </Button>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-3">
            {/* Brand */}
            {product.brand && (
              <div className="text-sm text-orange-600 font-medium">
                {product.brand}
              </div>
            )}

            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
              {product.name}
            </h3>

            {/* Short Description */}
            {product.shortDescription && variant !== 'compact' && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.shortDescription}
              </p>
            )}

            {/* Reviews */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                (4.0 • 127 đánh giá)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-lg font-bold text-gray-900">
                  {formatPrice(product.priceCents)}
                </div>
                {product.originalPriceCents && (
                  <div className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPriceCents)}
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="text-right">
                {product.stockQuantity > 10 && (
                  <div className="text-sm text-green-600 font-medium">
                    Còn hàng
                  </div>
                )}
                {product.stockQuantity <= 10 && product.stockQuantity > 0 && (
                  <div className="text-sm text-yellow-600 font-medium">
                    Chỉ còn {product.stockQuantity}
                  </div>
                )}
                {product.stockQuantity === 0 && (
                  <div className="text-sm text-red-600 font-medium">
                    Hết hàng
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}