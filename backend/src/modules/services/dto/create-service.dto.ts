import { IsString, IsOptional, IsNumber, Min, Max, IsArray, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateServiceDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  typeId?: string;

  @IsOptional()
  @IsString()
  priceType?: string; // FIXED, RANGE, NEGOTIABLE, CONTACT

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number; // Min price in VND

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number; // Max price in VND

  @IsOptional()
  @IsNumber()
  @Min(0)
  basePriceCents?: number;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  price?: number;

  @IsOptional()
  @IsString()
  priceCurrency?: string;

  @IsNumber()
  @Min(1)
  @Max(1440) // Max 24 hours
  estimatedDuration!: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}