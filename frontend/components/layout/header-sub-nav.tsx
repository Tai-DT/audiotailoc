'use client';

import React from 'react';
import Link from 'next/link';
import { useCategories, useProductAnalytics } from '@/lib/hooks/use-api';

const FALLBACK_CATEGORIES = [
    { name: 'Loa Karaoke', href: '/products?category=loa-karaoke' },
    { name: 'Cục Đẩy', href: '/products?category=amply-cuc-day' },
    { name: 'Microphone', href: '/products?category=microphone' },
    { name: 'Vang Số & Mixer', href: '/products?category=vang-so-mixer' },
];

export default function HeaderSubNav() {
    const [mounted, setMounted] = React.useState(false);
    const { data: categories } = useCategories();
    const { data: productAnalytics } = useProductAnalytics();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const topCategories = React.useMemo(() => {
        if (!productAnalytics?.topCategories?.length || !categories?.length) {
            return FALLBACK_CATEGORIES;
        }

        const mapped = productAnalytics.topCategories
            .slice()
            .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
            .map((stat) => {
                const match = categories.find((cat) => cat.name === stat.name);
                if (!match) return null;
                const slugOrId = match.slug || match.id;
                return {
                    name: match.name,
                    href: `/products?category=${slugOrId}`,
                };
            })
            .filter((item): item is { name: string; href: string } => Boolean(item))
            .slice(0, 4);

        return mapped.length === 4 ? mapped : FALLBACK_CATEGORIES;
    }, [productAnalytics, categories]);

    if (!mounted) {
        return <div className="container mx-auto px-4 lg:px-6 h-full" />;
    }

    return (
        <div className="w-full h-full overflow-x-auto scrollbar-hide">
            <div className="container mx-auto px-2 sm:px-4 lg:px-6 h-full flex items-center justify-start md:justify-center gap-1 sm:gap-2 md:gap-4 py-1 min-w-max md:min-w-0">
                {topCategories.map((cat) => (
                    <Link
                        key={cat.name}
                        href={cat.href}
                        className="group flex items-center px-2 sm:px-3 md:px-4 py-2 hover:bg-white/10 rounded-lg transition-all relative h-full whitespace-nowrap"
                    >
                        <span className="text-[11px] sm:text-[12px] md:text-[14px] font-bold uppercase tracking-wide text-foreground group-hover:text-primary transition-colors">
                            {cat.name}
                        </span>
                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
