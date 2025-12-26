'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Sub navigation bar (secondary quick category/service shortcuts)
 * Features:
 * - Horizontal scroll with momentum on touch devices
 * - Gradient fade edges + scroll buttons (desktop / when overflow)
 * - Keyboard accessible (ArrowLeft / ArrowRight to scroll; Home/End jump)
 * - Active item highlighting based on pathname or category query
 */

export interface SubNavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive?: boolean; // allow manual override
}

interface SubNavProps {
  items: SubNavItem[];
  className?: string;
  ariaLabel?: string;
  center?: boolean; // center items horizontally (e.g., on desktop)
}

function SubNavContent({
  items,
  className,
  ariaLabel = 'Quick navigation',
  center = false,
}: SubNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get('category');
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const updateScrollState = React.useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const atStart = scrollLeft <= 0;
    const atEnd = scrollLeft + clientWidth >= scrollWidth - 1; // tolerance
    setCanScrollLeft(!atStart);
    setCanScrollRight(!atEnd);
  }, []);

  React.useEffect(() => {
    updateScrollState();
    const el = containerRef.current;
    if (!el) return;
    const handle = () => updateScrollState();
    el.addEventListener('scroll', handle, { passive: true });
    window.addEventListener('resize', handle);
    return () => {
      el.removeEventListener('scroll', handle);
      window.removeEventListener('resize', handle);
    };
  }, [updateScrollState]);

  const scrollBy = (delta: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollBy(160);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollBy(-160);
    } else if (e.key === 'Home') {
      e.preventDefault();
      const el = containerRef.current; if (el) el.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (e.key === 'End') {
      e.preventDefault();
      const el = containerRef.current; if (el) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={cn('relative', className)}
    >
      {/* Scroll buttons (appear when overflow) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1 sm:pl-2">
        <Button
          type="button"
            variant="ghost"
            size="icon"
            aria-hidden={!canScrollLeft}
            aria-label="Scroll left"
            disabled={!canScrollLeft}
            onClick={() => scrollBy(-220)}
            className={cn(
              'h-7 w-7 sm:h-8 sm:w-8 rounded-full shadow-sm transition-opacity duration-200',
              'bg-background/80 backdrop-blur border hover:bg-background',
              canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0'
            )}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className={cn('ml-1 h-10 w-8 bg-gradient-to-r from-background to-transparent', !canScrollLeft && 'opacity-0')} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 sm:pr-2">
        <div className={cn('mr-1 h-10 w-8 bg-gradient-to-l from-background to-transparent', !canScrollRight && 'opacity-0')} />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-hidden={!canScrollRight}
          aria-label="Scroll right"
          disabled={!canScrollRight}
          onClick={() => scrollBy(220)}
          className={cn(
            'h-7 w-7 sm:h-8 sm:w-8 rounded-full shadow-sm transition-opacity duration-200',
            'bg-background/80 backdrop-blur border hover:bg-background',
            canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0'
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={containerRef}
        role="list"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-1 px-0 mx-0',
          'scroll-smooth focus:outline-none',
          'mask-image-linear-gradient',
          center && 'lg:justify-center'
        )}
      >
        {items.map((item) => {
          const Icon = item.icon;
          // Determine active state (pathname prefix or category param match or manual override)
          const isActive = item.isActive || pathname?.startsWith(item.href.split('?')[0]) || (
            item.href.includes('category=') && categoryParam && item.href.includes(`category=${categoryParam}`)
          );
          return (
            <div key={item.label} role="listitem">
              <Link
                href={item.href}
                className={cn(
                  'group flex items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-md border bg-muted/60 px-2.5 sm:px-3 py-1.5',
                  'text-xs font-medium transition-all duration-300 touch-manipulation hover:border-primary hover:bg-gradient-primary/10 hover:text-primary hover-lift hover:shadow-sm',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  isActive ? 'border-primary/70 text-primary shadow-sm bg-primary/5' : 'border-transparent text-muted-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {Icon && <Icon className="h-3.5 w-3.5 transition-transform group-hover:scale-110 flex-shrink-0" />}
                <span className="text-xs sm:text-sm">{item.label}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

export const SubNav: React.FC<SubNavProps> = (props) => {
  return (
    <Suspense fallback={<div className="h-12 bg-muted/30" />}>
      <SubNavContent {...props} />
    </Suspense>
  );
};

// Utility tailwind plugin class fallback (if not present ensure documentation):
// .mask-image-linear-gradient can be added in globals if desired for subtle edge fade.
