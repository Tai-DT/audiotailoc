'use client';

import React, { Suspense, useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { BannerCarouselSSR } from '@/components/home/banner-carousel-ssr';
import { FeaturedProductsSSR } from '@/components/home/featured-products-ssr';
import { SectionSkeleton } from '@/components/ui/loading-skeletons';
import { SectionErrorBoundary } from '@/components/error-boundary';
import { Banner, Product } from '@/lib/types';

// ==================== DYNAMIC IMPORTS ====================
// Below-the-fold sections with lazy loading for optimal bundle size

const CategoryProductsSection = dynamic(
  () => import('@/components/home/category-products-section').then(mod => ({ default: mod.CategoryProductsSection })),
  { loading: () => <SectionSkeleton ariaLabel="Đang tải danh mục sản phẩm" />, ssr: false }
);
const NewProductsSection = dynamic(
  () => import('@/components/home/new-products-section').then(mod => ({ default: mod.NewProductsSection })),
  { loading: () => <SectionSkeleton ariaLabel="Đang tải sản phẩm mới" />, ssr: false }
);
const BestSellingProductsSection = dynamic(
  () => import('@/components/home/best-selling-products-section').then(mod => ({ default: mod.BestSellingProductsSection })),
  { loading: () => <SectionSkeleton ariaLabel="Đang tải sản phẩm bán chạy" />, ssr: false }
);
const FeaturedServices = dynamic(
  () => import('@/components/home/featured-services').then(mod => ({ default: mod.FeaturedServices })),
  { loading: () => <SectionSkeleton ariaLabel="Đang tải dịch vụ nổi bật" />, ssr: false }
);
const StatsSection = dynamic(
  () => import('@/components/home/stats-section').then(mod => ({ default: mod.StatsSection })),
  { loading: () => <SectionSkeleton ariaLabel="Đang tải thống kê" />, ssr: false }
);
const TechniciansSection = dynamic(
  () => import('@/components/home/technicians-section').then(mod => ({ default: mod.TechniciansSection })),
  { loading: () => <SectionSkeleton ariaLabel="Đang tải đội ngũ kỹ thuật" />, ssr: false }
);
const TestimonialsSection = dynamic(
  () => import('@/components/home/testimonials-section').then(mod => ({ default: mod.TestimonialsSection })),
  { loading: () => <SectionSkeleton ariaLabel="Đang tải đánh giá khách hàng" />, ssr: false }
);
const FeaturedProjects = dynamic(
  () => import('@/components/home/featured-projects').then(mod => ({ default: mod.FeaturedProjects })),
  { loading: () => <SectionSkeleton ariaLabel="Đang tải dự án nổi bật" />, ssr: false }
);
const FeaturedKnowledgeSection = dynamic(
  () => import('@/components/home/featured-knowledge-section').then(mod => ({ default: mod.FeaturedKnowledgeSection })),
  { loading: () => <SectionSkeleton ariaLabel="Đang tải kiến thức" />, ssr: false }
);
const FeaturedBlogSection = dynamic(
  () => import('@/components/home/featured-blog-section').then(mod => ({ default: mod.FeaturedBlogSection })),
  { loading: () => <SectionSkeleton ariaLabel="Đang tải bài viết" />, ssr: false }
);
const NewsletterSection = dynamic(
  () => import('@/components/home/newsletter-section').then(mod => ({ default: mod.NewsletterSection })),
  { loading: () => <SectionSkeleton ariaLabel="Đang tải mục đăng ký" />, ssr: false }
);

// ==================== ANIMATED SECTION (CSS + IntersectionObserver) ====================
// Uses CSS animations triggered by IntersectionObserver - NO framer-motion for TBT reduction
interface AnimatedSectionProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  className?: string;
}

function AnimatedSection({ children, fallbackTitle, className = '' }: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '-50px', threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <SectionErrorBoundary fallbackTitle={fallbackTitle}>
      <Suspense fallback={<SectionSkeleton />}>
        <div
          ref={ref}
          className={`transition-all duration-600 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          } ${className}`}
          style={{ transitionDuration: '0.6s' }}
        >
          {children}
        </div>
      </Suspense>
    </SectionErrorBoundary>
  );
}

// ==================== HOMEPAGE CLIENT COMPONENT ====================
interface HomeClientProps {
  initialBanners: Banner[];
  initialProducts?: Product[];
  /** Skip banner carousel when static banner is rendered in parent */
  skipBanner?: boolean;
}

export function HomeClient({ 
  initialBanners, 
  initialProducts = [],
  skipBanner = false,
}: HomeClientProps) {
  return (
    <>
      {/* Banner Carousel - Skip if static banner is rendered in parent */}
      {!skipBanner && initialBanners.length > 0 && (
        <section aria-label="Banner chính">
          <BannerCarouselSSR initialBanners={initialBanners} />
        </section>
      )}

      {/* Featured Products - SSR with data, minimal client JS */}
      <section aria-label="Sản phẩm nổi bật" className="animate-fade-in-up">
        <FeaturedProductsSSR initialProducts={initialProducts} />
      </section>

      {/* 
        Below the fold - Lazy loaded with error boundaries
        Each section uses CSS animations with IntersectionObserver (lighter than framer-motion)
      */}
      <AnimatedSection fallbackTitle="Không thể tải danh mục">
        <CategoryProductsSection />
      </AnimatedSection>

      <AnimatedSection fallbackTitle="Không thể tải sản phẩm mới">
        <NewProductsSection />
      </AnimatedSection>

      <AnimatedSection fallbackTitle="Không thể tải sản phẩm bán chạy">
        <BestSellingProductsSection />
      </AnimatedSection>

      <AnimatedSection fallbackTitle="Không thể tải dịch vụ">
        <FeaturedServices />
      </AnimatedSection>

      <AnimatedSection fallbackTitle="Không thể tải thống kê">
        <StatsSection />
      </AnimatedSection>

      <AnimatedSection fallbackTitle="Không thể tải đội ngũ">
        <TechniciansSection />
      </AnimatedSection>

      <AnimatedSection fallbackTitle="Không thể tải đánh giá">
        <TestimonialsSection />
      </AnimatedSection>

      <AnimatedSection fallbackTitle="Không thể tải dự án">
        <FeaturedProjects />
      </AnimatedSection>

      <AnimatedSection fallbackTitle="Không thể tải kiến thức">
        <FeaturedKnowledgeSection />
      </AnimatedSection>

      <AnimatedSection fallbackTitle="Không thể tải bài viết">
        <FeaturedBlogSection />
      </AnimatedSection>

      <AnimatedSection fallbackTitle="Không thể tải mục đăng ký">
        <NewsletterSection />
      </AnimatedSection>
    </>
  );
}
