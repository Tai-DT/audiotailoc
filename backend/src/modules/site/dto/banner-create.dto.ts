import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUrl,
  IsInt,
  IsBoolean,
  IsDateString,
  MinLength,
} from 'class-validator';

export class CreateBannerDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsUrl()
  imageUrl!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  mobileImageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  linkUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buttonLabel?: string;

  @ApiProperty({ default: 'home' })
  @IsString()
  page: string = 'home';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  locale?: string;

  @ApiProperty({ default: 0 })
  @IsInt()
  position: number = 0;

  @ApiProperty({ default: true })
  @IsBoolean()
  isActive: boolean = true;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endAt?: string;
}
