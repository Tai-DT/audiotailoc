'use client';

import React from 'react';
import Link from 'next/link';

const SUB_CATEGORIES = [
    { name: 'Loa Karaoke', href: '/products?category=loa-karaoke' },
    { name: 'Cục Đẩy', href: '/products?category=amply-cuc-day' },
    { name: 'Microphone', href: '/products?category=microphone' },
    { name: 'Vang Số & Mixer', href: '/products?category=vang-so-mixer' },
    { name: 'Dàn Karaoke', href: '/products?category=dan-karaoke' },
    { name: 'Loa Sub', href: '/products?category=loa-sub' },
];

export default function HeaderSubNav() {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="container mx-auto px-4 lg:px-6 h-full" />;
    }

    return (
        <div className="w-full h-full overflow-x-auto scrollbar-hide">
            <div className="container mx-auto px-2 sm:px-4 lg:px-6 h-full flex items-center justify-start md:justify-center gap-1 sm:gap-2 md:gap-4 py-1 min-w-max md:min-w-0">
                {SUB_CATEGORIES.map((cat) => (
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
