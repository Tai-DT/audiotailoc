'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/product-grid';
import { useTopViewedProducts } from '@/lib/hooks/use-api';
import { toast } from 'react-hot-toast';
import { useCart } from '@/components/providers/cart-provider';

export function NewProductsSection() {
  // Giả sử API có endpoint cho sản phẩm mới, tạm thời dùng useTopViewedProducts
  const { data: products, isLoading } = useTopViewedProducts(6);
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
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Sản phẩm mới
              </h2>
              <p className="text-muted-foreground">
                Khám phá những sản phẩm âm thanh mới nhất
              </p>
            </div>
          </div>
          <Link href="/products?sort=newest">
            <Button variant="ghost" className="hidden sm:flex">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <ProductGrid
          products={products || []}
          loading={isLoading}
          onAddToCart={handleAddToCart}
          onViewProduct={handleViewProduct}
        />

        <div className="text-center mt-8 sm:hidden">
          <Link href="/products?sort=newest">
            <Button variant="outline">
              Xem tất cả sản phẩm mới
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
