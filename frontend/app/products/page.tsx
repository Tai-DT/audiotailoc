'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Grid, List, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ProductCard from '@/components/ui/ProductCard';
import { useProductStore } from '@/lib/store';
import { ProductFilters } from '@/lib/types-prisma';

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const { products, categories, isLoading, getProducts, getCategories, setFilters } = useProductStore();

  // Mock brands - in real app, this would come from API
  const brands = ['Sony', 'Audio-Technica', 'Sennheiser', 'Bose', 'Yamaha', 'Pioneer', 'JBL', 'Focal'];

  const searchParams = useSearchParams();

  useEffect(() => {
    getCategories();
    // Initialize category filter from URL if present
    const cid = searchParams.get('categoryId') || searchParams.get('category');
    if (cid) {
      setSelectedCategories([cid]);
    }
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCategories]);

  useEffect(() => {
    const delayedLoad = setTimeout(() => {
      loadProducts();
    }, 500);

    return () => clearTimeout(delayedLoad);
  }, [searchQuery, selectedBrands, selectedCategories, priceRange, sortBy, sortOrder]);

  const loadProducts = () => {
    const filters: ProductFilters = {
      search: searchQuery || undefined,
      brand: selectedBrands.length > 0 ? selectedBrands.join(',') : undefined,
      categoryId: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy: sortBy as 'price' | 'name' | 'createdAt' | 'viewCount',
      sortOrder,
      page: 1,
      limit: 20
    };
    
    setFilters(filters);
    getProducts(filters);
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    setSelectedBrands(prev => 
      checked ? [...prev, brand] : prev.filter(b => b !== brand)
    );
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories(prev => 
      checked ? [...prev, categoryId] : prev.filter(c => c !== categoryId)
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange([0, 50000000]);
    setSortBy('name');
    setSortOrder('asc');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const FiltersSidebar = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label htmlFor="search">Tìm kiếm</Label>
        <Input
          id="search"
          placeholder="Tên sản phẩm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2"
        />
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <Label className="text-sm font-semibold">Danh mục</Label>
        <div className="mt-3 space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => 
                  handleCategoryChange(category.id, checked as boolean)
                }
              />
              <Label 
                htmlFor={`category-${category.id}`} 
                className="text-sm cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <Label className="text-sm font-semibold">Thương hiệu</Label>
        <div className="mt-3 space-y-3">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => 
                  handleBrandChange(brand, checked as boolean)
                }
              />
              <Label 
                htmlFor={`brand-${brand}`} 
                className="text-sm cursor-pointer"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <Label className="text-sm font-semibold">Khoảng giá</Label>
        <div className="mt-3 space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={50000000}
            step={100000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Clear Filters */}
      <Button 
        variant="outline" 
        onClick={clearFilters}
        className="w-full"
      >
        <X className="h-4 w-4 mr-2" />
        Xóa bộ lọc
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Sản phẩm</h1>
        <p className="text-gray-600">
          Khám phá bộ sưu tập thiết bị âm thanh chất lượng cao
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Bộ lọc</h3>
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <FiltersSidebar />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Results Count and Mobile Filter */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {products.length} sản phẩm
                </span>
                
                {/* Mobile Filters */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Bộ lọc
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersSidebar />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Sort and View Controls */}
              <div className="flex items-center gap-4">
                {/* Sort */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="sort" className="text-sm">Sắp xếp:</Label>
                  <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                    const [newSortBy, newSortOrder] = value.split('-');
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder as 'asc' | 'desc');
                  }}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name-asc">Tên A-Z</SelectItem>
                      <SelectItem value="name-desc">Tên Z-A</SelectItem>
                      <SelectItem value="price-asc">Giá thấp đến cao</SelectItem>
                      <SelectItem value="price-desc">Giá cao đến thấp</SelectItem>
                      <SelectItem value="createdAt-desc">Mới nhất</SelectItem>
                      <SelectItem value="viewCount-desc">Phổ biến nhất</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedBrands.length > 0 || selectedCategories.length > 0 || searchQuery) && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Tìm kiếm: {searchQuery}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => setSearchQuery('')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  {selectedBrands.map(brand => (
                    <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                      {brand}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleBrandChange(brand, false)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  {selectedCategories.map(categoryId => {
                    const category = categories.find(c => c.id === categoryId);
                    return category ? (
                      <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                        {category.name}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleCategoryChange(categoryId, false)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Products Grid/List */}
          {isLoading ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-[400px]"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  variant={viewMode === 'list' ? 'compact' : 'default'}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Filter className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">Không tìm thấy sản phẩm nào</p>
                <p className="text-sm">Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
              <Button variant="outline" onClick={clearFilters}>
                Xóa tất cả bộ lọc
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
