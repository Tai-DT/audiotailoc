'use client';

import React, { useEffect, useState } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { useProductStore, ProductFilters as FilterType } from '@/store/product-store';
import { useUIStore } from '@/store/ui-store';

export default function ProductsPage() {
  const { 
    products, 
    categories, 
    pagination, 
    filters, 
    isLoading, 
    error,
    fetchProducts, 
    fetchCategories, 
    setFilters 
  } = useProductStore();
  
  const { addNotification } = useUIStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // Fetch categories on mount
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    // Fetch products when filters change
    fetchProducts(filters, 1);
  }, [filters, fetchProducts]);

  const handleFiltersChange = (newFilters: FilterType) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    fetchProducts(filters, page);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  if (error) {
    addNotification({
      type: 'error',
      title: 'Lỗi',
      message: error,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sản phẩm</h1>
          <p className="text-gray-600">
            Khám phá các sản phẩm âm thanh chất lượng cao
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <ProductFilters
              onFiltersChange={handleFiltersChange}
              currentFilters={filters}
            />
          </div>

          {/* Products Content */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Results Count */}
                <div className="text-sm text-gray-600">
                  Hiển thị {products.length} trong tổng số {pagination.total} sản phẩm
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Xem:</span>
                  <button
                    onClick={() => handleViewModeChange('grid')}
                    className={`p-2 rounded-md ${
                      viewMode === 'grid'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleViewModeChange('list')}
                    className={`p-2 rounded-md ${
                      viewMode === 'list'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Products Grid/List */}
            {!isLoading && products.length > 0 && (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showAddToCart={true}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && products.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-600 mb-4">
                  Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                </p>
                <button
                  onClick={() => handleFiltersChange({
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                  })}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Xem tất cả sản phẩm
                </button>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && pagination.total > pagination.pageSize && (
              <div className="mt-8 flex items-center justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  
                  {Array.from({ length: Math.ceil(pagination.total / pagination.pageSize) }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === Math.ceil(pagination.total / pagination.pageSize) ||
                      Math.abs(page - pagination.page) <= 1
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-3 py-2 text-sm text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            page === pagination.page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
