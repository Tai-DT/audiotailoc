'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingCart,
  Search,
  Menu,
  X,
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
import type { ServiceType, Service } from '@/lib/types';
import { cn } from '@/lib/utils';

// Added types
interface Category {
  id: string;
  name: string;
  slug?: string;
  parentId?: string | null;
  children?: Category[];
}

interface NavLink {
  href: string;
  label: string;
  description?: undefined;
}

interface MobileLink {
  href: string;
  label: string;
  description?: string;
}

interface SubNavItem {
  label: string;
  href: string;
  // Use SVG props for icon components (e.g. lucide-react icons)
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const { itemCount } = useCart() as { itemCount: number };
  const { data: user } = useAuth() as { data?: { id?: string; name?: string; email?: string; avatar?: string } | null };

  const isAuthenticated = !!user;
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

  const mobileMainLinks: MobileLink[] = [
    { href: '/products', label: 'Sản phẩm', description: 'Tất cả danh mục sản phẩm' },
    { href: '/services', label: 'Dịch vụ', description: 'Giải pháp & gói dịch vụ' },
    { href: '/support', label: 'Hỗ trợ', description: 'Cơ sở kiến thức & FAQ' },
    { href: '/about', label: 'Giới thiệu', description: 'Về Audio Tài Lộc' },
    { href: '/blog', label: 'Blog', description: 'Tin tức & chia sẻ' },
    { href: '/contact', label: 'Liên hệ', description: 'Thông tin liên hệ' },
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
          <div className="flex items-center justify-between text-sm py-2 text-muted-foreground">
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-2 hover:text-primary transition-colors">
                <Phone className="h-4 w-4 text-primary" />
                <span>Hotline: 1900 636 525</span>
              </span>
              <span className="hidden xl:flex items-center space-x-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@audiotailoc.com</span>
              </span>
              <span className="hidden xl:flex items-center space-x-2 hover:text-accent transition-colors">
                <Clock className="h-4 w-4 text-accent" />
                <span>08:00 - 21:00 (T2 - CN)</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
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
        <div className="flex h-16 items-center gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 shrink-0">
            <div className="relative h-8 w-28 sm:h-9 sm:w-36">
              <Image
                src="/images/logo/logo-light.svg"
                alt="Audio Tài Lộc"
                width={144}
                height={36}
                priority
                className="h-8 w-28 sm:h-9 sm:w-36 object-contain dark:hidden"
              />
              <Image
                src="/images/logo/logo-dark.svg"
                alt="Audio Tài Lộc"
                width={144}
                height={36}
                priority
                className="hidden h-8 w-28 sm:h-9 sm:w-36 object-contain dark:block"
              />
            </div>
          </Link>

          {/* Navigation Menu */}
          <div className="hidden xl:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList className="justify-start">
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
                    <div className="grid gap-3 p-6 md:w-[480px] lg:w-[600px] lg:grid-cols-2">
                      {isLoadingCategories ? (
                        <div className="col-span-full text-center py-4">
                          <p className="text-sm text-muted-foreground">Đang tải danh mục...</p>
                        </div>
                      ) : isCategoriesError ? (
                        <div className="col-span-full text-center py-4">
                          <p className="text-sm text-destructive">Không thể tải danh mục sản phẩm</p>
                        </div>
                      ) : topLevelCategories.length === 0 ? (
                        <div className="col-span-full text-center py-4">
                          <p className="text-sm text-muted-foreground">Chưa có danh mục sản phẩm</p>
                        </div>
                      ) : (
                        topLevelCategories.map((category: Category) => (
                          <div key={category.id} className="space-y-2">
                            <Link
                              href={category.slug ? `/products?category=${category.slug}` : '/products'}
                              className="block text-base font-semibold text-foreground transition-colors hover:text-primary"
                            >
                              {category.name}
                            </Link>
                            <div className="space-y-1">
                              <Link
                                href={`/products?category=${category.slug}`}
                                className="block text-sm text-muted-foreground transition-colors hover:text-primary"
                              >
                                Tất cả sản phẩm
                              </Link>
                              {category.children?.map((child: Category) => (
                                <Link
                                  key={child.id}
                                  href={`/products?category=${child.slug}`}
                                  className="block text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                  {child.name}
                                </Link>
                              ))}
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
                    <div className="grid gap-6 p-6 md:w-[520px] lg:w-[680px]">
                      {isLoadingServiceTypes ? (
                        <div className="col-span-full text-center py-4">
                          <p className="text-sm text-muted-foreground">Đang tải loại dịch vụ...</p>
                        </div>
                      ) : isServiceTypesError ? (
                        <div className="col-span-full text-center py-4">
                          <p className="text-sm text-destructive">Không thể tải loại dịch vụ</p>
                        </div>
                      ) : !serviceTypes?.length ? (
                        <div className="col-span-full text-center py-4">
                          <p className="text-sm text-muted-foreground">Chưa có loại dịch vụ</p>
                        </div>
                      ) : (
                        serviceTypes.map((serviceType: ServiceType) => {
                          const services: Service[] = servicesByType?.[serviceType.id] ?? [];
                          return (
                            <div key={serviceType.id} className="rounded-xl border bg-card/80 p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <Link
                                    href={`/services?type=${serviceType.slug}`}
                                    className="block text-base font-semibold text-foreground transition-colors hover:text-primary"
                                  >
                                    {serviceType.name}
                                  </Link>
                                  {serviceType.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      {serviceType.description}
                                    </p>
                                  )}
                                </div>
                                <Link
                                  href={`/services?type=${serviceType.slug}`}
                                  className="text-xs font-medium text-primary hover:underline"
                                >
                                  Xem tất cả
                                </Link>
                              </div>
                              {services.length > 0 && (
                                <div className="mt-4 grid gap-2">
                                  {services.slice(0, 4).map((service: Service) => (
                                    <Link
                                      key={service.id}
                                      href={`/services/${service.slug ?? service.id}`}
                                      className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
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

          {/* Search Bar - Center */}
          <div className="hidden lg:flex-1 lg:max-w-xl xl:block">
            <form onSubmit={handleSearch} className="relative group">
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
            {/* Wishlist */}
            {isAuthenticated && (
              <Link href="/wishlist" className="relative group">
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

            {/* Cart */}
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

            {/* User Menu */}
            {isAuthenticated ? (
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
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          </div>
        </div>

        {/* Sub navigation */}
        <div className="border-t border-muted pt-3 mt-2">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:justify-center">
            {([
              { label: 'Mic', href: '/products?category=mic', icon: MicIcon },
              { label: 'Loa', href: '/products?category=loa', icon: SpeakerIcon },
              { label: 'Mixer', href: '/products?category=mixer', icon: SlidersHorizontal },
              { label: 'Thanh Lý', href: '/products?category=thanh-ly', icon: PackageSearch },
            ] as SubNavItem[]).map((item: SubNavItem) => (
               <Link
                 key={item.label}
                 href={item.href}
                 className="flex items-center gap-2 whitespace-nowrap rounded-md border border-transparent bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-300 hover:border-primary hover:bg-gradient-primary/10 hover:text-primary hover-lift hover:shadow-sm"
               >
                 <item.icon className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                 <span className="flex-1">{item.label}</span>
               </Link>
             ))}
          </div>
        </div>
      </div>

      {/* Mobile expanded menu */}
      {isMenuOpen && (
        <div className="xl:hidden border-t py-4 space-y-4 bg-background">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="px-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm thiết bị, dịch vụ..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* Mobile Navigation Links */}
          <div className="grid grid-cols-2 gap-3 px-4 text-sm">
            {mobileMainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border p-3 text-foreground hover:border-primary hover:text-primary transition-colors touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="space-y-1">
                  <p className="font-medium">{link.label}</p>
                  {link.description && (
                    <p className="text-xs text-muted-foreground">{link.description}</p>
                  )}
                </div>
              </Link>
            ))}
            {/* Mobile Wishlist */}
            {isAuthenticated && (
              <Link
                href="/wishlist"
                className="rounded-lg border p-3 text-foreground hover:border-primary hover:text-primary transition-colors touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <div className="space-y-1">
                    <p className="font-medium">Yêu thích</p>
                    {wishlistCount?.count && wishlistCount.count > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {wishlistCount.count}
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Mobile User Actions */}
          {!isAuthenticated && (
            <div className="px-4 flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  Đăng nhập
                </Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  Đăng ký
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile Categories & Services */}
          {topLevelCategories.length > 0 && (
            <div className="px-4 space-y-2">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Danh mục sản phẩm
              </p>
              <div className="grid grid-cols-2 gap-2">
                {topLevelCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={category.slug ? `/products?category=${category.slug}` : '/products'}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary touch-manipulation"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="truncate">{category.name}</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      {category.children?.length ? `${category.children.length}` : 'Tất cả'}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(serviceTypes?.length ?? 0) > 0 && (
            <div className="px-4 space-y-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Loại dịch vụ
              </p>
              <div className="grid gap-3">
                {serviceTypes!.map((serviceType: ServiceType) => {
                  const services: Service[] = servicesByType?.[serviceType.id] ?? [];
                  return (
                    <div
                      key={serviceType.id}
                      className="rounded-xl border bg-muted/40"
                    >
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-foreground touch-manipulation"
                        onClick={() => {
                          window.location.href = `/services?type=${serviceType.slug}`;
                          setIsMenuOpen(false);
                        }}
                      >
                        <span>{serviceType.name}</span>
                        <span className="text-xs text-primary">Xem tất cả</span>
                      </button>
                      {services.length > 0 && (
                        <div className="border-t px-3 py-2 space-y-1">
                          {services.slice(0, 4).map((service: Service) => (
                            <Link
                              key={service.id}
                              href={`/services/${service.slug ?? service.id}`}
                              className="block rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary touch-manipulation"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {service.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

    </header>
  );
}
