import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsEmail, IsUrl, ValidateNested } from 'class-validator';

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

export class SiteBusinessDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  taxCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  businessLicense?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timezone?: string;
}

export class SiteEmailDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emailHost?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emailPort?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emailUsername?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emailPassword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emailFrom?: string;
}

export class SiteNotificationsDto {
  @ApiPropertyOptional()
  @IsOptional()
  orderNotification?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  paymentNotification?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  reviewNotification?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  lowStockNotification?: boolean;
}

export class SiteSecurityDto {
  @ApiPropertyOptional()
  @IsOptional()
  twoFactorAuth?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  sessionTimeout?: number;

  @ApiPropertyOptional()
  @IsOptional()
  passwordExpiry?: number;

  @ApiPropertyOptional()
  @IsOptional()
  maxLoginAttempts?: number;
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

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => SiteBusinessDto)
  business?: SiteBusinessDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => SiteEmailDto)
  email?: SiteEmailDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => SiteNotificationsDto)
  notifications?: SiteNotificationsDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => SiteSecurityDto)
  security?: SiteSecurityDto;
}
