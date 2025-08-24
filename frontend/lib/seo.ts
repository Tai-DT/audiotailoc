import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  structuredData?: any;
  noIndex?: boolean;
  noFollow?: boolean;
}

export class SEOManager {
  private static readonly DEFAULT_CONFIG = {
    siteName: 'Audio Tài Lộc',
    siteUrl: 'https://audiotailoc.com',
    defaultImage: '/images/og-default.jpg',
    twitterHandle: '@audiotailoc',
    locale: 'vi_VN',
    type: 'website',
  };

  // Generate Next.js metadata
  static generateMetadata(config: SEOConfig): Metadata {
    const {
      title,
      description,
      keywords = [],
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage,
      ogType = 'website',
      twitterTitle,
      twitterDescription,
      twitterImage,
      twitterCard = 'summary_large_image',
      noIndex = false,
      noFollow = false,
    } = config;

    const fullTitle = title.includes(this.DEFAULT_CONFIG.siteName) 
      ? title 
      : `${title} | ${this.DEFAULT_CONFIG.siteName}`;

    const metadata: Metadata = {
      title: fullTitle,
      description,
      keywords: keywords.join(', '),
      robots: {
        index: !noIndex,
        follow: !noFollow,
        googleBot: {
          index: !noIndex,
          follow: !noFollow,
        },
      },
      openGraph: {
        title: ogTitle || fullTitle,
        description: ogDescription || description,
        url: canonicalUrl || this.DEFAULT_CONFIG.siteUrl,
        siteName: this.DEFAULT_CONFIG.siteName,
        images: ogImage ? [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: ogTitle || title,
          }
        ] : [
          {
            url: this.DEFAULT_CONFIG.defaultImage,
            width: 1200,
            height: 630,
            alt: this.DEFAULT_CONFIG.siteName,
          }
        ],
        locale: this.DEFAULT_CONFIG.locale,
        type: ogType as any,
      },
      twitter: {
        card: twitterCard,
        title: twitterTitle || ogTitle || fullTitle,
        description: twitterDescription || ogDescription || description,
        images: twitterImage || ogImage || this.DEFAULT_CONFIG.defaultImage,
        creator: this.DEFAULT_CONFIG.twitterHandle,
        site: this.DEFAULT_CONFIG.twitterHandle,
      },
      alternates: canonicalUrl ? {
        canonical: canonicalUrl,
      } : undefined,
    };

