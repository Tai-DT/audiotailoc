import { IsString, IsNumber, IsOptional, IsBoolean, Min, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Premium Audio Cable',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Product slug (URL-friendly version of name)',
    example: 'premium-audio-cable',
  })
  @IsString()
  slug!: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'High-quality audio cable for professional use',
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    description: 'Product price in cents (VND)',
    example: 15000000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  priceCents!: number;

  @ApiPropertyOptional({
    description: 'Product original price in cents (VND)',
    example: 18000000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPriceCents?: number;

  @ApiPropertyOptional({
    description: 'Product short description',
    example: 'Premium quality audio cable',
  })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional({
    description: 'Product SKU (Stock Keeping Unit)',
    example: 'AUD-CABLE-001',
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({
    description: 'Product warranty',
    example: '24 months',
  })
  @IsOptional()
  @IsString()
  warranty?: string;

  @ApiPropertyOptional({
    description: 'Product features',
    example: 'Waterproof, Wireless, Long battery life',
  })
  @IsOptional()
  @IsString()
  features?: string;

  @ApiPropertyOptional({
    description: 'Minimum order quantity',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  minOrderQuantity?: number = 1;

  @ApiPropertyOptional({
    description: 'Maximum order quantity',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxOrderQuantity?: number;

  @ApiPropertyOptional({
    description: 'Product tags (comma-separated)',
    example: 'audio,cable,professional',
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({
    description: 'Product category ID',
    example: 'category-uuid',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Product brand',
    example: 'AudioPro',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Product weight in grams',
    example: 250,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({
    description: 'Product dimensions (L x W x H in cm)',
    example: '100x5x5',
  })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiPropertyOptional({
    description: 'Product specifications (JSON object)',
    example: '{"length": "3m", "connector": "3.5mm", "material": "copper"}',
  })
  @IsOptional()
  specifications?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Product images (array of URLs)',
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({
    description: 'Product image URL (primary image)',
    example: 'https://example.com/image1.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Is product active/visible?',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiPropertyOptional({
    description: 'Is this a digital product (downloadable software)?',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDigital?: boolean = false;

  @ApiPropertyOptional({
    description: 'Download URL for digital products (e.g., Google Drive share link)',
    example: 'https://drive.google.com/file/d/<fileId>/view',
  })
  @IsOptional()
  @IsString()
  downloadUrl?: string;

  @ApiPropertyOptional({
    description: 'Is product featured?',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  featured?: boolean = false;

  @ApiPropertyOptional({
    description: 'SEO meta title',
    example: 'Premium Audio Cable - Professional Quality',
  })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'SEO meta description',
    example: 'High-quality audio cable for professional audio equipment',
  })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({
    description: 'Product model',
    example: 'AC-1000',
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({
    description: 'SEO meta keywords (comma-separated)',
    example: 'audio,cable,professional,premium',
  })
  @IsOptional()
  @IsString()
  metaKeywords?: string;

  @ApiPropertyOptional({
    description: 'SEO canonical URL',
    example: 'https://audiotailoc.com/products/premium-audio-cable',
  })
  @IsOptional()
  @IsString()
  canonicalUrl?: string;

  @ApiPropertyOptional({
    description: 'Stock quantity',
    example: 100,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number = 0;
}
