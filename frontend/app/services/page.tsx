'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api-client';
import { Service } from '@/lib/api-client';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, selectedCategory, selectedType]);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await api.services.getAll({ isActive: true });
      const servicesData = response.data.data;
      setServices(servicesData);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      toast.error('Không thể tải danh sách dịch vụ');
    } finally {
      setIsLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    if (selectedType) {
      filtered = filtered.filter(service => service.type === selectedType);
    }

    setFilteredServices(filtered);
  };

  const categoryLabels = {
    AUDIO_EQUIPMENT: 'Thiết bị âm thanh',
    HOME_THEATER: 'Rạp hát tại nhà',
    PROFESSIONAL_SOUND: 'Âm thanh chuyên nghiệp',
    LIGHTING: 'Ánh sáng',
    CONSULTATION: 'Tư vấn',
    MAINTENANCE: 'Bảo trì',
    OTHER: 'Khác'
  };

  const typeLabels = {
    AUDIO_EQUIPMENT: 'Thiết bị âm thanh',
    HOME_THEATER: 'Rạp hát tại nhà',
    PROFESSIONAL_SOUND: 'Âm thanh chuyên nghiệp',
    LIGHTING: 'Ánh sáng',
    CONSULTATION: 'Tư vấn',
    MAINTENANCE: 'Bảo trì',
    OTHER: 'Khác'
  };

  const categoryIcons = {
    AUDIO_EQUIPMENT: '🎵',
    HOME_THEATER: '🏠',
    PROFESSIONAL_SOUND: '🎤',
    LIGHTING: '💡',
    CONSULTATION: '💬',
    MAINTENANCE: '🔧',
    OTHER: '📦'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Dịch vụ chuyên nghiệp</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Đội ngũ kỹ thuật viên giàu kinh nghiệm với các dịch vụ âm thanh chất lượng cao
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary">🔧 Lắp đặt chuyên nghiệp</Badge>
              <Badge variant="secondary">🛠️ Bảo trì định kỳ</Badge>
              <Badge variant="secondary">💡 Tư vấn miễn phí</Badge>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Tìm kiếm dịch vụ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                {/* Category Filter */}
                <div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả danh mục</SelectItem>
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Type Filter */}
                <div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả loại</SelectItem>
                      {Object.entries(typeLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Tìm thấy <span className="font-semibold text-gray-900">{filteredServices.length}</span> dịch vụ
          </p>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-12"
          >
            <FunnelIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy dịch vụ</h3>
            <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <Link href={`/services/${service.slug}`}>
                    <div className="aspect-video relative">
                      {service.imageUrl ? (
                        <Image src={service.imageUrl} alt={service.name} fill className="object-cover rounded-t-lg" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center rounded-t-lg">
                          <span className="text-white text-2xl font-bold">AT</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-white/90 text-gray-800">
                          {categoryIcons[service.category as keyof typeof categoryIcons]} {categoryLabels[service.category as keyof typeof categoryLabels]}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className="hover:text-primary-600 transition-colors">
                        {service.name}
                      </CardTitle>
                      {service.description && (
                        <CardDescription className="line-clamp-2">
                          {service.description}
                        </CardDescription>
                      )}
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {service.estimatedDuration} phút
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <StarIcon className="h-4 w-4 mr-1 text-yellow-400" />
                          4.8
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600">
                          {service.basePriceCents.toLocaleString()} VND
                        </span>
                        <Badge variant="outline">
                          {typeLabels[service.type as keyof typeof typeLabels]}
                        </Badge>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
