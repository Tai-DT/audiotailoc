'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/lib/hooks/use-categories';
import { Category } from '@/lib/types';
import { getMediaUrl } from '@/lib/utils';

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name');

  const { data: categories = [], isLoading } = useCategories();

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let items = categories.filter((category) => {
      if (!query) return true;
      return (
        category.name.toLowerCase().includes(query) ||
        (category.description || '').toLowerCase().includes(query)
      );
    });

    items = items.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name, 'vi');
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return items;
  }, [categories, searchQuery, sortBy]);

  const renderCategoryImage = (category: Category) => {
    const imageSrc = category.imageUrl ? getMediaUrl(category.imageUrl) : '/placeholder-product.svg';

    return (
      <Image
        src={imageSrc}
        alt={category.name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-b from-primary/5 to-background border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-3xl">
              <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Danh mục</div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Danh mục sản phẩm</h1>
              <p className="text-sm text-muted-foreground">Tìm kiếm sản phẩm theo từng danh mục</p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-4">
          <div className="animate-pulse" role="status" aria-label="Đang tải danh mục">
            <div className="h-6 bg-muted rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl">
            <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Danh mục</div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Danh mục sản phẩm</h1>
            <p className="text-sm text-muted-foreground">
              Khám phá các nhóm sản phẩm âm thanh phù hợp với nhu cầu của bạn.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm danh mục..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'createdAt')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Tên A → Z</SelectItem>
                <SelectItem value="createdAt">Mới nhất</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                aria-label="Xem dạng lưới"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                aria-label="Xem dạng danh sách"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            Không tìm thấy danh mục phù hợp.
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-3">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      {renderCategoryImage(category)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link href={`/danh-muc/${category.slug}`}>
                            <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                              {category.name}
                            </h3>
                          </Link>
                          <Badge variant="secondary" className="mt-1">Danh mục</Badge>
                        </div>
                        <Link href={`/danh-muc/${category.slug}`}>
                          <Button size="sm">Xem danh mục</Button>
                        </Link>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {category.description || 'Khám phá các sản phẩm nổi bật trong danh mục này.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative h-36 sm:h-40 md:h-48 rounded-t-lg overflow-hidden bg-muted">
                    {renderCategoryImage(category)}
                    <Badge className="absolute top-3 left-3 bg-primary text-foreground">Danh mục</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <Link href={`/danh-muc/${category.slug}`}>
                    <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                      {category.name}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {category.description || 'Khám phá các sản phẩm nổi bật trong danh mục này.'}
                  </p>
                  <Link href={`/danh-muc/${category.slug}`}>
                    <Button size="sm" variant="outline">Xem danh mục</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
