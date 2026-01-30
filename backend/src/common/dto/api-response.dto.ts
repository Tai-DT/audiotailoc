import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ApiResponseDto<T = any> {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  message!: string;

  @ApiPropertyOptional({
    description: 'Response data',
  })
  data?: T;

  @ApiPropertyOptional({
    description: 'Timestamp of the response',
    example: '2025-08-31T22:57:59.000Z',
  })
  timestamp?: string;

  @ApiPropertyOptional({
    description: 'Request ID for tracking',
    example: 'req_1234567890',
  })
  requestId?: string;
}

export class PaginationDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
    minimum: 1,
  })
  page!: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  pageSize!: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total!: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages!: number;

  @ApiProperty({
    description: 'Indicates if there is a next page',
    example: true,
  })
  hasNext!: boolean;

  @ApiProperty({
    description: 'Indicates if there is a previous page',
    example: false,
  })
  hasPrev!: boolean;
}

export class PaginatedResponseDto<T = any> extends ApiResponseDto<T[]> {
  @ApiProperty({
    description: 'Pagination information',
    type: PaginationDto,
  })
  @Type(() => PaginationDto)
  pagination!: PaginationDto;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: false,
  })
  success!: boolean;

  @ApiProperty({
    description: 'Error message',
    example: 'Invalid request parameters',
  })
  message!: string;

  @ApiPropertyOptional({
    description: 'Error code',
    example: 'VALIDATION_ERROR',
  })
  errorCode?: string;

  @ApiPropertyOptional({
    description: 'Detailed error information',
    example: ['Name is required', 'Price must be a positive number'],
  })
  errors?: string[];

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2025-08-31T22:57:59.000Z',
  })
  timestamp!: string;

  @ApiPropertyOptional({
    description: 'Request ID for tracking',
    example: 'req_1234567890',
  })
  requestId?: string;

  @ApiPropertyOptional({
    description: 'Path that caused the error',
    example: '/api/v1/catalog/products',
  })
  path?: string;
}

export class HealthCheckDto {
  @ApiProperty({
    description: 'Service status',
    example: 'ok',
    enum: ['ok', 'error', 'maintenance'],
  })
  status!: string;

  @ApiProperty({
    description: 'Service uptime in seconds',
    example: 3600,
  })
  uptime!: number;

  @ApiProperty({
    description: 'Service version',
    example: '1.0.0',
  })
  version!: string;

  @ApiPropertyOptional({
    description: 'Environment',
    example: 'development',
  })
  environment?: string;

  @ApiPropertyOptional({
    description: 'Additional info',
  })
  info?: Record<string, any>;
}
