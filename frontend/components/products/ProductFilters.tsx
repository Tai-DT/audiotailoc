'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  X, 
  Star, 
  Truck, 
  Zap,
  RefreshCw
} from 'lucide-react';

interface ProductFiltersProps {
  onFiltersChange: (filters: any) => void;
  currentFilters: any;
  categories?: Array<{ id: string; name: string; count: number }>;
  brands?: Array<{ id: string; name: string; count: number }>;
}

export default function ProductFilters({ 
  onFiltersChange, 
  currentFilters,
  categories = [],
  brands = []
}: ProductFiltersProps) {
  const [filters, setFilters] = useState({
    search: '',
    categoryIds: [] as string[],
    brandIds: [] as string[],
    priceRange: [0, 10000000],
    inStock: false,
    featured: false,
    rating: 0,
    sortBy: 'featured'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategoryIds = filters.categoryIds.includes(categoryId)
      ? filters.categoryIds.filter(id => id !== categoryId)
      : [...filters.categoryIds, categoryId];
    handleFilterChange('categoryIds', newCategoryIds);
  };

  const handleBrandToggle = (brandId: string) => {
    const newBrandIds = filters.brandIds.includes(brandId)
      ? filters.brandIds.filter(id => id !== brandId)
      : [...filters.brandIds, brandId];
    handleFilterChange('brandIds', newBrandIds);
  };

  const handlePriceRangeChange = (value: number[]) => {
    handleFilterChange('priceRange', value);
  };

  const handleRatingChange = (rating: number) => {
    handleFilterChange('rating', rating);
  };

  const handleSortChange = (sortBy: string) => {
    handleFilterChange('sortBy', sortBy);
  };

  const clearAllFilters = () => {
    const defaultFilters = {
      search: '',
      categoryIds: [],
      brandIds: [],
      priceRange: [0, 10000000],
      inStock: false,
      featured: false,
      rating: 0,
      sortBy: 'featured'
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) {
      return value.length > 0 && (Array.isArray(value) ? value.some(v => v !== 0) : value !== 0);
    }
    return value !== '' && value !== false && value !== 0;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const sortOptions = [
    { value: 'featured', label: 'Nổi bật' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price-low', label: 'Giá thấp → cao' },
    { value: 'price-high', label: 'Giá cao → thấp' },
    { value: 'rating', label: 'Đánh giá cao nhất' },
    { value: 'name-asc', label: 'Tên A-Z' },
    { value: 'name-desc', label: 'Tên Z-A' }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Bộ lọc
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-red-600 hover:text-red-700"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Xóa tất cả
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Sort Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sắp xếp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sortOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="sortBy"
                value={option.value}
                checked={filters.sortBy === option.value}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-blue-600"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      {categories.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Danh mục</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.categoryIds.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <span className="text-sm">{category.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </label>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Thương hiệu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.brandIds.includes(brand.id)}
                    onCheckedChange={() => handleBrandToggle(brand.id)}
                  />
                  <span className="text-sm">{brand.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {brand.count}
                </Badge>
              </label>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Khoảng giá</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceRangeChange}
            max={10000000}
            min={0}
            step={100000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
        </CardContent>
      </Card>

      {/* Rating Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Đánh giá</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.rating === rating}
                onChange={(e) => handleRatingChange(Number(e.target.value))}
                className="text-blue-600"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm ml-1">& trở lên</span>
              </div>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Other Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tùy chọn khác</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox
              checked={filters.inStock}
              onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
            />
            <div className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-green-600" />
              <span className="text-sm">Còn hàng</span>
            </div>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox
              checked={filters.featured}
              onCheckedChange={(checked) => handleFilterChange('featured', checked)}
            />
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span className="text-sm">Sản phẩm nổi bật</span>
            </div>
          </label>
        </CardContent>
      </Card>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Tìm kiếm: {filters.search}
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              
              {filters.categoryIds.map((id) => {
                const category = categories.find(c => c.id === id);
                return category ? (
                  <Badge key={id} variant="secondary" className="bg-green-100 text-green-800">
                    {category.name}
                    <button
                      onClick={() => handleCategoryToggle(id)}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
              
              {filters.brandIds.map((id) => {
                const brand = brands.find(b => b.id === id);
                return brand ? (
                  <Badge key={id} variant="secondary" className="bg-purple-100 text-purple-800">
                    {brand.name}
                    <button
                      onClick={() => handleBrandToggle(id)}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
              
              {filters.rating > 0 && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {filters.rating}⭐ trở lên
                  <button
                    onClick={() => handleRatingChange(0)}
                    className="ml-1 text-yellow-600 hover:text-yellow-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
