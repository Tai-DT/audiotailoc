import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsDate,
  IsJSON,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePromotionDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'BUY_X_GET_Y';

  @IsNumber()
  @Min(0)
  value: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  usageLimit?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startsAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiresAt?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  products?: string[];

  @IsOptional()
  @IsString()
  customerSegment?: string;

  @IsOptional()
  @IsBoolean()
  isFirstPurchaseOnly?: boolean;

  @IsOptional()
  @IsBoolean()
  tierBased?: boolean;

  @IsOptional()
  @IsJSON()
  conditions?: Record<string, any>;

  @IsOptional()
  @IsJSON()
  metadata?: Record<string, any>;
}

export class UpdatePromotionDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  type?: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'BUY_X_GET_Y';

  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  usageLimit?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startsAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiresAt?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  products?: string[];

  @IsOptional()
  @IsString()
  customerSegment?: string;

  @IsOptional()
  @IsBoolean()
  isFirstPurchaseOnly?: boolean;

  @IsOptional()
  @IsBoolean()
  tierBased?: boolean;

  @IsOptional()
  @IsJSON()
  conditions?: Record<string, any>;

  @IsOptional()
  @IsJSON()
  metadata?: Record<string, any>;
}

export class ValidatePromotionDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsNumber()
  cartTotal?: number;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];
}

export class PromotionResponseDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: string;
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageCount: number;
  usageLimit?: number;
  isActive: boolean;
  isFirstPurchaseOnly: boolean;
  tierBased: boolean;
  customerSegment?: string;
  startsAt?: Date;
  expiresAt?: Date;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  categories?: string[];
  products?: string[];
  conditions?: Record<string, any>;
  metadata?: Record<string, any>;
}

export class PromotionStatsDto {
  total: number;
  active: number;
  expired: number;
  totalUsage: number;
  totalRevenue: number;
  conversionRate: number;
  averageDiscount: number;
}

export class CustomerPromotionDto {
  id: string;
  promotionId: string;
  userId: string;
  orderId?: string;
  discountApplied?: number;
  usedAt: Date;
  status: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export class PromotionAuditLogDto {
  id: string;
  promotionId: string;
  userId?: string;
  action: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export class PromotionAnalyticsDto {
  id: string;
  promotionId: string;
  date: Date;
  impressions: number;
  clicks: number;
  conversions: number;
  revenueImpact: number;
  discountGiven: number;
  usageCount: number;
  avgOrderValue?: number;
  conversionRate?: number;
  roi?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class ApplyPromotionToCartDto {
  code: string;
  cartItems: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  userId?: string;
  subtotal: number;
}

export class PromotionApplicationResultDto {
  promotionId: string;
  code: string;
  discountAmount: number;
  discountPercentage: number;
  applicableItems: string[];
  message: string;
  valid: boolean;
}
