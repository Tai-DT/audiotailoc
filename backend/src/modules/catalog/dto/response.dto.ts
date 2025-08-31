import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductImageResponseDto {
  @ApiProperty({
    description: 'Image URL',
    example: 'https://example.com/uploads/products/image.jpg',
  })
  url: string;

  @ApiPropertyOptional({
    description: 'Image alt text',
    example: 'Premium Audio Cable - Professional Quality',
  })
  alt?: string;

  @ApiPropertyOptional({
    description: 'Is this the main product image',
    example: true,
  })
  isMain?: boolean;

  @ApiPropertyOptional({
    description: 'Image width in pixels',
    example: 800,
  })
  width?: number;

  @ApiPropertyOptional({
    description: 'Image height in pixels',
    example: 600,
  })
  height?: number;
}

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Premium Audio Cable - 3 Meter',
  })
  name: string;

  @ApiProperty({
    description: 'Product URL slug',
    example: 'premium-audio-cable-3-meter',
  })
  slug: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-quality audio cable with gold-plated connectors for superior sound transmission',
  })
  description: string;

  @ApiProperty({
    description: 'Product price in VND',
    example: 150000,
  })
  price: number;

  @ApiPropertyOptional({
    description: 'Sale price in VND (if on sale)',
    example: 120000,
  })
  salePrice?: number;

  @ApiPropertyOptional({
    description: 'Current stock quantity',
    example: 50,
  })
  stock?: number;

  @ApiPropertyOptional({
    description: 'Product SKU',
    example: 'AUD-CABLE-3M-001',
  })
  sku?: string;

  @ApiPropertyOptional({
    description: 'Product category',
    example: 'Audio Cables',
  })
  category?: string;

  @ApiPropertyOptional({
    description: 'Product brand',
    example: 'AudioPro',
  })
  brand?: string;

  @ApiPropertyOptional({
    description: 'Product weight in grams',
    example: 250,
  })
  weight?: number;

  @ApiPropertyOptional({
    description: 'Product dimensions',
    example: '300x2x2 cm',
  })
  dimensions?: string;

  @ApiPropertyOptional({
    description: 'Product specifications',
    example: {
      length: '3 meters',
      connector_type: '3.5mm jack to RCA',
      cable_type: 'Shielded',
      impedance: '75 ohm',
    },
  })
  specifications?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Product tags',
    type: [String],
    example: ['audio', 'cable', 'professional', 'gold-plated'],
  })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Product images',
    type: [ProductImageResponseDto],
  })
  images?: ProductImageResponseDto[];

  @ApiProperty({
    description: 'Is product active and visible',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Is product featured',
    example: false,
  })
  isFeatured: boolean;

  @ApiPropertyOptional({
    description: 'SEO meta title',
    example: 'Premium Audio Cable - 3 Meter | High Quality Audio Equipment',
  })
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'SEO meta description',
    example: 'Professional grade 3-meter audio cable with gold-plated connectors. Perfect for studios and live performances.',
  })
  metaDescription?: string;

  @ApiPropertyOptional({
    description: 'Product rating (0-5)',
    example: 4.5,
  })
  rating?: number;

  @ApiPropertyOptional({
    description: 'Number of reviews',
    example: 24,
  })
  reviewCount?: number;

  @ApiPropertyOptional({
    description: 'View count',
    example: 1250,
  })
  viewCount?: number;

  @ApiPropertyOptional({
    description: 'Purchase count',
    example: 85,
  })
  purchaseCount?: number;

  @ApiProperty({
    description: 'Product creation date',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Product last update date',
    example: '2024-01-20T14:45:00.000Z',
  })
  updatedAt: string;

  @ApiPropertyOptional({
    description: 'Related products',
    type: [Object],
  })
  relatedProducts?: Partial<ProductResponseDto>[];

  @ApiPropertyOptional({
    description: 'Product availability status',
    enum: ['in_stock', 'low_stock', 'out_of_stock', 'discontinued'],
    example: 'in_stock',
  })
  availability?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';

  @ApiPropertyOptional({
    description: 'Estimated delivery time in days',
    example: 3,
  })
  estimatedDeliveryDays?: number;
}

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Category unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Audio Equipment',
  })
  name: string;

  @ApiProperty({
    description: 'Category URL slug',
    example: 'audio-equipment',
  })
  slug: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Professional audio equipment and accessories',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Category image URL',
    example: 'https://example.com/categories/audio-equipment.jpg',
  })
  image?: string;

  @ApiPropertyOptional({
    description: 'Parent category ID',
    example: '456e7890-e89b-12d3-a456-426614174001',
  })
  parentId?: string;

  @ApiPropertyOptional({
    description: 'Category display order',
    example: 1,
  })
  order?: number;

  @ApiProperty({
    description: 'Is category active',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Number of products in category',
    example: 45,
  })
  productCount?: number;

  @ApiProperty({
    description: 'Category creation date',
    example: '2024-01-10T09:00:00.000Z',
  })
  createdAt: string;

  @ApiPropertyOptional({
    description: 'Subcategories',
    type: [Object],
  })
  subcategories?: CategoryResponseDto[];
}

export class SearchResultDto {
  @ApiProperty({
    description: 'Search results',
    type: [ProductResponseDto],
  })
  products: ProductResponseDto[];

  @ApiProperty({
    description: 'Total number of results',
    example: 156,
  })
  total: number;

  @ApiProperty({
    description: 'Search query used',
    example: 'audio cable',
  })
  query: string;

  @ApiPropertyOptional({
    description: 'Search suggestions for better results',
    type: [String],
    example: ['audio cables', 'audio cable 3m', 'premium audio cable'],
  })
  suggestions?: string[];

  @ApiPropertyOptional({
    description: 'Applied filters',
    example: {
      category: 'audio-equipment',
      priceRange: '100000-500000',
      brands: ['AudioPro', 'SoundTech'],
    },
  })
  appliedFilters?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Available filter options',
    example: {
      categories: [{ id: '1', name: 'Audio Equipment', count: 45 }],
      brands: [{ name: 'AudioPro', count: 12 }, { name: 'SoundTech', count: 8 }],
      priceRanges: [{ range: '0-100000', count: 15 }, { range: '100000-500000', count: 25 }],
    },
  })
  filterOptions?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Search execution time in milliseconds',
    example: 45,
  })
  searchTime?: number;
}

export class RecommendationResponseDto {
  @ApiProperty({
    description: 'Recommended products',
    type: [ProductResponseDto],
  })
  products: ProductResponseDto[];

  @ApiProperty({
    description: 'Recommendation algorithm used',
    example: 'collaborative_filtering',
  })
  algorithm: string;

  @ApiProperty({
    description: 'Confidence score (0-1)',
    example: 0.85,
  })
  confidence: number;

  @ApiPropertyOptional({
    description: 'Reason for recommendation',
    example: 'Customers who bought this item also bought',
  })
  reason?: string;
}