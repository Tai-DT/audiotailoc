import Head from 'next/head';
import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  locale?: string;
}

export function generateSEO({
  title = 'Audio Tài Lộc - Nâng tầm trải nghiệm âm thanh',
  description = 'Cửa hàng audio chuyên nghiệp với các sản phẩm chất lượng cao. Tai nghe, loa, ampli và phụ kiện âm thanh chính hãng, giá tốt nhất thị trường.',
  keywords = ['audio', 'tai nghe', 'loa', 'ampli', 'âm thanh', 'chất lượng cao', 'chính hãng'],
  image = '/og-image.jpg',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  locale = 'vi_VN',
}: SEOProps): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : [{ name: 'Audio Tài Lộc' }],
    creator: 'Audio Tài Lộc',
    publisher: 'Audio Tài Lộc',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      type: type === 'product' ? 'website' : type,
      locale,
      url: fullUrl,
      title,
      description,
      siteName: 'Audio Tài Lộc',
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImage],
      creator: '@audiotailoc',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...(publishedTime && { publishedTime }),
    ...(modifiedTime && { modifiedTime }),
    ...(author && { author }),
    ...(section && { section }),
    ...(tags && { tags }),
  };
}

// JSON-LD Structured Data Components
export function ProductStructuredData({
  product,
}: {
  product: {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    brand?: string;
    category?: string;
    rating?: {
      ratingValue: number;
      reviewCount: number;
    };
  };
}) {
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.id}`,
    name: product.name,
    description: product.description,
    image: product.image.startsWith('http')
      ? product.image
      : `${process.env.NEXT_PUBLIC_SITE_URL}${product.image}`,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'VND',
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      seller: {
        '@type': 'Organization',
        name: 'Audio Tài Lộc',
      },
    },
    ...(product.brand && {
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
    }),
    ...(product.category && { category: product.category }),
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.ratingValue,
        reviewCount: product.rating.reviewCount,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function OrganizationStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/#organization`,
    name: 'Audio Tài Lộc',
    alternateName: 'Audio Tai Loc',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    logo: {
      '@type': 'ImageObject',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/logo.png`,
    },
    description: 'Cửa hàng audio chuyên nghiệp với các sản phẩm chất lượng cao. Tai nghe, loa, ampli và phụ kiện âm thanh chính hãng.',
    sameAs: [
      'https://facebook.com/audiotailoc',
      'https://instagram.com/audiotailoc',
      'https://twitter.com/audiotailoc',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84-123-456-789',
      contactType: 'customer service',
      availableLanguage: 'Vietnamese',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ho Chi Minh City',
      addressRegion: 'Ho Chi Minh',
      addressCountry: 'VN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '10.7769',
      longitude: '106.7009',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function BreadcrumbStructuredData({
  items,
}: {
  items: Array<{
    name: string;
    url?: string;
  }>;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

