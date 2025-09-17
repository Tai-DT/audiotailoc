'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServiceFilters as ServiceFiltersType } from '@/lib/types';
import { useServiceTypes } from '@/lib/hooks/use-api';
import { Filter, X } from 'lucide-react';

interface ServiceFiltersProps {
  filters: ServiceFiltersType;
  onFiltersChange: (filters: Partial<ServiceFiltersType>) => void;
}

export function ServiceFilters({ filters, onFiltersChange }: ServiceFiltersProps) {
  const { data: serviceTypes } = useServiceTypes();
  const handlePriceRangeChange = (minPrice?: number, maxPrice?: number) => {
    onFiltersChange({
      minPrice,
      maxPrice
    });
  };

  const handleServiceTypeChange = (typeId?: string) => {
    onFiltersChange({
      typeId
    });
  };

  const handleSortChange = (sortBy: 'createdAt' | 'name' | 'price' | 'viewCount', sortOrder: 'asc' | 'desc') => {
    onFiltersChange({
      sortBy,
      sortOrder
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      minPrice: undefined,
      maxPrice: undefined,
      typeId: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = filters.minPrice || filters.maxPrice || filters.typeId;

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Bộ lọc</span>
            </CardTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Xóa
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Khoảng giá</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant={!filters.minPrice && !filters.maxPrice ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => handlePriceRangeChange()}
          >
            Tất cả
          </Button>
          <Button
            variant={filters.minPrice === 0 && filters.maxPrice === 5000000 ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => handlePriceRangeChange(0, 5000000)}
          >
            Dưới 5 triệu
          </Button>
          <Button
            variant={filters.minPrice === 5000000 && filters.maxPrice === 20000000 ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => handlePriceRangeChange(5000000, 20000000)}
          >
            5 - 20 triệu
          </Button>
          <Button
            variant={filters.minPrice === 20000000 && !filters.maxPrice ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => handlePriceRangeChange(20000000)}
          >
            Trên 20 triệu
          </Button>
        </CardContent>
      </Card>

      {/* Service Type Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Loại dịch vụ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant={!filters.typeId ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => handleServiceTypeChange()}
          >
            Tất cả
          </Button>
          {serviceTypes?.map((type) => (
            <Button
              key={type.id}
              variant={filters.typeId === type.id ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => handleServiceTypeChange(type.id)}
            >
              {type.name}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Sort Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sắp xếp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant={filters.sortBy === 'createdAt' && filters.sortOrder === 'desc' ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => handleSortChange('createdAt', 'desc')}
          >
            Mới nhất
          </Button>
          <Button
            variant={filters.sortBy === 'price' && filters.sortOrder === 'asc' ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => handleSortChange('price', 'asc')}
          >
            Giá thấp đến cao
          </Button>
          <Button
            variant={filters.sortBy === 'price' && filters.sortOrder === 'desc' ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => handleSortChange('price', 'desc')}
          >
            Giá cao đến thấp
          </Button>
          <Button
            variant={filters.sortBy === 'name' && filters.sortOrder === 'asc' ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => handleSortChange('name', 'asc')}
          >
            Tên A-Z
          </Button>
        </CardContent>
      </Card>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Bộ lọc đang áp dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filters.minPrice && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Giá từ: {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(filters.minPrice)}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handlePriceRangeChange(undefined, filters.maxPrice)}
                  />
                </Badge>
              )}
              {filters.maxPrice && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Giá đến: {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(filters.maxPrice)}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handlePriceRangeChange(filters.minPrice)}
                  />
                </Badge>
              )}
              {filters.typeId && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Loại: {serviceTypes?.find(type => type.id === filters.typeId)?.name || filters.typeId}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleServiceTypeChange()}
                  />
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}