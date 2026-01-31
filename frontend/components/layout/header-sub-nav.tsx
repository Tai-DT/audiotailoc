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
        <div className="container mx-auto px-4 lg:px-6 h-full flex items-center justify-start md:justify-center gap-4 md:gap-5 overflow-x-auto scrollbar-hide py-2">
            {SUB_CATEGORIES.map((cat) => (
                <Link
                    key={cat.name}
                    href={cat.href}
                    className="group flex items-center px-4 md:px-5 py-1.5 md:py-2 rounded-xl hover:bg-white/5 transition-all relative overflow-hidden h-full whitespace-nowrap bg-white/5 md:bg-transparent"
                >
                    <span className="text-[10px] md:text-[12px] font-bold uppercase tracking-widest text-foreground/90 group-hover:text-primary transition-colors font-sans">
                        {cat.name}
                    </span>
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                </Link>
            ))}
        </div>
    );
}
