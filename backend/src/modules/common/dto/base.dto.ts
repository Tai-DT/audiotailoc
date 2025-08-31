import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsEnum, IsArray, Min, Max, IsBoolean, IsUUID } from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number (starts from 1)',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page (max 100)',
    minimum: 1,
    maximum: 100,
    default: 20,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: SortOrder,
    default: SortOrder.DESC,
    example: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}

export class SearchDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search query string',
    example: 'audio equipment',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Filter by category',
    example: 'electronics',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Minimum price filter',
    minimum: 0,
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price filter',
    minimum: 0,
    example: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Filter featured items only',
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
    description: 'Filter by tags',
    type: [String],
    example: ['bestseller', 'new-arrival'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class BulkIdsDto {
  @ApiProperty({
    description: 'Array of item IDs',
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174000', '456e7890-e89b-12d3-a456-426614174001'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[];
}

export class StandardResponseDto<T> {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiPropertyOptional({
    description: 'Response data',
  })
  data?: T;

  @ApiPropertyOptional({
    description: 'Error information',
  })
  error?: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    path: string;
    correlationId?: string;
  };

  @ApiPropertyOptional({
    description: 'API metadata',
    example: {
      version: 'v1',
      deprecated: false,
    },
  })
  _api?: {
    version: string;
    deprecated: boolean;
  };
}

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Array of items',
    isArray: true,
  })
  items: T[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      page: 1,
      pageSize: 20,
      total: 100,
      totalPages: 5,
      hasNext: true,
      hasPrev: false,
    },
  })
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  @ApiPropertyOptional({
    description: 'Applied and available filters',
    example: {
      applied: { category: 'electronics', featured: true },
      available: { categories: ['electronics', 'audio', 'accessories'] },
    },
  })
  filters?: {
    applied: Record<string, any>;
    available: Record<string, any>;
  };
}

export class BulkOperationResultDto {
  @ApiProperty({
    description: 'Number of items processed',
    example: 5,
  })
  processed: number;

  @ApiProperty({
    description: 'Number of successful operations',
    example: 4,
  })
  successful: number;

  @ApiProperty({
    description: 'Number of failed operations',
    example: 1,
  })
  failed: number;

  @ApiPropertyOptional({
    description: 'List of errors for failed operations',
    type: [Object],
    example: [{ id: '123', error: 'Not found' }],
  })
  errors?: Array<{
    id: string;
    error: string;
  }>;
}

export class DeleteResponseDto {
  @ApiProperty({
    description: 'Indicates if the item was deleted',
    example: true,
  })
  deleted: boolean;

  @ApiProperty({
    description: 'ID of the deleted item',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;
}

export class UpdateResponseDto {
  @ApiProperty({
    description: 'Indicates if the item was updated',
    example: true,
  })
  updated: boolean;

  @ApiProperty({
    description: 'ID of the updated item',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;
}

export class AnalyticsQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Start date for analytics (ISO 8601)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for analytics (ISO 8601)',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Group by period',
    enum: ['hour', 'day', 'week', 'month'],
    example: 'day',
  })
  @IsOptional()
  @IsEnum(['hour', 'day', 'week', 'month'])
  groupBy?: 'hour' | 'day' | 'week' | 'month';

  @ApiPropertyOptional({
    description: 'Metrics to include',
    type: [String],
    example: ['views', 'clicks', 'conversions'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metrics?: string[];
}