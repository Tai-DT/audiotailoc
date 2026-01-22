import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PromotionService {
  constructor(private readonly prisma: PrismaService) {}

  async validate(
    code?: string,
    orderAmount?: number,
  ): Promise<{
    code: string;
    type: 'PERCENT' | 'FIXED' | 'PERCENTAGE';
    value: number;
    maxDiscount?: number;
  } | null> {
    if (!code) return null;
    const now = new Date();
    const promo = await this.prisma.promotions.findUnique({ where: { code } });
    if (!promo) return null;

    // Check if promotion is active
    if (promo.isActive === false) return null;

    // Check expiration date
    if (promo.expiresAt && promo.expiresAt < now) return null;

    // Check start date
    if (promo.startsAt && promo.startsAt > now) return null;

    // Check minimum order amount if provided
    if (orderAmount !== undefined && promo.minOrderAmount) {
      if (orderAmount < promo.minOrderAmount) return null;
    }

    return {
      code: promo.code,
      type: promo.type as any,
      value: promo.value,
      maxDiscount: promo.maxDiscount || undefined,
    };
  }

  computeDiscount(
    promo: { type: 'PERCENT' | 'FIXED' | 'PERCENTAGE'; value: number; maxDiscount?: number } | null,
    subtotal: number,
  ): number {
    if (!promo) return 0;

    if (promo.type === 'FIXED') {
      return Math.min(subtotal, promo.value);
    }

    // PERCENT or PERCENTAGE type
    const pct = Math.max(0, Math.min(100, promo.value));
    let discount = Math.floor((subtotal * pct) / 100);

    // Apply max discount cap if set
    if (promo.maxDiscount && promo.maxDiscount > 0) {
      discount = Math.min(discount, promo.maxDiscount);
    }

    return discount;
  }
}
