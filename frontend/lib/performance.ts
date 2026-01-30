/**
 * Performance utilities for lazy loading and optimization
 */
import dynamic from 'next/dynamic';
import type { ComponentType, ReactNode } from 'react';
import type { DynamicOptionsLoadingProps } from 'next/dynamic';

/**
 * Create a lazily loaded component with custom loading state
 */
export function lazyLoad<T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: {
    loading?: () => ReactNode;
    ssr?: boolean;
  } = {}
) {
  return dynamic(importFn, {
    loading: options.loading as ((loadingProps: DynamicOptionsLoadingProps) => ReactNode) | undefined,
    ssr: options.ssr ?? true,
  });
}

/**
 * Lazy loaded home page components - Updated for new components
 */
export const LazyWhyChooseUsSection = dynamic(
  () => import('@/components/home/why-choose-us-section').then(mod => ({ default: mod.WhyChooseUsSection })),
  { ssr: true }
);

export const LazyCTASection = dynamic(
  () => import('@/components/home/cta-section').then(mod => ({ default: mod.CTASection })),
  { ssr: true }
);

export const LazyServicesSection = dynamic(
  () => import('@/components/home/services-section').then(mod => ({ default: mod.ServicesSection })),
  { ssr: true }
);

/**
 * Preload component for better UX
 */
export function preloadComponent<T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>
) {
  // Start loading the component
  importFn();
}

/**
 * Image loading priority helper
 */
export function shouldPrioritizeImage(index: number, visibleCount: number = 4): boolean {
  return index < visibleCount;
}

/**
 * Intersection Observer hook for lazy loading
 */
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof window === 'undefined') return null;

  return new IntersectionObserver(callback, {
    rootMargin: '100px',
    threshold: 0.1,
    ...options,
  });
}
