'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useServices, useServiceTypes } from '@/lib/hooks/use-api';
import { ServiceFilters as ServiceFiltersType } from '@/lib/types';

import { ServicesHero } from '@/components/services/services-hero';
import { ServiceGridNew } from '@/components/services/service-grid-new';
import { ServiceFiltersNew } from '@/components/services/service-filters-new';

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
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <ServicesHero totalServices={totalItems} />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <span className="text-foreground">Dịch vụ</span>
        </nav>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Desktop Filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <ServiceFiltersNew
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Bộ lọc
                    {activeFilterCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-sm">
                <SheetHeader>
                  <SheetTitle>Bộ lọc</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <ServiceFiltersNew
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    className="border-0 p-0"
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Service Grid */}
          <section className="lg:col-span-3">
            <ServiceGridNew
              services={services}
              isLoading={isLoading}
              totalPages={totalPages}
              currentPage={filters.page || 1}
              onPageChange={handlePageChange}
              totalItems={totalItems}
            />
          </section>
        </div>
      </main>
    </div>
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
