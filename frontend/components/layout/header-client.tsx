'use client';

import React, { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  ShoppingCart,
  Search,
  User,
  Heart,
  Mic as MicIcon,
  Speaker as SpeakerIcon,
  SlidersHorizontal,
  PackageSearch,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useCart } from '@/components/providers/cart-provider';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { cn } from '@/lib/utils';

// Lazy load heavy components
const NavigationMenuFull = dynamic(
  () => import('./header-nav').then(mod => ({ default: mod.HeaderNav })),
  { ssr: false }
);

const UserMenu = dynamic(
  () => import('./header-user-menu').then(mod => ({ default: mod.HeaderUserMenu })),
  { ssr: false }
);

const MobileNav = dynamic(
  () => import('./mobile-nav').then(mod => ({ default: mod.MobileNav })),
  { ssr: false }
);

interface SubNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const SUB_NAV_ITEMS: SubNavItem[] = [
  { label: 'Micro', href: '/products?category=micro-karaoke-khong-day', icon: MicIcon },
  { label: 'Loa', href: '/products?category=loa-loa-sub', icon: SpeakerIcon },
  { label: 'Mixer', href: '/products?category=mixer-vang-so', icon: SlidersHorizontal },
  { label: 'Thanh Lý', href: '/products?category=hang-thanh-ly-hang-cu', icon: PackageSearch },
];

/**
 * HeaderClient - Lightweight Client Component
 * Only contains interactive elements that require JavaScript.
 * Heavy components (Navigation, UserMenu) are lazy loaded.
 */
export function HeaderClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const { itemCount } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      {/* Top info bar - Static content inlined for speed */}
      <div className="hidden lg:block border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-xs py-2 text-muted-foreground">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <a href="tel:0768426262" className="flex items-center space-x-1.5 hover:text-primary transition-colors">
                <span className="font-medium">Hotline: 0768 426 262</span>
              </a>
              <span className="hidden xl:flex items-center space-x-1.5">
                <span>08:00 - 21:00 (T2 - CN)</span>
              </span>
            </div>
            <div className="flex items-center space-x-4 lg:space-x-6">
              <Link href="/shipping" className="hover:text-primary transition-colors text-xs">Chính sách giao hàng</Link>
              <Link href="/warranty" className="hover:text-primary transition-colors text-xs">Bảo hành & đổi trả</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 shrink-0">
            <div className="relative h-8 w-28 sm:h-9 sm:w-36">
              <Image
                src="/images/logo/logo-light.svg"
                alt="Audio Tài Lộc"
                width={144}
                height={36}
                className="h-8 w-28 sm:h-9 sm:w-36 object-contain dark:hidden"
                priority
              />
              <Image
                src="/images/logo/logo-dark.svg"
                alt="Audio Tài Lộc"
                width={144}
                height={36}
                className="hidden h-8 w-28 sm:h-9 sm:w-36 object-contain dark:block"
                priority
              />
            </div>
          </Link>

          {/* Navigation - Lazy loaded */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <Suspense fallback={
              <nav className="flex items-center space-x-6">
                {['Sản phẩm', 'Dịch vụ', 'Giới thiệu', 'Blog', 'Liên hệ'].map((label) => (
                  <span key={label} className="text-sm text-muted-foreground">{label}</span>
                ))}
              </nav>
            }>
              <NavigationMenuFull pathname={pathname} />
            </Suspense>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex lg:flex-1 lg:max-w-md xl:max-w-xl">
            <form onSubmit={handleSearch} className="relative group w-full">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <Input
                type="text"
                placeholder="Tìm kiếm thiết bị, dịch vụ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 hover:border-primary focus:border-primary transition-all"
              />
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <ThemeToggle />
            
            {/* Cart */}
            <Link href="/cart" className="relative group" aria-label="Giỏ hàng">
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" aria-label="Xem giỏ hàng">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                {isMounted && itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    aria-label={`${itemCount} sản phẩm trong giỏ`}
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu - Lazy loaded */}
            <Suspense fallback={
              <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Đang tải menu người dùng">
                <User className="h-4 w-4" aria-hidden="true" />
              </Button>
            }>
              <UserMenu />
            </Suspense>

            {/* Mobile Nav - Lazy loaded */}
            <div className="lg:hidden">
              <Suspense fallback={<div className="h-9 w-9" />}>
                <MobileNav
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  handleSearch={handleSearch}
                  categories={[]}
                  serviceTypes={[]}
                  servicesByType={{}}
                  isAuthenticated={false}
                  wishlistCount={undefined}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Sub navigation */}
      <div className="border-t border-muted/50 bg-muted/30 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {SUB_NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group flex items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-lg border border-transparent bg-background/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground transition-all hover:border-primary/50 hover:text-primary hover:shadow-md"
              >
                <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
