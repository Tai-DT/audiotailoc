'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useServices, useServiceTypes } from '@/lib/hooks/use-api';
import { ServiceFilters as ServiceFiltersType } from '@/lib/types';

import { PageBanner } from '@/components/shared/page-banner';
import { ServiceGrid } from '@/components/services/service-grid';
import { ServiceFilters } from '@/components/services/service-filters';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal } from 'lucide-react';

function ServicesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: serviceTypes } = useServiceTypes();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<ServiceFiltersType>({
    typeId: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    pageSize: 12
  });

  // Initialize filters from URL
  useEffect(() => {
    const typeParam = searchParams.get('type');
    const pageParam = searchParams.get('page');

    let typeId: string | undefined;
    if (typeParam && serviceTypes) {
      const matchingType = serviceTypes.find(t => t.slug === typeParam || t.id === typeParam);
      typeId = matchingType?.id;
    }

    setFilters(prev => ({
      ...prev,
      typeId: typeId || prev.typeId,
      page: pageParam ? parseInt(pageParam, 10) : 1
    }));
  }, [searchParams, serviceTypes]);

  const { data, isLoading } = useServices(filters);

  const handleFiltersChange = (newFilters: Partial<ServiceFiltersType>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    setIsMobileFilterOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    const updatedFilters = { ...filters, page: newPage };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateURL = (updatedFilters: ServiceFiltersType) => {
    const params = new URLSearchParams();
    
    if (updatedFilters.typeId) {
      const serviceType = serviceTypes?.find(t => t.id === updatedFilters.typeId);
      if (serviceType) params.set('type', serviceType.slug);
    }
    if (updatedFilters.page && updatedFilters.page > 1) {
      params.set('page', updatedFilters.page.toString());
    }

    const queryString = params.toString();
    router.push(`/services${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  const services = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.total || services.length;

  const activeFilterCount = [filters.minPrice || filters.maxPrice, filters.typeId].filter(Boolean).length;

  return (
    <main className="min-h-screen bg-background" role="main" aria-labelledby="services-hero-title">
      {/* Hero Banner */}
      <PageBanner 
        page="services" 
        fallbackTitle="Dịch vụ của chúng tôi" 
        fallbackSubtitle="Tư vấn, lắp đặt và bảo trì hệ thống âm thanh chuyên nghiệp"
      />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">Trang chủ</Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground" aria-current="page">Dịch vụ</span>
        </nav>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="text-lg font-semibold mb-4" id="filters-sidebar-title">Bộ lọc dịch vụ</h2>
              <ServiceFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                serviceTypes={serviceTypes || []}
              />
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  aria-label={`Bộ lọc dịch vụ${activeFilterCount > 0 ? `, đang chọn ${activeFilterCount} bộ lọc` : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                    Bộ lọc
                    {activeFilterCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full" aria-label={`${activeFilterCount} bộ lọc đang chọn`}>
                        {activeFilterCount}
                      </span>
                    )}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-sm" aria-labelledby="filters-sheet-title">
                <SheetHeader>
                  <SheetTitle id="filters-sheet-title">Bộ lọc dịch vụ</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <ServiceFilters
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    className="border-0 p-0"
                    serviceTypes={serviceTypes || []}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Service Grid */}
          <section className="lg:col-span-3" aria-labelledby="services-grid-title">
            <h2 id="services-grid-title" className="sr-only">Danh sách dịch vụ</h2>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground text-sm" id="services-count" role="status" aria-live="polite">
                Hiển thị <span className="font-medium text-foreground">{services.length}</span> trong số <span className="font-medium text-foreground">{totalItems}</span> dịch vụ
              </p>
            </div>
            <ServiceGrid
              services={services}
              isLoading={isLoading}
              totalPages={totalPages}
              currentPage={filters.page || 1}
              onPageChange={handlePageChange}
              totalItems={totalItems}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    }>
      <ServicesPageContent />
    </Suspense>
  );
}
