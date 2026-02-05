'use client';

import React from 'react';
import Link from 'next/link';

const SUB_NAV_ITEMS = [
    { name: 'Loa Full', href: '/products?category=loa-karaoke' },
    { name: 'Cục Đẩy', href: '/products?category=amply-cuc-day' },
    { name: 'Micro', href: '/products?category=microphone' },
    { name: 'Vang Số & Mixer', href: '/products?category=vang-so-mixer' },
    { name: 'Phần mềm', href: '/software' },
] as const;

export default function HeaderSubNav() {
    return (
        <div className="w-full h-full overflow-x-auto scrollbar-hide">
            <div className="container mx-auto px-2 sm:px-4 lg:px-6 h-full flex items-center justify-start md:justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-6 min-w-max md:min-w-0">
                {SUB_NAV_ITEMS.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="group relative flex items-center h-9 sm:h-10 px-3 sm:px-4 hover:bg-white/10 rounded-full transition-colors whitespace-nowrap"
                    >
                        <span className="text-[10px] sm:text-[11px] md:text-xs font-black uppercase tracking-[0.12em] text-foreground/80 group-hover:text-primary transition-colors">
                            {item.name}
                        </span>
                        <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-primary transition-all duration-300 group-hover:w-3/4" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
