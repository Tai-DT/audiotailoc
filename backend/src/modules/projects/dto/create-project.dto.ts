import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsInt,
  IsUrl,
  IsDateString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}

export class CreateProjectDto {
  @ApiProperty({ description: 'Project name', example: 'Phòng Karaoke Luxury' })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ description: 'URL slug', example: 'phong-karaoke-luxury' })
  @IsString()
  @IsOptional()
  @MaxLength(250)
  slug?: string;

  @ApiPropertyOptional({ description: 'Full project description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Short description for listings' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  shortDescription?: string;

  @ApiPropertyOptional({ description: 'Client name' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  client?: string;

  @ApiPropertyOptional({ description: 'Client logo URL' })
  @IsUrl()
  @IsOptional()
  clientLogo?: string;

  @ApiPropertyOptional({ description: 'Client logo URL (alternative)' })
  @IsUrl()
  @IsOptional()
  clientLogoUrl?: string;

  @ApiPropertyOptional({ description: 'Project category', example: 'Karaoke' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ description: 'Technologies used (JSON string or array)' })
  @IsOptional()
  technologies?: string | string[];

  @ApiPropertyOptional({ description: 'Project features (JSON string or array)' })
  @IsOptional()
  features?: string | string[];

  @ApiPropertyOptional({ description: 'Images (JSON string or array)' })
  @IsOptional()
  images?: string | string[];

  @ApiPropertyOptional({ description: 'Thumbnail image URL' })
  @IsUrl()
  @IsOptional()
  thumbnailImage?: string;

  @ApiPropertyOptional({ description: 'Cover image URL' })
  @IsUrl()
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional({ description: 'Gallery images (JSON string or array)' })
  @IsOptional()
  galleryImages?: string | string[];

  @ApiPropertyOptional({ description: 'YouTube video ID', example: 'dQw4w9WgXcQ' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  youtubeVideoId?: string;

  @ApiPropertyOptional({ description: 'YouTube video URL' })
  @IsUrl()
  @IsOptional()
  youtubeVideoUrl?: string;

  @ApiPropertyOptional({ description: 'GitHub repository URL' })
  @IsUrl()
  @IsOptional()
  githubUrl?: string;

  @ApiPropertyOptional({ description: 'Live website URL' })
  @IsUrl()
  @IsOptional()
  liveUrl?: string;

  @ApiPropertyOptional({ description: 'Project start date' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Project end date' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Project date (alternative)' })
  @IsDateString()
  @IsOptional()
  projectDate?: string;

  @ApiPropertyOptional({ description: 'Completion date' })
  @IsDateString()
  @IsOptional()
  completionDate?: string;

  @ApiPropertyOptional({ description: 'Project duration', example: '6 tuần' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  duration?: string;

  @ApiPropertyOptional({ description: 'Team size', example: 5 })
  @IsInt()
  @Min(1)
  @IsOptional()
  teamSize?: number;

  @ApiPropertyOptional({ description: 'Project budget', example: '100-200 triệu' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  budget?: string;

  @ApiPropertyOptional({ enum: ProjectStatus, default: ProjectStatus.DRAFT })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @ApiPropertyOptional({ description: 'Is project active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Is project featured', default: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Display order for sorting', default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;

  @ApiPropertyOptional({ description: 'Tags (JSON string or array)' })
  @IsOptional()
  tags?: string | string[];

  @ApiPropertyOptional({ description: 'Client testimonial' })
  @IsString()
  @IsOptional()
  testimonial?: string;

  @ApiPropertyOptional({ description: 'Project results/outcomes' })
  @IsString()
  @IsOptional()
  results?: string;

  @ApiPropertyOptional({ description: 'Project challenges' })
  @IsString()
  @IsOptional()
  challenges?: string;

  @ApiPropertyOptional({ description: 'Solutions implemented' })
  @IsString()
  @IsOptional()
  solutions?: string;

  @ApiPropertyOptional({ description: 'Full project content (HTML/Markdown)' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'SEO meta title' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  metaTitle?: string;

  @ApiPropertyOptional({ description: 'SEO meta description' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  metaDescription?: string;

  @ApiPropertyOptional({ description: 'SEO meta keywords' })
  @IsString()
  @IsOptional()
  metaKeywords?: string;

  @ApiPropertyOptional({ description: 'Canonical URL' })
  @IsUrl()
  @IsOptional()
  canonicalUrl?: string;

  @ApiPropertyOptional({ description: 'Open Graph title' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  ogTitle?: string;

  @ApiPropertyOptional({ description: 'Open Graph description' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  ogDescription?: string;

  @ApiPropertyOptional({ description: 'Open Graph image URL' })
  @IsUrl()
  @IsOptional()
  ogImage?: string;

  @ApiPropertyOptional({ description: 'Structured data (JSON-LD)' })
  @IsString()
  @IsOptional()
  structuredData?: string;

  @ApiProperty({ description: 'User ID (creator)' })
  @IsString()
  userId: string;
}
