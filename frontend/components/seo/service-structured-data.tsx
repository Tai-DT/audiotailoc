import { parseImages } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  images?: unknown;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  priceType: string;
  duration: number;
  serviceType?: {
    name: string;
  };
  isFeatured: boolean;
  viewCount: number;
}

interface ServiceStructuredDataProps {
  service: Service;
}

export function ServiceStructuredData({ service }: ServiceStructuredDataProps) {
  const getPriceRange = () => {
    switch (service.priceType) {
      case 'FIXED':
        return {
          price: (service.price! / 100).toFixed(2),
          priceCurrency: 'VND',
        };
      case 'RANGE':
        if (service.minPrice && service.maxPrice) {
          return {
            price: (service.minPrice / 100).toFixed(2),
            priceCurrency: 'VND',
            // Note: Schema.org doesn't have a direct way to represent price ranges
            // We'll use the minimum price as the main price
          };
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const priceInfo = getPriceRange();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.shortDescription || service.description,
    image: parseImages(service.images),
    provider: {
      '@type': 'Organization',
      name: 'Audio Tài Lộc',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com',
    },
    serviceType: service.serviceType?.name,
    ...(priceInfo && {
      offers: {
        '@type': 'Offer',
        ...priceInfo,
      },
    }),
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Duration',
        value: `${service.duration} minutes`,
      },
      {
        '@type': 'PropertyValue',
        name: 'View Count',
        value: service.viewCount,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}