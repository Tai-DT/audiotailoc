'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ServiceGrid } from '@/components/services/service-grid';
import { ServiceFilters } from '@/components/services/service-filters';
import { useServices, useServiceTypes } from '@/lib/hooks/use-api';
import { ServiceFilters as ServiceFiltersType } from '@/lib/types';

function ServicesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: serviceTypes } = useServiceTypes();

  const [filters, setFilters] = useState<ServiceFiltersType>({
    typeId: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    pageSize: 12
  });

  // Initialize filters from query parameters
  useEffect(() => {
    const typeParam = searchParams.get('type');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const sortByParam = searchParams.get('sortBy');
    const sortOrderParam = searchParams.get('sortOrder');
    const pageParam = searchParams.get('page');

    // If type parameter is provided, find the matching service type ID
    let typeId: string | undefined;
    if (typeParam && serviceTypes) {
      const matchingType = serviceTypes.find(
        t => t.slug === typeParam || t.id === typeParam
      );
      typeId = matchingType?.id;
    }

    setFilters(prevFilters => ({
      ...prevFilters,
      typeId: typeId || prevFilters.typeId,
      minPrice: minPriceParam ? parseInt(minPriceParam, 10) : prevFilters.minPrice,
      maxPrice: maxPriceParam ? parseInt(maxPriceParam, 10) : prevFilters.maxPrice,
      sortBy: (sortByParam as ServiceFiltersType['sortBy']) || prevFilters.sortBy,
      sortOrder: (sortOrderParam as ServiceFiltersType['sortOrder']) || prevFilters.sortOrder,
      page: pageParam ? parseInt(pageParam, 10) : 1
    }));
  }, [searchParams, serviceTypes]);

  const { data, isLoading } = useServices(filters);

  const handleFiltersChange = (newFilters: Partial<ServiceFiltersType>) => {
    const updatedFilters = {
      ...filters,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    };

    setFilters(updatedFilters);

    // Update URL parameters
    const params = new URLSearchParams();
    if (updatedFilters.typeId) {
      const serviceType = serviceTypes?.find(t => t.id === updatedFilters.typeId);
      if (serviceType) {
        params.set('type', serviceType.slug);
      }
    }
    if (updatedFilters.minPrice) {
      params.set('minPrice', updatedFilters.minPrice.toString());
    }
    if (updatedFilters.maxPrice) {
      params.set('maxPrice', updatedFilters.maxPrice.toString());
    }
    if (updatedFilters.sortBy !== 'createdAt') {
      params.set('sortBy', updatedFilters.sortBy!);
    }
    if (updatedFilters.sortOrder !== 'desc') {
      params.set('sortOrder', updatedFilters.sortOrder!);
    }

    const queryString = params.toString();
    router.push(`/services${queryString ? `?${queryString}` : ''}`);
  };

  const handlePageChange = (newPage: number) => {
    const updatedFilters = {
      ...filters,
      page: newPage
    };
    setFilters(updatedFilters);

    // Update URL with page parameter
    const params = new URLSearchParams();
    if (filters.typeId) {
      const serviceType = serviceTypes?.find(t => t.id === filters.typeId);
      if (serviceType) {
        params.set('type', serviceType.slug);
      }
    }
    if (filters.minPrice) {
      params.set('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice) {
      params.set('maxPrice', filters.maxPrice.toString());
    }
    if (filters.sortBy !== 'createdAt') {
      params.set('sortBy', filters.sortBy!);
    }
    if (filters.sortOrder !== 'desc') {
      params.set('sortOrder', filters.sortOrder!);
    }
    if (newPage > 1) {
      params.set('page', newPage.toString());
    }

    const queryString = params.toString();
    router.push(`/services${queryString ? `?${queryString}` : ''}`);

    // Scroll to top
    window.scrollTo(0, 0);
  };

  const services = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Dịch vụ</span>
        </nav>

        {/* Compact Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Danh sách dịch vụ</h1>
          <p className="text-sm text-muted-foreground">
            Khám phá các dịch vụ chuyên nghiệp của chúng tôi
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <ServiceFilters 
              filters={filters} 
              onFiltersChange={handleFiltersChange}
            />
          </aside>

          {/* Main Content - Service Grid */}
          <section className="lg:col-span-3">
            <ServiceGrid
              services={services}
              isLoading={isLoading}
              totalPages={totalPages}
              currentPage={filters.page || 1}
              onPageChange={handlePageChange}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServicesPageContent />
    </Suspense>
  );
}
