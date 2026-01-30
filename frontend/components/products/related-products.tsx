'use client';

import React from 'react';
import { useProducts, Product as HookProduct } from '@/lib/hooks/use-products';
import { ProductGrid } from '@/components/products/product-grid';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/lib/types';

interface RelatedProductsProps {
 categoryId?: string;
 currentProductId: string;
}

export function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
 // If no category, we can't really show related products effectively
 // Alternatively, we could show "Featured" or "New" products
 const { data, isLoading } = useProducts({
 categoryId: categoryId,
 limit: 5,
 // We might want to exclude the current product, but the API might not support exclusion directly.
 // We'll filter it out on the client side if needed, but fetching 5 to be safe.
 page: 1
 });

 if (!categoryId) return null;

 // Cast to compatible Product type
 const relatedProducts = (data?.products
 ?.filter((p: HookProduct) => p.id !== currentProductId)
 .slice(0, 4) || []) as unknown as Product[];

 if (!isLoading && relatedProducts.length === 0) {
 return null;
 }

 return (
 <section className="py-12 border-t border-border/50 mt-12">
 <div className="mb-8">
 <h2 className="text-2xl font-bold mb-2">
 <AnimatedGradientText className="text-2xl font-bold p-0">
 Sản phẩm liên quan
 </AnimatedGradientText>
 </h2>
 <p className="text-muted-foreground">
 Có thể bạn cũng quan tâm đến những sản phẩm này
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
 // We don't need pagination for this section
 />
 )}
 </section>
 );
}
