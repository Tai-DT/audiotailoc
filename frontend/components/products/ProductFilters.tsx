'use client';

import React, { useState } from 'react';
import { useProductStore, ProductFilters as FilterType } from '@/store/product-store';

interface ProductFiltersProps {
  onFiltersChange: (filters: FilterType) => void;
  currentFilters: FilterType;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  onFiltersChange,
  currentFilters,
}) => {
  const { categories } = useProductStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof FilterType, value: any) => {
    const newFilters = { ...currentFilters, [key]: value };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    onFiltersChange({
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Bộ lọc sản phẩm</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>

      <div className={`lg:block ${isOpen ? 'block' : 'hidden'}`}>
        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm
          </label>
          <input
            type="text"
            value={currentFilters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Categories */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Danh mục
          </label>
          <select
            value={currentFilters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Khoảng giá
          </label>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Giá tối thiểu"
              value={currentFilters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Giá tối đa"
              value={currentFilters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={currentFilters.featured || false}
              onChange={(e) => handleFilterChange('featured', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Chỉ sản phẩm nổi bật</span>
          </label>
        </div>

        {/* Sort By */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sắp xếp theo
          </label>
          <select
            value={`${currentFilters.sortBy}-${currentFilters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              handleFilterChange('sortBy', sortBy);
              handleFilterChange('sortOrder', sortOrder);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt-desc">Mới nhất</option>
            <option value="createdAt-asc">Cũ nhất</option>
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
            <option value="priceCents-asc">Giá tăng dần</option>
            <option value="priceCents-desc">Giá giảm dần</option>
          </select>
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};
