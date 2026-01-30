'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProductFilters as ProductFiltersType } from '@/lib/types';
import { useCategories } from '@/lib/hooks/use-api';
import { X, Filter } from 'lucide-react';

interface ProductFiltersProps {
 filters: ProductFiltersType;
 onFiltersChange: (filters: Partial<ProductFiltersType>) => void;
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
 const { data: categories } = useCategories();
 const [priceRange, setPriceRange] = React.useState({
 min: filters.minPrice || '',
 max: filters.maxPrice || ''
 });

 const handlePriceChange = (field: 'min' | 'max', value: string) => {
 const newPriceRange = { ...priceRange, [field]: value };
 setPriceRange(newPriceRange);
 // Apply price filter after a short delay
 setTimeout(() => {
 onFiltersChange({
 minPrice: newPriceRange.min ? Number(newPriceRange.min) : undefined,
 maxPrice: newPriceRange.max ? Number(newPriceRange.max) : undefined
 });
 }, 500);
 };

 const clearFilters = () => {
 onFiltersChange({
 q: undefined,
 minPrice: undefined,
 maxPrice: undefined,
 categoryId: undefined,
 brand: undefined,
 featured: undefined,
 isActive: undefined,
 inStock: undefined,
 tags: undefined
 });
 setPriceRange({ min: '', max: '' });
 };

 const hasActiveFilters = !!(
 filters.q ||
 filters.minPrice ||
 filters.maxPrice ||
 filters.categoryId ||
 filters.brand ||
 filters.featured ||
 filters.inStock
 );

 const formatPrice = (cents: number) => {
 return new Intl.NumberFormat('vi-VN').format(cents);
 };

 return (
 <div className="space-y-6">
 {/* Search */}
 <Card>
 <CardHeader className="pb-3">
 <CardTitle className="text-sm font-medium flex items-center">
 <Filter className="w-4 h-4 mr-2" />
 Tìm kiếm & Lọc
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-4">
 <div>
 <Input
 type="text"
 placeholder="Tìm kiếm sản phẩm..."
 value={filters.q || ''}
 onChange={(e) => onFiltersChange({ q: e.target.value })}
 />
 </div>
 {hasActiveFilters && (
 <Button
 variant="outline"
 size="sm"
 onClick={clearFilters}
 className="w-full"
 >
 <X className="w-4 h-4 mr-2" />
 Xóa bộ lọc
 </Button>
 )}
 </CardContent>
 </Card>

 {/* Categories */}
 {categories && categories.length > 0 && (
 <Card>
 <CardHeader className="pb-3">
 <CardTitle className="text-sm font-medium">Danh mục</CardTitle>
 </CardHeader>
 <CardContent>
 <div className="space-y-2">
 <button
 onClick={() => onFiltersChange({ categoryId: undefined })}
 className={`block w-full text-left text-sm p-2 rounded ${
 !filters.categoryId
 ? 'bg-primary text-primary-foreground'
 : 'hover:bg-muted'
 }`}
 >
 Tất cả danh mục
 </button>
 {categories.map((category) => (
 <button
 key={category.id}
 onClick={() => onFiltersChange({ categoryId: category.id })}
 className={`block w-full text-left text-sm p-2 rounded ${
 filters.categoryId === category.id
 ? 'bg-primary text-primary-foreground'
 : 'hover:bg-muted'
 }`}
 >
 {category.name}
 </button>
 ))}
 </div>
 </CardContent>
 </Card>
 )}

 {/* Price Range */}
 <Card>
 <CardHeader className="pb-3">
 <CardTitle className="text-sm font-medium">Khoảng giá</CardTitle>
 </CardHeader>
 <CardContent className="space-y-3">
 <div className="grid grid-cols-2 gap-2">
 <Input
 type="number"
 placeholder="Từ"
 value={priceRange.min}
 onChange={(e) => handlePriceChange('min', e.target.value)}
 />
 <Input
 type="number"
 placeholder="Đến"
 value={priceRange.max}
 onChange={(e) => handlePriceChange('max', e.target.value)}
 />
 </div>
 {/* Quick Price Filters */}
 <div className="space-y-2">
 <p className="text-xs text-muted-foreground">Lọc nhanh:</p>
 <div className="grid grid-cols-2 gap-1">
 <Button
 variant="outline"
 size="sm"
 onClick={() => onFiltersChange({ maxPrice: 1000000 })}
 className="text-xs"
 >
 Dưới 1M
 </Button>
 <Button
 variant="outline"
 size="sm"
 onClick={() => onFiltersChange({ minPrice: 1000000, maxPrice: 5000000 })}
 className="text-xs"
 >
 1M - 5M
 </Button>
 <Button
 variant="outline"
 size="sm"
 onClick={() => onFiltersChange({ minPrice: 5000000, maxPrice: 10000000 })}
 className="text-xs"
 >
 5M - 10M
 </Button>
 <Button
 variant="outline"
 size="sm"
 onClick={() => onFiltersChange({ minPrice: 10000000 })}
 className="text-xs"
 >
 Trên 10M
 </Button>
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Features */}
 <Card>
 <CardHeader className="pb-3">
 <CardTitle className="text-sm font-medium">Tính năng</CardTitle>
 </CardHeader>
 <CardContent className="space-y-3">
 <label className="flex items-center space-x-2">
 <input
 type="checkbox"
 checked={filters.featured || false}
 onChange={(e) => onFiltersChange({ featured: e.target.checked || undefined })}
 className="rounded"
 />
 <span className="text-sm">Sản phẩm nổi bật</span>
 </label>
 <label className="flex items-center space-x-2">
 <input
 type="checkbox"
 checked={filters.inStock || false}
 onChange={(e) => onFiltersChange({ inStock: e.target.checked || undefined })}
 className="rounded"
 />
 <span className="text-sm">Còn hàng</span>
 </label>
 <label className="flex items-center space-x-2">
 <input
 type="checkbox"
 checked={filters.isActive || false}
 onChange={(e) => onFiltersChange({ isActive: e.target.checked || undefined })}
 className="rounded"
 />
 <span className="text-sm">Đang hoạt động</span>
 </label>
 </CardContent>
 </Card>

