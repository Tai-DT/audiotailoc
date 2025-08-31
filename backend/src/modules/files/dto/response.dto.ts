import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FileType, ImageSize } from './file.dto';

export class FileResponseDto {
  @ApiProperty({
    description: 'File unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Original filename',
    example: 'premium-audio-cable.jpg',
  })
  filename: string;

  @ApiProperty({
    description: 'File display name',
    example: 'Premium Audio Cable - Product Image',
  })
  displayName: string;

  @ApiProperty({
    description: 'File type category',
    enum: FileType,
    example: FileType.IMAGE,
  })
  type: FileType;

  @ApiProperty({
    description: 'MIME type',
    example: 'image/jpeg',
  })
  mimeType: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
  })
  size: number;

  @ApiProperty({
    description: 'Formatted file size',
    example: '1.0 MB',
  })
  formattedSize: string;

  @ApiProperty({
    description: 'File URL',
    example: 'https://cdn.audiotailoc.com/uploads/products/premium-audio-cable.jpg',
  })
  url: string;

  @ApiPropertyOptional({
    description: 'CDN URL for faster access',
    example: 'https://cdn.audiotailoc.com/uploads/products/premium-audio-cable.jpg',
  })
  cdnUrl?: string;

  @ApiPropertyOptional({
    description: 'File description or alt text',
    example: 'Premium audio cable product image showing the connector details',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'File category',
    example: 'products',
  })
  category?: string;

  @ApiPropertyOptional({
    description: 'Associated entity ID',
    example: '456e7890-e89b-12d3-a456-426614174001',
  })
  entityId?: string;

  @ApiPropertyOptional({
    description: 'Entity type',
    example: 'product',
  })
  entityType?: string;

  @ApiProperty({
    description: 'Is file publicly accessible',
    example: true,
  })
  isPublic: boolean;

  @ApiPropertyOptional({
    description: 'Image dimensions (for image files)',
    type: 'object',
    example: {
      width: 1920,
      height: 1080,
    },
  })
  dimensions?: {
    width: number;
    height: number;
  };

  @ApiPropertyOptional({
    description: 'Available image sizes (for image files)',
    type: 'object',
    example: {
      thumbnail: 'https://cdn.audiotailoc.com/uploads/products/premium-audio-cable-thumb.jpg',
      small: 'https://cdn.audiotailoc.com/uploads/products/premium-audio-cable-small.jpg',
      medium: 'https://cdn.audiotailoc.com/uploads/products/premium-audio-cable-medium.jpg',
      large: 'https://cdn.audiotailoc.com/uploads/products/premium-audio-cable-large.jpg',
      original: 'https://cdn.audiotailoc.com/uploads/products/premium-audio-cable.jpg',
    },
  })
  sizes?: Record<ImageSize, string>;

  @ApiPropertyOptional({
    description: 'File metadata',
    type: 'object',
    example: {
      exif: {
        camera: 'Canon EOS R5',
        iso: 400,
        aperture: 'f/2.8',
      },
      colorSpace: 'sRGB',
      hasAlpha: false,
    },
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'File upload date',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'File last update date',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: string;

  @ApiPropertyOptional({
    description: 'Upload statistics',
    type: 'object',
    example: {
      views: 1250,
      downloads: 45,
      lastAccessed: '2024-01-20T14:30:00.000Z',
    },
  })
  stats?: {
    views: number;
    downloads: number;
    lastAccessed: string;
  };
}

export class UploadResponseDto {
  @ApiProperty({
    description: 'Upload successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Uploaded file information',
    type: FileResponseDto,
  })
  file: FileResponseDto;

  @ApiPropertyOptional({
    description: 'Upload processing status',
    example: 'completed',
    enum: ['processing', 'completed', 'failed'],
  })
  processingStatus?: 'processing' | 'completed' | 'failed';

  @ApiPropertyOptional({
    description: 'Generated thumbnails (for images)',
    type: 'object',
    example: {
      thumbnail: 'https://cdn.audiotailoc.com/uploads/products/premium-audio-cable-thumb.jpg',
      small: 'https://cdn.audiotailoc.com/uploads/products/premium-audio-cable-small.jpg',
      medium: 'https://cdn.audiotailoc.com/uploads/products/premium-audio-cable-medium.jpg',
    },
  })
  thumbnails?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Processing warnings',
    type: [String],
    example: ['Image was automatically compressed to reduce file size'],
  })
  warnings?: string[];
}

export class FileStatsDto {
  @ApiProperty({
    description: 'Total number of files',
    example: 1250,
  })
  totalFiles: number;

  @ApiProperty({
    description: 'Total storage used in bytes',
    example: 2147483648,
  })
  totalSize: number;

  @ApiProperty({
    description: 'Formatted total size',
    example: '2.0 GB',
  })
  formattedSize: string;

  @ApiProperty({
    description: 'Files by type',
    type: 'object',
    example: {
      IMAGE: 850,
      DOCUMENT: 200,
      VIDEO: 100,
      AUDIO: 75,
      ARCHIVE: 20,
      OTHER: 5,
    },
  })
  filesByType: Record<FileType, number>;

  @ApiProperty({
    description: 'Storage by type in bytes',
    type: 'object',
    example: {
      IMAGE: 1073741824,
      DOCUMENT: 536870912,
      VIDEO: 429496729,
      AUDIO: 85899345,
      ARCHIVE: 17179869,
      OTHER: 4194304,
    },
  })
  storageByType: Record<FileType, number>;

  @ApiProperty({
    description: 'Files by category',
    type: 'object',
    example: {
      products: 800,
      users: 250,
      documents: 150,
      misc: 50,
    },
  })
  filesByCategory: Record<string, number>;

  @ApiProperty({
    description: 'Upload trends (last 30 days)',
    type: 'array',
    example: [
      { date: '2024-01-15', uploads: 25, size: 52428800 },
      { date: '2024-01-16', uploads: 30, size: 62914560 },
    ],
  })
  uploadTrends: Array<{
    date: string;
    uploads: number;
    size: number;
  }>;

  @ApiPropertyOptional({
    description: 'Storage limits and usage',
    type: 'object',
    example: {
      usedBytes: 2147483648,
      limitBytes: 10737418240,
      usedPercentage: 20,
      remainingBytes: 8589934592,
    },
  })
  quotaInfo?: {
    usedBytes: number;
    limitBytes: number;
    usedPercentage: number;
    remainingBytes: number;
  };
}

export class BulkOperationResponseDto {
  @ApiProperty({
    description: 'Number of files processed',
    example: 10,
  })
  processed: number;

  @ApiProperty({
    description: 'Number of successful operations',
    example: 8,
  })
  successful: number;

  @ApiProperty({
    description: 'Number of failed operations',
    example: 2,
  })
  failed: number;

  @ApiPropertyOptional({
    description: 'List of errors for failed operations',
    type: [Object],
    example: [
      { fileId: '123', filename: 'image1.jpg', error: 'File not found' },
      { fileId: '456', filename: 'image2.jpg', error: 'Permission denied' },
    ],
  })
  errors?: Array<{
    fileId: string;
    filename: string;
    error: string;
  }>;

  @ApiPropertyOptional({
    description: 'Total size of processed files',
    example: 52428800,
  })
  totalSize?: number;
}