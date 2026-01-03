/**
 * Performance utilities for lazy loading and optimization
 */
import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Create a lazily loaded component with custom loading state
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    loading?: ComponentType;
    ssr?: boolean;
  } = {}
) {
  return dynamic(importFn, {
    loading: options.loading,
    ssr: options.ssr ?? true,
  });
}

/**
 * Lazy loaded home page components
 */
export const LazyTestimonialsSection = dynamic(
  () => import('@/components/home/testimonials-section').then(mod => ({ default: mod.TestimonialsSection })),
  { ssr: true }
);

export const LazyBlogSection = dynamic(
  () => import('@/components/home/blog-section').then(mod => ({ default: mod.BlogSection })),
  { ssr: true }
);

export const LazyProjectsSection = dynamic(
  () => import('@/components/home/projects-section').then(mod => ({ default: mod.ProjectsSection })),
  { ssr: true }
);

export const LazyFaqSection = dynamic(
  () => import('@/components/home/faq-section').then(mod => ({ default: mod.FaqSection })),
  { ssr: true }
);

export const LazyContactSection = dynamic(
  () => import('@/components/home/contact-section').then(mod => ({ default: mod.ContactSection })),
  { ssr: true }
);

/**
 * Lazy loaded chart components (heavy)
 */
export const LazyRecharts = dynamic(
  () => import('recharts').then(mod => mod),
  { ssr: false }
);

/**
 * Preload component for better UX
 */
export function preloadComponent(
  importFn: () => Promise<{ default: ComponentType<any> }>
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
