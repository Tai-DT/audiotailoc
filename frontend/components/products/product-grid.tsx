'use client';

import React from 'react';
import { ProductCard } from './product-card';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { BlurFade } from '@/components/ui/blur-fade';
import { EmptyState } from '@/components/ui/empty-state';
import { Package } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onAddToCart?: (productId: string) => void;
  onViewProduct?: (productSlug: string) => void;
}

export function ProductGrid({ 
  products, 
  loading = false, 
  onAddToCart, 
  onViewProduct 
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-7">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="space-y-4 animate-pulse">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-1/4 rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
              <Skeleton className="h-6 w-1/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="Không tìm thấy sản phẩm"
        description="Hãy thử tìm kiếm với từ khóa khác hoặc lọc theo danh mục để khám phá thêm sản phẩm."
        action={{
          label: 'Xem tất cả sản phẩm',
          href: '/products',
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-7">
      {products.map((product, index) => (
        <BlurFade key={product.id} delay={0.05 * index} inView>
          <ProductCard
            product={product}
            onAddToCart={onAddToCart}
            onViewProduct={onViewProduct}
          />
        </BlurFade>
      ))}
    </div>
  );
}

