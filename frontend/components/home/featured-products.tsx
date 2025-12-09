'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/product-grid';
import { useTopViewedProducts } from '@/lib/hooks/use-api';
import { toast } from 'react-hot-toast';
import { useCart } from '@/components/providers/cart-provider';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';

export function FeaturedProducts() {
  const { data: products, isLoading } = useTopViewedProducts(8);
  const { addItem: addCartItem } = useCart();

  const handleAddToCart = (productId: string) => {
    const product = products?.find((item) => item.id === productId);

    if (!product) {
      toast.error('Không tìm thấy sản phẩm để thêm vào giỏ hàng');
      return;
    }

    try {
      addCartItem({
        id: product.id,
        name: product.name,
        price: product.priceCents ?? 0,
        image: product.images?.[0] ?? product.imageUrl ?? '/placeholder-product.svg',
        category: product.category?.name ?? 'Sản phẩm',
        description: product.shortDescription ?? undefined,
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  };

  const handleViewProduct = (productSlug: string) => {
    window.location.href = `/products/${productSlug}`;
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <div className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <span className="mr-2">⭐</span>
            Được yêu thích nhất
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            <AnimatedGradientText
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              speed={1.2}
              colorFrom="oklch(0.58 0.28 20)"
              colorTo="oklch(0.70 0.22 40)"
            >
            Sản phẩm nổi bật
            </AnimatedGradientText>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Khám phá những sản phẩm âm thanh được yêu thích nhất với chất lượng 
            vượt trội và giá cả hợp lý.
          </p>
        </div>

        <ProductGrid
          products={products || []}
          loading={isLoading}
          onAddToCart={handleAddToCart}
          onViewProduct={handleViewProduct}
        />

        {/* Enhanced CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <Link href="/products">
            <ShimmerButton
              className="px-8 py-6 text-base font-semibold"
              shimmerColor="oklch(0.58 0.28 20)"
              background="oklch(0.58 0.28 20)"
              borderRadius="0.5rem"
            >
              <span className="flex items-center gap-2">
              Xem tất cả sản phẩm
                <ArrowRight className="h-5 w-5" />
              </span>
            </ShimmerButton>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">Hơn 500+ sản phẩm chất lượng cao</p>
        </div>
      </div>
    </section>
  );
}

