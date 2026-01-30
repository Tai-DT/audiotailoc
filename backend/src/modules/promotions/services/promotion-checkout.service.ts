import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PromotionsService } from '../promotions.service';
import { PromotionAdvancedService } from './promotion-advanced.service';
import { PromotionCustomerService } from './promotion-customer.service';
import { PromotionAnalyticsService } from './promotion-analytics.service';

export interface CheckoutItem {
  productId: string;
  categoryId?: string;
  quantity: number;
  priceCents: number;
  name?: string;
}

export interface CheckoutData {
  userId?: string;
  items: CheckoutItem[];
  subtotalCents: number;
  shippingCents?: number;
}

export interface PromotionApplicationResult {
  applied: boolean;
  promotionId?: string;
  code?: string;
  discountCents: number;
  discountPercentage: number;
  applicableItems: string[];
  message: string;
  finalTotal?: number;
  breakdown?: {
    itemId: string;
    discount: number;
  }[];
}

export interface CheckoutSummary {
  subtotal: number;
  appliedPromotion?: {
    code: string;
    discount: number;
    type: string;
  };
  shipping: number;
  total: number;
  estimatedSavings: number;
}

@Injectable()
export class PromotionCheckoutService {
  constructor(
    private prisma: PrismaService,
    private promotionsService: PromotionsService,
    private advancedService: PromotionAdvancedService,
    private customerService: PromotionCustomerService,
    private analyticsService: PromotionAnalyticsService,
  ) {}

