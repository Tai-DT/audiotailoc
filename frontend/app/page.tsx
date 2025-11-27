import React from 'react';
import { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'Audio Tài Lộc - Chuyên Gia Âm Thanh Hàng Đầu Việt Nam',
  description: 'Cung cấp thiết bị âm thanh chính hãng: Loa, Amply, Micro, Vang số. Dịch vụ tư vấn, lắp đặt phòng karaoke, hội trường, sân khấu chuyên nghiệp.',
  openGraph: {
    title: 'Audio Tài Lộc - Chuyên Gia Âm Thanh Hàng Đầu Việt Nam',
    description: 'Cung cấp thiết bị âm thanh chính hãng: Loa, Amply, Micro, Vang số. Dịch vụ tư vấn, lắp đặt phòng karaoke, hội trường, sân khấu chuyên nghiệp.',
    images: [
      {
        url: '/images/og-home.jpg', // Cần đảm bảo ảnh này tồn tại hoặc thay thế
        width: 1200,
        height: 630,
        alt: 'Audio Tài Lộc Showroom',
      },
    ],
  },
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Audio Tài Lộc',
    url: 'https://audiotailoc.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://audiotailoc.com/products?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <main className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
