import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export interface TierDiscount {
  minQuantity: number;
  maxQuantity?: number;
  discountValue: number;
  discountType: 'PERCENTAGE' | 'FIXED';
}

export interface ConditionalPromotion {
  type: 'FIRST_PURCHASE' | 'CUSTOMER_SEGMENT' | 'TIME_BASED' | 'PRODUCT_CATEGORY' | 'ORDER_AMOUNT';
  value: string | number;
  operator?: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'BETWEEN' | 'IN';
}

export interface PromotionConditions {
  firstPurchaseOnly?: boolean;
  customerSegments?: string[];
  minOrderValue?: number;
  maxOrderValue?: number;
  specificProducts?: string[];
  specificCategories?: string[];
  excludedProducts?: string[];
  excludedCategories?: string[];
  validDays?: number[]; // 0-6 for Sunday-Saturday
  validHours?: { start: number; end: number };
  maxUsagePerCustomer?: number;
  requiresVIP?: boolean;
  newCustomersOnly?: boolean;
  tierDiscounts?: TierDiscount[];
}

@Injectable()
export class PromotionAdvancedService {
  constructor(private prisma: PrismaService) {}

  /**
   * Parse and validate promotion conditions
   */
  parseConditions(conditionsJson: any): PromotionConditions | null {
    if (!conditionsJson) return null;

    try {
      const conditions: PromotionConditions = {};

      if (conditionsJson.firstPurchaseOnly !== undefined) {
        conditions.firstPurchaseOnly = conditionsJson.firstPurchaseOnly;
      }

      if (conditionsJson.customerSegments) {
        conditions.customerSegments = Array.isArray(conditionsJson.customerSegments)
          ? conditionsJson.customerSegments
          : [conditionsJson.customerSegments];
      }

      if (conditionsJson.minOrderValue) {
        conditions.minOrderValue = Number(conditionsJson.minOrderValue);
      }

      if (conditionsJson.maxOrderValue) {
        conditions.maxOrderValue = Number(conditionsJson.maxOrderValue);
      }

      if (conditionsJson.specificProducts) {
        conditions.specificProducts = Array.isArray(conditionsJson.specificProducts)
          ? conditionsJson.specificProducts
          : [conditionsJson.specificProducts];
      }

      if (conditionsJson.specificCategories) {
        conditions.specificCategories = Array.isArray(conditionsJson.specificCategories)
          ? conditionsJson.specificCategories
          : [conditionsJson.specificCategories];
      }

      if (conditionsJson.excludedProducts) {
        conditions.excludedProducts = Array.isArray(conditionsJson.excludedProducts)
          ? conditionsJson.excludedProducts
          : [conditionsJson.excludedProducts];
      }

      if (conditionsJson.excludedCategories) {
        conditions.excludedCategories = Array.isArray(conditionsJson.excludedCategories)
          ? conditionsJson.excludedCategories
          : [conditionsJson.excludedCategories];
      }

      if (conditionsJson.validDays) {
        conditions.validDays = conditionsJson.validDays;
      }

      if (conditionsJson.validHours) {
        conditions.validHours = conditionsJson.validHours;
      }

      if (conditionsJson.maxUsagePerCustomer) {
        conditions.maxUsagePerCustomer = Number(conditionsJson.maxUsagePerCustomer);
      }

      if (conditionsJson.requiresVIP !== undefined) {
        conditions.requiresVIP = conditionsJson.requiresVIP;
      }

      if (conditionsJson.newCustomersOnly !== undefined) {
        conditions.newCustomersOnly = conditionsJson.newCustomersOnly;
      }

      if (conditionsJson.tierDiscounts) {
        conditions.tierDiscounts = conditionsJson.tierDiscounts.map((tier: any) => ({
          minQuantity: Number(tier.minQuantity),
          maxQuantity: tier.maxQuantity ? Number(tier.maxQuantity) : undefined,
          discountValue: Number(tier.discountValue),
          discountType: tier.discountType || 'PERCENTAGE',
        }));
      }

      return conditions;
    } catch (error) {
      throw new BadRequestException('Invalid promotion conditions format');
    }
  }

