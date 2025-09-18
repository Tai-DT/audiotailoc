'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/product-card';
import { ProductFilters } from '@/components/products/product-filters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProductSearch } from '@/lib/hooks/use-api';
import { ProductFilters as ProductFiltersType } from '@/lib/types';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowLeft
} from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = React.useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState<ProductFiltersType>({
    page: 1,
    pageSize: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const { data: searchResults, isLoading, error } = useProductSearch(query, 50);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    router.push('/search');
  };

  const handleFiltersChange = (newFilters: Partial<ProductFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const filteredResults = React.useMemo(() => {
    if (!searchResults) return [];

    let results = [...searchResults];

    // Apply category filter
    if (filters.categoryId) {
      results = results.filter(product =>
        product.category?.slug === filters.categoryId ||
        product.category?.name.toLowerCase().includes(filters.categoryId!.toLowerCase())
      );
    }

    // Apply price range filter
    if (filters.minPrice !== undefined) {
      results = results.filter(product => product.priceCents >= filters.minPrice! * 100);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(product => product.priceCents <= filters.maxPrice! * 100);
    }

    // Apply brand filter
    if (filters.brand) {
      results = results.filter(product =>
        product.brand?.toLowerCase().includes(filters.brand!.toLowerCase())
      );
    }

    // Apply sorting
    results.sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (filters.sortBy) {
        case 'price':
          aValue = a.priceCents;
          bValue = b.priceCents;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return results;
  }, [searchResults, filters]);

  const hasActiveFilters = !!(
    filters.categoryId ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.brand ||
    (filters.sortBy !== 'createdAt') ||
    (filters.sortOrder !== 'desc')
  );

  const clearAllFilters = () => {
    setFilters({
      page: 1,
      pageSize: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Trang chủ
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-2xl font-bold">Tìm kiếm sản phẩm</h1>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={!query.trim()}>
              <Search className="mr-2 h-4 w-4" />
              Tìm kiếm
            </Button>
            {query && (
              <Button variant="outline" onClick={handleClearSearch}>
                <X className="mr-2 h-4 w-4" />
                Xóa
              </Button>
            )}
          </form>

          {/* Search Results Summary */}
          {query && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <p className="text-muted-foreground">
                  {isLoading ? (
                    'Đang tìm kiếm...'
                  ) : (
                    `Tìm thấy ${filteredResults.length} sản phẩm cho "${query}"`
                  )}
                </p>
                {hasActiveFilters && (
                  <Badge variant="secondary">
                    Có bộ lọc đang hoạt động
                  </Badge>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Bộ lọc
                {hasActiveFilters && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    !
                  </Badge>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Bộ lọc</CardTitle>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ProductFilters
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Search Results */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-square bg-muted" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <h2 className="text-xl font-semibold text-destructive mb-2">
                  Lỗi tìm kiếm
                </h2>
                <p className="text-muted-foreground">
                  Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.
                </p>
              </div>
            ) : !query ? (
              <div className="text-center py-16">
                <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  Bắt đầu tìm kiếm
                </h2>
                <p className="text-muted-foreground">
                  Nhập từ khóa để tìm kiếm sản phẩm bạn quan tâm.
                </p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-16">
                <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  Không tìm thấy sản phẩm
                </h2>
                <p className="text-muted-foreground mb-4">
                  Không có sản phẩm nào phù hợp với từ khóa &quot;{query}&quot;.
                </p>
                <div className="flex justify-center space-x-4">
                  <Link href="/products">
                    <Button variant="outline">
                      Xem tất cả sản phẩm
                    </Button>
                  </Link>
                  <Button onClick={handleClearSearch}>
                    Tìm kiếm lại
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredResults.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(id) => console.log('Add to cart:', id)}
                    onAddToWishlist={(id) => console.log('Add to wishlist:', id)}
                    onViewProduct={(id) => console.log('View product:', id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Popular Searches */}
        {!query && (
          <div className="mt-16">
            <Card>
              <CardHeader>
                <CardTitle>Tìm kiếm phổ biến</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Loa Bluetooth',
                    'Micro thu âm',
                    'Ampli karaoke',
                    'Tai nghe gaming',
                    'Mixer âm thanh',
                    'Hệ thống âm thanh gia đình'
                  ].map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuery(term);
                        router.push(`/search?q=${encodeURIComponent(term)}`);
                      }}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
