'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServiceFilters as ServiceFiltersType } from '@/lib/types';
import { useServiceTypes } from '@/lib/hooks/use-api';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceFiltersProps {
 filters: ServiceFiltersType;
 onFiltersChange: (filters: Partial<ServiceFiltersType>) => void;
 className?: string;
}

export function ServiceFilters({ filters, onFiltersChange, className }: ServiceFiltersProps) {
 const { data: serviceTypes } = useServiceTypes();

 const handlePriceRangeChange = (minPrice?: number, maxPrice?: number) => {
 onFiltersChange({ minPrice, maxPrice });
 };

 const handleServiceTypeChange = (typeId?: string) => {
 onFiltersChange({ typeId });
 };

 const handleSortChange = (sortBy: 'createdAt' | 'name' | 'price', sortOrder: 'asc' | 'desc') => {
 onFiltersChange({ sortBy, sortOrder });
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

 const priceRanges = [
 { label: 'Tất cả', min: undefined, max: undefined },
 { label: 'Dưới 5 triệu', min: 0, max: 5000000 },
 { label: '5 - 20 triệu', min: 5000000, max: 20000000 },
 { label: 'Trên 20 triệu', min: 20000000, max: undefined },
 ];

 const sortOptions = [
 { label: 'Mới nhất', sortBy: 'createdAt' as const, sortOrder: 'desc' as const },
 { label: 'Giá thấp → cao', sortBy: 'price' as const, sortOrder: 'asc' as const },
 { label: 'Giá cao → thấp', sortBy: 'price' as const, sortOrder: 'desc' as const },
 ];

 return (
 <div className={cn("bg-card rounded-xl border border-border/60 p-4 space-y-5", className)}>
 {/* Header */}
 <div className="flex items-center justify-between">
 <h3 className="font-medium">Bộ lọc</h3>
 {hasActiveFilters && (
 <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2 text-xs">
 <X className="h-3 w-3 mr-1" />
 Xóa
 </Button>
 )}
 </div>

 {/* Service Type */}
 <div className="space-y-2">
 <p className="text-sm font-medium text-muted-foreground">Loại dịch vụ</p>
 <div className="flex flex-wrap gap-2">
 <Badge
 variant={!filters.typeId ? "default" : "outline"}
 className="cursor-pointer"
 onClick={() => handleServiceTypeChange()}
 >
 Tất cả
 </Badge>
 {serviceTypes?.map((type) => (
 <Badge
 key={type.id}
 variant={filters.typeId === type.id ? "default" : "outline"}
 className="cursor-pointer"
 onClick={() => handleServiceTypeChange(type.id)}
 >
 {type.name}
 </Badge>
 ))}
 </div>
 </div>

 {/* Price Range */}
 <div className="space-y-2">
 <p className="text-sm font-medium text-muted-foreground">Khoảng giá</p>
 <div className="flex flex-wrap gap-2">
 {priceRanges.map((range) => {
 const isActive = range.min === undefined && range.max === undefined
 ? !filters.minPrice && !filters.maxPrice
 : filters.minPrice === range.min && filters.maxPrice === range.max;
 return (
 <Badge
 key={range.label}
 variant={isActive ? "default" : "outline"}
 className="cursor-pointer"
 onClick={() => handlePriceRangeChange(range.min, range.max)}
 >
 {range.label}
 </Badge>
 );
 })}
 </div>
 </div>

 {/* Sort */}
 <div className="space-y-2">
 <p className="text-sm font-medium text-muted-foreground">Sắp xếp</p>
 <div className="flex flex-wrap gap-2">
 {sortOptions.map((option) => {
 const isActive = filters.sortBy === option.sortBy && filters.sortOrder === option.sortOrder;
 return (
 <Badge
 key={option.label}
 variant={isActive ? "default" : "outline"}
 className="cursor-pointer"
 onClick={() => handleSortChange(option.sortBy, option.sortOrder)}
 >
 {option.label}
 </Badge>
 );
 })}
 </div>
 </div>
 </div>
 );
}
