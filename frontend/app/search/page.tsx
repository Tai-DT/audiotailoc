"use client"

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AdvancedSearch from '@/components/AdvancedSearch';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
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
  page?: number;
  pageSize?: number;
}

interface SearchResult {
  hits: any[];
  estimatedTotalHits?: number;
  page: number;
  pageSize: number;
  facetDistribution?: Record<string, any>;
  processingTimeMs?: number;
  query?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [results, setResults] = useState<SearchResult | null>(null);
  const [facets, setFacets] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse initial filters from URL
  const getFiltersFromParams = useCallback((): SearchFilters => {
    const filters: SearchFilters = {};
    
    if (searchParams.get('q')) filters.q = searchParams.get('q')!;
    if (searchParams.get('categoryId')) filters.categoryId = searchParams.get('categoryId')!;
    if (searchParams.get('minPrice')) filters.minPrice = parseInt(searchParams.get('minPrice')!);
    if (searchParams.get('maxPrice')) filters.maxPrice = parseInt(searchParams.get('maxPrice')!);
    if (searchParams.get('brand')) filters.brand = searchParams.get('brand')!;
    if (searchParams.get('inStock')) filters.inStock = searchParams.get('inStock') === 'true';
    if (searchParams.get('featured')) filters.featured = searchParams.get('featured') === 'true';
    if (searchParams.get('tags')) filters.tags = searchParams.get('tags')!.split(',');
    if (searchParams.get('sortBy')) filters.sortBy = searchParams.get('sortBy')!;
    if (searchParams.get('page')) filters.page = parseInt(searchParams.get('page')!);
    
    filters.pageSize = 20; // Default page size
    
    return filters;
  }, [searchParams]);

  // Update URL with filters
  const updateURL = (filters: SearchFilters) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) params.set(key, value.join(','));
        } else {
          params.set(key, value.toString());
        }
      }
    });

    router.push(`/search?${params.toString()}`);
  };

  // Perform search
  const performSearch = async (filters: SearchFilters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.set(key, value.toString());
          }
        }
      });

      const response = await fetch(`/api/catalog/search/advanced?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data = await response.json();
      setResults(data);
      
      // Update facets if available
      if (data.facetDistribution) {
        setFacets(data.facetDistribution);
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load initial facets
  const loadFacets = async () => {
    try {
      const response = await fetch('/api/catalog/search/facets');
      if (response.ok) {
        const data = await response.json();
        setFacets(data);
      }
    } catch (err) {
      console.error('Failed to load facets:', err);
    }
  };

  // Handle search
  const handleSearch = (filters: SearchFilters) => {
    const searchFilters = { ...filters, page: 1 }; // Reset to first page
    updateURL(searchFilters);
    performSearch(searchFilters);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const currentFilters = getFiltersFromParams();
    const newFilters = { ...currentFilters, page };
    updateURL(newFilters);
    performSearch(newFilters);
  };

  // Initial load
  useEffect(() => {
    loadFacets();
    const filters = getFiltersFromParams();
    if (Object.keys(filters).length > 1 || filters.q) { // Has filters or query
      performSearch(filters);
    }
  }, [getFiltersFromParams]);

  const currentFilters = getFiltersFromParams();
  const hasResults = results && results.hits.length > 0;
  const totalPages = results ? Math.ceil((results.estimatedTotalHits || 0) / results.pageSize) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tìm kiếm sản phẩm</h1>
        <p className="text-gray-600">Tìm kiếm và lọc sản phẩm theo nhu cầu của bạn</p>
      </div>

      {/* Advanced Search Component */}
      <AdvancedSearch
        onSearch={handleSearch}
        initialFilters={currentFilters}
        facets={facets}
      />

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Đang tìm kiếm...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>{error}</p>
              <Button 
                variant="outline" 
                onClick={() => performSearch(currentFilters)}
                className="mt-2"
              >
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {!loading && results && (
        <>
          {/* Results Summary */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">
                  {results.estimatedTotalHits === 0 ? (
                    'Không tìm thấy sản phẩm nào'
                  ) : (
                    <>
                      Tìm thấy <strong>{results.estimatedTotalHits}</strong> sản phẩm
                      {results.query && (
                        <> cho &quot;<strong>{results.query}</strong>&quot;</>
                      )}
                    </>
                  )}
                </p>
                {results.processingTimeMs && (
                  <p className="text-sm text-gray-500">
                    Thời gian xử lý: {results.processingTimeMs}ms
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {hasResults ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {results.hits.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(results.page - 1)}
                    disabled={results.page <= 1}
                  >
                    ← Trang trước
                  </Button>
                  
                  <span className="flex items-center px-4 py-2 text-sm text-gray-600">
                    Trang {results.page} / {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(results.page + 1)}
                    disabled={results.page >= totalPages}
                  >
                    Trang sau →
                  </Button>
                </div>
              )}
            </>
          ) : (
            !loading && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h3>
                    <p className="text-gray-600 mb-4">
                      Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                    <Button onClick={() => handleSearch({})}>
                      Xóa tất cả bộ lọc
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </>
      )}
    </div>
  );
}
