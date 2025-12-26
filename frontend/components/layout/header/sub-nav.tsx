import React from 'react';
import Link from 'next/link';
import {
  Mic as MicIcon,
  Speaker as SpeakerIcon,
  SlidersHorizontal,
  PackageSearch,
  Music,
  Cable,
  Disc,
  Radio,
} from 'lucide-react';

interface SubNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export function SubNav() {
  const subNavItems: SubNavItem[] = [
    { label: 'Loa', href: '/products?category=loa-loa-sub', icon: SpeakerIcon },
    { label: 'Amply', href: '/products?category=amply-cuc-day', icon: Radio },
    { label: 'Micro', href: '/products?category=micro-karaoke-khong-day', icon: MicIcon },
    { label: 'Mixer - Vang Số', href: '/products?category=mixer-vang-so', icon: SlidersHorizontal },
    { label: 'Dàn Karaoke', href: '/products?category=dan-karaoke', icon: Disc },
    { label: 'Đầu Karaoke', href: '/products?category=dau-karaoke-cd', icon: Music },
    { label: 'Loa Soundbar', href: '/products?category=loa-soundbar', icon: Cable },
    { label: 'Thanh Lý', href: '/products?category=hang-thanh-ly-hang-cu', icon: PackageSearch },
  ];

  return (
    <div className="border-t border-muted py-1.5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {subNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex items-center gap-1 sm:gap-1.5 whitespace-nowrap rounded-md border border-transparent bg-muted/60 px-2 sm:px-2.5 py-1 text-xs font-medium text-muted-foreground transition-all duration-300 hover:border-primary hover:bg-gradient-primary/10 hover:text-primary hover-lift hover:shadow-sm touch-manipulation"
            >
              <item.icon className="h-3 w-3 transition-transform group-hover:scale-110 flex-shrink-0" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}