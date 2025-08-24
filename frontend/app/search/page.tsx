"use client"

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';
import { Search, Filter, Grid, List, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface SearchResult {
  id: string;
  type: 'product' | 'service' | 'project';
  title: string;
  description: string;
  image?: string;
  priceCents?: number;
  slug?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    priceRange: 'all'
  });

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    setError(null);

    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!base) {
        setError('API không khả dụng');
        setLoading(false);
        return;
      }

      const response = await fetch(`${base}/catalog/search?q=${encodeURIComponent(searchQuery)}&limit=50`);
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.items || []);
      } else {
        setError('Không thể tải kết quả tìm kiếm');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set('q', searchTerm.trim());
      window.history.pushState({}, '', url.toString());
      performSearch(searchTerm.trim());
    }
  };

  const filteredResults = results.filter(item => {
    if (filters.type !== 'all' && item.type !== filters.type) return false;
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.priceRange !== 'all' && item.priceCents) {
      const price = item.priceCents / 100;
      switch (filters.priceRange) {
        case 'under-100k':
          return price < 100000;
        case '100k-500k':
          return price >= 100000 && price < 500000;
        case '500k-1m':
          return price >= 500000 && price < 1000000;
        case 'over-1m':
          return price >= 1000000;
        default:
          return true;
      }
    }
    return true;
  });

  const getItemLink = (item: SearchResult) => {
    switch (item.type) {
      case 'product':
        return `/products/${item.slug}`;
      case 'service':
        return `/services/${item.slug}`;
      case 'project':
        return `/projects/${item.slug}`;
      default:
        return '#';
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'product':
        return '🎵';
      case 'service':
        return '🔧';
      case 'project':
        return '🏗️';
      default:
        return '📄';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Tìm kiếm</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm, dịch vụ, dự án..."
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Đang tìm...' : 'Tìm kiếm'}
              </Button>
            </div>
          </form>

          {/* Search Results Summary */}
          {query && (
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Kết quả tìm kiếm cho &ldquo;{query}&rdquo;: {filteredResults.length} kết quả
              </p>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Bộ lọc
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type Filter */}
                <div>
                  <h4 className="font-medium mb-2">Loại</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'Tất cả' },
                      { value: 'product', label: 'Sản phẩm' },
                      { value: 'service', label: 'Dịch vụ' },
                      { value: 'project', label: 'Dự án' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value={option.value}
                          checked={filters.type === option.value}
                          onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                          className="mr-2"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h4 className="font-medium mb-2">Khoảng giá</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'Tất cả' },
                      { value: 'under-100k', label: 'Dưới 100k' },
                      { value: '100k-500k', label: '100k - 500k' },
                      { value: '500k-1m', label: '500k - 1M' },
                      { value: 'over-1m', label: 'Trên 1M' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="priceRange"
                          value={option.value}
                          checked={filters.priceRange === option.value}
                          onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                          className="mr-2"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4">Đang tìm kiếm...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-6xl mb-4">❌</div>
                <h2 className="text-2xl font-bold mb-2">Có lỗi xảy ra</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => performSearch(query)}>Thử lại</Button>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold mb-2">Không tìm thấy kết quả</h2>
                <p className="text-gray-600 mb-4">
                  Thử tìm kiếm với từ khóa khác hoặc kiểm tra chính tả
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredResults.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getItemIcon(item.type)}</span>
                          <div>
                            <CardTitle className="text-lg">
                              <Link href={getItemLink(item)} className="hover:text-blue-600">
                                {item.title}
                              </Link>
                            </CardTitle>
                            <Badge variant="outline" className="mt-1">
                              {item.type === 'product' ? 'Sản phẩm' : 
                               item.type === 'service' ? 'Dịch vụ' : 'Dự án'}
                            </Badge>
                          </div>
                        </div>
                        {item.priceCents && (
                          <div className="text-right">
                            <p className="font-bold text-lg">{formatPrice(item.priceCents)}</p>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      
                      {item.rating && (
                        <div className="flex items-center gap-1 mb-3">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{item.rating}</span>
                          {item.reviewCount && (
                            <span className="text-sm text-gray-500">({item.reviewCount} đánh giá)</span>
                          )}
                        </div>
                      )}
                      
                      <Button asChild className="w-full">
                        <Link href={getItemLink(item)}>
                          Xem chi tiết
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
