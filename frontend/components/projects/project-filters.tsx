'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

export function ProjectFilters() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [selectedLocation, setSelectedLocation] = React.useState<string>('');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('');

  const categories = [
    'Tất cả',
    'Hội trường',
    'Studio',
    'Sân khấu',
    'Phòng họp',
    'Nhà hát',
    'Sự kiện'
  ];

  const locations = [
    'Tất cả',
    'Hà Nội',
    'TP.HCM',
    'Đà Nẵng',
    'Cần Thơ',
    'Hải Phòng',
    'Khác'
  ];

  const statuses = [
    'Tất cả',
    'Hoàn thành',
    'Đang thực hiện',
    'Sắp tới'
  ];

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedLocation('');
    setSelectedStatus('');
  };

  const hasActiveFilters = selectedCategory || selectedLocation || selectedStatus;

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

      {/* Category Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Loại dự án</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category || (!selectedCategory && category === 'Tất cả') ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setSelectedCategory(category === 'Tất cả' ? '' : category)}
            >
              {category}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Location Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Địa điểm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {locations.map((location) => (
            <Button
              key={location}
              variant={selectedLocation === location || (!selectedLocation && location === 'Tất cả') ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setSelectedLocation(location === 'Tất cả' ? '' : location)}
            >
              {location}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Status Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Trạng thái</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status || (!selectedStatus && status === 'Tất cả') ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setSelectedStatus(status === 'Tất cả' ? '' : status)}
            >
              {status}
            </Button>
          ))}
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
              {selectedCategory && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Danh mục: {selectedCategory}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedCategory('')}
                  />
                </Badge>
              )}
              {selectedLocation && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Địa điểm: {selectedLocation}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedLocation('')}
                  />
                </Badge>
              )}
              {selectedStatus && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Trạng thái: {selectedStatus}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedStatus('')}
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