  /**
   * Check if customer meets all conditions for a promotion
   */
  async checkConditions(
    promotionId: string,
    userId: string,
    cartData: {
      items: Array<{ productId: string; categoryId?: string; quantity: number; price: number }>;
      total: number;
    },
  ): Promise<{ valid: boolean; reason?: string }> {
    const promotion = await this.prisma.promotions.findUnique({
      where: { id: promotionId },
    });

    if (!promotion) {
      return { valid: false, reason: 'Promotion not found' };
    }

    // conditions field does not exist, use metadata instead
    const conditions = this.parseConditions((promotion.metadata as any)?.conditions);
    if (!conditions) {
      return { valid: true }; // No conditions = always valid
    }

    // Check time-based conditions
    const now = new Date();

    if (conditions.validDays) {
      const currentDay = now.getDay();
      if (!conditions.validDays.includes(currentDay)) {
        return { valid: false, reason: 'Promotion not valid on this day' };
      }
    }

    if (conditions.validHours) {
      const currentHour = now.getHours();
      if (currentHour < conditions.validHours.start || currentHour >= conditions.validHours.end) {
        return {
          valid: false,
          reason: `Promotion only valid between ${conditions.validHours.start}:00 and ${conditions.validHours.end}:00`,
        };
      }
    }

    // Check order value conditions
    if (conditions.minOrderValue && cartData.total < conditions.minOrderValue) {
      return {
        valid: false,
        reason: `Minimum order value is ${conditions.minOrderValue.toLocaleString('vi-VN')}đ`,
      };
    }

    if (conditions.maxOrderValue && cartData.total > conditions.maxOrderValue) {
      return {
        valid: false,
        reason: `Maximum order value is ${conditions.maxOrderValue.toLocaleString('vi-VN')}đ`,
      };
    }

    // Check product/category restrictions
    if (conditions.specificProducts && conditions.specificProducts.length > 0) {
      const hasApplicableProduct = cartData.items.some(item =>
        conditions.specificProducts!.includes(item.productId),
      );

      if (!hasApplicableProduct) {
        return { valid: false, reason: 'Promotion not applicable to items in cart' };
      }
    }

    if (conditions.specificCategories && conditions.specificCategories.length > 0) {
      const hasApplicableCategory = cartData.items.some(item =>
        conditions.specificCategories!.includes(item.categoryId || ''),
      );

      if (!hasApplicableCategory) {
        return {
          valid: false,
          reason: 'Promotion not applicable to product categories in cart',
        };
      }
    }

    if (conditions.excludedProducts && conditions.excludedProducts.length > 0) {
      const hasExcludedProduct = cartData.items.some(item =>
        conditions.excludedProducts!.includes(item.productId),
      );

      if (hasExcludedProduct) {
        return {
          valid: false,
          reason: 'Promotion cannot be applied with items in excluded list',
        };
      }
    }

    if (conditions.excludedCategories && conditions.excludedCategories.length > 0) {
      const hasExcludedCategory = cartData.items.some(item =>
        conditions.excludedCategories!.includes(item.categoryId || ''),
      );

      if (hasExcludedCategory) {
        return {
          valid: false,
          reason: 'Promotion cannot be applied with excluded categories',
        };
      }
    }

    // Check customer conditions
    if (conditions.firstPurchaseOnly || conditions.newCustomersOnly) {
      const customerOrderCount = await this.prisma.orders.count({
        where: { userId },
      });

      if (customerOrderCount > 0) {
        return {
          valid: false,
          reason: 'Promotion is only for new customers',
        };
      }
    }

    if (conditions.maxUsagePerCustomer) {
      // TODO: customer_promotions table does not exist
      const customerUsageCount = 0; // await this.prisma.customer_promotions.count({
      //   where: {
      //     promotionId,
      //     userId,
      //     status: 'APPLIED',
      //   },
      // });

      if (customerUsageCount >= conditions.maxUsagePerCustomer) {
        return {
          valid: false,
          reason: `You have already used this promotion ${conditions.maxUsagePerCustomer} time(s)`,
        };
      }
    }

    return { valid: true };
  }

