'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/Footer';
import { FeaturedServices } from '@/components/home/featured-services';
import { ServiceGrid } from '@/components/services/service-grid';
import { ServiceFilters } from '@/components/services/service-filters';
import { useServices } from '@/lib/hooks/use-api';
import { ServiceFilters as ServiceFiltersType } from '@/lib/types';

export default function ServicesPage() {
  const [filters, setFilters] = React.useState<ServiceFiltersType>({
    page: 1,
    pageSize: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const { data, isLoading, error } = useServices(filters);

  const handleFiltersChange = (newFilters: Partial<ServiceFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Không thể tải dịch vụ
            </h1>
            <p className="text-muted-foreground">
              Đã xảy ra lỗi khi tải danh sách dịch vụ. Vui lòng thử lại sau.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Dịch vụ chuyên nghiệp
              </h1>
              <p className="text-xl text-muted-foreground">
                Chúng tôi cung cấp các dịch vụ kỹ thuật âm thanh chuyên nghiệp,
                từ tư vấn, lắp đặt đến bảo hành và bảo trì hệ thống.
              </p>
            </div>
          </div>
        </section>

        {/* Services Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <ServiceFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>

              {/* Services Grid */}
              <div className="lg:col-span-3">
                <ServiceGrid
                  services={data?.items || []}
                  isLoading={isLoading}
                  totalPages={data?.totalPages || 1}
                  currentPage={filters.page || 1}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <FeaturedServices />
      </main>
      <Footer />
    </div>
  );
}