  /**
   * Apply promotion code during checkout
   */
  async applyPromotionToCheckout(
    code: string,
    checkout: CheckoutData,
  ): Promise<PromotionApplicationResult> {
    if (!code || code.trim().length === 0) {
      return {
        applied: false,
        discountCents: 0,
        discountPercentage: 0,
        applicableItems: [],
        message: 'Promotion code is required',
      };
    }

    try {
      // Validate promotion
      const validationResult = await this.promotionsService.validateCode(
        code.toUpperCase(),
        checkout.subtotalCents / 100,
      );

      if (!validationResult.valid) {
        return {
          applied: false,
          discountCents: 0,
          discountPercentage: 0,
          applicableItems: [],
          message: validationResult.error || 'Promotion code is invalid',
        };
      }

      const promotion = validationResult.promotion;

      // Check advanced conditions if customer ID provided
      if (checkout.userId) {
        const conditionCheck = await this.advancedService.checkConditions(
          promotion.id,
          checkout.userId,
          {
            items: checkout.items.map(item => ({
              ...item,
              price: item.priceCents,
            })),
            total: checkout.subtotalCents / 100,
          },
        );

        if (!conditionCheck.valid) {
          return {
            applied: false,
            discountCents: 0,
            discountPercentage: 0,
            applicableItems: [],
            message: conditionCheck.reason || 'Promotion conditions not met',
          };
        }
      }

      // Apply promotion to items
      const applyResult: any = await this.promotionsService.applyToCart(
        code.toUpperCase(),
        checkout.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          priceCents: item.priceCents,
        })),
      );

      if (!applyResult.valid) {
        return {
          applied: false,
          discountCents: 0,
          discountPercentage: 0,
          applicableItems: [],
          message: applyResult.error || 'Failed to apply promotion',
        };
      }

      // Calculate discount details
      const discountCents = applyResult.totalDiscount || 0;
      const discountPercentage =
        checkout.subtotalCents > 0 ? (discountCents / checkout.subtotalCents) * 100 : 0;

      return {
        applied: true,
        promotionId: promotion.id,
        code: promotion.code,
        discountCents,
        discountPercentage,
        applicableItems: applyResult.itemDiscounts?.map((id: any) => id.productId) || [],
        message: `Promotion applied successfully! You saved ${(discountCents / 100).toLocaleString('vi-VN')}đ`,
        breakdown: applyResult.itemDiscounts?.map((item: any) => ({
          itemId: item.productId,
          discount: item.discount,
        })),
      };
    } catch (error: any) {
      return {
        applied: false,
        discountCents: 0,
        discountPercentage: 0,
        applicableItems: [],
        message: error.message || 'An error occurred while applying the promotion',
      };
    }
  }

  /**
   * Get checkout summary with applied promotion
   */
  async getCheckoutSummary(
    checkout: CheckoutData,
    promotionCode?: string,
  ): Promise<CheckoutSummary> {
    let appliedPromotion = null;
    let discountCents = 0;

    if (promotionCode) {
      const applicationResult = await this.applyPromotionToCheckout(promotionCode, checkout);

      if (applicationResult.applied) {
        appliedPromotion = {
          code: applicationResult.code!,
          discount: applicationResult.discountCents,
          type: 'APPLIED',
        };
        discountCents = applicationResult.discountCents;
      }
    }

    const shipping = checkout.shippingCents || 0;
    const total = checkout.subtotalCents - discountCents + shipping;

    return {
      subtotal: checkout.subtotalCents / 100,
      appliedPromotion: appliedPromotion
        ? {
            code: appliedPromotion.code,
            discount: appliedPromotion.discount / 100,
            type: appliedPromotion.type,
          }
        : undefined,
      shipping: shipping / 100,
      total: total / 100,
      estimatedSavings: discountCents / 100,
    };
  }

  /**
   * Get applicable promotions for current checkout
   */
  async getApplicablePromotions(checkout: CheckoutData): Promise<any[]> {
    const promotions = await this.prisma.promotions.findMany({
      where: {
        isActive: true,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        type: true,
        value: true,
        minOrderAmount: true,
        maxDiscount: true,
        expiresAt: true,
      },
    });

    const applicable = [];

    for (const promotion of promotions) {
      // Check minimum order amount
      if (promotion.minOrderAmount && checkout.subtotalCents / 100 < promotion.minOrderAmount) {
        continue;
      }

      // Check expiration
      if (promotion.expiresAt && new Date() > promotion.expiresAt) {
        continue;
      }

      // Calculate potential discount
      let potentialDiscount = 0;
      if (promotion.type === 'PERCENTAGE') {
        potentialDiscount = (checkout.subtotalCents * promotion.value) / 100 / 100;
        if (promotion.maxDiscount) {
          potentialDiscount = Math.min(potentialDiscount, promotion.maxDiscount / 100);
        }
      } else if (promotion.type === 'FIXED_AMOUNT') {
        potentialDiscount = promotion.value / 100;
      }

      applicable.push({
        ...promotion,
        potentialDiscount,
        minOrderAmount: promotion.minOrderAmount ? promotion.minOrderAmount / 100 : null,
        maxDiscount: promotion.maxDiscount ? promotion.maxDiscount / 100 : null,
      });
    }

    // Sort by potential discount (highest first)
    return applicable.sort((a, b) => b.potentialDiscount - a.potentialDiscount);
  }

  /**
   * Get personalized promotion suggestions for checkout
   */
  async getSuggestedPromotions(checkout: CheckoutData, limit: number = 3): Promise<any[]> {
    const applicable = await this.getApplicablePromotions(checkout);

    if (!checkout.userId) {
      // Anonymous user - return top promotions
      return applicable.slice(0, limit);
    }

    const usedPromotions = await this.prisma.customer_promotions.findMany({
      where: { userId: checkout.userId },
      select: { promotionId: true },
      distinct: ['promotionId'],
    });
    const usedPromotionIds = usedPromotions.map(up => up.promotionId);

    // Filter out already used promotions
    const suggestions = applicable.filter(p => !usedPromotionIds.includes(p.id));

    // Get customer insights for ranking
    const customerStats = await this.customerService.getCustomerStats(checkout.userId);

    // Rank based on relevance
    const ranked = suggestions.map(promo => ({
      ...promo,
      relevanceScore: this.calculateCheckoutRelevance(promo, checkout, customerStats),
    }));

    return ranked.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, limit);
  }

  /**
   * Record promotion application in checkout
   */
  async recordCheckoutPromotion(
    promotionId: string,
    userId: string,
    orderId: string,
    discountCents: number,
  ) {
    await this.customerService.recordUsage({
      promotionId,
      userId,
      orderId,
      discountApplied: discountCents,
      status: 'APPLIED',
      metadata: {
        appliedAt: new Date().toISOString(),
        channel: 'CHECKOUT',
      },
    });

    // Update analytics
    await this.analyticsService.recordAnalytics({
      promotionId,
      date: new Date(),
      conversions: 1,
      discountGiven: discountCents / 100,
      usageCount: 1,
    });
  }

  /**
   * Validate promotion availability at checkout
   */
  async validatePromotionAvailability(code: string): Promise<{
    available: boolean;
    reason?: string;
    promotion?: any;
  }> {
    const promotion = await this.prisma.promotions.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promotion) {
      return {
        available: false,
        reason: 'Promotion code not found',
      };
    }

    if (!promotion.isActive) {
      return {
        available: false,
        reason: 'Promotion is currently inactive',
      };
    }

    const now = new Date();

    if (promotion.startsAt && promotion.startsAt > now) {
      return {
        available: false,
        reason: 'Promotion is not yet active',
      };
    }

    if (promotion.expiresAt && promotion.expiresAt < now) {
      return {
        available: false,
        reason: 'Promotion has expired',
      };
    }

    // Check usage limit
    const metadata = (promotion.metadata as any) || {};
    const usageCount = metadata.usageCount || 0;
    const usageLimit = metadata.usageLimit || promotion.usageLimit;

    if (usageLimit && usageCount >= usageLimit) {
      return {
        available: false,
        reason: 'Promotion usage limit reached',
      };
    }

    return {
      available: true,
      promotion: {
        id: promotion.id,
        code: promotion.code,
        name: promotion.name,
        type: promotion.type,
        value: promotion.value,
      },
    };
  }

  /**
   * Calculate checkout relevance score for a promotion
   */
  private calculateCheckoutRelevance(
    promotion: any,
    checkout: CheckoutData,
    customerStats: any,
  ): number {
    let score = 50;

    // Bonus for free shipping
    if (promotion.type === 'FREE_SHIPPING') {
      score += 20;
    }

    // Bonus for percentage discounts
    if (promotion.type === 'PERCENTAGE') {
      score += 10;
    }

    // Bonus if customer meets minimum order
    if (promotion.minOrderAmount && checkout.subtotalCents / 100 >= promotion.minOrderAmount) {
      score += 15;
    }

    // Bonus based on discount amount
    if (promotion.maxDiscount) {
      const savingsPotential = promotion.maxDiscount / 100 / (checkout.subtotalCents / 100);
      if (savingsPotential > 0.1) {
        // More than 10% savings
        score += 15;
      }
    }

    // Bonus if customer has used similar promotions before
    if (customerStats.totalPromotionsUsed > 0) {
      score += 10;
    }

    return Math.min(100, score);
  }

  /**
   * Get shipping discount if applicable
   */
  async getShippingDiscount(
    promotionCode: string,
    shippingCents: number,
  ): Promise<{ discountCents: number; finalShipping: number } | null> {
    const promotion = await this.prisma.promotions.findUnique({
      where: { code: promotionCode.toUpperCase() },
    });

    if (!promotion || promotion.type !== 'FREE_SHIPPING') {
      return null;
    }

    return {
      discountCents: shippingCents,
      finalShipping: 0,
    };
  }
}
