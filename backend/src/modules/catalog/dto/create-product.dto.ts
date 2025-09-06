import {
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  IsBoolean,
  Min,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductImageDto {
  @ApiProperty({
    description: 'Image URL',
    example: 'https://example.com/image.jpg',
  })
  @IsUrl()
  url!: string;

  @ApiPropertyOptional({
    description: 'Image alt text',
    example: 'Product image description',
  })
  @IsOptional()
  @IsString()
  alt?: string;

  @ApiPropertyOptional({
    description: 'Is this the main image?',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isMain?: boolean;
}

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

  @ApiProperty({
    description: 'Product description',
    example: 'High-quality audio cable for professional use',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description: 'Product price in VND',
    example: 150000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({
    description: 'Product sale price in VND',
    example: 120000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @ApiPropertyOptional({
    description: 'Product stock quantity',
    example: 100,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number = 0;

  @ApiPropertyOptional({
    description: 'Product SKU (Stock Keeping Unit)',
    example: 'AUD-CABLE-001',
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({
    description: 'Product category',
    example: 'Cables',
  })
  @IsOptional()
  @IsString()
  category?: string;

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
    description: 'Product specifications (JSON string)',
    example: '{"length": "3m", "connector": "3.5mm"}',
  })
  @IsOptional()
  @IsString()
  specifications?: string;

  @ApiPropertyOptional({
    description: 'Product tags',
    example: ['audio', 'cable', 'professional'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Product images',
    type: [ProductImageDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  @ArrayMinSize(1)
  images?: ProductImageDto[];

  @ApiPropertyOptional({
    description: 'Is product active/visible?',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiPropertyOptional({
    description: 'Is product featured?',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean = false;

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
}
