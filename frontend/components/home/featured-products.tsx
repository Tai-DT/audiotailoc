'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/product-grid';
import { useTopViewedProducts } from '@/lib/hooks/use-api';
import { toast } from 'react-hot-toast';

export function FeaturedProducts() {
  const { data: products, isLoading } = useTopViewedProducts(8);

  const handleAddToCart = (productId: string) => {
    // TODO: Implement add to cart functionality
    toast.success('Đã thêm vào giỏ hàng');
  };

  const handleAddToWishlist = (productId: string) => {
    // TODO: Implement add to wishlist functionality
    toast.success('Đã thêm vào yêu thích');
  };

  const handleViewProduct = (productId: string) => {
    // TODO: Implement view product functionality
    console.log('View product:', productId);
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
          onAddToWishlist={handleAddToWishlist}
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


