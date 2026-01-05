'use client';

import React from 'react';
import Link from 'next/link';
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
import { useCategories, useServiceTypes, useServicesByType } from '@/lib/hooks/use-api';
import { cn } from '@/lib/utils';

interface HeaderNavProps {
  pathname: string | null;
}

interface Category {
  id: string;
  name: string;
  slug?: string;
  parentId?: string | null;
  description?: string;
  children?: Category[];
}

const PRIMARY_LINKS = [
  { href: '/about', label: 'Giới thiệu' },
  { href: '/du-an', label: 'Dự án' },
  { href: '/blog', label: 'Blog' },
  { href: '/support', label: 'Hỗ trợ' },
  { href: '/contact', label: 'Liên hệ' },
];

export function HeaderNav({ pathname }: HeaderNavProps) {
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { data: serviceTypes, isLoading: isLoadingServiceTypes } = useServiceTypes();
  const { data: _servicesByType } = useServicesByType();

  const topLevelCategories = React.useMemo(
    () => (categories ?? []).filter((cat: Category) => !cat.parentId),
    [categories]
  );

  const getLinkClasses = (href: string) => {
    const active = pathname?.startsWith(href ?? '');
    return active ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary';
  };

  return (
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
                  <p className="text-xs text-muted-foreground">Đang tải...</p>
                </div>
              ) : topLevelCategories.length === 0 ? (
                <div className="col-span-full text-center py-3">
                  <p className="text-xs text-muted-foreground">Chưa có danh mục</p>
                </div>
              ) : (
                topLevelCategories.slice(0, 6).map((category: Category) => (
                  <div key={category.id} className="space-y-1.5">
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="block text-sm font-semibold text-foreground hover:text-primary"
                    >
                      {category.name}
                    </Link>
                    {category.children && category.children.length > 0 && (
                      <div className="space-y-0.5">
                        {category.children.slice(0, 3).map((child: Category) => (
                          <Link
                            key={child.id}
                            href={`/products?category=${child.slug}`}
                            className="block text-xs text-muted-foreground hover:text-primary"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
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
            <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
              {isLoadingServiceTypes ? (
                <p className="text-xs text-muted-foreground text-center py-3">Đang tải...</p>
              ) : !serviceTypes?.length ? (
                <p className="text-xs text-muted-foreground text-center py-3">Chưa có dịch vụ</p>
              ) : (
                serviceTypes.slice(0, 3).map((serviceType: { id: string; name: string; slug?: string; description?: string }) => (
                  <div key={serviceType.id} className="rounded-lg border bg-card/80 p-3">
                    <Link
                      href={`/services?type=${serviceType.slug}`}
                      className="text-sm font-semibold hover:text-primary"
                    >
                      {serviceType.name}
                    </Link>
                    {serviceType.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{serviceType.description}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Other Links */}
        {PRIMARY_LINKS.map((link) => (
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
  );
}
