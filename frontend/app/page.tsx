'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { CategoryNavbar } from '@/components/layout/category-navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/hero';
import { FeaturedProducts } from '@/components/home/featured-products';
import { FeaturedServices } from '@/components/home/featured-services';
import { FeaturedProjects } from '@/components/home/featured-projects';
import { StatsSection } from '@/components/home/stats-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { NewsletterSection } from '@/components/home/newsletter-section';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CategoryNavbar />
      <main>
        <Hero />
        <StatsSection />
        <FeaturedProducts />
        <FeaturedServices />
        <FeaturedProjects />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}