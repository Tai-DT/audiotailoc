'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/product-grid';
import { ChevronLeft, Grid, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '@/components/providers/cart-provider';
import { apiClient, handleApiResponse } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Product, Category } from '@/lib/types';

interface CategoryPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

// Hooks for API calls
function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/catalog/categories/slug/${slug}`);
      return handleApiResponse<Category>(response);
    },
    enabled: !!slug,
  });
}

function useCategoryProducts(slug: string, page: number = 1, limit: number = 12) {
  return useQuery({
    queryKey: ['category-products', slug, page, limit],
    queryFn: async () => {
      const response = await apiClient.get(`/catalog/categories/slug/${slug}/products`, {
        params: { page, limit }
      });
      return handleApiResponse<{
        items: Product[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      }>(response);
    },
    enabled: !!slug,
  });
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // Handle both Promise params (new pattern) and direct object
  const isPromise = typeof (params as unknown as { then?: unknown }).then === 'function';
  const resolvedParams = isPromise ? React.use(params as Promise<{ slug: string }>) : (params as { slug: string });
  const slug = resolvedParams.slug;

  const [currentPage, setCurrentPage] = React.useState(1);
  const { addItem: addCartItem } = useCart();

  const { data: category, isLoading: isCategoryLoading, error: categoryError } = useCategory(slug);
  const { data: productsData, isLoading: isProductsLoading } = useCategoryProducts(slug, currentPage);

  const handleAddToCart = (productId: string) => {
    const product = productsData?.items?.find((item) => item.id === productId);

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
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  };

  const handleViewProduct = (productSlug: string) => {
    window.location.href = `/products/${productSlug}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isCategoryLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-200 aspect-square rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (categoryError || !category) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <Link href="/danh-muc" className="hover:text-primary">Danh mục</Link>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
            <p className="text-muted-foreground">
              {productsData ? `${productsData.total} sản phẩm` : 'Đang tải...'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Bộ lọc
            </Button>
            <Button variant="outline" size="sm">
              <Grid className="mr-2 h-4 w-4" />
              Sắp xếp
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <ProductGrid
            products={(productsData?.items || []) as Product[]}
            loading={isProductsLoading}
            onAddToCart={handleAddToCart}
            onViewProduct={handleViewProduct}
          />
        </div>

        {/* Pagination */}
        {productsData && productsData.totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </Button>
            
            {Array.from({ length: productsData.totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              disabled={currentPage >= productsData.totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Sau
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        )}

        {/* Empty State */}
        {productsData && productsData.items.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Không có sản phẩm</h3>
            <p className="text-muted-foreground mb-6">
              Hiện tại danh mục này chưa có sản phẩm nào.
            </p>
            <Link href="/products">
              <Button>
                Khám phá sản phẩm khác
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}