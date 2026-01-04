'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/product-grid';
import { Product } from '@/lib/types';
import { toast } from 'react-hot-toast';
import { useCart } from '@/components/providers/cart-provider';
import { parseImages } from '@/lib/utils';

interface FeaturedProductsSSRProps {
  initialProducts: Product[];
}

/**
 * SSR-optimized Featured Products section
 * Uses products pre-fetched on server to avoid client-side API calls
 * This significantly reduces TBT and improves LCP
 */
export function FeaturedProductsSSR({ initialProducts }: FeaturedProductsSSRProps) {
  const { addItem: addCartItem } = useCart();
  const products = initialProducts;
  const isLoading = false; // No loading state since we have SSR data

  const handleAddToCart = (productId: string) => {
    const product = products?.find((item) => item.id === productId);

    if (!product) {
      toast.error('Không tìm thấy sản phẩm để thêm vào giỏ hàng');
      return;
    }

    try {
      const images = parseImages(product.images, product.imageUrl);
      addCartItem({
        id: product.id,
        name: product.name,
        price: product.priceCents ?? 0,
        image: images[0] || '/placeholder-product.svg',
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

  // Don't render if no products
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="section-shell">
        <div className="rounded-3xl border border-border/60 bg-card/50 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-[0_24px_120px_-60px_rgba(0,0,0,0.55)] space-y-10">
          <div className="section-heading items-center text-center">
            <div className="inline-flex items-center justify-center rounded-full border border-border/60 bg-background/70 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="mr-2">⭐</span>
              Được yêu thích nhất
            </div>
            <div className="section-title text-foreground">
              <span 
                className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-tertiary to-primary bg-clip-text text-transparent"
              >
                Sản phẩm nổi bật
              </span>
            </div>
            <p className="section-subtitle max-w-3xl mx-auto">
              Khám phá các sản phẩm được yêu thích nhất với chất lượng vượt trội và giá hợp lý.
            </p>
          </div>

          <ProductGrid
            products={products}
            loading={isLoading}
            onAddToCart={handleAddToCart}
            onViewProduct={handleViewProduct}
          />

          <div className="flex flex-col items-center gap-3 text-center">
            <Link href="/products">
              <Button size="lg" className="px-8">
                <span className="flex items-center gap-2">
                  Xem tất cả sản phẩm
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">Hơn 500+ sản phẩm chất lượng cao</p>
          </div>
        </div>
      </div>
    </section>
  );
}
