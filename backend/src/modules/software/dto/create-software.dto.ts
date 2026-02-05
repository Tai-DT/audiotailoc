import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateSoftwareDto {
  @ApiProperty({ description: 'Software name' })
  @IsString()
  @Length(1, 255)
  name!: string;

  @ApiPropertyOptional({ description: 'Slug (auto-generated if not provided)' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  slug?: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Category' })
  @IsString()
  category!: string;

  @ApiProperty({ description: 'Platform (Windows/macOS/Linux/...)' })
  @IsString()
  platform!: string;

  @ApiPropertyOptional({ description: 'Version' })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiPropertyOptional({ description: 'Price in cents (VND * 100)' })
  @IsOptional()
  @IsNumber()
  priceCents?: number;

  @ApiPropertyOptional({ description: 'Require purchase to download' })
  @IsOptional()
  @IsBoolean()
  isPaidRequired?: boolean;

  @ApiPropertyOptional({ description: 'Google Drive / download URL' })
  @IsOptional()
  @IsString()
  downloadUrl?: string;

  @ApiPropertyOptional({ description: 'Website URL' })
  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @ApiPropertyOptional({ description: 'Image URL' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Features (markdown/plain text)' })
  @IsOptional()
  @IsString()
  features?: string;

  @ApiPropertyOptional({ description: 'Linked productId for paid software' })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional({ description: 'Active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
