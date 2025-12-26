'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn, parseImages } from '@/lib/utils';
import { BlurFade } from '@/components/ui/blur-fade';

interface ProductGalleryProps {
  images?: unknown;
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Ensure we have at least one image or a placeholder
  const normalizedImages = parseImages(images);
  const displayImages = normalizedImages.length > 0 ? normalizedImages : ['/placeholder-product.svg'];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <BlurFade key={displayImages[selectedIndex]} duration={0.4} inView>
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border/50 bg-muted/20 shadow-sm">
          <Image
            src={displayImages[selectedIndex]}
            alt={`${productName} - Image ${selectedIndex + 1}`}
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </BlurFade>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              title={`Xem ảnh ${index + 1}`}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border transition-all hover:opacity-100",
                selectedIndex === index 
                  ? "border-primary ring-2 ring-primary/20 opacity-100" 
                  : "border-border/50 opacity-60 hover:border-primary/50"
              )}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-cover object-center"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
