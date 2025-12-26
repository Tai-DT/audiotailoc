'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/product-grid';
import { useTopViewedProducts } from '@/lib/hooks/use-api';
import { toast } from 'react-hot-toast';
import { useCart } from '@/components/providers/cart-provider';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { parseImages } from '@/lib/utils';

export function BestSellingProductsSection ()
{
  // Giả sử API có endpoint cho sản phẩm bán chạy, tạm thời dùng useTopViewedProducts
  const { data: products, isLoading } = useTopViewedProducts( 6 );
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

  return (
    <section className="py-16 sm:py-20">
      <div className="section-shell">
        <div className="rounded-3xl border border-border/60 bg-card/50 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-[0_24px_120px_-60px_rgba(0,0,0,0.55)] space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  <AnimatedGradientText
                    className="text-2xl md:text-3xl font-bold"
                    speed={1.1}
                    colorFrom="oklch(0.60 0.26 25)"
                    colorTo="oklch(0.72 0.20 35)"
                  >
                    Sản phẩm bán chạy
                  </AnimatedGradientText>
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Những sản phẩm được khách hàng tin dùng nhất.
                </p>
              </div>
            </div>
            <Link href="/products?sort=bestselling" className="hidden sm:inline-flex">
              <Button variant="outline">
                <span className="flex items-center gap-2">
                  Xem tất cả
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </Link>
          </div>

          <ProductGrid
            products={products || []}
            loading={isLoading}
            onAddToCart={handleAddToCart}
            onViewProduct={handleViewProduct}
          />

          <div className="text-center sm:hidden">
            <Link href="/products?sort=bestselling">
              <Button variant="outline">
                Xem tất cả sản phẩm bán chạy
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
