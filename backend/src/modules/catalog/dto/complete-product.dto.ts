import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  IsArray,
  IsUrl,
  Length,
  Matches,
  ArrayMaxSize,
  ValidateNested,
  IsEnum,
  Allow,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

// Enums
export enum ProductSortBy {
  CREATED_AT = 'createdAt',
  NAME = 'name',
  PRICE = 'price',
  UPDATED_AT = 'updatedAt',
  VIEW_COUNT = 'viewCount',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class ProductSpecificationDto {
  @ApiProperty({
    description: 'Specification key',
    example: 'Power Output',
  })
  @IsString()
  @Length(1, 100)
  key!: string;

  @ApiProperty({
    description: 'Specification value',
    example: '100W RMS',
  })
  @IsString()
  @Length(1, 500)
  value!: string;
}

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Premium Audio Cable',
  })
  @IsString()
  @Length(1, 255)
  name!: string;

  @ApiPropertyOptional({
    description: 'Product slug (auto-generated if not provided)',
    example: 'premium-audio-cable',
  })
  @IsOptional()
  @Transform(({ value }) => (value === null ? undefined : value))
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'High-quality audio cable for professional use',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Short description',
    example: 'Premium quality audio cable',
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  shortDescription?: string;

  @ApiProperty({
    description: 'Product price in cents',
    example: 299000,
  })
  @IsNumber()
  @Min(0)
  priceCents!: number;

  @ApiPropertyOptional({
    description: 'Original price in cents (for discounts)',
    example: 399000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPriceCents?: number;

  @ApiPropertyOptional({
    description: 'SKU (Stock Keeping Unit)',
    example: 'AUDIO-CABLE-001',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  sku?: string;

  @ApiPropertyOptional({
    description: 'Warranty information',
    example: '12 months',
  })
  @IsOptional()
  @IsString()
  warranty?: string;

  @ApiPropertyOptional({
    description: 'Product features (comma-separated)',
    example: 'High quality, Durable, Warranty included',
  })
  @IsOptional()
  @IsString()
  features?: string;

  @ApiPropertyOptional({
    description: 'Minimum order quantity',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  minOrderQuantity?: number = 1;

  @ApiPropertyOptional({
    description: 'Maximum order quantity',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxOrderQuantity?: number;

  @ApiPropertyOptional({
    description: 'Product tags (comma-separated)',
    example: 'audio,cable,premium',
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({
    description: 'Category ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @Allow()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Brand name',
    example: 'AudioTech',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  brand?: string;

  @ApiPropertyOptional({
    description: 'Product model',
    example: 'AT-1000',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  model?: string;

  @ApiPropertyOptional({
    description: 'Product weight in grams',
    example: 500,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({
    description: 'Product dimensions (LxWxH)',
    example: '20x10x5 cm',
  })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiPropertyOptional({
    description: 'Product specifications',
    type: [ProductSpecificationDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSpecificationDto)
  specifications?: ProductSpecificationDto[];

  @ApiPropertyOptional({
    description: 'Product images URLs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  images?: string[];

  @ApiPropertyOptional({
    description: 'Is product active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean = true;

  @ApiPropertyOptional({
    description: 'Is product featured',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  featured?: boolean = false;

  @ApiPropertyOptional({
    description: 'Meta title for SEO',
    example: 'Premium Audio Cable - High Quality Audio Equipment',
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'Meta description for SEO',
    example:
      'Buy premium audio cable for professional audio equipment. High quality, durable, and affordable.',
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  metaDescription?: string;

  @ApiPropertyOptional({
    description: 'Meta keywords for SEO',
    example: 'audio cable, premium audio, professional equipment',
  })
  @IsOptional()
  @IsString()
  metaKeywords?: string;

  @ApiPropertyOptional({
    description: 'Canonical URL',
    example: 'https://audiotailoc.com/products/premium-audio-cable',
  })
  @IsOptional()
  @IsUrl()
  canonicalUrl?: string;

  @ApiPropertyOptional({
    description: 'Stock quantity',
    example: 100,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Product name',
    example: 'Premium Audio Cable',
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Product slug',
    example: 'premium-audio-cable',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'High-quality audio cable for professional use',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Short description',
    example: 'Premium quality audio cable',
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  shortDescription?: string;

  @ApiPropertyOptional({
    description: 'Product price in cents',
    example: 299000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceCents?: number;

  @ApiPropertyOptional({
    description: 'Original price in cents (for discounts)',
    example: 399000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPriceCents?: number;

  @ApiPropertyOptional({
    description: 'SKU (Stock Keeping Unit)',
    example: 'AUDIO-CABLE-001',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  sku?: string;

  @ApiPropertyOptional({
    description: 'Warranty information',
    example: '12 months',
  })
  @IsOptional()
  @IsString()
  warranty?: string;

  @ApiPropertyOptional({
    description: 'Product features (comma-separated)',
    example: 'High quality, Durable, Warranty included',
  })
  @IsOptional()
  @IsString()
  features?: string;

  @ApiPropertyOptional({
    description: 'Minimum order quantity',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  minOrderQuantity?: number;

  @ApiPropertyOptional({
    description: 'Maximum order quantity',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxOrderQuantity?: number;

  @ApiPropertyOptional({
    description: 'Product tags (comma-separated)',
    example: 'audio,cable,premium',
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({
    description: 'Category ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Brand name',
    example: 'AudioTech',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  brand?: string;

  @ApiPropertyOptional({
    description: 'Product model',
    example: 'AT-1000',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  model?: string;

  @ApiPropertyOptional({
    description: 'Product weight in grams',
    example: 500,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({
    description: 'Product dimensions (LxWxH)',
    example: '20x10x5 cm',
  })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiPropertyOptional({
    description: 'Product specifications',
    type: [ProductSpecificationDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSpecificationDto)
  specifications?: ProductSpecificationDto[];

  @ApiPropertyOptional({
    description: 'Product images URLs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  images?: string[];

  @ApiPropertyOptional({
    description: 'Is product active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Is product featured',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'Meta title for SEO',
    example: 'Premium Audio Cable - High Quality Audio Equipment',
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'Meta description for SEO',
    example:
      'Buy premium audio cable for professional audio equipment. High quality, durable, and affordable.',
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  metaDescription?: string;

  @ApiPropertyOptional({
    description: 'Meta keywords for SEO',
    example: 'audio cable, premium audio, professional equipment',
  })
  @IsOptional()
  @IsString()
  metaKeywords?: string;

  @ApiPropertyOptional({
    description: 'Canonical URL',
    example: 'https://audiotailoc.com/products/premium-audio-cable',
  })
  @IsOptional()
  @IsUrl()
  canonicalUrl?: string;

  @ApiPropertyOptional({
    description: 'Stock quantity',
    example: 100,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;
}

export class ProductListQueryDto {
  @ApiPropertyOptional({
    description: 'Page number (starts from 1)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number = 20;

  @ApiPropertyOptional({
    description: 'Sort by field',
    example: 'createdAt',
    enum: ProductSortBy,
    default: ProductSortBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(ProductSortBy)
  sortBy?: ProductSortBy = ProductSortBy.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({
    description: 'Search query',
    example: 'wireless speaker',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Category ID filter',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by featured status',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'Minimum price in cents',
    example: 100000,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price in cents',
    example: 500000,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  maxPrice?: number;
}

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'product-uuid',
  })
  id!: string;

  @ApiProperty({
    description: 'Product slug',
    example: 'premium-audio-cable',
  })
  slug!: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Premium Audio Cable',
  })
  name!: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'High-quality audio cable for professional use',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Short description',
    example: 'Premium quality audio cable',
  })
  shortDescription?: string;

  @ApiProperty({
    description: 'Product price in cents',
    example: 299000,
  })
  priceCents!: number;

  @ApiPropertyOptional({
    description: 'Original price in cents',
    example: 399000,
  })
  originalPriceCents?: number;

  @ApiPropertyOptional({
    description: 'SKU',
    example: 'AUDIO-CABLE-001',
  })
  sku?: string;

  @ApiPropertyOptional({
    description: 'Warranty',
    example: '12 months',
  })
  warranty?: string;

  @ApiPropertyOptional({
    description: 'Features',
    example: 'High quality, Durable, Warranty included',
  })
  features?: string;

  @ApiProperty({
    description: 'Minimum order quantity',
    example: 1,
  })
  minOrderQuantity!: number;

  @ApiPropertyOptional({
    description: 'Maximum order quantity',
    example: 10,
  })
  maxOrderQuantity?: number;

  @ApiPropertyOptional({
    description: 'Tags',
    example: 'audio,cable,premium',
  })
  tags?: string;

  @ApiPropertyOptional({
    description: 'Category information',
    type: Object,
  })
  category?: any;

  @ApiPropertyOptional({
    description: 'Brand',
    example: 'AudioTech',
  })
  brand?: string;

  @ApiPropertyOptional({
    description: 'Model',
    example: 'AT-1000',
  })
  model?: string;

  @ApiPropertyOptional({
    description: 'Weight in grams',
    example: 500,
  })
  weight?: number;

  @ApiPropertyOptional({
    description: 'Dimensions',
    example: '20x10x5 cm',
  })
  dimensions?: string;

  @ApiPropertyOptional({
    description: 'Specifications',
    type: [ProductSpecificationDto],
  })
  specifications?: ProductSpecificationDto[];

  @ApiPropertyOptional({
    description: 'Images URLs',
    type: [String],
  })
  images?: string[];

  @ApiProperty({
    description: 'Is active',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Is featured',
    example: false,
  })
  featured!: boolean;

  @ApiProperty({
    description: 'View count',
    example: 150,
  })
  viewCount!: number;

  @ApiProperty({
    description: 'Created at',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt!: string;

  @ApiProperty({
    description: 'Updated at',
    example: '2024-01-01T00:00:00Z',
  })
  updatedAt!: string;

  @ApiPropertyOptional({
    description: 'Meta title',
    example: 'Premium Audio Cable - High Quality Audio Equipment',
  })
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'Meta description',
    example: 'Buy premium audio cable for professional audio equipment',
  })
  metaDescription?: string;

  @ApiPropertyOptional({
    description: 'Meta keywords',
    example: 'audio cable, premium audio, professional equipment',
  })
  metaKeywords?: string;

  @ApiPropertyOptional({
    description: 'Canonical URL',
    example: 'https://audiotailoc.com/products/premium-audio-cable',
  })
  canonicalUrl?: string;
}

export class ProductListResponseDto {
  @ApiProperty({
    description: 'List of products',
    type: [ProductResponseDto],
  })
  items!: ProductResponseDto[];

  @ApiProperty({
    description: 'Total number of products',
    example: 150,
  })
  total!: number;

  @ApiProperty({
    description: 'Current page',
    example: 1,
  })
  page!: number;

  @ApiProperty({
    description: 'Page size',
    example: 20,
  })
  pageSize!: number;

  @ApiProperty({
    description: 'Total pages',
    example: 8,
  })
  totalPages!: number;

  @ApiProperty({
    description: 'Has next page',
    example: true,
  })
  hasNext!: boolean;

  @ApiProperty({
    description: 'Has previous page',
    example: false,
  })
  hasPrev!: boolean;
}

export class ProductAnalyticsDto {
  @ApiProperty({
    description: 'Total number of products',
    example: 150,
  })
  totalProducts!: number;

  @ApiProperty({
    description: 'Number of active products',
    example: 120,
  })
  activeProducts!: number;

  @ApiProperty({
    description: 'Number of featured products',
    example: 15,
  })
  featuredProducts!: number;

  @ApiProperty({
    description: 'Number of out of stock products',
    example: 5,
  })
  outOfStockProducts!: number;

  @ApiProperty({
    description: 'Total view count',
    example: 15420,
  })
  totalViews!: number;

  @ApiProperty({
    description: 'Average price',
    example: 250000,
  })
  averagePrice!: number;

  @ApiProperty({
    description: 'Products by category',
    example: { 'audio-cables': 25, speakers: 30 },
  })
  productsByCategory!: Record<string, number>;

  @ApiProperty({
    description: 'Top viewed products',
    type: [ProductResponseDto],
  })
  topViewedProducts!: ProductResponseDto[];

  @ApiProperty({
    description: 'Recent products',
    type: [ProductResponseDto],
  })
  recentProducts!: ProductResponseDto[];
}

export class BulkUpdateProductsDto {
  @ApiProperty({
    description: 'Product IDs to update',
    type: [String],
    example: ['product-id-1', 'product-id-2'],
  })
  @IsArray()
  @IsString({ each: true })
  productIds!: string[];

  @ApiPropertyOptional({
    description: 'Update active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Update featured status',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'Add tags (comma-separated)',
    example: 'new-tag,another-tag',
  })
  @IsOptional()
  @IsString()
  addTags?: string;

  @ApiPropertyOptional({
    description: 'Remove tags (comma-separated)',
    example: 'old-tag',
  })
  @IsOptional()
  @IsString()
  removeTags?: string;

  @ApiPropertyOptional({
    description: 'Update category ID',
    example: 'new-category-id',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;
}

export class ProductSearchSuggestionDto {
  @ApiProperty({
    description: 'Suggestion text',
    example: 'Wireless Speaker',
  })
  text!: string;

  @ApiProperty({
    description: 'Suggestion type',
    enum: ['product', 'category', 'brand'],
    example: 'product',
  })
  type!: 'product' | 'category' | 'brand';

  @ApiPropertyOptional({
    description: 'Product count for this suggestion',
    example: 25,
  })
  count?: number;
}

export class ImportResultDto {
  @ApiProperty({
    description: 'Number of products imported',
    example: 10,
  })
  imported!: number;

  @ApiProperty({
    description: 'Import errors',
    type: [String],
    example: ['Row 2: Missing name', 'Row 5: Invalid price'],
  })
  errors!: string[];
}
