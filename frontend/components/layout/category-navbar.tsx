'use client';

import React from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import type { Category } from '@/lib/types';

interface CategoryMenuProps {
  categories?: Category[];
  isLoading: boolean;
  isError: boolean;
}

export function CategoryMenu({ categories, isLoading, isError }: CategoryMenuProps) {
  const topLevelCategories = React.useMemo(
    () => (categories ?? []).filter((category) => !category.parentId),
    [categories]
  );

  const childCategoryMap = React.useMemo(() => {
    const map = new Map<string, Category[]>();
    (categories ?? []).forEach((category) => {
      if (!category.parentId) {
        return;
      }

      const group = map.get(category.parentId) ?? [];
      group.push(category);
      map.set(category.parentId, group);
    });
    return map;
  }, [categories]);

  if (isLoading) {
    return (
      <div className="grid gap-6 p-6 md:w-[480px] lg:w-[720px] lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 md:w-[320px] lg:w-[480px]">
        <p className="text-sm text-destructive">Không thể tải danh mục sản phẩm. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  if (!topLevelCategories.length) {
    return (
      <div className="p-6 md:w-[320px] lg:w-[480px]">
        <p className="text-sm text-muted-foreground">Chưa có danh mục sản phẩm nào được thiết lập.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 p-6 md:w-[520px] lg:w-[780px] lg:grid-cols-3">
      {topLevelCategories.map((category) => {
        const childCategories = childCategoryMap.get(category.id) ?? [];
        return (
          <div key={category.id} className="space-y-3">
            <Link
              href={category.slug ? `/products?category=${category.slug}` : '/products'}
              className="text-base font-semibold text-foreground transition-colors hover:text-primary"
            >
              {category.name}
            </Link>

            <div className="space-y-2">
              {childCategories.length > 0 ? (
                childCategories.map((child) => (
                  <Link
                    key={child.id}
                    href={child.slug ? `/products?category=${child.slug}` : '/products'}
                    className="block text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {child.name}
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Xem tất cả sản phẩm thuộc danh mục {category.name.toLowerCase()}.
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}