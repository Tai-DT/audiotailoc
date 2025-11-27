'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/use-auth';
import { useWishlistCount } from '@/lib/hooks/use-wishlist';
import { useCategories, useServiceTypes, useServicesByType } from '@/lib/hooks/use-api';
import { MobileNav } from '@/components/layout/mobile-nav';
import { TopBar } from './header/top-bar';
import { SubNav } from './header/sub-nav';
import { UserActions } from './header/user-actions';
import { DesktopNav } from './header/desktop-nav';
import { SearchBar } from './header/search-bar';
import type { Category, ServiceType, Service } from '@/lib/types';

export function Header() {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const { user } = useAuth();

  const isAuthenticated = !!user;
  const wishlistCount = useWishlistCount();
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isCategoriesError
  } = useCategories();
  const {
    data: serviceTypes,
    isLoading: isLoadingServiceTypes,
    isError: isServiceTypesError
  } = useServiceTypes();
  const { data: servicesByType } = useServicesByType();

  const topLevelCategories = React.useMemo<Category[]>(
    () => (categories ?? []).filter((category) => !category.parentId),
    [categories]
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (searchQuery.trim()) {
      // Navigate to search page with query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      {/* Top info bar */}
      <TopBar />

      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 shrink-0">
            <div className="relative h-7 w-24 sm:h-8 sm:w-32">
              <Image
                src="/images/logo/logo-light.svg"
                alt="Audio Tài Lộc"
                width={128}
                height={32}
                priority
                className="h-7 w-24 sm:h-8 sm:w-32 object-contain dark:hidden"
              />
              <Image
                src="/images/logo/logo-dark.svg"
                alt="Audio Tài Lộc"
                width={128}
                height={32}
                priority
                className="hidden h-7 w-24 sm:h-8 sm:w-32 object-contain dark:block"
              />
            </div>
          </Link>

          {/* Navigation Menu - Centered */}
          <DesktopNav 
            categories={categories}
            isLoadingCategories={isLoadingCategories}
            isCategoriesError={isCategoriesError}
            serviceTypes={serviceTypes}
            isLoadingServiceTypes={isLoadingServiceTypes}
            isServiceTypesError={isServiceTypesError}
            servicesByType={servicesByType}
          />

          {/* Search Bar - Show from lg breakpoint */}
          <SearchBar />

          {/* User Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <UserActions />

            {/* Mobile Menu Button - Show when navbar is hidden */}
            <MobileNav
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              categories={topLevelCategories}
              serviceTypes={serviceTypes || []}
              servicesByType={servicesByType || {}}
              isAuthenticated={isAuthenticated}
              wishlistCount={{ count: wishlistCount }}
            />
          </div>
        </div>

        {/* Sub navigation - Centered */}
        <SubNav />
      </div>
    </header>
  );
}