'use client';

import React from 'react';
import { useProducts } from '@/lib/hooks/use-api';
import { ProductGrid } from '@/components/products/product-grid';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/lib/types';

interface RelatedProductsProps {
 categoryId?: string;
 currentProductId: string;
 isDigital?: boolean;
 basePath?: string;
}

export function RelatedProducts({ categoryId, currentProductId, isDigital, basePath }: RelatedProductsProps) {
 // If no category, we can't really show related products effectively
 // Alternatively, we could show "Featured" or "New" products
 const { data, isLoading } = useProducts({
 categoryId: categoryId,
 isDigital: isDigital,
 isActive: true,
 page: 1,
 pageSize: 8,
 });

 if (!categoryId) return null;

 const relatedProducts = (data?.items || [])
  .filter((p: Product) => p.id !== currentProductId)
  .slice(0, 4);

 if (!isLoading && relatedProducts.length === 0) {
 return null;
 }

 return (
 <section className="py-12 border-t border-border/50 mt-12">
 <div className="mb-8">
 <h2 className="text-2xl font-bold mb-2">
 <AnimatedGradientText className="text-2xl font-bold p-0">
 {isDigital ? 'Phần mềm liên quan' : 'Sản phẩm liên quan'}
 </AnimatedGradientText>
 </h2>
 <p className="text-muted-foreground">
 Có thể bạn cũng quan tâm đến những mục này
 </p>
 </div>

 {isLoading ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 {[...Array(4)].map((_, i) => (
 <div key={i} className="space-y-4">
 <Skeleton className="aspect-square rounded-xl" />
 <Skeleton className="h-4 w-2/3" />
 <Skeleton className="h-4 w-1/2" />
 </div>
 ))}
 </div>
 ) : (
 <ProductGrid
 products={relatedProducts}
 loading={false}
 basePath={basePath}
 // We don't need pagination for this section
 />
 )}
 </section>
 );
}
