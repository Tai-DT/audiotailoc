'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { BannerCarousel } from '@/components/home/banner-carousel';
import { FeaturedProducts } from '@/components/home/featured-products';

// Dynamic imports for below-the-fold sections (lazy loading)
const CategoryProductsSection = dynamic(
  () => import('@/components/home/category-products-section').then(mod => ({ default: mod.CategoryProductsSection })),
  { loading: () => <SectionSkeleton /> }
);
const NewProductsSection = dynamic(
  () => import('@/components/home/new-products-section').then(mod => ({ default: mod.NewProductsSection })),
  { loading: () => <SectionSkeleton /> }
);
const BestSellingProductsSection = dynamic(
  () => import('@/components/home/best-selling-products-section').then(mod => ({ default: mod.BestSellingProductsSection })),
  { loading: () => <SectionSkeleton /> }
);
const FeaturedServices = dynamic(
  () => import('@/components/home/featured-services').then(mod => ({ default: mod.FeaturedServices })),
  { loading: () => <SectionSkeleton /> }
);
const StatsSection = dynamic(
  () => import('@/components/home/stats-section').then(mod => ({ default: mod.StatsSection })),
  { loading: () => <SectionSkeleton /> }
);
const TechniciansSection = dynamic(
  () => import('@/components/home/technicians-section').then(mod => ({ default: mod.TechniciansSection })),
  { loading: () => <SectionSkeleton /> }
);
const TestimonialsSection = dynamic(
  () => import('@/components/home/testimonials-section').then(mod => ({ default: mod.TestimonialsSection })),
  { loading: () => <SectionSkeleton /> }
);
const FeaturedProjects = dynamic(
  () => import('@/components/home/featured-projects').then(mod => ({ default: mod.FeaturedProjects })),
  { loading: () => <SectionSkeleton /> }
);
const FeaturedKnowledgeSection = dynamic(
  () => import('@/components/home/featured-knowledge-section').then(mod => ({ default: mod.FeaturedKnowledgeSection })),
  { loading: () => <SectionSkeleton /> }
);
const FeaturedBlogSection = dynamic(
  () => import('@/components/home/featured-blog-section').then(mod => ({ default: mod.FeaturedBlogSection })),
  { loading: () => <SectionSkeleton /> }
);
const NewsletterSection = dynamic(
  () => import('@/components/home/newsletter-section').then(mod => ({ default: mod.NewsletterSection })),
  { loading: () => <SectionSkeleton /> }
);

// Loading skeleton for lazy-loaded sections
function SectionSkeleton() {
  return (
    <div className="py-12 px-4">
      <div className="container mx-auto">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, ease: 'easeOut' },
};

export default function Home() {
  return (
    <main className="bg-background">
      {/* Above the fold - loaded immediately */}
      <BannerCarousel />

      <motion.div {...fadeInUp}>
        <FeaturedProducts />
      </motion.div>

      {/* Below the fold - lazy loaded */}
      <Suspense fallback={<SectionSkeleton />}>
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <CategoryProductsSection />
        </motion.div>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <NewProductsSection />
        </motion.div>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
          <BestSellingProductsSection />
        </motion.div>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
          <FeaturedServices />
        </motion.div>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <motion.div {...fadeInUp} transition={{ delay: 0.5 }}>
          <StatsSection />
        </motion.div>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <motion.div {...fadeInUp} transition={{ delay: 0.55 }}>
          <TechniciansSection />
        </motion.div>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <motion.div {...fadeInUp} transition={{ delay: 0.6 }}>
          <TestimonialsSection />
        </motion.div>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <motion.div {...fadeInUp} transition={{ delay: 0.7 }}>
          <FeaturedProjects />
        </motion.div>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <motion.div {...fadeInUp} transition={{ delay: 0.8 }}>
          <FeaturedKnowledgeSection />
        </motion.div>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <motion.div {...fadeInUp} transition={{ delay: 0.9 }}>
          <FeaturedBlogSection />
        </motion.div>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <motion.div {...fadeInUp} transition={{ delay: 1.0 }}>
          <NewsletterSection />
        </motion.div>
      </Suspense>
    </main>
  );
}
