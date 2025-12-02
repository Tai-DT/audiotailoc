'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingCart,
  Search,
  User,
  LogOut,
  Phone,
  Mail,
  Clock,
  Heart,
  ShoppingBag,
  Mic as MicIcon,
  Speaker as SpeakerIcon,
  SlidersHorizontal,
  PackageSearch,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { useAuth, useLogout } from '@/lib/hooks/use-auth';
import { useCart } from '@/components/providers/cart-provider';
import { useWishlistCount } from '@/lib/hooks/use-wishlist';
import { useCategories } from '@/lib/hooks/use-api';
import { useServiceTypes, useServicesByType } from '@/lib/hooks/use-api';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { MobileNav } from '@/components/layout/mobile-nav';
import type { ServiceType, Service } from '@/lib/types';
import { cn } from '@/lib/utils';

// Added types
interface Category {
  id: string;
  name: string;
  slug?: string;
  parentId?: string | null;
  description?: string;
  children?: Category[];
}

interface NavLink {
  href: string;
  label: string;
  description?: undefined;
}

interface SubNavItem {
  label: string;
  href: string;
  // Use SVG props for icon components (e.g. lucide-react icons)
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export function Header() {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [isMounted, setIsMounted] = React.useState(false);
  const { itemCount } = useCart() as { itemCount: number };
  const { data: user } = useAuth() as { data?: { id?: string; name?: string; email?: string; avatar?: string } | null };

  // Only check authentication after mount to prevent hydration mismatch
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const isAuthenticated = isMounted && !!user;
  const { data: wishlistCount } = useWishlistCount({ enabled: isAuthenticated }) as { data?: { count: number } | undefined };
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isCategoriesError
  } = useCategories() as { data?: Category[]; isLoading: boolean; isError: boolean };
  const {
    data: serviceTypes,
    isLoading: isLoadingServiceTypes,
    isError: isServiceTypesError
  } = useServiceTypes() as { data?: ServiceType[]; isLoading: boolean; isError: boolean };
  const { data: servicesByType } = useServicesByType() as { data?: Record<string, Service[]> | undefined };

  const logoutMutation = useLogout();
  const pathname = usePathname();

  const topLevelCategories = React.useMemo<Category[]>(
    () => (categories ?? []).filter((category) => !category.parentId),
    [categories]
  );