    return metadata;
  }

  // Generate structured data for products
  static generateProductStructuredData(product: {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    image: string;
    brand?: string;
    category?: string;
    sku?: string;
    availability: 'InStock' | 'OutOfStock' | 'PreOrder';
    rating?: {
      value: number;
      count: number;
    };
  }) {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.image,
      sku: product.sku || product.id,
      brand: product.brand ? {
        '@type': 'Brand',
        name: product.brand,
      } : undefined,
      category: product.category,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency,
        availability: `https://schema.org/${product.availability}`,
        url: `${this.DEFAULT_CONFIG.siteUrl}/products/${product.id}`,
      },
      aggregateRating: product.rating ? {
        '@type': 'AggregateRating',
        ratingValue: product.rating.value,
        reviewCount: product.rating.count,
      } : undefined,
    };

    return this.cleanStructuredData(structuredData);
  }

  // Generate structured data for organization
  static generateOrganizationStructuredData() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.DEFAULT_CONFIG.siteName,
      url: this.DEFAULT_CONFIG.siteUrl,
      logo: `${this.DEFAULT_CONFIG.siteUrl}/images/logo.png`,
      description: 'Chuyên cung cấp thiết bị âm thanh chất lượng cao tại Việt Nam',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Đường ABC',
        addressLocality: 'TP. Hồ Chí Minh',
        addressCountry: 'VN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+84-xxx-xxx-xxx',
        contactType: 'customer service',
        availableLanguage: ['Vietnamese', 'English'],
      },
      sameAs: [
        'https://facebook.com/audiotailoc',
        'https://instagram.com/audiotailoc',
        'https://youtube.com/audiotailoc',
      ],
    };
  }

  // Generate structured data for breadcrumbs
  static generateBreadcrumbStructuredData(breadcrumbs: Array<{
    name: string;
    url: string;
  }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };
  }

  // Generate structured data for FAQ
  static generateFAQStructuredData(faqs: Array<{
    question: string;
    answer: string;
  }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }

  // Generate structured data for reviews
  static generateReviewStructuredData(reviews: Array<{
    author: string;
    rating: number;
    text: string;
    date: string;
  }>, product: { name: string; id: string }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      review: reviews.map(review => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author,
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
        },
        reviewBody: review.text,
        datePublished: review.date,
      })),
    };
  }

  // SEO optimization utilities
  static optimizeTitle(title: string, maxLength: number = 60): string {
    if (title.length <= maxLength) return title;
    
    // Truncate at word boundary
    const truncated = title.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 0 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  }

  static optimizeDescription(description: string, maxLength: number = 160): string {
    if (description.length <= maxLength) return description;
    
    const truncated = description.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 0 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  }

  static generateKeywords(content: string, maxKeywords: number = 10): string[] {
    // Simple keyword extraction (in production, use more sophisticated NLP)
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);

    // Count word frequency
    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort by frequency and return top keywords
    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word);
  }

  static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  // URL optimization
  static optimizeUrl(url: string): string {
    return url
      .toLowerCase()
      .replace(/[^a-z0-9\/\-_]/g, '')
      .replace(/\/+/g, '/')
      .replace(/\/$/, ''); // Remove trailing slash
  }

  // Image optimization for SEO
  static generateImageAlt(productName: string, context?: string): string {
    const base = productName;
    const suffix = context ? ` - ${context}` : '';
    return `${base}${suffix} | ${this.DEFAULT_CONFIG.siteName}`;
  }

  // Generate canonical URL
  static generateCanonicalUrl(path: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.DEFAULT_CONFIG.siteUrl}${cleanPath}`;
  }

  // Validate SEO configuration
  static validateSEOConfig(config: SEOConfig): {
    isValid: boolean;
    warnings: string[];
    errors: string[];
  } {
    const warnings: string[] = [];
    const errors: string[] = [];

    // Title validation
    if (!config.title) {
      errors.push('Title is required');
    } else if (config.title.length > 60) {
      warnings.push('Title is longer than 60 characters');
    } else if (config.title.length < 30) {
      warnings.push('Title is shorter than 30 characters');
    }

    // Description validation
    if (!config.description) {
      errors.push('Description is required');
    } else if (config.description.length > 160) {
      warnings.push('Description is longer than 160 characters');
    } else if (config.description.length < 120) {
      warnings.push('Description is shorter than 120 characters');
    }

    // Keywords validation
    if (config.keywords && config.keywords.length > 10) {
      warnings.push('Too many keywords (recommended: 5-10)');
    }

    // Image validation
    if (config.ogImage && !config.ogImage.startsWith('http')) {
      warnings.push('Open Graph image should be an absolute URL');
    }

    return {
      isValid: errors.length === 0,
      warnings,
      errors,
    };
  }

  // Helper method to clean structured data
  private static cleanStructuredData(data: any): any {
    // Remove undefined values
    const cleaned = JSON.parse(JSON.stringify(data, (key, value) => 
      value === undefined ? undefined : value
    ));

    return cleaned;
  }

  // Generate robots meta tag
  static generateRobotsTag(options: {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    noimageindex?: boolean;
  } = {}): string {
    const {
      index = true,
      follow = true,
      noarchive = false,
      nosnippet = false,
      noimageindex = false,
    } = options;

    const directives: string[] = [];

    directives.push(index ? 'index' : 'noindex');
    directives.push(follow ? 'follow' : 'nofollow');

    if (noarchive) directives.push('noarchive');
    if (nosnippet) directives.push('nosnippet');
    if (noimageindex) directives.push('noimageindex');

    return directives.join(', ');
  }
}
