'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ProductService } from '@/lib/product-service';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number | 'auto';
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
}

const DEFAULT_FALLBACK = '/images/placeholder-product.jpg';

export function ProductImage({
  src,
  alt,
  width = 400,
  height = 400,
  className,
  priority = false,
  quality = 'auto',
  format = 'auto',
  fallbackSrc = DEFAULT_FALLBACK,
  loading = 'lazy',
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Determine which image to show
  const getImageSrc = (): string => {
    if (imageError || !src) {
      return fallbackSrc;
    }
    
    // If it's a Cloudinary URL, optimize it
    if (ProductService.isCloudinaryUrl(src)) {
      return ProductService.getOptimizedImageUrl(src, {
        width,
        height,
        quality,
        format,
      });
    }
    
    return src;
  };

  const imageSrc = getImageSrc();

  return (
    <div className={cn('relative overflow-hidden bg-gray-100', className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={loading}
        className={cn(
          'object-cover transition-all duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          console.error('Image failed to load:', src);
          setImageError(true);
          setIsLoading(false);
        }}
      />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        </div>
      )}
    </div>
  );
}

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
  mainImageClassName?: string;
  thumbnailClassName?: string;
  showThumbnails?: boolean;
  maxThumbnails?: number;
}

export function ProductImageGallery({
  images,
  alt,
  className,
  mainImageClassName,
  thumbnailClassName,
  showThumbnails = true,
  maxThumbnails = 5,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const validImages = images.filter(Boolean);
  const displayImages = validImages.slice(0, maxThumbnails);
  const currentImage = displayImages[selectedIndex] || displayImages[0];

  if (validImages.length === 0) {
    return (
      <ProductImage
        src={null}
        alt={alt}
        className={cn('w-full aspect-square', mainImageClassName)}
      />
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Image */}
      <ProductImage
        src={currentImage}
        alt={`${alt} - Hình ${selectedIndex + 1}`}
        className={cn('w-full aspect-square rounded-lg', mainImageClassName)}
        priority={selectedIndex === 0}
        width={600}
        height={600}
      />
      
      {/* Thumbnails */}
      {showThumbnails && displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200',
                selectedIndex === index
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300',
                thumbnailClassName
              )}
            >
              <ProductImage
                src={image}
                alt={`${alt} - Thumbnail ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full"
                loading="lazy"
              />
            </button>
          ))}
          
          {validImages.length > maxThumbnails && (
            <div className="flex-shrink-0 w-16 h-16 rounded-md bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-xs text-gray-500 font-medium">
              +{validImages.length - maxThumbnails}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
