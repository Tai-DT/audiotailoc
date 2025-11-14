'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/product-grid';
import { useTopViewedProducts } from '@/lib/hooks/use-api';
import { toast } from 'react-hot-toast';
import { useCart } from '@/components/providers/cart-provider';

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
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <span className="mr-2">⭐</span>
            Được yêu thích nhất
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Sản phẩm nổi bật
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
            <Button size="lg" className="px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
              Xem tất cả sản phẩm
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">Hơn 500+ sản phẩm chất lượng cao</p>
        </div>
      </div>
    </section>
  );
}

