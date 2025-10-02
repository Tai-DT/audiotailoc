'use client';

import React, { useState } from 'react';
import { PageBanner } from '@/components/ui/page-banner';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Grid, List, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServices, useServiceTypes } from '@/lib/hooks/use-api';
import { Service } from '@/lib/types';

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt' | 'viewCount'>('createdAt');

  const { data: servicesData, isLoading: servicesLoading } = useServices({
    q: searchQuery || undefined,
    typeId: selectedType !== 'all' ? selectedType : undefined,
    sortBy,
    sortOrder: 'desc',
    pageSize: 50,
  });

  const { data: serviceTypes, isLoading: typesLoading } = useServiceTypes();

  const services = servicesData?.items || [];
  const filteredServices = services.filter(service =>
    service.isActive && (!selectedType || selectedType === 'all' || service.typeId === selectedType)
  );

  const renderServiceCard = (service: Service) => {
    const serviceType = serviceTypes?.find(type => type.id === service.typeId);

    if (viewMode === 'list') {
      return (
        <Card key={service.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={service.images?.[0] || '/placeholder-service.jpg'}
                  alt={service.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <Link href={`/services/${service.slug}`}>
                      <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors">
                        {service.name}
                      </h3>
                    </Link>
                    {serviceType && (
                      <Badge variant="secondary" className="mt-1">
                        {serviceType.name}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {service.priceType === 'FIXED'
                        ? `${service.price.toLocaleString('vi-VN')}₫`
                        : service.priceType === 'RANGE'
                        ? `${service.minPrice?.toLocaleString('vi-VN')}₫ - ${service.maxPrice?.toLocaleString('vi-VN')}₫`
                        : 'Liên hệ'
                      }
                    </div>
                    <div className="text-sm text-gray-500">
                      {service.priceType === 'FIXED' ? 'Giá cố định' :
                       service.priceType === 'RANGE' ? 'Giá theo yêu cầu' :
                       'Giá thương lượng'}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2">
                  {service.shortDescription || service.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration} phút</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{service.viewCount} lượt xem</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {service.tags?.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/services/${service.slug}`}>
                    <Button size="sm">Xem chi tiết</Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card key={service.id} className="hover:shadow-lg transition-shadow">
        <CardHeader className="p-0">
          <div className="relative h-48">
            <Image
              src={service.images?.[0] || '/placeholder-service.jpg'}
              alt={service.name}
              fill
              className="object-cover rounded-t-lg"
            />
            {service.isFeatured && (
              <Badge className="absolute top-2 left-2 bg-yellow-500">
                Nổi bật
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <Link href={`/services/${service.slug}`}>
                <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors line-clamp-2">
                  {service.name}
                </h3>
              </Link>
              {serviceType && (
                <Badge variant="secondary" className="mt-1">
                  {serviceType.name}
                </Badge>
              )}
            </div>

            <p className="text-gray-600 text-sm line-clamp-2">
              {service.shortDescription || service.description}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{service.duration} phút</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-green-600">
                {service.priceType === 'FIXED'
                  ? `${service.price.toLocaleString('vi-VN')}₫`
                  : service.priceType === 'RANGE'
                  ? `${service.minPrice?.toLocaleString('vi-VN')}₫ - ${service.maxPrice?.toLocaleString('vi-VN')}₫`
                  : 'Liên hệ'
                }
              </div>
              <Link href={`/services/${service.slug}`}>
                <Button size="sm">Xem chi tiết</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (servicesLoading || typesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageBanner
          page="categories"
          title="Danh mục dịch vụ"
          subtitle="Khám phá theo danh mục"
          description="Tìm kiếm dịch vụ âm thanh theo từng danh mục chuyên biệt. Từ lắp đặt, bảo trì đến tư vấn kỹ thuật - tất cả đều có tại Audio Tài Lộc."
          showStats={true}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Page Banner */}
        <PageBanner
          page="categories"
          title="Danh mục dịch vụ"
          subtitle="Khám phá theo danh mục"
          description="Tìm kiếm dịch vụ âm thanh theo từng danh mục chuyên biệt. Từ lắp đặt, bảo trì đến tư vấn kỹ thuật - tất cả đều có tại Audio Tài Lộc."
          showStats={true}
        />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Dịch vụ của chúng tôi</h1>
            <p className="text-gray-600">
              Khám phá các dịch vụ âm thanh chuyên nghiệp tại Audio Tài Lộc
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm dịch vụ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Tất cả loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  {serviceTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Mới nhất</SelectItem>
                  <SelectItem value="name">Tên A-Z</SelectItem>
                  <SelectItem value="price">Giá thấp đến cao</SelectItem>
                  <SelectItem value="viewCount">Phổ biến nhất</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex gap-2">
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
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Hiển thị {filteredServices.length} dịch vụ
              {selectedType !== 'all' && serviceTypes?.find(t => t.id === selectedType) &&
                ` trong danh mục ${serviceTypes.find(t => t.id === selectedType)?.name}`
              }
            </p>
          </div>

          {/* Services Grid/List */}
          {filteredServices.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredServices.map(renderServiceCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Không tìm thấy dịch vụ</h3>
              <p className="text-gray-600">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
            </div>
          )}

          {/* Categories Overview */}
          {selectedType === 'all' && serviceTypes && serviceTypes.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Danh mục dịch vụ</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {serviceTypes.map((type) => {
                  const typeServices = services.filter(s => s.typeId === type.id && s.isActive);
                  return (
                    <Card key={type.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">{type.icon || '🎵'}</div>
                        <h3 className="font-semibold mb-1">{type.name}</h3>
                        <p className="text-sm text-gray-600">{typeServices.length} dịch vụ</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}