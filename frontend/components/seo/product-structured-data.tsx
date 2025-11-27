import { Product } from '@/lib/types';

interface ProductStructuredDataProps {
  product: Product;
}

export function ProductStructuredData({ product }: ProductStructuredDataProps) {
  const images = (product.images || [product.imageUrl]).filter(Boolean) as string[];
  const priceValue = Number(product.priceCents ?? 0);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    image: images,
    offers: {
      '@type': 'Offer',
      price: priceValue,
      priceCurrency: 'VND',
      availability: product.stockQuantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      condition: 'https://schema.org/NewCondition',
    },
    brand: {
      '@type': 'Brand',
      name: 'Audio Tài Lộc',
    },
    category: product.category?.name,
    aggregateRating: product.averageRating ? {
      '@type': 'AggregateRating',
      ratingValue: product.averageRating,
      reviewCount: product.reviewCount || 0,
    } : undefined,
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
