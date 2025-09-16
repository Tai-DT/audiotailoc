import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PromotionService {
  constructor(private readonly prisma: PrismaService) {}

  async validate(code?: string): Promise<{ code: string; type: 'PERCENT' | 'FIXED'; value: number } | null> {
    if (!code) return null;
    const now = new Date();
    const promo = await this.prisma.promotion.findUnique({ where: { code } });
    if (!promo) return null;
    // Align with schema fields
    if (promo.expiresAt && promo.expiresAt < now) return null;
    if (promo.isActive === false) return null;
    return { code: promo.code, type: promo.type as any, value: promo.value };
  }

  computeDiscount(promo: { type: 'PERCENT' | 'FIXED'; value: number } | null, subtotal: number): number {
    if (!promo) return 0;
    if (promo.type === 'FIXED') return Math.min(subtotal, promo.value);
    const pct = Math.max(0, Math.min(100, promo.value));
    return Math.floor((subtotal * pct) / 100);
  }
}
