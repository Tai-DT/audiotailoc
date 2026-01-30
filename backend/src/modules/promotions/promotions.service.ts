import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreatePromotionDto {
  code: string;
  name: string;
  description?: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'BUY_X_GET_Y';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  isActive?: boolean;
  startsAt?: Date;
  expiresAt?: Date;
  categories?: string[];
  products?: string[];
  customerSegments?: string[];
}

export interface UpdatePromotionDto {
  code?: string;
  name?: string;
  description?: string;
  type?: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'BUY_X_GET_Y';
  value?: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  isActive?: boolean;
  startsAt?: Date;
  expiresAt?: Date;
  categories?: string[];
  products?: string[];
  customerSegments?: string[];
}

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { isActive?: boolean; type?: string; search?: string }) {
    const where: any = {};
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;
    if (filters?.type) where.type = filters.type;
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { code: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    const promotions = await this.prisma.promotions.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return promotions.map(p => this.mapPromotion(p));
  }

  private mapPromotion(p: any) {
    const metadata = (p.metadata as any) || {};
    return {
      ...p,
      usageCount: metadata.usageCount || 0,
      usageLimit: metadata.usageLimit,
      categories: metadata.categories || [],
      products: metadata.products || [],
      customerSegments: metadata.customerSegments || [],
    };
  }

  async findOne(id: string) {
    const promotion = await this.prisma.promotions.findUnique({ where: { id } });
    if (!promotion) throw new NotFoundException('Promotion not found');
    return this.mapPromotion(promotion);
  }

  async findByCode(code: string, tx?: any) {
    const client = tx || this.prisma;
    const promotion = await client.promotions.findUnique({
      where: { code: code.toUpperCase() },
    });
    if (!promotion) throw new NotFoundException('Promotion not found');
    return this.mapPromotion(promotion);
  }

  async create(dto: CreatePromotionDto, createdBy?: string) {
    const existing = await this.prisma.promotions.findUnique({
      where: { code: dto.code.toUpperCase() },
    });
    if (existing) throw new BadRequestException('Code already exists');

    const promotion = await this.prisma.promotions.create({
      data: {
        id: `promo_${Date.now()}`,
        code: dto.code.toUpperCase(),
        name: dto.name,
        description: dto.description,
        type: dto.type,
        value: dto.value,
        minOrderAmount: dto.minOrderAmount,
        maxDiscount: dto.maxDiscount,
        isActive: dto.isActive ?? true,
        startsAt: dto.startsAt,
        expiresAt: dto.expiresAt,
        metadata: {
          usageCount: 0,
          usageLimit: dto.usageLimit,
          categories: dto.categories || [],
          products: dto.products || [],
          customerSegments: dto.customerSegments || [],
        },
        createdBy,
        updatedAt: new Date(),
      } as any,
    });
    return this.mapPromotion(promotion);
  }

  async update(id: string, dto: UpdatePromotionDto) {
    const existing = await this.prisma.promotions.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Promotion not found');

    const metadata = {
      ...(existing.metadata as any),
      usageLimit: dto.usageLimit ?? (existing.metadata as any).usageLimit,
      categories: dto.categories ?? (existing.metadata as any).categories,
      products: dto.products ?? (existing.metadata as any).products,
    };

    const updated = await this.prisma.promotions.update({
      where: { id },
      data: {
        ...dto,
        code: dto.code?.toUpperCase(),
        metadata,
      } as any,
    });
    return this.mapPromotion(updated);
  }

  async delete(id: string) {
    await this.prisma.promotions.delete({ where: { id } });
    return { success: true };
  }

  async validateCode(
    code: string,
    orderAmount: number | bigint = 0,
    userId?: string,
    items: any[] = [],
    tx?: any,
  ) {
    const client = tx || this.prisma;
    const promotion = await client.promotions.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        promotions_categories: { select: { categoryId: true } },
        promotions_products: { select: { productId: true } },
      },
    });

    if (!promotion || !promotion.isActive) return { valid: false, error: 'Mã không hợp lệ' };

    const now = new Date();
    if (promotion.startsAt && promotion.startsAt > now)
      return { valid: false, error: 'Mã chưa có hiệu lực' };
    if (promotion.expiresAt && promotion.expiresAt < now)
      return { valid: false, error: 'Mã đã hết hạn' };

    const metadata = (promotion.metadata as any) || {};
    const totalUsageLimit = metadata.usageLimit || promotion.usageLimit;
    const usageCount = promotion.usageCount || metadata.usageCount || 0;

    // 1. Total usage limit
    if (totalUsageLimit && usageCount >= totalUsageLimit) {
      return { valid: false, error: 'Mã đã dùng hết lượt' };
    }

    // 2. Per-user usage limit
    if (userId) {
      const userUsageLimit = metadata.userLimit || 1; // Default 1 if not specified but user tracking is active
      const userUsageCount = await client.customer_promotions.count({
        where: { promotionId: promotion.id, userId, status: 'SUCCEEDED' },
      });
      if (userUsageCount >= userUsageLimit) {
        return { valid: false, error: 'Bạn đã dùng mã này quá số lần cho phép' };
      }
    }

    // 3. First Purchase Only Check
    if (promotion.isFirstPurchaseOnly && userId) {
      const orderCount = await client.orders.count({
        where: {
          userId,
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] },
        },
      });
      if (orderCount > 0) {
        return { valid: false, error: 'Mã giảm giá này chỉ dành cho đơn hàng đầu tiên' };
      }
    }

    // 4. Customer Segment Check
    if (promotion.customerSegment && userId) {
      const user = await client.users.findUnique({ where: { id: userId } });
      if (user && user.role !== promotion.customerSegment) {
        // Simple role-based segment for now, can be expanded to active/loyalty segments later
        return { valid: false, error: 'Bạn không thuộc nhóm khách hàng được áp dụng mã này' };
      }
    }

    // 5. Minimum order amount
    if (promotion.minOrderAmount && BigInt(orderAmount) < BigInt(promotion.minOrderAmount)) {
      return {
        valid: false,
        error: `Đơn tối thiểu ${Number(promotion.minOrderAmount).toLocaleString()}đ`,
      };
    }

    // 6. Product/Category Restrictions
    const allowedProducts = promotion.promotions_products.map(p => p.productId);
    const allowedCategories = promotion.promotions_categories.map(c => c.categoryId);

    let applicableAmount = orderAmount;
    if (allowedProducts.length > 0 || allowedCategories.length > 0) {
      const applicableItems = items.filter(item => {
        const isAllowedProduct =
          allowedProducts.length === 0 || allowedProducts.includes(item.productId);
        const isAllowedCategory =
          allowedCategories.length === 0 ||
          (item.categoryId && allowedCategories.includes(item.categoryId));
        return isAllowedProduct && isAllowedCategory;
      });

      if (applicableItems.length === 0) {
        return { valid: false, error: 'Mã giảm giá không áp dụng cho các sản phẩm này' };
      }

      applicableAmount = applicableItems.reduce(
        (sum, item) => sum + BigInt(item.price || item.priceCents) * BigInt(item.quantity),
        BigInt(0),
      );
    }

    let discountBigInt = BigInt(0);
    const isFreeShipping = promotion.type === 'FREE_SHIPPING';

    if (promotion.type === 'PERCENTAGE') {
      discountBigInt =
        (BigInt(applicableAmount) * BigInt(Math.round(promotion.value))) / BigInt(100);
      if (promotion.maxDiscount) {
        const maxDiscount = BigInt(promotion.maxDiscount);
        if (discountBigInt > maxDiscount) discountBigInt = maxDiscount;
      }
    } else if (promotion.type === 'FIXED_AMOUNT') {
      discountBigInt = BigInt(promotion.value);
    }

    const discount = Number(
      discountBigInt > BigInt(orderAmount) ? BigInt(orderAmount) : discountBigInt,
    );

    return {
      valid: true,
      discount,
      isFreeShipping,
      promotion: this.mapPromotion(promotion),
    };
  }

  async incrementUsage(
    code: string,
    userId?: string,
    orderId?: string,
    discountApplied?: number | bigint,
    tx?: any,
  ) {
    const client = tx || this.prisma;
    const promo = await this.findByCode(code, client);
    const metadata = (promo.metadata as any) || {};

    // 1. Update total usage count
    await client.promotions.update({
      where: { id: promo.id },
      data: {
        usageCount: { increment: 1 },
        metadata: {
          ...metadata,
          usageCount: (metadata.usageCount || 0) + 1,
        },
      },
    });

    // 2. Record customer usage
    if (userId) {
      await client.customer_promotions.create({
        data: {
          id: randomUUID(),
          promotionId: promo.id,
          userId,
          orderId,
          discountApplied: BigInt(discountApplied || 0) as any,
          status: 'SUCCEEDED',
        },
      });
    }
  }

  async applyToCart(code: string, items: any[]) {
    const validation = await this.validateCode(
      code,
      items.reduce((s, i) => s + BigInt(i.priceCents || 0) * BigInt(i.quantity || 1), BigInt(0)),
    );
    if (!validation.valid) return validation;

    const promotion = validation.promotion as any;
    const totalDiscount = validation.discount;
    // 6. Redistribute discount only to applicable items
    const allowedProducts = promotion.promotions_products?.map((p: any) => p.productId) || [];
    const allowedCategories = promotion.promotions_categories?.map((c: any) => c.categoryId) || [];

    const applicableItems = items.filter(item => {
      const isAllowedProduct =
        allowedProducts.length === 0 || allowedProducts.includes(item.productId);
      const isAllowedCategory =
        allowedCategories.length === 0 ||
        (item.categoryId && allowedCategories.includes(item.categoryId));
      return isAllowedProduct && isAllowedCategory;
    });

    const applicableSubtotal = applicableItems.reduce(
      (s, i) => s + Number(i.price || i.priceCents) * i.quantity,
      0,
    );
    const itemDiscounts = [];
    let remaining = validation.discount;

    items.forEach(item => {
      let itemDiscount = 0;
      const isApplicable = applicableItems.some(ai => ai.productId === item.productId);

      if (isApplicable && applicableSubtotal > 0) {
        // Simple proportional distribution
        itemDiscount = Math.round(
          ((Number(item.price || item.priceCents) * item.quantity) / applicableSubtotal) *
            validation.discount,
        );
        // Ensure we don't exceed remaining
        itemDiscount = Math.min(itemDiscount, remaining);
        remaining -= itemDiscount;
      }

      itemDiscounts.push({
        productId: item.productId,
        discount: itemDiscount,
        finalPrice:
          Number(item.price || item.priceCents) - Math.round(itemDiscount / item.quantity),
      });
    });

    // Cleanup: if there's a tiny rounding error (remaining != 0), add it to the first applicable item
    if (remaining !== 0 && itemDiscounts.length > 0) {
      const firstApplicable = itemDiscounts.find(id =>
        applicableItems.some(ai => ai.productId === id.productId),
      );
      if (firstApplicable) firstApplicable.discount += remaining;
    }

    return {
      valid: true,
      totalDiscount,
      itemDiscounts,
      isFreeShipping: promotion.type === 'FREE_SHIPPING',
    };
  }

  async getStats() {
    const all = await this.prisma.promotions.findMany();
    return {
      total: all.length,
      active: all.filter(p => p.isActive).length,
    };
  }

  /**
   * Get promotions applicable for a specific product
   */
  async getPromotionsForProduct(productId: string, categoryId?: string) {
    const now = new Date();

    // Get all active promotions
    const promotions = await this.prisma.promotions.findMany({
      where: {
        isActive: true,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [
          {
            OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
          },
        ],
      },
      include: {
        promotions_products: { select: { productId: true } },
        promotions_categories: { select: { categoryId: true } },
      },
    });

    // Filter promotions that apply to this product
    const applicable = promotions.filter(promo => {
      const allowedProducts = promo.promotions_products.map(p => p.productId);
      const allowedCategories = promo.promotions_categories.map(c => c.categoryId);

      // If no product/category restrictions, it applies to all
      if (allowedProducts.length === 0 && allowedCategories.length === 0) {
        return true;
      }

      // Check if product is in allowed list
      if (allowedProducts.length > 0 && allowedProducts.includes(productId)) {
        return true;
      }

      // Check if category is in allowed list
      if (categoryId && allowedCategories.length > 0 && allowedCategories.includes(categoryId)) {
        return true;
      }

      return false;
    });

    return applicable.map(p => this.mapPromotion(p));
  }

  /**
   * Check if a product is eligible for a specific promotion
   */
  async isProductEligible(
    promotionId: string,
    productId: string,
    categoryId?: string,
  ): Promise<boolean> {
    const promotion = await this.prisma.promotions.findUnique({
      where: { id: promotionId },
      include: {
        promotions_products: { select: { productId: true } },
        promotions_categories: { select: { categoryId: true } },
      },
    });

    if (!promotion || !promotion.isActive) {
      return false;
    }

    const now = new Date();
    if (promotion.startsAt && promotion.startsAt > now) return false;
    if (promotion.expiresAt && promotion.expiresAt < now) return false;

    const allowedProducts = promotion.promotions_products.map(p => p.productId);
    const allowedCategories = promotion.promotions_categories.map(c => c.categoryId);

    // If no restrictions, all products are eligible
    if (allowedProducts.length === 0 && allowedCategories.length === 0) {
      return true;
    }

    // Check product restriction
    if (allowedProducts.length > 0 && allowedProducts.includes(productId)) {
      return true;
    }

    // Check category restriction
    if (categoryId && allowedCategories.length > 0 && allowedCategories.includes(categoryId)) {
      return true;
    }

    return false;
  }

  /**
   * Duplicate an existing promotion with a new code
   */
  async duplicate(id: string) {
    const original = await this.prisma.promotions.findUnique({
      where: { id },
      include: {
        promotions_products: true,
        promotions_categories: true,
      },
    });

    if (!original) {
      throw new NotFoundException('Promotion not found');
    }

    const newCode = `${original.code}_COPY_${Date.now().toString(36).toUpperCase()}`;

    const duplicated = await this.prisma.promotions.create({
      data: {
        id: `promo_${Date.now()}`,
        code: newCode,
        name: `${original.name} (Copy)`,
        description: original.description,
        type: original.type,
        value: original.value,
        minOrderAmount: original.minOrderAmount,
        maxDiscount: original.maxDiscount,
        isActive: false, // Start as inactive
        startsAt: null,
        expiresAt: null,
        usageCount: 0,
        metadata: original.metadata,
        updatedAt: new Date(),
      } as any,
    });

    // Copy product associations
    if (original.promotions_products.length > 0) {
      await this.prisma.promotions_products.createMany({
        data: original.promotions_products.map(pp => ({
          id: `pp_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          promotionId: duplicated.id,
          productId: pp.productId,
        })),
      });
    }

    // Copy category associations
    if (original.promotions_categories.length > 0) {
      await this.prisma.promotions_categories.createMany({
        data: original.promotions_categories.map(pc => ({
          id: `pc_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          promotionId: duplicated.id,
          categoryId: pc.categoryId,
        })),
      });
    }

    return { success: true, data: this.mapPromotion(duplicated) };
  }

  /**
   * Toggle promotion active status
   */
  async toggleActive(id: string) {
    const promotion = await this.prisma.promotions.findUnique({ where: { id } });
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    const updated = await this.prisma.promotions.update({
      where: { id },
      data: { isActive: !promotion.isActive },
    });

    return { success: true, data: this.mapPromotion(updated) };
  }
}