  const handleLogout = (): void => {
    logoutMutation.mutate();
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (searchQuery.trim()) {
      // Navigate to search page with query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const primaryLinks: NavLink[] = [
    { href: '/projects', label: 'Dự án' },
    { href: '/about', label: 'Giới thiệu' },
    { href: '/blog', label: 'Blog' },
    { href: '/support', label: 'Hỗ trợ' },
    { href: '/contact', label: 'Liên hệ' },
  ];

  const getLinkClasses = (href: string) => {
    const active = pathname?.startsWith(href ?? '');

    return active
      ? 'text-primary font-semibold'
      : 'text-muted-foreground hover:text-primary';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      {/* Top info bar */}
      <div className="hidden lg:block border-b bg-gradient-primary/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-xs py-1.5 text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5 hover:text-primary transition-colors">
                <Phone className="h-3.5 w-3.5 text-primary" />
                <span>Hotline: 0768 426 262</span>
              </span>
              <span className="hidden xl:flex items-center space-x-1.5 hover:text-primary transition-colors">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span>support@audiotailoc.com</span>
              </span>
              <span className="hidden xl:flex items-center space-x-1.5 hover:text-accent transition-colors">
                <Clock className="h-3.5 w-3.5 text-accent" />
                <span>08:00 - 21:00 (T2 - CN)</span>
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/shipping" className="hover:text-primary hover-audio transition-colors">
                Chính sách giao hàng
              </Link>
              <Link href="/warranty" className="hover:text-primary hover-audio transition-colors">
                Bảo hành & đổi trả
              </Link>
              <Link href="/support" className="hover:text-primary hover-audio transition-colors">
                Hỗ trợ kỹ thuật
              </Link>
            </div>
          </div>
        </div>
      </div>

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
                className="h-7 w-24 sm:h-8 sm:w-32 object-contain dark:hidden"
              />
              <Image
                src="/images/logo/logo-dark.svg"
                alt="Audio Tài Lộc"
                width={128}
                height={32}
                className="hidden h-7 w-24 sm:h-8 sm:w-32 object-contain dark:block"
              />
            </div>
          </Link>

          {/* Navigation Menu - Centered */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <NavigationMenu>
              <NavigationMenuList className="justify-center">
                {/* Products Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'text-sm text-foreground hover:text-primary',
                      pathname?.startsWith('/products') && 'text-primary font-semibold'
                    )}
                  >
                    Sản phẩm
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-2 p-4 md:w-[420px] lg:w-[520px] lg:grid-cols-2">
                      {isLoadingCategories ? (
                        <div className="col-span-full text-center py-3">
                          <p className="text-xs text-muted-foreground">Đang tải danh mục...</p>
                        </div>
                      ) : isCategoriesError ? (
                        <div className="col-span-full text-center py-3">
                          <p className="text-xs text-destructive">Không thể tải danh mục sản phẩm</p>
                        </div>
                      ) : topLevelCategories.length === 0 ? (
                        <div className="col-span-full text-center py-3">
                          <p className="text-xs text-muted-foreground">Chưa có danh mục sản phẩm</p>
                        </div>
                      ) : (
                        topLevelCategories.map((category: Category) => (
                          <div key={category.id} className="space-y-1.5">
                            <Link
                              href={category.slug ? `/products?category=${category.slug}` : '/products'}
                              className="block text-sm font-semibold text-foreground transition-colors hover:text-primary"
                            >
                              {category.name}
                            </Link>
                            {/* Category Description - Công dụng */}
                            {category.description && (
                              <p className="text-xs text-muted-foreground/80 line-clamp-2 mb-1">
                                {category.description}
                              </p>
                            )}
                            <div className="space-y-0.5">
                              {category.children && category.children.length > 0 ? (
                                category.children.slice(0, 4).map((child: Category) => (
                                  <Link
                                    key={child.id}
                                    href={`/products?category=${child.slug}`}
                                    className="block text-xs text-muted-foreground transition-colors hover:text-primary"
                                  >
                                    {child.name}
                                  </Link>
                                ))
                              ) : (
                                <Link
                                  href={`/products?category=${category.slug}`}
                                  className="block text-xs text-muted-foreground transition-colors hover:text-primary"
                                >
                                  Xem tất cả {category.name}
                                </Link>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Services Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'text-sm text-foreground hover:text-primary',
                      pathname?.startsWith('/services') && 'text-primary font-semibold'
                    )}
                  >
                    Dịch vụ
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-4 p-4 md:w-[460px] lg:w-[580px]">
                      {isLoadingServiceTypes ? (
                        <div className="col-span-full text-center py-3">
                          <p className="text-xs text-muted-foreground">Đang tải loại dịch vụ...</p>
                        </div>
                      ) : isServiceTypesError ? (
                        <div className="col-span-full text-center py-3">
                          <p className="text-xs text-destructive">Không thể tải loại dịch vụ</p>
                        </div>
                      ) : !serviceTypes?.length ? (
                        <div className="col-span-full text-center py-3">
                          <p className="text-xs text-muted-foreground">Chưa có loại dịch vụ</p>
                        </div>
                      ) : (
                        serviceTypes.slice(0, 3).map((serviceType: ServiceType) => {
                          const services: Service[] = servicesByType?.[serviceType.id] ?? [];
                          return (
                            <div key={serviceType.id} className="rounded-lg border bg-card/80 p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-0.5">
                                  <Link
                                    href={`/services?type=${serviceType.slug}`}
                                    className="block text-sm font-semibold text-foreground transition-colors hover:text-primary"
                                  >
                                    {serviceType.name}
                                  </Link>
                                  {serviceType.description && (
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                      {serviceType.description}
                                    </p>
                                  )}
                                </div>
                                <Link
                                  href={`/services?type=${serviceType.slug}`}
                                  className="text-xs font-medium text-primary hover:underline whitespace-nowrap"
                                >
                                  Xem tất cả
                                </Link>
                              </div>
                              {services.length > 0 && (
                                <div className="mt-2 grid gap-1.5">
                                  {services.slice(0, 3).map((service: Service) => (
                                    <Link
                                      key={service.id}
                                      href={`/services/${service.slug ?? service.id}`}
                                      className="flex items-center justify-between rounded-md border px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                                    >
                                      <span className="line-clamp-1">{service.name}</span>
                                      <span className="text-xs font-medium text-primary/70">Chi tiết</span>
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Other Links */}
                {primaryLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          'text-sm text-foreground hover:text-primary',
                          getLinkClasses(link.href)
                        )}
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
              <NavigationMenuIndicator />
              <NavigationMenuViewport />
            </NavigationMenu>
          </div>

          {/* Search Bar - Show from lg breakpoint */}
          <div className="hidden lg:flex lg:flex-1 lg:max-w-md xl:max-w-xl">
            <form onSubmit={handleSearch} className="relative group w-full">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                {searchQuery && (
                  <div className="audio-wave">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                )}
              </div>
              <Input
                type="text"
                placeholder="Tìm kiếm thiết bị, dịch vụ, mã sản phẩm..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 hover:border-primary focus:border-primary transition-all duration-300"
              />
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <ThemeToggle />
            {/* Wishlist - Always render wrapper to maintain DOM structure, only show content if authenticated after mount */}
            <div className="h-9 w-9 sm:h-10 sm:w-10">
              {isMounted && isAuthenticated && (
                <Link href="/wishlist" className="relative group block">
                  <Button variant="ghost" size="icon" className="hover:bg-tertiary hover:text-tertiary-foreground transition-all duration-300 hover-lift h-9 w-9 sm:h-10 sm:w-10">
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5 group-hover:text-warning transition-colors" />
                    {wishlistCount?.count && wishlistCount.count > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs bg-warning text-warning-foreground hover:bg-warning/90"
                      >
                        {wishlistCount.count}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}
            </div>

            {/* Cart - Always render to maintain consistent DOM structure */}
            <Link href="/cart" className="relative group">
              <Button variant="ghost" size="icon" className="hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover-lift h-9 w-9 sm:h-10 sm:w-10">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 group-hover:text-accent transition-colors" />
                {itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu - Always render same structure to prevent hydration mismatch */}
            {!isMounted ? (
              // Server render: always show login/register buttons
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Đăng nhập</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </div>
            ) : isAuthenticated ? (
              // Client render after mount: show user menu if authenticated
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full">
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Trang cá nhân</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>Đơn hàng</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Danh sách yêu thích</span>
                      {wishlistCount?.count && wishlistCount.count > 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {wishlistCount.count}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Client render after mount: show login/register if not authenticated
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Đăng nhập</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button - Show when navbar is hidden */}
            <MobileNav
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              categories={topLevelCategories}
              serviceTypes={serviceTypes}
              servicesByType={servicesByType}
              isAuthenticated={isAuthenticated}
              wishlistCount={wishlistCount}
            />
          </div>
        </div>

        {/* Sub navigation - Centered */}
        <div className="border-t border-muted py-1.5">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
              {([
                { label: 'Mic', href: '/products?category=mic', icon: MicIcon },
                { label: 'Loa', href: '/products?category=loa', icon: SpeakerIcon },
                { label: 'Mixer', href: '/products?category=mixer', icon: SlidersHorizontal },
                { label: 'Thanh Lý', href: '/products?category=thanh-ly', icon: PackageSearch },
              ] as SubNavItem[]).map((item: SubNavItem) => (
                 <Link
                   key={item.label}
                   href={item.href}
                   className="group flex items-center gap-1 sm:gap-1.5 whitespace-nowrap rounded-md border border-transparent bg-muted/60 px-2 sm:px-2.5 py-1 text-xs font-medium text-muted-foreground transition-all duration-300 hover:border-primary hover:bg-gradient-primary/10 hover:text-primary hover-lift hover:shadow-sm touch-manipulation"
                 >
                   <item.icon className="h-3 w-3 transition-transform group-hover:scale-110 flex-shrink-0" />
                   <span className="text-xs">{item.label}</span>
                 </Link>
               ))}
            </div>
          </div>
        </div>
      </div>

    </header>
  );
}
