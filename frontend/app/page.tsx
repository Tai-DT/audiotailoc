'use client';

import React from 'react';
import { BannerCarousel } from '@/components/home/banner-carousel';
import { StatsSection } from '@/components/home/stats-section';
import { FeaturedProducts } from '@/components/home/featured-products';
import { NewProductsSection } from '@/components/home/new-products-section';
import { BestSellingProductsSection } from '@/components/home/best-selling-products-section';
import { CategoryProductsSection } from '@/components/home/category-products-section';
import { FeaturedServices } from '@/components/home/featured-services';
import { FeaturedProjects } from '@/components/home/featured-projects';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { NewsletterSection } from '@/components/home/newsletter-section';
import { FeaturedBlogSection } from '@/components/home/featured-blog-section';
import { FeaturedKnowledgeSection } from '@/components/home/featured-knowledge-section';

export default function Home() {
  return (
    <main className="bg-background">
      <BannerCarousel />
      {/* Core Product Sections - Maximum Focus */}
      <FeaturedProducts />
      <CategoryProductsSection />
      <NewProductsSection />
      <BestSellingProductsSection />
      
      {/* Service Section - Secondary Focus */}
      <FeaturedServices />
      
      {/* Trust & Social Proof */}
      <StatsSection />
      <TestimonialsSection />
      
      {/* Portfolio & Content */}
      <FeaturedProjects />
      <FeaturedKnowledgeSection />
      <FeaturedBlogSection />
      
      {/* Conversion */}
      <NewsletterSection />
    </main>
  );
}
