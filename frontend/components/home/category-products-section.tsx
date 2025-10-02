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

export function CategoryProductsSection() {
  // Giả sử API có endpoint cho sản phẩm theo danh mục, tạm thời dùng useTopViewedProducts
  const { data: products, isLoading: productsLoading } = useTopViewedProducts(8);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
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
    window.location.href = `/san-pham/${productSlug}`;
  };

  if (categoriesLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>

          {/* Category Navigation Loading */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-10 w-24" />
            ))}
          </div>

          <ProductGrid
            products={[]}
            loading={true}
            onAddToCart={handleAddToCart}
            onViewProduct={handleViewProduct}
          />
        </div>
      </section>
    );
  }

  // Lấy tối đa 4 danh mục đầu tiên
  const displayCategories = categories?.slice(0, 4) || [];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Grid3X3 className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Danh mục sản phẩm
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Khám phá các danh mục thiết bị âm thanh chuyên nghiệp
          </p>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {displayCategories.map((category) => (
            <Link key={category.id} href={`/san-pham?category=${category.slug}`}>
              <Button
                variant="outline"
                className="hover:bg-purple-50 hover:border-purple-200"
              >
                {category.name}
              </Button>
            </Link>
          ))}
          <Link href="/san-pham">
            <Button variant="outline">
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
    </section>
  );
}
