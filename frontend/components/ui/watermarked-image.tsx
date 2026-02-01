'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { CONTACT_CONFIG } from '@/lib/contact-config';

interface WatermarkedImageProps {
 src: string;
 alt: string;
 width?: number;
 height?: number;
 className?: string;
 priority?: boolean;
 fill?: boolean;
 sizes?: string;
 quality?: number;
 logoSize?: 'sm' | 'md' | 'lg';
 logoPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
 style?: React.CSSProperties;
 fallbackSrc?: string;
}

export function WatermarkedImage({
 src,
 alt,
 width,
 height,
 className,
 priority = false,
 fill = false,
 sizes,
 quality = 90,
 logoSize = 'md',
 logoPosition = 'bottom-right',
 style,
 fallbackSrc = '/placeholder-product.svg',
}: WatermarkedImageProps) {
 const { theme, systemTheme } = useTheme();
 const [mounted, setMounted] = useState(false);
 const [hasError, setHasError] = useState(false);

 useEffect(() => {
 setMounted(true);
 }, []);

 // Reset error state when src changes
 useEffect(() => {
 setHasError(false);
 }, [src]);

 // Logo size mapping (in pixels for Image component)
 const logoSizeMap = {
 sm: { width: 40, height: 20 },
 md: { width: 52, height: 27 },
 lg: { width: 68, height: 36 },
 };

 // Position mapping
 const positionMap = {
 'bottom-right': 'bottom-3 right-3 sm:bottom-6 sm:right-6',
 'bottom-left': 'bottom-3 left-3 sm:bottom-6 sm:left-6',
 'top-right': 'top-3 right-3 sm:top-6 sm:right-6',
 'top-left': 'top-3 left-3 sm:top-6 sm:left-6',
 'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
 };

 // Choose logo based on theme
 const currentTheme = theme === 'system' ? systemTheme : theme;
 const isDark = mounted && currentTheme === 'dark';
 const logoSrc = isDark
 ? '/images/logo/logo-light.svg'
 : '/images/logo/logo-dark.svg';

 const logoSize_px = logoSizeMap[logoSize];
 const normalizedSrc = typeof src === 'string' && src.trim().length > 0 ? src : fallbackSrc;
 const imageSrc = hasError ? fallbackSrc : normalizedSrc;

 const WatermarkContent = () => (
 <div
 data-testid="watermark-container"
 className={cn(
 'absolute z-[50] flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full',
 isDark
 ? 'bg-background/80 dark:bg-background dark:bg-slate-950/80 border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)]'
 : 'bg-white/80 border-black/10 shadow-[0_0_20px_rgba(0,0,0,0.1)]',
 'backdrop-blur-xl border transition-all duration-500 opacity-90 hover:opacity-100 scale-100',
 'pointer-events-none select-none flex-nowrap',
 positionMap[logoPosition]
 )}
 >
 {/* Phone number */}
 <span className={cn(
 "font-bold text-[9px] sm:text-[11px] tracking-tight whitespace-nowrap drop-shadow-sm flex items-center gap-1.5",
 isDark ? "text-foreground dark:text-white" : "text-slate-900"
 )}>
 <span className="text-primary brightness-110">📞</span> {CONTACT_CONFIG.phone.display}
 </span>

 {/* Premium Separator */}
 <div className={cn(
 "w-[1px] h-3 bg-gradient-to-b from-transparent to-transparent",
 isDark ? "via-white/30" : "via-black/20"
 )} />

 {/* Domain name */}
 <span className="text-primary font-black text-[9px] sm:text-[11px] tracking-widest uppercase whitespace-nowrap drop-shadow-sm">
 audiotailoc.com
 </span>

 {/* Premium Separator */}
 <div className={cn(
 "w-[1px] h-2 sm:h-3 bg-gradient-to-b from-transparent to-transparent",
 isDark ? "via-white/30" : "via-black/20"
 )} />

 {/* Logo */}
 <div className="relative flex items-center justify-center">
 <Image
 src={logoSrc}
 alt="Logo"
 width={logoSize_px.width}
 height={logoSize_px.height}
 className={cn(
 "opacity-100 transition-all duration-500",
 isDark ? "drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" : "drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
 )}
 priority={false}
 unoptimized
 />
 </div>
 </div>
 );

 if (fill) {
 return (
 <div className="relative w-full h-full overflow-hidden">
 <Image
 src={imageSrc}
 alt={alt}
 fill
 sizes={sizes}
 quality={quality}
 priority={priority}
 className={cn(
 'transition-all duration-700',
 hasError ? 'grayscale opacity-50' : 'opacity-100',
 className
 )}
 style={style}
 draggable={false}
 onContextMenu={(e) => e.preventDefault()}
 onDragStart={(e) => e.preventDefault()}
 onError={() => setHasError(true)}
 />
 {mounted && <WatermarkContent />}

 {/* Transparent Overlay for Extra Protection */}
 <div
 className="absolute inset-0 z-20 cursor-default"
 onContextMenu={(e) => e.preventDefault()}
 onDragStart={(e) => e.preventDefault()}
 />
 </div>
 );
 }

 return (
 <div className="relative inline-block overflow-hidden select-none">
 <Image
 src={imageSrc}
 alt={alt}
 width={width}
 height={height}
 quality={quality}
 priority={priority}
 className={cn(
 'transition-all duration-700',
 hasError ? 'grayscale opacity-50' : 'opacity-100',
 className
 )}
 style={style}
 draggable={false}
 onContextMenu={(e) => e.preventDefault()}
 onDragStart={(e) => e.preventDefault()}
 onError={() => setHasError(true)}
 />
 {mounted && <WatermarkContent />}

 {/* Transparent Overlay for Extra Protection */}
 <div
 className="absolute inset-0 z-20 cursor-default"
 onContextMenu={(e) => e.preventDefault()}
 onDragStart={(e) => e.preventDefault()}
 />
 </div>
 );
}
