import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { randomUUID } from 'crypto';

export interface CustomerPromotionUsage {
  promotionId: string;
  userId: string;
  orderId?: string;
  discountApplied?: number;
  status?: 'APPLIED' | 'PENDING' | 'REVERSED';
  metadata?: Record<string, any>;
}

@Injectable()
export class PromotionCustomerService {
  constructor(private prisma: PrismaService) {}

  /**
   * Record a customer's promotion usage
   */
  async recordUsage(data: CustomerPromotionUsage) {
    return this.prisma.customer_promotions.create({
      data: {
        id: randomUUID(),
        promotionId: data.promotionId,
        userId: data.userId,
        orderId: data.orderId,
        discountApplied: data.discountApplied ? BigInt(data.discountApplied) : null,
        status: data.status || 'APPLIED',
        metadata: data.metadata || {},
        usedAt: new Date(),
        createdAt: new Date(),
      },
      include: {
        promotions: true,
        users: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Check if a customer has already used a promotion
   */
  async hasCustomerUsedPromotion(promotionId: string, userId: string): Promise<boolean> {
    const usage = await this.prisma.customer_promotions.findFirst({
      where: {
        promotionId,
        userId,
        status: 'APPLIED',
      },
    });
    return !!usage;
  }

  /**
   * Get promotion usage history for a customer
   */
  async getCustomerHistory(
    userId: string,
    filters?: {
      promotionId?: string;
      status?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    },
  ) {
    const where: any = { userId };

    if (filters?.promotionId) {
      where.promotionId = filters.promotionId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.startDate || filters?.endDate) {
      where.usedAt = {};
      if (filters.startDate) where.usedAt.gte = filters.startDate;
      if (filters.endDate) where.usedAt.lte = filters.endDate;
    }

    const [usage, total] = await Promise.all([
      this.prisma.customer_promotions.findMany({
        where,
        orderBy: { usedAt: 'desc' },
        take: filters?.limit || 20,
        skip: filters?.offset || 0,
        include: {
          promotions: true,
        },
      }),
      this.prisma.customer_promotions.count({ where }),
    ]);

    return {
      data: usage.map(u => ({
        ...u,
        discountApplied: u.discountApplied ? Number(u.discountApplied) : 0,
        promotionName: u.promotions?.name,
      })),
      total,
    };
  }

  /**
   * Get all customers who used a specific promotion
   */
  async getPromotionUsers(
    promotionId: string,
    filters?: {
      status?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    },
  ) {
    const where: any = { promotionId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.startDate || filters?.endDate) {
      where.usedAt = {};
      if (filters.startDate) where.usedAt.gte = filters.startDate;
      if (filters.endDate) where.usedAt.lte = filters.endDate;
    }

    const [users, total] = await Promise.all([
      this.prisma.customer_promotions.findMany({
        where,
        orderBy: { usedAt: 'desc' },
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
        distinct: ['userId'],
        include: {
          users: {
            select: {
              id: true,
              email: true,
              name: true,
              phone: true,
            },
          },
        },
      }),
      this.prisma.customer_promotions
        .findMany({
          where,
          distinct: ['userId'],
        })
        .then(result => result.length),
    ]);

    return {
      data: users,
      total,
      limit: filters?.limit || 50,
      offset: filters?.offset || 0,
    };
  }

  /**
   * Get customer segments that can use a specific promotion
   */
  async getEligibleCustomers(promotionId: string) {
    const promotion = await this.prisma.promotions.findUnique({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new Error('Promotion not found');
    }

    const where: any = {
      role: 'USER',
      // Add more conditions based on customerSegment
    };

    if (promotion.customerSegment) {
      where.role = promotion.customerSegment;
    }

    // Get users who haven't used this promotion yet
    const usedUserIds = await this.prisma.customer_promotions
      .findMany({
        where: { promotionId },
        select: { userId: true },
        distinct: ['userId'],
      })
      .then(results => results.map(r => r.userId));

    const eligibleUsers = await this.prisma.users.findMany({
      where: {
        ...where,
        NOT: {
          id: {
            in: usedUserIds,
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
      },
    });

    return eligibleUsers;
  }

  /**
   * Get customer promotion statistics
   */
  async getCustomerStats(userId: string) {
    const [totalPromotionsUsed, totalSavings, averageDiscount, lastUsed, promotionsByType] =
      await Promise.all([
        this.prisma.customer_promotions.count({
          where: {
            userId,
            status: 'APPLIED',
          },
        }),
        this.prisma.customer_promotions.aggregate({
          where: {
            userId,
            status: 'APPLIED',
          },
          _sum: {
            discountApplied: true,
          },
        }),
        this.prisma.customer_promotions.aggregate({
          where: {
            userId,
            status: 'APPLIED',
          },
          _avg: {
            discountApplied: true,
          },
        }),
        this.prisma.customer_promotions.findFirst({
          where: { userId },
          orderBy: { usedAt: 'desc' },
        }),
        this.prisma.customer_promotions.groupBy({
          by: ['promotionId'],
          where: { userId, status: 'APPLIED' },
          _count: true,
          orderBy: {
            _count: {
              promotionId: 'desc',
            },
          },
          take: 5,
        }),
      ]);

    return {
      totalPromotionsUsed,
      totalSavings: totalSavings._sum.discountApplied
        ? Number(totalSavings._sum.discountApplied)
        : 0,
      averageDiscount: averageDiscount._avg.discountApplied
        ? Number(averageDiscount._avg.discountApplied)
        : 0,
      lastUsed: lastUsed?.usedAt,
      topPromotions: promotionsByType.length,
    };
  }

  /**
   * Reverse a promotion usage (for returns/cancellations)
   */
  async reverseUsage(customerPromotionId: string, reason?: string) {
    return this.prisma.customer_promotions.update({
      where: { id: customerPromotionId },
      data: {
        status: 'REVERSED',
        metadata: {
          reversedAt: new Date(),
          reason,
        },
      },
      include: {
        promotions: true,
      },
    });
  }
  /**
   * Get promotion adoption rate
   */
  async getAdoptionRate(promotionId: string) {
    const totalUsers = await this.prisma.users.count({
      where: { role: 'USER' },
    });

    const usedUsers = await this.prisma.customer_promotions
      .findMany({
        where: {
          promotionId,
          status: 'APPLIED',
        },
        distinct: ['userId'],
      })
      .then(results => results.length);

    return {
      totalUsers,
      usedUsers,
      adoptionRate: totalUsers > 0 ? (usedUsers / totalUsers) * 100 : 0,
      percentage: `${totalUsers > 0 ? ((usedUsers / totalUsers) * 100).toFixed(2) : 0}%`,
    };
  }

  /**
   * Get customer lifetime value with promotions
   */
  async getCustomerLTV(userId: string) {
    const orders = await this.prisma.orders.findMany({
      where: { userId },
      select: {
        totalCents: true,
        discountCents: true,
      },
    });

    const promotionUsage = await this.prisma.customer_promotions.findMany({
      where: { userId, status: 'APPLIED' },
    });

    const totalSpent =
      Number(orders.reduce((sum, order) => sum + BigInt(order.totalCents || 0), BigInt(0))) / 100;
    const totalDiscount = promotionUsage.reduce(
      (sum, usage) => sum + Number(usage.discountApplied || 0),
      0,
    );

    return {
      totalSpent,
      totalDiscount,
      totalWithoutDiscount: totalSpent + totalDiscount,
      averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0,
      numberOfOrders: orders.length,
      numberOfPromotions: promotionUsage.length,
    };
  }
}