 {/* Brand */}
 <Card>
 <CardHeader className="pb-3">
 <CardTitle className="text-sm font-medium">Thương hiệu</CardTitle>
 </CardHeader>
 <CardContent>
 <Input
 type="text"
 placeholder="Nhập thương hiệu..."
 value={filters.brand || ''}
 onChange={(e) => onFiltersChange({ brand: e.target.value || undefined })}
 />
 </CardContent>
 </Card>

 {/* Active Filters */}
 {hasActiveFilters && (
 <Card>
 <CardHeader className="pb-3">
 <CardTitle className="text-sm font-medium">Bộ lọc đang áp dụng</CardTitle>
 </CardHeader>
 <CardContent>
 <div className="flex flex-wrap gap-2">
 {filters.q && (
 <Badge variant="secondary" className="text-xs">
 Tìm kiếm: {filters.q}
 <button
 onClick={() => onFiltersChange({ q: undefined })}
 className="ml-1 hover:text-destructive"
 title="Xóa bộ lọc tìm kiếm"
 >
 <X className="w-3 h-3" />
 </button>
 </Badge>
 )}
 {filters.categoryId && (
 <Badge variant="secondary" className="text-xs">
 Danh mục
 <button
 onClick={() => onFiltersChange({ categoryId: undefined })}
 className="ml-1 hover:text-destructive"
 title="Xóa bộ lọc danh mục"
 >
 <X className="w-3 h-3" />
 </button>
 </Badge>
 )}
 {(filters.minPrice || filters.maxPrice) && (
 <Badge variant="secondary" className="text-xs">
 Giá: {filters.minPrice ? formatPrice(filters.minPrice) : '0'} - {filters.maxPrice ? formatPrice(filters.maxPrice) : '∞'}
 <button
 onClick={() => onFiltersChange({ minPrice: undefined, maxPrice: undefined })}
 className="ml-1 hover:text-destructive"
 title="Xóa bộ lọc giá"
 >
 <X className="w-3 h-3" />
 </button>
 </Badge>
 )}
 {filters.featured && (
 <Badge variant="secondary" className="text-xs">
 Nổi bật
 <button
 onClick={() => onFiltersChange({ featured: undefined })}
 className="ml-1 hover:text-destructive"
 title="Xóa bộ lọc nổi bật"
 >
 <X className="w-3 h-3" />
 </button>
 </Badge>
 )}
 {filters.inStock && (
 <Badge variant="secondary" className="text-xs">
 Còn hàng
 <button
 onClick={() => onFiltersChange({ inStock: undefined })}
 className="ml-1 hover:text-destructive"
 title="Xóa bộ lọc còn hàng"
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
