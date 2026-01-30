'use client';

import React from 'react';
import Link from 'next/link';
import { Mic2, Speaker, Music, Zap, Settings, Headphones } from 'lucide-react';

const SUB_CATEGORIES = [
 { name: 'Loa Karaoke', icon: <Speaker className="w-3.5 h-3.5" />, href: '/products?category=loa-karaoke', color: 'from-red-600 to-red-900' },
 { name: 'Cục Đẩy', icon: <Zap className="w-3.5 h-3.5" />, href: '/products?category=amply-cuc-day', color: 'from-red-500 to-orange-700' },
 { name: 'Microphone', icon: <Mic2 className="w-3.5 h-3.5" />, href: '/products?category=microphone', color: 'from-red-600 to-rose-900' },
 { name: 'Vang Số & Mixer', icon: <Settings className="w-3.5 h-3.5" />, href: '/products?category=vang-so-mixer', color: 'from-amber-500 to-amber-700' },
 { name: 'Dàn Karaoke', icon: <Music className="w-3.5 h-3.5" />, href: '/products?category=dan-karaoke', color: 'from-primary to-red-900' },
 { name: 'Loa Sub', icon: <Headphones className="w-3.5 h-3.5" />, href: '/products?category=loa-sub', color: 'from-slate-700 to-slate-900' },
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
        <div className="container mx-auto px-4 lg:px-6 h-full flex items-center justify-start md:justify-center gap-3 md:gap-5 overflow-x-auto scrollbar-hide">
            {SUB_CATEGORIES.map((cat) => (
                <Link
                    key={cat.name}
                    href={cat.href}
                    className="group flex items-center gap-2 px-2.5 md:px-3.5 py-1 md:py-1.5 rounded-full hover:bg-white/5 transition-all relative overflow-hidden h-full whitespace-nowrap"
                >
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center text-foreground dark:text-white shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        {cat.icon}
                    </div>
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.22em] text-yellow-400/80 group-hover:text-yellow-300 transition-colors font-display italic">
                        {cat.name}
                    </span>
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                </Link>
            ))}
 </div>
 );
}
