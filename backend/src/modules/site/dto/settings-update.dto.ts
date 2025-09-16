import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class SiteGeneralDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  siteName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tagline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  primaryEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  primaryPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  workingHours?: string;
}

export class SiteAboutDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contentHtml?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  heroImageUrl?: string;
}

export class SiteSocialsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  youtube?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  tiktok?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  instagram?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  zalo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  github?: string;
}

export class UpdateSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => SiteGeneralDto)
  general?: SiteGeneralDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => SiteAboutDto)
  about?: SiteAboutDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => SiteSocialsDto)
  socials?: SiteSocialsDto;
}
