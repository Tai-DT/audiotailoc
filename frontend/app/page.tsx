'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { BannerCarousel } from '@/components/home/banner-carousel';
import { FeaturedProducts } from '@/components/home/featured-products';
import { SectionSkeleton } from '@/components/ui/loading-skeletons';
import { SectionErrorBoundary } from '@/components/error-boundary';

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

// ==================== ANIMATIONS ====================
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, ease: 'easeOut' },
};

// ==================== SECTION WRAPPER ====================
// Wrapper with error boundary and accessibility
interface SectionWrapperProps {
  children: React.ReactNode;
  delay?: number;
  fallbackTitle?: string;
}

function SectionWrapper({ children, delay = 0, fallbackTitle }: SectionWrapperProps) {
  return (
    <SectionErrorBoundary fallbackTitle={fallbackTitle}>
      <Suspense fallback={<SectionSkeleton />}>
        <motion.div {...fadeInUp} transition={{ delay }}>
          {children}
        </motion.div>
      </Suspense>
    </SectionErrorBoundary>
  );
}

// ==================== HOMEPAGE ====================
export default function Home() {
  return (
    <main className="bg-background" id="main-content">
      {/* 
        Above the fold - Loaded immediately for fast LCP
        These are critical for first paint
      */}
      <section aria-label="Banner chính">
        <BannerCarousel />
      </section>

      <motion.section {...fadeInUp} aria-label="Sản phẩm nổi bật">
        <FeaturedProducts />
      </motion.section>

      {/* 
        Below the fold - Lazy loaded with error boundaries
        Each section is independently wrapped for resilience
      */}
      <SectionWrapper delay={0.1} fallbackTitle="Không thể tải danh mục">
        <CategoryProductsSection />
      </SectionWrapper>

      <SectionWrapper delay={0.15} fallbackTitle="Không thể tải sản phẩm mới">
        <NewProductsSection />
      </SectionWrapper>

      <SectionWrapper delay={0.2} fallbackTitle="Không thể tải sản phẩm bán chạy">
        <BestSellingProductsSection />
      </SectionWrapper>

      <SectionWrapper delay={0.25} fallbackTitle="Không thể tải dịch vụ">
        <FeaturedServices />
      </SectionWrapper>

      <SectionWrapper delay={0.3} fallbackTitle="Không thể tải thống kê">
        <StatsSection />
      </SectionWrapper>

      <SectionWrapper delay={0.35} fallbackTitle="Không thể tải đội ngũ">
        <TechniciansSection />
      </SectionWrapper>

      <SectionWrapper delay={0.4} fallbackTitle="Không thể tải đánh giá">
        <TestimonialsSection />
      </SectionWrapper>

      <SectionWrapper delay={0.45} fallbackTitle="Không thể tải dự án">
        <FeaturedProjects />
      </SectionWrapper>

      <SectionWrapper delay={0.5} fallbackTitle="Không thể tải kiến thức">
        <FeaturedKnowledgeSection />
      </SectionWrapper>

      <SectionWrapper delay={0.55} fallbackTitle="Không thể tải bài viết">
        <FeaturedBlogSection />
      </SectionWrapper>

      <SectionWrapper delay={0.6} fallbackTitle="Không thể tải mục đăng ký">
        <NewsletterSection />
      </SectionWrapper>
    </main>
  );
}
