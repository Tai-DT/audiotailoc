'use client';

import React from 'react';
import { ProductCard } from './product-card';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Package } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ProductGridProps {
    products: Product[];
    loading?: boolean;
    onAddToCart?: (productId: string) => void;
    onViewProduct?: (productSlug: string) => void;
    /** Base path for product detail links (e.g. /products, /software) */
    basePath?: string;
    /** ID for the grid, useful for aria-labelledby */
    id?: string;
    /** Label for screen readers */
    ariaLabel?: string;
    /** Number of columns for large screens */
    columns?: 3 | 4;
}

import { useRouter } from 'next/navigation';

export function ProductGrid({
    products,
    loading = false,
    onAddToCart,
    onViewProduct,
    basePath = '/products',
    id,
    ariaLabel = 'Danh sách sản phẩm',
    columns = 4,
}: ProductGridProps) {
    const router = useRouter();
    const normalizedBasePath = basePath.startsWith('/') ? basePath.replace(/\/$/, '') : `/${basePath.replace(/\/$/, '')}`;

    const handleViewProduct = (slug: string) => {
        if (onViewProduct) {
            onViewProduct(slug);
        } else {
            router.push(`${normalizedBasePath}/${slug}`);
        }
    };

    // Loading state with accessibility
    if (loading) {
        return (
            <div
                role="status"
                aria-label="Đang tải danh sách sản phẩm"
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-7"
            >
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="space-y-4 animate-pulse" aria-hidden="true">
                        <Skeleton className="aspect-square w-full rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-1/4 rounded" />
                            <Skeleton className="h-4 w-3/4 rounded" />
                            <Skeleton className="h-4 w-1/2 rounded" />
                            <Skeleton className="h-6 w-1/3 rounded" />
                        </div>
                    </div>
                ))}
                <span className="sr-only">Đang tải sản phẩm...</span>
            </div>
        );
    }

    // Empty state
    if (products.length === 0) {
        return (
            <EmptyState
                icon={Package}
                title="Không tìm thấy sản phẩm"
                description="Hãy thử tìm kiếm với từ khóa khác hoặc lọc theo danh mục để khám phá thêm sản phẩm."
                action={{
                    label: 'Xem tất cả sản phẩm',
                    href: normalizedBasePath,
                }}
            />
        );
    }

    return (
        <section
            id={id}
            aria-label={ariaLabel}
            className={cn(
                "grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-7",
                columns === 3 ? "md:grid-cols-3 xl:grid-cols-3" : "md:grid-cols-3 xl:grid-cols-4"
            )}
        >
            {/* Screen reader announcement */}
            <div className="sr-only" aria-live="polite">
                Hiển thị {products.length} sản phẩm
            </div>

            {products.map((product, index) => (
                <div
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${Math.min(index * 50, 200)}ms` }}
                >
                    <ProductCard
                        product={product}
                        onAddToCart={onAddToCart}
                        onViewProduct={handleViewProduct}
                        basePath={normalizedBasePath}
                        priority={index < 4} // First 4 products load with priority
                    />
                </div>
            ))}
        </section>
    );
}
