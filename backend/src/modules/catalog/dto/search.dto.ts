import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsBoolean, IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductRecommendationDto {
  @ApiProperty({
    description: 'Product ID to get recommendations for',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  productId: string;

  @ApiPropertyOptional({
    description: 'Number of recommendations to return',
    minimum: 1,
    maximum: 50,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Type of recommendations',
    enum: ['similar', 'related', 'frequently-bought-together', 'alternative'],
    default: 'similar',
    example: 'similar',
  })
  @IsOptional()
  @IsString()
  type?: 'similar' | 'related' | 'frequently-bought-together' | 'alternative' = 'similar';

  @ApiPropertyOptional({
    description: 'User ID for personalized recommendations',
    example: '456e7890-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;
}

export class AdvancedSearchDto {
  @ApiProperty({
    description: 'Search query',
    example: 'wireless bluetooth headphones',
  })
  @IsString()
  query: string;

  @ApiPropertyOptional({
    description: 'Categories to search in',
    type: [String],
    example: ['audio', 'electronics'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({
    description: 'Brands to filter by',
    type: [String],
    example: ['Sony', 'Bose', 'JBL'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  brands?: string[];

  @ApiPropertyOptional({
    description: 'Minimum price',
    minimum: 0,
    example: 100000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price',
    minimum: 0,
    example: 5000000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Tags to filter by',
    type: [String],
    example: ['wireless', 'noise-cancelling', 'bluetooth'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Features to filter by',
    type: [String],
    example: ['bluetooth', 'noise-cancelling', 'water-resistant'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({
    description: 'Include out of stock products',
    default: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  includeOutOfStock?: boolean = false;

  @ApiPropertyOptional({
    description: 'Sort by relevance, price, or popularity',
    enum: ['relevance', 'price_asc', 'price_desc', 'popularity', 'newest'],
    default: 'relevance',
    example: 'relevance',
  })
  @IsOptional()
  @IsString()
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'popularity' | 'newest' = 'relevance';

  @ApiPropertyOptional({
    description: 'Enable fuzzy search for typos',
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  fuzzy?: boolean = true;

  @ApiPropertyOptional({
    description: 'Search within specifications',
    default: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  searchSpecs?: boolean = false;
}

export class SearchSuggestionsDto {
  @ApiProperty({
    description: 'Partial search query for suggestions',
    example: 'head',
  })
  @IsString()
  query: string;

  @ApiPropertyOptional({
    description: 'Maximum number of suggestions',
    minimum: 1,
    maximum: 20,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Type of suggestions',
    enum: ['products', 'categories', 'brands', 'all'],
    default: 'all',
    example: 'all',
  })
  @IsOptional()
  @IsString()
  type?: 'products' | 'categories' | 'brands' | 'all' = 'all';
}

export class ProductFilterOptionsDto {
  @ApiPropertyOptional({
    description: 'Category to get filter options for',
    example: 'audio-equipment',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Include price ranges in filter options',
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  includePriceRanges?: boolean = true;

  @ApiPropertyOptional({
    description: 'Include brand options in filter',
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  includeBrands?: boolean = true;

  @ApiPropertyOptional({
    description: 'Include available tags',
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  includeTags?: boolean = true;
}