  /**
   * Calculate tiered discount based on quantity
   */
  calculateTieredDiscount(
    conditions: PromotionConditions,
    quantity: number,
    basePrice: number,
  ): { discount: number; tier: TierDiscount | null } {
    if (!conditions.tierDiscounts || conditions.tierDiscounts.length === 0) {
      return { discount: 0, tier: null };
    }

    const applicableTier = conditions.tierDiscounts.find(tier => {
      const meetsMinimum = quantity >= tier.minQuantity;
      const meetsMaximum = tier.maxQuantity === undefined || quantity <= tier.maxQuantity;
      return meetsMinimum && meetsMaximum;
    });

    if (!applicableTier) {
      return { discount: 0, tier: null };
    }

    let discount = 0;
    if (applicableTier.discountType === 'PERCENTAGE') {
      discount = (basePrice * applicableTier.discountValue) / 100;
    } else {
      discount = applicableTier.discountValue;
    }

    return { discount, tier: applicableTier };
  }

  /**
   * Get applicable tiered discount tier
   */
  getTierForQuantity(conditions: PromotionConditions, quantity: number): TierDiscount | null {
    if (!conditions.tierDiscounts || conditions.tierDiscounts.length === 0) {
      return null;
    }

    return (
      conditions.tierDiscounts.find(tier => {
        const meetsMinimum = quantity >= tier.minQuantity;
        const meetsMaximum = tier.maxQuantity === undefined || quantity <= tier.maxQuantity;
        return meetsMinimum && meetsMaximum;
      }) || null
    );
  }

  /**
   * Get all available tiers for a promotion
   */
  getAvailableTiers(conditions: PromotionConditions): TierDiscount[] {
    return conditions.tierDiscounts || [];
  }

  /**
   * Get next tier discount recommendation
   */
  getNextTierRecommendation(
    conditions: PromotionConditions,
    currentQuantity: number,
  ): { nextTier: TierDiscount; quantityNeeded: number } | null {
    if (!conditions.tierDiscounts || conditions.tierDiscounts.length === 0) {
      return null;
    }

    const nextTier = conditions.tierDiscounts.find(tier => tier.minQuantity > currentQuantity);

    if (!nextTier) {
      return null;
    }

    return {
      nextTier,
      quantityNeeded: nextTier.minQuantity - currentQuantity,
    };
  }

  /**
   * Check if promotion is segment-based
   */
  isSegmentBased(promotion: any): boolean {
    // conditions field does not exist, use metadata instead
    const conditions = this.parseConditions((promotion.metadata as any)?.conditions);
    if (!conditions) return false;

    return !!(
      conditions.customerSegments?.length ||
      conditions.newCustomersOnly ||
      conditions.requiresVIP ||
      conditions.maxUsagePerCustomer
    );
  }

  /**
   * Check if promotion is time-restricted
   */
  isTimeRestricted(promotion: any): boolean {
    // conditions field does not exist, use metadata instead
    const conditions = this.parseConditions((promotion.metadata as any)?.conditions);
    if (!conditions) return false;

    return !!(conditions.validDays?.length || conditions.validHours);
  }

  /**
   * Check if promotion has product restrictions
   */
  hasProductRestrictions(promotion: any): boolean {
    // conditions field does not exist, use metadata instead
    const conditions = this.parseConditions((promotion.metadata as any)?.conditions);
    if (!conditions) return false;

    return !!(
      conditions.specificProducts?.length ||
      conditions.specificCategories?.length ||
      conditions.excludedProducts?.length ||
      conditions.excludedCategories?.length
    );
  }

