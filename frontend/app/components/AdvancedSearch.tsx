"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SearchFilters {
  q?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  featured?: boolean;
  tags?: string[];
  sortBy?: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
  facets?: Record<string, any>;
}

export default function AdvancedSearch({ onSearch, initialFilters = {}, facets = {} }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({});
    onSearch({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null && 
    (Array.isArray(value) ? value.length > 0 : true)
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Tìm kiếm nâng cao</CardTitle>
            <CardDescription>Lọc sản phẩm theo tiêu chí chi tiết</CardDescription>
          </div>
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm"
          >
            {isExpanded ? 'Thu gọn' : 'Mở rộng'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="flex gap-2">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={filters.q || ''}
            onChange={(e) => handleFilterChange('q', e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch}>Tìm kiếm</Button>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
            {/* Category Filter */}
            {facets.categoryId && (
              <div>
                <label className="block text-sm font-medium mb-2">Danh mục</label>
                <select
                  value={filters.categoryId || ''}
                  onChange={(e) => handleFilterChange('categoryId', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả danh mục</option>
                  {Object.entries(facets.categoryId as Record<string, number>).map(([id, count]) => (
                    <option key={id} value={id}>
                      {String(id)} ({Number(count)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Brand Filter */}
            {facets.brand && (
              <div>
                <label className="block text-sm font-medium mb-2">Thương hiệu</label>
                <select
                  value={filters.brand || ''}
                  onChange={(e) => handleFilterChange('brand', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả thương hiệu</option>
                  {Object.entries(facets.brand as Record<string, number>).map(([brand, count]) => (
                    <option key={brand} value={brand}>
                      {String(brand)} ({Number(count)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Khoảng giá (VNĐ)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Từ"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Đến"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium mb-2">Sắp xếp theo</label>
              <select
                value={filters.sortBy || 'relevance'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Độ liên quan</option>
                <option value="price_asc">Giá thấp đến cao</option>
                <option value="price_desc">Giá cao đến thấp</option>
                <option value="name_asc">Tên A-Z</option>
                <option value="name_desc">Tên Z-A</option>
                <option value="created_desc">Mới nhất</option>
              </select>
            </div>

            {/* Stock Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Tình trạng</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock === true}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked ? true : undefined)}
                    className="mr-2"
                  />
                  Còn hàng
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.featured === true}
                    onChange={(e) => handleFilterChange('featured', e.target.checked ? true : undefined)}
                    className="mr-2"
                  />
                  Sản phẩm nổi bật
                </label>
              </div>
            </div>

            {/* Tags Filter */}
            {facets.tags && (
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {Object.entries(facets.tags as Record<string, number>).map(([tag, count]) => (
                    <label key={tag} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.tags?.includes(tag) || false}
                        onChange={(e) => {
                          const currentTags = filters.tags || [];
                          if (e.target.checked) {
                            handleFilterChange('tags', [...currentTags, tag]);
                          } else {
                            handleFilterChange('tags', currentTags.filter(t => t !== tag));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{String(tag)} ({Number(count)})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={handleSearch} className="flex-1">
            Áp dụng bộ lọc
          </Button>
          {hasActiveFilters && (
            <Button variant="outline" onClick={handleReset}>
              Xóa bộ lọc
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="pt-2">
            <p className="text-sm text-gray-600 mb-2">Bộ lọc đang áp dụng:</p>
            <div className="flex flex-wrap gap-2">
              {filters.q && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  Từ khóa: &quot;{filters.q}&quot;
                </span>
              )}
              {filters.categoryId && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  Danh mục: {filters.categoryId}
                </span>
              )}
              {filters.brand && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  Thương hiệu: {filters.brand}
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  Giá: {filters.minPrice || 0} - {filters.maxPrice || '∞'}
                </span>
              )}
              {filters.inStock && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  Còn hàng
                </span>
              )}
              {filters.featured && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                  Nổi bật
                </span>
              )}
              {filters.tags?.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
