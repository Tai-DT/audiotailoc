'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ComponentType, ReactNode } from 'react';
import { SectionSkeleton, ProductGridSkeleton } from '@/components/ui/loading-skeletons';

// ==================== LAZY LOADING UTILITIES ====================
// Optimized dynamic imports with proper loading states

/** Options for lazy loading */
interface LazyOptions {
  /** Show loading skeleton */
  loading?: ReactNode;
  /** Server-side rendering */
  ssr?: boolean;
}

/**
 * Create a lazy-loaded component with default loading behavior
 */
export function createLazyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyOptions = {}
) {
  const { loading, ssr = false } = options;
  
  return dynamic(importFn, {
    loading: () => <>{loading || <SectionSkeleton />}</>,
    ssr,
  });
}

/**
 * Create a lazy-loaded section with section skeleton
 */
export function lazySection<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>
) {
  return createLazyComponent(importFn, { 
    loading: <SectionSkeleton />,
    ssr: false 
  });
}

/**
 * Create a lazy-loaded product grid with grid skeleton
 */
export function lazyProductGrid<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  count = 8
) {
  return createLazyComponent(importFn, { 
    loading: <ProductGridSkeleton count={count} />,
    ssr: false 
  });
}

// ==================== PRE-DEFINED LAZY COMPONENTS ====================
// Common components that benefit from lazy loading

/** Lazy-loaded BannerCarousel - heavy with animations */
export const LazyBannerCarousel = dynamic(
  () => import('@/components/home/banner-carousel-enhanced').then(mod => ({ default: mod.BannerCarousel })),
  { 
    loading: () => (
      <div className="h-[400px] md:h-[500px] bg-muted animate-pulse rounded-xl" />
    ),
    ssr: false 
  }
);

/** Lazy-loaded FeaturedProducts - can be deferred */
export const LazyFeaturedProducts = dynamic(
  () => import('@/components/home/featured-products').then(mod => ({ default: mod.FeaturedProducts })),
  { 
    loading: () => <SectionSkeleton />,
    ssr: false 
  }
);

/** Lazy-loaded CategoryProductsSection */
export const LazyCategoryProductsSection = dynamic(
  () => import('@/components/home/category-products-section').then(mod => ({ default: mod.CategoryProductsSection })),
  { 
    loading: () => <SectionSkeleton />,
    ssr: false 
  }
);

/** Lazy-loaded NewProducts */
export const LazyNewProducts = dynamic(
  () => import('@/components/home/new-products-section').then(mod => ({ default: mod.NewProductsSection })),
  { 
    loading: () => <ProductGridSkeleton count={8} />,
    ssr: false 
  }
);

/** Lazy-loaded BestSelling */
export const LazyBestSelling = dynamic(
  () => import('@/components/home/best-selling-products-section').then(mod => ({ default: mod.BestSellingProductsSection })),
  { 
    loading: () => <ProductGridSkeleton count={8} />,
    ssr: false 
  }
);

/** Lazy-loaded FeaturedProjects */
export const LazyFeaturedProjects = dynamic(
  () => import('@/components/home/featured-projects').then(mod => ({ default: mod.FeaturedProjects })),
  { 
    loading: () => <SectionSkeleton />,
    ssr: false 
  }
);

/** Lazy-loaded ChatWidget - definitely should be lazy */
export const LazyChatWidget = dynamic(
  () => import('@/components/ui/chat-widget').then(mod => ({ default: mod.ChatWidget })),
  { 
    loading: () => null,
    ssr: false 
  }
);

/** Lazy-loaded ServiceBookingModal */
export const LazyServiceBookingModal = dynamic(
  () => import('@/components/services/service-booking-modal').then(mod => ({ default: mod.ServiceBookingModal })),
  { 
    loading: () => null,
    ssr: false 
  }
);

// ==================== INTERSECTION OBSERVER HOOK ====================
// Progressive loading when element comes into view

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersection(options: UseIntersectionOptions = {}) {
  const { threshold = 0.1, rootMargin = '100px', triggerOnce = true } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip if already intersected in triggerOnce mode
    if (triggerOnce && hasIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setHasIntersected(true);
          
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
}

// ==================== PROGRESSIVE SECTION COMPONENT ====================
// Wrapper that loads content when it comes into view

interface ProgressiveSectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  /** Margin from viewport to start loading */
  rootMargin?: string;
  /** Minimum height to prevent layout shift */
  minHeight?: string;
  /** ID for accessibility */
  id?: string;
  /** ARIA label */
  ariaLabel?: string;
  className?: string;
}

export function ProgressiveSection({
  children,
  fallback,
  rootMargin = '200px',
  minHeight = '300px',
  id,
  ariaLabel,
  className,
}: ProgressiveSectionProps) {
  const { ref, hasIntersected } = useIntersection({ rootMargin, triggerOnce: true });

  return (
    <section
      ref={ref}
      id={id}
      aria-label={ariaLabel}
      className={className}
      style={{ minHeight: hasIntersected ? 'auto' : minHeight }}
    >
      {hasIntersected ? children : (fallback || <SectionSkeleton />)}
    </section>
  );
}

// ==================== PROGRESSIVE IMAGE ====================
// Image that loads when near viewport

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: ProgressiveImageProps) {
  const { ref, hasIntersected } = useIntersection({ rootMargin: '300px' });
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Load immediately if priority
  const shouldLoad = priority || hasIntersected;

  return (
    <div 
      ref={ref} 
      className={`relative overflow-hidden ${className || ''}`}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          aria-hidden="true"
        />
      )}
      
      {/* Actual image */}
      {shouldLoad && (
        <Image
          src={src}
          alt={alt}
          width={width || 400}
          height={height || 300}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
}

// ==================== PREFETCH UTILITIES ====================

/**
 * Prefetch a route when link is hovered
 */
export function usePrefetch(href: string) {
  const prefetched = useRef(false);

  const onMouseEnter = useCallback(() => {
    if (prefetched.current) return;
    
    // Use link preload
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
    
    prefetched.current = true;
  }, [href]);

  return { onMouseEnter };
}

const LazyLoadingUtils = {
  createLazyComponent,
  lazySection,
  lazyProductGrid,
  useIntersection,
  ProgressiveSection,
  ProgressiveImage,
};

export default LazyLoadingUtils;
