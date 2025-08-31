import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsArray, IsEnum, IsNumber, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { SearchDto } from '../../common/dto/base.dto';

export enum ProductSortBy {
  NAME = 'name',
  PRICE = 'price',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  POPULARITY = 'popularity',
  RATING = 'rating',
  STOCK = 'stock',
}

export enum PriceRange {
  UNDER_100K = '0-100000',
  FROM_100K_TO_500K = '100000-500000',
  FROM_500K_TO_1M = '500000-1000000',
  FROM_1M_TO_5M = '1000000-5000000',
  OVER_5M = '5000000-99999999',
}

export class ListProductsDto extends SearchDto {
  @ApiPropertyOptional({
    description: 'Product category ID or slug',
    example: 'audio-equipment',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Product brand',
    example: 'Sony',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Filter by in-stock items only',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by active products only',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by featured products only',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: ProductSortBy,
    default: ProductSortBy.CREATED_AT,
    example: ProductSortBy.PRICE,
  })
  @IsOptional()
  @IsEnum(ProductSortBy)
  sortBy?: ProductSortBy;

  @ApiPropertyOptional({
    description: 'Predefined price ranges',
    enum: PriceRange,
    example: PriceRange.FROM_100K_TO_500K,
  })
  @IsOptional()
  @IsEnum(PriceRange)
  priceRange?: PriceRange;

  @ApiPropertyOptional({
    description: 'Filter by product tags',
    type: [String],
    example: ['bestseller', 'new-arrival', 'sale'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Minimum stock quantity',
    minimum: 0,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minStock?: number;

  @ApiPropertyOptional({
    description: 'Maximum stock quantity',
    minimum: 0,
    example: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxStock?: number;

  @ApiPropertyOptional({
    description: 'Filter by discount availability',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  hasDiscount?: boolean;

  @ApiPropertyOptional({
    description: 'Search within product name only',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  nameOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Include related products in response',
    example: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  includeRelated?: boolean;
}