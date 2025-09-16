'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductFilters } from '@/components/products/product-filters';
import { useProducts } from '@/lib/hooks/use-api';
import { ProductFilters as ProductFiltersType } from '@/lib/types';
import { toast } from 'react-hot-toast';

export default function ProductsPage() {
  const [filters, setFilters] = React.useState<ProductFiltersType>({
    page: 1,
    pageSize: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const { data, isLoading, error } = useProducts(filters);

  const handleFiltersChange = (newFilters: Partial<ProductFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">
              Có lỗi xảy ra khi tải sản phẩm
            </h1>
            <p className="text-muted-foreground">
              Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sản phẩm</h1>
          <p className="text-muted-foreground">
            Khám phá bộ sưu tập thiết bị âm thanh chất lượng cao
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {data?.total ? `Hiển thị ${data.items.length} trên ${data.total} sản phẩm` : 'Đang tải...'}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Sắp xếp:</span>
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      handleFiltersChange({ sortBy: sortBy as any, sortOrder: sortOrder as any });
                    }}
                    className="text-sm border rounded px-2 py-1"
                    title="Chọn cách sắp xếp sản phẩm"
                  >
                    <option value="createdAt-desc">Mới nhất</option>
                    <option value="createdAt-asc">Cũ nhất</option>
                    <option value="price-asc">Giá thấp đến cao</option>
                    <option value="price-desc">Giá cao đến thấp</option>
                    <option value="name-asc">Tên A-Z</option>
                    <option value="name-desc">Tên Z-A</option>
                    <option value="viewCount-desc">Xem nhiều nhất</option>
                  </select>
                </div>
              </div>
            </div>

            <ProductGrid
              products={data?.items || []}
              loading={isLoading}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              onViewProduct={handleViewProduct}
            />

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => handlePageChange(filters.page! - 1)}
                  disabled={!data.hasPrev}
                  className="px-3 py-2 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                >
                  Trước
                </button>
                
                {[...Array(Math.min(5, data.totalPages))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm border rounded ${
                        filters.page === page
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(filters.page! + 1)}
                  disabled={!data.hasNext}
                  className="px-3 py-2 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
