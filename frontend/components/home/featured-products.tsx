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

  const handleViewProduct = (productId: string) => {
    window.location.href = `/products/${productId}`;
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sản phẩm nổi bật
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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

        <div className="text-center mt-12">
          <Link href="/products">
            <Button variant="outline" size="lg">
              Xem tất cả sản phẩm
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

