'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/products/product-card';
import { Product } from '@/lib/types';


interface ProductGridProps {
    products: Product[];
    columns?: 2 | 3 | 4;
    className?: string;
}

import { useRouter } from 'next/navigation';

export function ProductGrid({
    products,
    columns = 4,
    className
}: ProductGridProps) {
    const router = useRouter();

    if (products.length === 0) return null;

    const gridCols = {
        2: 'grid-cols-2',
        3: 'grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-2 lg:grid-cols-4',
    };

    const handleViewProduct = (slug: string) => {
        router.push(`/products/${slug}`);
    };

    return (
        <div
            className={cn(
                "grid gap-6 md:gap-8",
                gridCols[columns],
                className
            )}
        >
            {products.map((product, index) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onViewProduct={handleViewProduct}
                />
            ))}
        </div>
    );
}