  /**
   * Get promotion summary with complexity level
   */
  getPromotionComplexity(promotion: any): {
    level: 'SIMPLE' | 'MODERATE' | 'ADVANCED';
    features: string[];
  } {
    const features: string[] = [];

    // tierBased field does not exist in schema
    // if (promotion.tierBased) {
    if (false) {
      // promotion.tierBased
      features.push('Tiered Discounts');
    }

    if (this.isTimeRestricted(promotion)) {
      features.push('Time Restrictions');
    }

    if (this.isSegmentBased(promotion)) {
      features.push('Customer Segmentation');
    }

    if (this.hasProductRestrictions(promotion)) {
      features.push('Product Restrictions');
    }

    // conditions field does not exist, use metadata instead
    const conditions = this.parseConditions((promotion.metadata as any)?.conditions);
    if (conditions?.tierDiscounts?.length) {
      features.push(`${conditions.tierDiscounts.length} Tier Levels`);
    }

    let level: 'SIMPLE' | 'MODERATE' | 'ADVANCED' = 'SIMPLE';
    if (features.length >= 3) {
      level = 'ADVANCED';
    } else if (features.length >= 2) {
      level = 'MODERATE';
    }

    return { level, features };
  }

  /**
   * Recommend promotions for a customer segment
   */
  async recommendPromotionsForSegment(segment: string, limit: number = 10) {
    const promotions = await this.prisma.promotions.findMany({
      where: {
        isActive: true,
        // customerSegment field does not exist in schema
        // customerSegment: segment,
        id: { not: '' }, // Temporary filter
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return promotions.map(promo => ({
      ...promo,
      complexity: this.getPromotionComplexity(promo),
    }));
  }

  /**
   * Get smart promotion recommendations based on customer behavior
   */
  async getSmartRecommendations(userId: string, limit: number = 5) {
    // Get user's order history
    const userOrders = await this.prisma.orders.findMany({
      where: { userId },
      select: { totalCents: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    // TODO: customer_promotions table does not exist
    const usedPromotions: any[] = []; // await this.prisma.customer_promotions.findMany({
    //   where: { userId },
    //   select: { promotionId: true },
    //   distinct: ['promotionId'],
    // });

    const usedPromotionIds = usedPromotions.map(up => up.promotionId);

    // Find promotions not yet used
    const recommendations = await this.prisma.promotions.findMany({
      where: {
        isActive: true,
        NOT: {
          id: {
            in: usedPromotionIds,
          },
        },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      totalOrders: userOrders.length,
      averageOrderValue:
        userOrders.length > 0
          ? userOrders.reduce((sum, o) => sum + o.totalCents, 0) / userOrders.length / 100
          : 0,
      recommendations: recommendations.map(promo => ({
        ...promo,
        complexity: this.getPromotionComplexity(promo),
        relevance: this.calculateRelevance(promo, userOrders),
      })),
    };
  }

  /**
   * Calculate relevance score for a promotion to a customer
   */
  private calculateRelevance(
    promotion: any,
    userOrders: Array<{ totalCents: number; createdAt: Date }>,
  ): number {
    let score = 50; // Base score

    // Adjust based on user's average order value
    if (userOrders.length > 0) {
      const avgOrderValue =
        userOrders.reduce((sum, o) => sum + o.totalCents, 0) / userOrders.length;

      if (promotion.min_order_amount && avgOrderValue >= promotion.min_order_amount) {
        score += 20;
      } else if (!promotion.min_order_amount) {
        score += 10;
      }
    }

    // Adjust based on promotion type
    if (promotion.type === 'PERCENTAGE') {
      score += 10; // Customers prefer percentage discounts
    }

    // Adjust based on promotion recency
    const daysSinceCreated = Math.floor(
      (Date.now() - new Date(promotion.createdAt).getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysSinceCreated < 7) {
      score += 15; // Recent promotions are more relevant
    }

    return Math.min(100, score);
  }
}
