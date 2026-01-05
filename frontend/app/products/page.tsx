'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts, useCategories } from '@/lib/hooks/use-api';
import { ProductFilters } from '@/lib/types';
import { ProductGrid } from '@/components/products/product-grid';
import { toast } from 'react-hot-toast';
import { useCart } from '@/components/providers/cart-provider';
import { parseImages } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageBanner } from '@/components/shared/page-banner';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');

  const { addItem: addCartItem } = useCart();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [_categoryNotFound, setCategoryNotFound] = React.useState(false);
  const [filters, setFilters] = React.useState<ProductFilters>({
    page: 1,
    pageSize: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const { data, isLoading } = useProducts(filters);
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Set category filter based on URL parameter
  React.useEffect(() => {
    if (!categories) return;

    if (categorySlug) {
      const category = categories.find((cat: { slug: string; id: string }) => cat.slug === categorySlug);
      if (category) {
        setFilters((prev: ProductFilters) => ({ ...prev, categoryId: category.id, page: 1 }));
        setCategoryNotFound(false);
      } else {
        // Category slug not found in database
        setCategoryNotFound(true);
        setFilters((prev: ProductFilters) => ({ ...prev, categoryId: undefined, page: 1 }));
      }
    } else {
      // Clear category filter when no slug in URL
      setFilters((prev: ProductFilters) => ({ ...prev, categoryId: undefined, page: 1 }));
      setCategoryNotFound(false);
    }
  }, [categorySlug, categories]);

  const handleFiltersChange = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev: ProductFilters) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleAddToCart = async (productId: string) => {
    const product = data?.items.find((item: { id: string }) => item.id === productId);

    if (!product) {
      toast.error('Không tìm thấy sản phẩm để thêm vào giỏ hàng');
      return;
    }

    try {
      const images = parseImages(product.images, product.imageUrl);
      addCartItem({
        id: product.id,
        name: product.name,
        price: product.priceCents / 100, // Convert cents to VND
        image: images[0] || '/placeholder-product.svg',
        category: product.category?.name || 'Uncategorized',
        description: product.shortDescription || product.description,
      }, 1);
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleFiltersChange({ q: searchQuery.trim() || undefined });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryNotFound(false);
    setFilters({
      page: 1,
      pageSize: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    // Clear URL parameter
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('category');
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Get current category name for display
  const currentCategory = categories?.find((cat: { id: string }) => cat.id === filters.categoryId);

  return (
    <main className="min-h-screen bg-background" role="main" aria-labelledby="products-title">
      {/* Hero Banner */}
      <PageBanner 
        page="products" 
        fallbackTitle={currentCategory ? currentCategory.name : "Tất cả sản phẩm"}
        fallbackSubtitle={currentCategory?.description || "Khám phá hàng ngàn thiết bị âm thanh chính hãng"}
      />

      {/* Category Not Found Alert */}
        <div className="border-b bg-destructive/5" role="alert" aria-live="assertive">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-destructive">
              <X className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span><strong>Không tìm thấy &quot;{categorySlug}&quot;</strong> - Hiển thị tất cả sản phẩm</span>
            </div>
          </div>
        </div>

      {/* Search and Filters */}
      <section className="py-3 bg-muted/30 border-b" aria-labelledby="filters-title">
        <div className="container mx-auto px-4">
          <h2 id="filters-title" className="sr-only">Bộ lọc và Tìm kiếm</h2>
          <div className="bg-background rounded-lg p-3 shadow-sm">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 mb-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  aria-label="Tìm kiếm sản phẩm"
                />
              </div>
              <Button type="submit" variant="default" className="w-full sm:w-auto h-9">
                <Search className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Tìm kiếm</span>
              </Button>
            </form>

            <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-start sm:items-center">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                <span>Lọc:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full sm:w-auto sm:flex sm:flex-wrap">
                <Select
                  value={filters.categoryId || 'all'}
                  onValueChange={(value: string) => {
                    const newCategoryId = value === 'all' ? undefined : value;
                    handleFiltersChange({ categoryId: newCategoryId });

                    // Update URL parameter
                    if (typeof window !== 'undefined') {
                      const url = new URL(window.location.href);
                      if (newCategoryId) {
                        const category = categories?.find((cat: { id: string; slug: string }) => cat.id === newCategoryId);
                        if (category) {
                          url.searchParams.set('category', category.slug);
                        }
                      } else {
                        url.searchParams.delete('category');
                      }
                      window.history.replaceState({}, '', url.toString());
                    }
                  }}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger className="w-full sm:w-44 h-9 text-sm">
                    <SelectValue placeholder={categoriesLoading ? "Đang tải..." : "Tất cả danh mục"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {categories?.map((category: { id: string; name: string }) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.brand || 'all'}
                  onValueChange={(value: string) => handleFiltersChange({ brand: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger className="w-full sm:w-44 h-9 text-sm">
                    <SelectValue placeholder="Tất cả thương hiệu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả thương hiệu</SelectItem>
                    {/* Add brand options here */}
                  </SelectContent>
                </Select>

                <Select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onValueChange={(value: string) => {
                    const [sortByRaw, sortOrder] = value.split('-');
                    // Normalize legacy 'priceCents' into 'price' to satisfy ProductFilters
                    const normalizedSortBy = sortByRaw === 'priceCents' ? 'price' : sortByRaw;
                    handleFiltersChange({
                      sortBy: normalizedSortBy as 'createdAt' | 'name' | 'price' | 'updatedAt' | 'viewCount',
                      sortOrder: sortOrder as 'asc' | 'desc'
                    });
                  }}
                >
                  <SelectTrigger className="w-full sm:w-44 h-9 text-sm">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">Mới nhất</SelectItem>
                    <SelectItem value="name-asc">Tên A-Z</SelectItem>
                    <SelectItem value="name-desc">Tên Z-A</SelectItem>
                    <SelectItem value="price-asc">Giá thấp đến cao</SelectItem>
                    <SelectItem value="price-desc">Giá cao đến thấp</SelectItem>
                    <SelectItem value="viewCount-desc">Xem nhiều nhất</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="w-full sm:w-auto sm:ml-auto h-9 text-sm"
              >
                <X className="h-3.5 w-3.5 mr-1.5" />
                <span className="hidden sm:inline">Xóa bộ lọc</span>
                <span className="sm:hidden">Xóa</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-4" aria-labelledby="products-grid-title">
        <div className="container mx-auto px-4">
          <h2 id="products-grid-title" className="sr-only">Danh sách sản phẩm</h2>
          {/* Product Count and Active Filters */}
          {(currentCategory || filters.q) && (
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground" role="status" aria-live="polite">
              <span>
                {data?.items.length || 0} sản phẩm
                {currentCategory && <span className="font-medium text-foreground"> • {currentCategory.name}</span>}
                {filters.q && <span className="font-medium text-foreground"> • &quot;{filters.q}&quot;</span>}
              </span>
            </div>
          )}

          <ProductGrid
            products={data?.items || []}
            loading={isLoading || categoriesLoading}
            onAddToCart={handleAddToCart}
          />
        </div>
      </section>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}