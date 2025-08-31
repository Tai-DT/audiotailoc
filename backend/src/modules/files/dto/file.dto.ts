import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, IsArray, IsBoolean, IsUUID, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum FileType {
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  ARCHIVE = 'ARCHIVE',
  OTHER = 'OTHER',
}

export enum ImageSize {
  THUMBNAIL = 'THUMBNAIL',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  ORIGINAL = 'ORIGINAL',
}

export class UploadFileDto {
  @ApiPropertyOptional({
    description: 'File category for organization',
    example: 'products',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Custom filename (without extension)',
    example: 'product-image-001',
  })
  @IsOptional()
  @IsString()
  customName?: string;

  @ApiPropertyOptional({
    description: 'File description or alt text',
    example: 'Premium audio cable product image',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Associated entity ID (product, user, etc.)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiPropertyOptional({
    description: 'Entity type',
    example: 'product',
  })
  @IsOptional()
  @IsString()
  entityType?: string;

  @ApiPropertyOptional({
    description: 'Whether file is public (affects CDN caching)',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean = true;

  @ApiPropertyOptional({
    description: 'Generate image thumbnails',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  generateThumbnails?: boolean = true;
}

export class ImageResizeDto {
  @ApiProperty({
    description: 'Target width in pixels',
    example: 800,
    minimum: 50,
    maximum: 4000,
  })
  @IsNumber()
  @Min(50)
  @Max(4000)
  width: number;

  @ApiProperty({
    description: 'Target height in pixels',
    example: 600,
    minimum: 50,
    maximum: 4000,
  })
  @IsNumber()
  @Min(50)
  @Max(4000)
  height: number;

  @ApiPropertyOptional({
    description: 'Maintain aspect ratio',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  maintainAspectRatio?: boolean = true;

  @ApiPropertyOptional({
    description: 'Image quality (1-100)',
    default: 80,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  quality?: number = 80;
}

export class FileSearchDto {
  @ApiPropertyOptional({
    description: 'Page number',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;

  @ApiPropertyOptional({
    description: 'Search in filename and description',
    example: 'product image',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by file type',
    enum: FileType,
    example: FileType.IMAGE,
  })
  @IsOptional()
  @IsEnum(FileType)
  type?: FileType;

  @ApiPropertyOptional({
    description: 'Filter by category',
    example: 'products',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter by entity type',
    example: 'product',
  })
  @IsOptional()
  @IsString()
  entityType?: string;

  @ApiPropertyOptional({
    description: 'Filter by entity ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiPropertyOptional({
    description: 'Filter by MIME type',
    example: 'image/jpeg',
  })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiPropertyOptional({
    description: 'Minimum file size in bytes',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minSize?: number;

  @ApiPropertyOptional({
    description: 'Maximum file size in bytes',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxSize?: number;

  @ApiPropertyOptional({
    description: 'Sort field',
    enum: ['filename', 'size', 'createdAt', 'updatedAt'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsEnum(['filename', 'size', 'createdAt', 'updatedAt'])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class BulkDeleteDto {
  @ApiProperty({
    description: 'Array of file IDs to delete',
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174000', '456e7890-e89b-12d3-a456-426614174001'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  fileIds: string[];

  @ApiPropertyOptional({
    description: 'Force delete even if file is referenced',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  force?: boolean = false;
}