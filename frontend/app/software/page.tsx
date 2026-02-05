'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCategories, useProducts } from '@/lib/hooks/use-api';
import { ProductFilters } from '@/lib/types';
import { ProductGrid } from '@/components/products/product-grid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Search, ArrowUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function SoftwarePageContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');

  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState<ProductFilters>({
    page: 1,
    pageSize: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    isDigital: true,
  });

  const { data, isLoading } = useProducts(filters);
  const { data: categories } = useCategories();

  React.useEffect(() => {
    if (!categories) return;

    if (categorySlug) {
      const category = categories.find((cat: { slug: string; id: string }) => cat.slug === categorySlug);
      if (category) {
        setFilters((prev: ProductFilters) => ({ ...prev, categoryId: category.id, page: 1 }));
      } else {
        setFilters((prev: ProductFilters) => ({ ...prev, categoryId: undefined, page: 1 }));
      }
    } else {
      setFilters((prev: ProductFilters) => ({ ...prev, categoryId: undefined, page: 1 }));
    }
  }, [categorySlug, categories]);

  const handleFiltersChange = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev: ProductFilters) => ({ ...prev, ...newFilters, page: 1, isDigital: true }));
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleFiltersChange({ q: searchQuery.trim() || undefined });
  };

  const handleCategoryChange = (categoryId: string | undefined) => {
    handleFiltersChange({ categoryId });
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (categoryId) {
        const category = categories?.find((cat: { id: string; slug: string }) => cat.id === categoryId);
        if (category) {
          url.searchParams.set('category', category.slug);
        }
      } else {
        url.searchParams.delete('category');
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  const totalPages = data?.totalPages || 1;
  const currentPage = filters.page || 1;

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground">Digital</p>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-2">
                Phần mềm
              </h1>
              <p className="text-muted-foreground mt-3 max-w-2xl">
                Thanh toán PayOS và tải xuống ngay sau khi giao dịch hoàn tất.
              </p>
            </div>
            <div className="hidden md:flex h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 items-center justify-center">
              <Download className="h-7 w-7 text-primary" />
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-[64px] sm:top-[80px] z-40 bg-background/80 backdrop-blur-xl border-b border-border/60">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 items-stretch lg:items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm phần mềm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-11 rounded-2xl"
                />
              </div>
            </form>

            <div className="flex items-center gap-3">
              <Select
                value={filters.categoryId || 'all'}
                onValueChange={(value) => handleCategoryChange(value === 'all' ? undefined : value)}
              >
                <SelectTrigger className="w-[180px] h-11 rounded-2xl">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {(categories || []).map((category: { id: string; name: string }) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={(value) => {
                  const [sortByRaw, sortOrder] = value.split('-');
                  handleFiltersChange({
                    sortBy: sortByRaw as ProductFilters['sortBy'],
                    sortOrder: sortOrder as ProductFilters['sortOrder'],
                  });
                }}
              >
                <SelectTrigger className="w-[180px] h-11 rounded-2xl">
                  <ArrowUpDown className="w-4 h-4 mr-2 text-primary" />
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Mới nhất</SelectItem>
                  <SelectItem value="createdAt-asc">Cũ nhất</SelectItem>
                  <SelectItem value="price-desc">Giá cao</SelectItem>
                  <SelectItem value="price-asc">Giá thấp</SelectItem>
                  <SelectItem value="viewCount-desc">Xem nhiều</SelectItem>
                  <SelectItem value="name-asc">Tên A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-8">
        <ProductGrid
          products={data?.items || []}
          loading={isLoading}
          basePath="/software"
          ariaLabel="Danh sách phần mềm"
        />

        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, currentPage - 1), isDigital: true }))}
            >
              Trước
            </Button>
            <div className="text-sm text-muted-foreground px-2">
              Trang {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setFilters((prev) => ({ ...prev, page: Math.min(totalPages, currentPage + 1), isDigital: true }))}
            >
              Sau
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}

export default function SoftwarePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center gap-3 text-muted-foreground">
        <Download className="h-5 w-5 animate-pulse" />
        Loading…
      </div>
    }>
      <SoftwarePageContent />
    </Suspense>
  );
}

