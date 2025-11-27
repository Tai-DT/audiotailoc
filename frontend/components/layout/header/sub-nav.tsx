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
    { label: 'Loa', href: '/products?category=loa', icon: SpeakerIcon },
    { label: 'Amply', href: '/products?category=amply', icon: Radio },
    { label: 'Micro', href: '/products?category=micro', icon: MicIcon },
    { label: 'Vang Số - Mixer', href: '/products?category=vang-so-mixer', icon: SlidersHorizontal },
    { label: 'Dàn Karaoke', href: '/products?category=dan-karaoke', icon: Disc },
    { label: 'Dàn Nghe Nhạc', href: '/products?category=dan-nghe-nhac', icon: Music },
    { label: 'Phụ Kiện', href: '/products?category=phu-kien', icon: Cable },
    { label: 'Thanh Lý', href: '/products?category=thanh-ly', icon: PackageSearch },
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