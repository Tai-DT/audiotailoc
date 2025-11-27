'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { cn } from '@/lib/utils';
import type { Category, ServiceType, Service } from '@/lib/types';

interface NavLink {
  href: string;
  label: string;
}

interface DesktopNavProps {
  categories?: Category[];
  isLoadingCategories: boolean;
  isCategoriesError: boolean;
  serviceTypes?: ServiceType[];
  isLoadingServiceTypes: boolean;
  isServiceTypesError: boolean;
  servicesByType?: Record<string, Service[]>;
}

export function DesktopNav({
  categories,
  isLoadingCategories,
  isCategoriesError,
  serviceTypes,
  isLoadingServiceTypes,
  isServiceTypesError,
  servicesByType
}: DesktopNavProps) {
  const pathname = usePathname();

  const topLevelCategories = React.useMemo<Category[]>(
    () => (categories ?? []).filter((category) => !category.parentId),
    [categories]
  );

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
  );
}