import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  /**
   * Get all promotions with optional filters
   */
  async findAll(filters?: { isActive?: boolean; type?: string; search?: string }) {
    const where: any = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

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

    // Calculate usage count from metadata if available
    const promotionsWithUsage = promotions.map(promo => {
      const metadata = (promo.metadata as any) || {};
      return {
        ...promo,
        usageCount: metadata.usageCount || 0,
        usageLimit: metadata.usageLimit,
        categories: metadata.categories || [],
        products: metadata.products || [],
        customerSegments: metadata.customerSegments || [],
        startDate: promo.starts_at || promo.createdAt,
        endDate: promo.expiresAt,
        minOrderAmount: promo.min_order_amount,
        maxDiscount: promo.max_discount,
      };
    });

    return {
      success: true,
      data: {
        promotions: promotionsWithUsage,
        total: promotionsWithUsage.length,
      },
    };
  }

  /**
   * Get promotion by ID
   */
  async findOne(id: string) {
    const promotion = await this.prisma.promotions.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    const metadata = (promotion.metadata as any) || {};
    return {
      success: true,
      data: {
        ...promotion,
        usageCount: metadata.usageCount || 0,
        usageLimit: metadata.usageLimit,
        categories: metadata.categories || [],
        products: metadata.products || [],
        customerSegments: metadata.customerSegments || [],
        startDate: promotion.starts_at || promotion.createdAt,
        endDate: promotion.expiresAt,
        minOrderAmount: promotion.min_order_amount,
        maxDiscount: promotion.max_discount,
      },
    };
  }

  /**
   * Get promotion by code
   */
  async findByCode(code: string) {
    const promotion = await this.prisma.promotions.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with code ${code} not found`);
    }

    const metadata = (promotion.metadata as any) || {};
    return {
      success: true,
      data: {
        ...promotion,
        usageCount: metadata.usageCount || 0,
        usageLimit: metadata.usageLimit,
        categories: metadata.categories || [],
        products: metadata.products || [],
        customerSegments: metadata.customerSegments || [],
        startDate: promotion.starts_at || promotion.createdAt,
        endDate: promotion.expiresAt,
        minOrderAmount: promotion.min_order_amount,
        maxDiscount: promotion.max_discount,
      },
    };
  }

  /**
   * Create new promotion
   */
  async create(createDto: CreatePromotionDto, createdBy?: string) {
    // Check if code already exists
    const existingPromotion = await this.prisma.promotions.findUnique({
      where: { code: createDto.code.toUpperCase() },
    });

    if (existingPromotion) {
      throw new BadRequestException(`Promotion with code ${createDto.code} already exists`);
    }

    // Validate dates
    if (createDto.startsAt && createDto.expiresAt && createDto.startsAt >= createDto.expiresAt) {
      throw new BadRequestException('Start date must be before expiration date');
    }

    const metadata = {
      usageCount: 0,
      usageLimit: createDto.usageLimit,
      categories: createDto.categories || [],
      products: createDto.products || [],
      customerSegments: createDto.customerSegments || [],
    };

    const promotion = await this.prisma.promotions.create({
      data: {
        id: `promo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        code: createDto.code.toUpperCase(),
        name: createDto.name,
        description: createDto.description,
        type: createDto.type || 'PERCENTAGE',
        value: createDto.value,
        min_order_amount: createDto.minOrderAmount,
        max_discount: createDto.maxDiscount,
        isActive: createDto.isActive ?? true,
        starts_at: createDto.startsAt,
        expiresAt: createDto.expiresAt,
        metadata,
        created_by: createdBy,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      data: {
        ...promotion,
        usageCount: 0,
        usageLimit: createDto.usageLimit,
        categories: createDto.categories || [],
        products: createDto.products || [],
        customerSegments: createDto.customerSegments || [],
        startDate: promotion.starts_at || promotion.createdAt,
        endDate: promotion.expiresAt,
        minOrderAmount: promotion.min_order_amount,
        maxDiscount: promotion.max_discount,
      },
      message: 'Promotion created successfully',
    };
  }

  /**
   * Update promotion
   */
  async update(id: string, updateDto: UpdatePromotionDto) {
    const existing = await this.prisma.promotions.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    // Check code uniqueness if code is being updated
    if (updateDto.code && updateDto.code !== existing.code) {
      const existingCode = await this.prisma.promotions.findUnique({
        where: { code: updateDto.code.toUpperCase() },
      });

      if (existingCode) {
        throw new BadRequestException(`Promotion with code ${updateDto.code} already exists`);
      }
    }

    // Validate dates
    const startsAt = updateDto.startsAt || existing.starts_at;
    const expiresAt = updateDto.expiresAt || existing.expiresAt;
    if (startsAt && expiresAt && startsAt >= expiresAt) {
      throw new BadRequestException('Start date must be before expiration date');
    }

    const existingMetadata = (existing.metadata as any) || {};
    const metadata = {
      ...existingMetadata,
      usageLimit: updateDto.usageLimit ?? existingMetadata.usageLimit,
      categories: updateDto.categories ?? existingMetadata.categories,
      products: updateDto.products ?? existingMetadata.products,
      customerSegments: updateDto.customerSegments ?? existingMetadata.customerSegments,
    };

    const promotion = await this.prisma.promotions.update({
      where: { id },
      data: {
        code: updateDto.code?.toUpperCase(),
        name: updateDto.name,
        description: updateDto.description,
        type: updateDto.type,
        value: updateDto.value,
        min_order_amount: updateDto.minOrderAmount,
        max_discount: updateDto.maxDiscount,
        isActive: updateDto.isActive,
        starts_at: updateDto.startsAt,
        expiresAt: updateDto.expiresAt,
        metadata,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      data: {
        ...promotion,
        usageCount: metadata.usageCount || 0,
        usageLimit: metadata.usageLimit,
        categories: metadata.categories || [],
        products: metadata.products || [],
        customerSegments: metadata.customerSegments || [],
        startDate: promotion.starts_at || promotion.createdAt,
        endDate: promotion.expiresAt,
        minOrderAmount: promotion.min_order_amount,
        maxDiscount: promotion.max_discount,
      },
      message: 'Promotion updated successfully',
    };
  }

  /**
   * Delete promotion
   */
  async delete(id: string) {
    const existing = await this.prisma.promotions.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    await this.prisma.promotions.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Promotion deleted successfully',
    };
  }

  /**
   * Duplicate promotion
   */
  async duplicate(id: string) {
    const existing = await this.prisma.promotions.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    const existingMetadata = (existing.metadata as any) || {};

    // Generate new code
    const newCode = `${existing.code}_COPY_${Date.now()}`;

    const promotion = await this.prisma.promotions.create({
      data: {
        id: `promo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        code: newCode,
        name: `${existing.name} (Copy)`,
        description: existing.description,
        type: existing.type,
        value: existing.value,
        min_order_amount: existing.min_order_amount,
        max_discount: existing.max_discount,
        isActive: existing.isActive,
        starts_at: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        metadata: {
          ...existingMetadata,
          usageCount: 0, // Reset usage count
        },
        created_by: existing.created_by,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      data: {
        ...promotion,
        usageCount: 0,
        usageLimit: existingMetadata.usageLimit,
        categories: existingMetadata.categories || [],
        products: existingMetadata.products || [],
        customerSegments: existingMetadata.customerSegments || [],
        startDate: promotion.starts_at || promotion.createdAt,
        endDate: promotion.expiresAt,
        minOrderAmount: promotion.min_order_amount,
        maxDiscount: promotion.max_discount,
      },
      message: 'Promotion duplicated successfully',
    };
  }

  /**
   * Toggle promotion active status
   */
  async toggleActive(id: string) {
    const existing = await this.prisma.promotions.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    const promotion = await this.prisma.promotions.update({
      where: { id },
      data: {
        isActive: !existing.isActive,
        updatedAt: new Date(),
      },
    });

    const metadata = (promotion.metadata as any) || {};
    return {
      success: true,
      data: {
        ...promotion,
        usageCount: metadata.usageCount || 0,
        usageLimit: metadata.usageLimit,
        categories: metadata.categories || [],
        products: metadata.products || [],
        customerSegments: metadata.customerSegments || [],
        startDate: promotion.starts_at || promotion.createdAt,
        endDate: promotion.expiresAt,
        minOrderAmount: promotion.min_order_amount,
        maxDiscount: promotion.max_discount,
      },
      message: `Promotion ${promotion.isActive ? 'activated' : 'deactivated'} successfully`,
    };
  }

  /**
   * Validate promotion code
   */
  async validateCode(code: string, orderAmount: number = 0) {
    const promotion = await this.prisma.promotions.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promotion) {
      return {
        valid: false,
        error: 'Mã khuyến mãi không tồn tại',
      };
    }

    if (!promotion.isActive) {
      return {
        valid: false,
        error: 'Mã khuyến mãi đã bị vô hiệu hóa',
      };
    }

    const now = new Date();
    if (promotion.starts_at && promotion.starts_at > now) {
      return {
        valid: false,
        error: 'Mã khuyến mãi chưa có hiệu lực',
      };
    }

    if (promotion.expiresAt && promotion.expiresAt < now) {
      return {
        valid: false,
        error: 'Mã khuyến mãi đã hết hạn',
      };
    }

    const metadata = (promotion.metadata as any) || {};
    const usageCount = metadata.usageCount || 0;
    const usageLimit = metadata.usageLimit;

    if (usageLimit && usageCount >= usageLimit) {
      return {
        valid: false,
        error: 'Mã khuyến mãi đã được sử dụng hết',
      };
    }

    if (promotion.min_order_amount && orderAmount < promotion.min_order_amount) {
      return {
        valid: false,
        error: `Đơn hàng tối thiểu ${promotion.min_order_amount?.toLocaleString('vi-VN')}đ để sử dụng mã này`,
      };
    }

    // Calculate discount
    let discount = 0;
    switch (promotion.type) {
      case 'PERCENTAGE':
        discount = orderAmount * (promotion.value / 100);
        if (promotion.max_discount) {
          discount = Math.min(discount, promotion.max_discount);
        }
        break;
      case 'FIXED_AMOUNT':
        discount = promotion.value;
        break;
      case 'FREE_SHIPPING':
        discount = 0; // Handled separately
        break;
      case 'BUY_X_GET_Y':
        discount = 0; // Handled in cart logic
        break;
    }

    return {
      valid: true,
      promotion: {
        ...promotion,
        usageCount,
        usageLimit,
        categories: metadata.categories || [],
        products: metadata.products || [],
        customerSegments: metadata.customerSegments || [],
        startDate: promotion.starts_at || promotion.createdAt,
        endDate: promotion.expiresAt,
        minOrderAmount: promotion.min_order_amount,
        maxDiscount: promotion.max_discount,
      },
      discount: Math.min(discount, orderAmount),
    };
  }

  /**
   * Get promotion statistics
   */
  async getStats() {
    const allPromotions = await this.prisma.promotions.findMany();

    const now = new Date();
    const activePromotions = allPromotions.filter(p => {
      const isActive = p.isActive;
      const notExpired = !p.expiresAt || p.expiresAt >= now;
      const hasStarted = !p.starts_at || p.starts_at <= now;
      return isActive && notExpired && hasStarted;
    });

    const expiredPromotions = allPromotions.filter(p => {
      return p.expiresAt && p.expiresAt < now;
    });

    let totalUsage = 0;
    let totalSavings = 0;

    allPromotions.forEach(promo => {
      const metadata = (promo.metadata as any) || {};
      const usageCount = metadata.usageCount || 0;
      totalUsage += usageCount;

      // Estimate savings
      if (promo.type === 'PERCENTAGE') {
        totalSavings += usageCount * 1500000 * (promo.value / 100);
      } else if (promo.type === 'FIXED_AMOUNT') {
        totalSavings += usageCount * promo.value;
      }
    });

    return {
      success: true,
      data: {
        totalPromotions: allPromotions.length,
        activePromotions: activePromotions.length,
        expiredPromotions: expiredPromotions.length,
        totalUsage,
        totalSavings: Math.round(totalSavings),
        conversionRate:
          allPromotions.length > 0
            ? Math.round((totalUsage / (allPromotions.length * 100)) * 100)
            : 0,
      },
    };
  }

  /**
   * Apply promotion to cart items
   * Returns discount breakdown for each applicable item
   */
  async applyToCart(
    code: string,
    cartItems: Array<{
      productId: string;
      categoryId?: string;
      quantity: number;
      priceCents: number;
    }>,
  ) {
    const promotion = await this.prisma.promotions.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promotion || !promotion.isActive) {
      return {
        valid: false,
        error: 'Mã khuyến mãi không hợp lệ',
      };
    }

    // Validate time range
    const now = new Date();
    if (promotion.starts_at && promotion.starts_at > now) {
      return { valid: false, error: 'Mã khuyến mãi chưa có hiệu lực' };
    }
    if (promotion.expiresAt && promotion.expiresAt < now) {
      return { valid: false, error: 'Mã khuyến mãi đã hết hạn' };
    }

    const metadata = (promotion.metadata as any) || {};
    const promotionProducts = metadata.products || [];
    const promotionCategories = metadata.categories || [];

    // Calculate total order amount
    const totalAmount = cartItems.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);

    // Check minimum order amount
    if (promotion.min_order_amount && totalAmount < promotion.min_order_amount) {
      return {
        valid: false,
        error: `Đơn hàng tối thiểu ${promotion.min_order_amount?.toLocaleString('vi-VN')}đ`,
      };
    }

    // Filter applicable items based on product/category restrictions
    let applicableItems = cartItems;
    if (promotionProducts.length > 0 || promotionCategories.length > 0) {
      applicableItems = cartItems.filter(item => {
        const matchesProduct =
          promotionProducts.length === 0 || promotionProducts.includes(item.productId);
        const matchesCategory =
          promotionCategories.length === 0 ||
          (item.categoryId && promotionCategories.includes(item.categoryId));
        return matchesProduct || matchesCategory;
      });
    }

    if (applicableItems.length === 0) {
      return {
        valid: false,
        error: 'Không có sản phẩm nào áp dụng được khuyến mãi này',
      };
    }

    // Calculate discount based on promotion type
    let totalDiscount = 0;
    const itemDiscounts = [];

    switch (promotion.type) {
      case 'PERCENTAGE':
        applicableItems.forEach(item => {
          const itemTotal = item.priceCents * item.quantity;
          const itemDiscount = Math.round(itemTotal * (promotion.value / 100));
          itemDiscounts.push({
            productId: item.productId,
            quantity: item.quantity,
            originalPrice: item.priceCents,
            discount: itemDiscount,
            finalPrice: item.priceCents - Math.round(itemDiscount / item.quantity),
          });
          totalDiscount += itemDiscount;
        });

        // Apply max discount cap
        if (promotion.max_discount && totalDiscount > promotion.max_discount) {
          const ratio = promotion.max_discount / totalDiscount;
          itemDiscounts.forEach(item => {
            item.discount = Math.round(item.discount * ratio);
            item.finalPrice = item.originalPrice - Math.round(item.discount / item.quantity);
          });
          totalDiscount = promotion.max_discount;
        }
        break;

      case 'FIXED_AMOUNT':
        // Distribute fixed discount proportionally across applicable items
        const applicableTotal = applicableItems.reduce(
          (sum, item) => sum + item.priceCents * item.quantity,
          0,
        );

        applicableItems.forEach(item => {
          const itemTotal = item.priceCents * item.quantity;
          const proportion = itemTotal / applicableTotal;
          const itemDiscount = Math.round(promotion.value * proportion);
          itemDiscounts.push({
            productId: item.productId,
            quantity: item.quantity,
            originalPrice: item.priceCents,
            discount: itemDiscount,
            finalPrice: item.priceCents - Math.round(itemDiscount / item.quantity),
          });
          totalDiscount += itemDiscount;
        });
        break;

      case 'FREE_SHIPPING':
        // Free shipping doesn't affect item prices
        itemDiscounts.push({
          type: 'FREE_SHIPPING',
          description: 'Miễn phí vận chuyển',
        });
        break;

      case 'BUY_X_GET_Y':
        {
          const buyQuantity = Math.max(1, Number(metadata.buyQuantity || 1));
          const getQuantity = Math.max(1, Number(metadata.getQuantity || 1));
          const buyProducts = metadata.buyProducts || metadata.products || [];
          const buyCategories = metadata.buyCategories || metadata.categories || [];
          const getProducts = metadata.getProducts || [];
          const getCategories = metadata.getCategories || [];
          const discountType = metadata.discountType || 'FREE'; // FREE or PERCENTAGE
          const discountValue = Number(metadata.discountValue || 100); // percentage if PERCENTAGE

          const isBuyMatch = (item: any) => {
            const matchesProduct = buyProducts.length === 0 || buyProducts.includes(item.productId);
            const matchesCategory =
              buyCategories.length === 0 ||
              (item.categoryId && buyCategories.includes(item.categoryId));
            return matchesProduct || matchesCategory;
          };

          const isGetMatch = (item: any) => {
            const matchesProduct = getProducts.length === 0 || getProducts.includes(item.productId);
            const matchesCategory =
              getCategories.length === 0 ||
              (item.categoryId && getCategories.includes(item.categoryId));
            // If no explicit getProducts/getCategories configured, fallback to buy criteria
            return getProducts.length === 0 && getCategories.length === 0
              ? isBuyMatch(item)
              : matchesProduct || matchesCategory;
          };

          const buyPool = applicableItems.filter(isBuyMatch);
          const getPool = applicableItems.filter(isGetMatch);

          const totalBuyQty = buyPool.reduce((sum, i) => sum + i.quantity, 0);
          if (totalBuyQty < buyQuantity) {
            return {
              valid: false,
              error: `Cần mua tối thiểu ${buyQuantity} sản phẩm áp dụng để nhận ưu đãi`,
            };
          }

          const eligibleFreeQty = Math.floor(totalBuyQty / buyQuantity) * getQuantity;
          if (eligibleFreeQty <= 0 || getPool.length === 0) {
            return {
              valid: false,
              error: 'Không có sản phẩm nào đủ điều kiện nhận khuyến mãi tặng kèm',
            };
          }

          // Sort get-pool by price ASC to discount cheapest items first
          const sortedGetPool = [...getPool].sort((a, b) => a.priceCents - b.priceCents);
          let remainingFreeQty = eligibleFreeQty;

          for (const item of sortedGetPool) {
            if (remainingFreeQty <= 0) break;
            const applyQty = Math.min(item.quantity, remainingFreeQty);
            const baseDiscount = item.priceCents * applyQty;
            const itemDiscount =
              discountType === 'PERCENTAGE'
                ? Math.round(baseDiscount * (discountValue / 100))
                : baseDiscount;

            itemDiscounts.push({
              productId: item.productId,
              quantity: applyQty,
              originalPrice: item.priceCents,
              discount: itemDiscount,
              finalPrice: item.priceCents - Math.round(itemDiscount / applyQty),
              note: `Buy ${buyQuantity} get ${getQuantity}`,
            });

            totalDiscount += itemDiscount;
            remainingFreeQty -= applyQty;
          }
        }
        break;
    }

    return {
      valid: true,
      promotion: {
        id: promotion.id,
        code: promotion.code,
        name: promotion.name,
        type: promotion.type,
        value: promotion.value,
      },
      totalDiscount: Math.min(totalDiscount, totalAmount),
      itemDiscounts,
      applicableItems: applicableItems.map(i => i.productId),
      applicableItemsCount: applicableItems.length,
      totalItemsCount: cartItems.length,
    };
  }

  /**
   * Check if product is eligible for a promotion
   */
  async isProductEligible(
    promotionId: string,
    productId: string,
    categoryId?: string,
  ): Promise<boolean> {
    const promotion = await this.prisma.promotions.findUnique({
      where: { id: promotionId },
    });

    if (!promotion || !promotion.isActive) {
      return false;
    }

    const metadata = (promotion.metadata as any) || {};
    const products = metadata.products || [];
    const categories = metadata.categories || [];

    // If no restrictions, all products are eligible
    if (products.length === 0 && categories.length === 0) {
      return true;
    }

    // Check product ID match
    if (products.includes(productId)) {
      return true;
    }

    // Check category ID match
    if (categoryId && categories.includes(categoryId)) {
      return true;
    }

    return false;
  }

  /**
   * Increment promotion usage count
   */
  async incrementUsage(code: string) {
    const promotion = await this.prisma.promotions.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (promotion) {
      const metadata = (promotion.metadata as any) || {};
      const currentUsage = metadata.usageCount || 0;

      await this.prisma.promotions.update({
        where: { id: promotion.id },
        data: {
          metadata: {
            ...metadata,
            usageCount: currentUsage + 1,
          },
        },
      });
    }
  }

  /**
   * Get active promotions for a product
   */
  async getPromotionsForProduct(productId: string, categoryId?: string) {
    const allPromotions = await this.prisma.promotions.findMany({
      where: { isActive: true },
    });

    const now = new Date();
    const applicablePromotions = [];

    for (const promotion of allPromotions) {
      // Check time validity
      if (promotion.starts_at && promotion.starts_at > now) continue;
      if (promotion.expiresAt && promotion.expiresAt < now) continue;

      const metadata = (promotion.metadata as any) || {};
      const products = metadata.products || [];
      const categories = metadata.categories || [];

      // Check if product is eligible
      const isEligible =
        (products.length === 0 && categories.length === 0) ||
        products.includes(productId) ||
        (categoryId && categories.includes(categoryId));

      if (isEligible) {
        applicablePromotions.push({
          ...promotion,
          usageCount: metadata.usageCount || 0,
          usageLimit: metadata.usageLimit,
          categories: metadata.categories || [],
          products: metadata.products || [],
          startDate: promotion.starts_at || promotion.createdAt,
          endDate: promotion.expiresAt,
          minOrderAmount: promotion.min_order_amount,
          maxDiscount: promotion.max_discount,
        });
      }
    }

    return {
      success: true,
      data: applicablePromotions,
      count: applicablePromotions.length,
    };
  }

  /**
   * Mark promotion as used (increment usage count)
   */
  async markAsUsed(code: string) {
    const promotion = await this.prisma.promotions.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    const metadata = (promotion.metadata as any) || {};
    const usageCount = (metadata.usageCount || 0) + 1;

    await this.prisma.promotions.update({
      where: { id: promotion.id },
      data: {
        metadata: {
          ...metadata,
          usageCount,
        },
      },
    });

    return {
      success: true,
      data: { usageCount },
    };
  }

  async getStatus() {
    return {
      module: 'promotions',
      status: 'operational',
      uptime: process.uptime(),
    };
  }
}
