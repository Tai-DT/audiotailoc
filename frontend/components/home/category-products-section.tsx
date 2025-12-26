'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/product-grid';
import { useTopViewedProducts, useCategories } from '@/lib/hooks/use-api';
import { toast } from 'react-hot-toast';
import { useCart } from '@/components/providers/cart-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { parseImages } from '@/lib/utils';

export function CategoryProductsSection ()
{
  // Giả sử API có endpoint cho sản phẩm theo danh mục, tạm thời dùng useTopViewedProducts
  const { data: products, isLoading: productsLoading } = useTopViewedProducts( 8 );
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { addItem: addCartItem } = useCart();

  const handleAddToCart = ( productId: string ) =>
  {
    const product = products?.find( ( item ) => item.id === productId );

    if ( !product )
    {
      toast.error( 'Không tìm thấy sản phẩm để thêm vào giỏ hàng' );
      return;
    }

    try
    {
      const images = parseImages( product.images, product.imageUrl );
      addCartItem( {
        id: product.id,
        name: product.name,
        price: product.priceCents ?? 0,
        image: images[ 0 ] || '/placeholder-product.svg',
        category: product.category?.name ?? 'Sản phẩm',
        description: product.shortDescription ?? undefined,
      } );
    } catch ( error )
    {
      console.error( 'Add to cart error:', error );
      toast.error( 'Có lỗi xảy ra khi thêm vào giỏ hàng' );
    }
  };

  const handleViewProduct = ( productSlug: string ) =>
  {
    window.location.href = `/products/${ productSlug }`;
  };

  if ( categoriesLoading )
  {
    return (
      <section className="py-16 sm:py-20">
        <div className="section-shell">
          <div className="rounded-3xl border border-border/60 bg-card/40 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-[0_24px_120px_-60px_rgba(0,0,0,0.55)] space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-8 w-48" />
              </div>
              <Skeleton className="h-6 w-80 mx-auto" />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {[ ...Array( 5 ) ].map( ( _, index ) => (
                <Skeleton key={index} className="h-10 w-24 rounded-full" />
              ) )}
            </div>
            <ProductGrid
              products={[]}
              loading={true}
              onAddToCart={handleAddToCart}
              onViewProduct={handleViewProduct}
            />
          </div>
        </div>
      </section>
    );
  }

  // Lấy tối đa 4 danh mục đầu tiên
  const displayCategories = categories?.slice( 0, 4 ) || [];

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="section-shell">
        <div className="rounded-3xl border border-border/60 bg-card/40 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-[0_24px_120px_-60px_rgba(0,0,0,0.55)] space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center gap-3 rounded-full border border-border/60 bg-background/70 px-4 py-2">
              <Grid3X3 className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Danh mục sản phẩm</span>
            </div>
            <AnimatedGradientText
              className="text-3xl sm:text-4xl font-bold"
              speed={1.15}
              colorFrom="oklch(0.60 0.26 25)"
              colorTo="oklch(0.72 0.20 35)"
            >
              Khám phá theo danh mục
            </AnimatedGradientText>
            <p className="section-subtitle max-w-2xl mx-auto">
              Lọc nhanh theo danh mục thiết bị âm thanh chuyên nghiệp.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {displayCategories.map( ( category ) => (
              <Link key={category.id} href={`/products?category=${ category.slug }`}>
                <Button variant="outline" className="rounded-full border-border/70">
                  {category.name}
                </Button>
              </Link>
            ) )}
            <Link href="/products">
              <Button variant="outline" className="rounded-full">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <ProductGrid
            products={products || []}
            loading={productsLoading}
            onAddToCart={handleAddToCart}
            onViewProduct={handleViewProduct}
          />
        </div>
      </div>
    </section>
  );
}
