import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

export interface LoyaltyAccount {
  id: string;
  userId: string;
  points: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  totalEarned: number;
  totalRedeemed: number;
  nextTierPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PointTransaction {
  id: string;
  userId: string;
  type: 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'ADJUSTED';
  points: number;
  description: string;
  orderId?: string;
  expiresAt?: Date;
  createdAt: Date;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'DISCOUNT' | 'FREE_SHIPPING' | 'PRODUCT' | 'CASHBACK';
  value: number; // Discount percentage or cashback amount
  minTier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  maxRedemptions?: number;
  validUntil?: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface RedemptionHistory {
  id: string;
  userId: string;
  rewardId: string;
  pointsUsed: number;
  orderId?: string;
  status: 'PENDING' | 'USED' | 'EXPIRED';
  expiresAt: Date;
  createdAt: Date;
  reward: LoyaltyReward;
}

@Injectable()
export class LoyaltyService {
  private readonly TIER_THRESHOLDS = {
    BRONZE: 0,
    SILVER: 1000,
    GOLD: 5000,
    PLATINUM: 15000,
  };

  private readonly EARNING_RULES = {
    ORDER_COMPLETION: 1, // 1 point per 1000 VND
    PRODUCT_REVIEW: 50,
    REFERRAL: 500,
    BIRTHDAY: 200,
    SOCIAL_SHARE: 25,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService
  ) {}

  async getLoyaltyAccount(userId: string): Promise<LoyaltyAccount> {
    const cacheKey = `loyalty:${userId}`;
    const cached = await this.cacheService.get<LoyaltyAccount>(cacheKey);
    if (cached) return cached;

    let account = await this.prisma.loyaltyAccount.findUnique({
      where: { userId },
    });

    if (!account) {
      // Create new loyalty account
      account = await this.prisma.loyaltyAccount.create({
        data: {
          userId,
          points: 0,
          tier: 'BRONZE',
          totalEarned: 0,
          totalRedeemed: 0,
        },
      });
    }

    const loyaltyAccount = this.mapLoyaltyAccount(account);
    
    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, loyaltyAccount, { ttl: 300 });
    
    return loyaltyAccount;
  }

  async earnPoints(
    userId: string,
    points: number,
    description: string,
    orderId?: string,
    expiresAt?: Date
  ): Promise<PointTransaction> {
    const account = await this.getLoyaltyAccount(userId);
    
    // Create point transaction
    const transaction = await this.prisma.pointTransaction.create({
      data: {
        userId,
        type: 'EARNED',
        points,
        description,
        orderId,
        expiresAt: expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year default
      },
    });

    // Update loyalty account
    const newPoints = account.points + points;
    const newTotalEarned = account.totalEarned + points;
    const newTier = this.calculateTier(newTotalEarned);

    await this.prisma.loyaltyAccount.update({
      where: { userId },
      data: {
        points: newPoints,
        totalEarned: newTotalEarned,
        tier: newTier,
      },
    });

    // Clear cache
    await this.clearLoyaltyCache(userId);

    // Check for tier upgrade
    if (newTier !== account.tier) {
      await this.handleTierUpgrade(userId, newTier);
    }

    return this.mapPointTransaction(transaction);
  }

  async redeemPoints(userId: string, rewardId: string): Promise<RedemptionHistory> {
    const [account, reward] = await Promise.all([
      this.getLoyaltyAccount(userId),
      this.getReward(rewardId),
    ]);

    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    if (!reward.isActive) {
      throw new BadRequestException('Reward is not active');
    }

    if (reward.validUntil && reward.validUntil < new Date()) {
      throw new BadRequestException('Reward has expired');
    }

    if (reward.minTier && !this.canAccessTier(account.tier, reward.minTier)) {
      throw new BadRequestException('Insufficient tier level for this reward');
    }

    if (account.points < reward.pointsCost) {
      throw new BadRequestException('Insufficient points');
    }

    // Check redemption limits
    if (reward.maxRedemptions) {
      const redemptionCount = await this.prisma.redemptionHistory.count({
        where: {
          userId,
          rewardId,
          status: { in: ['PENDING', 'USED'] },
        },
      });

      if (redemptionCount >= reward.maxRedemptions) {
        throw new BadRequestException('Maximum redemptions reached for this reward');
      }
    }

    // Create redemption record
    const redemption = await this.prisma.redemptionHistory.create({
      data: {
        userId,
        rewardId,
        pointsUsed: reward.pointsCost,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days to use
      },
      include: {
        reward: true,
      },
    });

    // Deduct points
    await this.prisma.loyaltyAccount.update({
      where: { userId },
      data: {
        points: { decrement: reward.pointsCost },
        totalRedeemed: { increment: reward.pointsCost },
      },
    });

    // Create point transaction
    await this.prisma.pointTransaction.create({
      data: {
        userId,
        type: 'REDEEMED',
        points: -reward.pointsCost,
        description: `Redeemed: ${reward.name}`,
      },
    });

    // Clear cache
    await this.clearLoyaltyCache(userId);

    return this.mapRedemptionHistory(redemption);
  }

  async getPointTransactions(
    userId: string,
    options: {
      page?: number;
      pageSize?: number;
      type?: 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'ADJUSTED';
    } = {}
  ): Promise<{
    transactions: PointTransaction[];
    pagination: {
      page: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  }> {
    const { page = 1, pageSize = 20, type } = options;

    const where: any = { userId };
    if (type) {
      where.type = type;
    }

    const [transactions, totalItems] = await Promise.all([
      this.prisma.pointTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.pointTransaction.count({ where }),
    ]);

    return {
      transactions: transactions.map(t => this.mapPointTransaction(t)),
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    };
  }

  async getAvailableRewards(userId: string): Promise<LoyaltyReward[]> {
    const account = await this.getLoyaltyAccount(userId);
    
    const rewards = await this.prisma.loyaltyReward.findMany({
      where: {
        isActive: true,
        OR: [
          { validUntil: null },
          { validUntil: { gte: new Date() } },
        ],
        OR: [
          { minTier: null },
          { minTier: { in: this.getAccessibleTiers(account.tier) } },
        ],
      },
      orderBy: { pointsCost: 'asc' },
    });

    return rewards.map(r => this.mapLoyaltyReward(r));
  }

  async getRedemptionHistory(userId: string): Promise<RedemptionHistory[]> {
    const redemptions = await this.prisma.redemptionHistory.findMany({
      where: { userId },
      include: { reward: true },
      orderBy: { createdAt: 'desc' },
    });

    return redemptions.map(r => this.mapRedemptionHistory(r));
  }

  async processOrderCompletion(userId: string, orderTotal: number, orderId: string): Promise<void> {
    // Calculate points based on order total (1 point per 1000 VND)
    const points = Math.floor(orderTotal / 1000) * this.EARNING_RULES.ORDER_COMPLETION;
    
    if (points > 0) {
      await this.earnPoints(
        userId,
        points,
        `Order completion: ${orderId}`,
        orderId
      );
    }
  }

  async processProductReview(userId: string, productId: string): Promise<void> {
    // Check if user already earned points for reviewing this product
    const existingTransaction = await this.prisma.pointTransaction.findFirst({
      where: {
        userId,
        description: { contains: `Product review: ${productId}` },
        type: 'EARNED',
      },
    });

    if (!existingTransaction) {
      await this.earnPoints(
        userId,
        this.EARNING_RULES.PRODUCT_REVIEW,
        `Product review: ${productId}`
      );
    }
  }

  async processReferral(userId: string, referredUserId: string): Promise<void> {
    await this.earnPoints(
      userId,
      this.EARNING_RULES.REFERRAL,
      `Referral: ${referredUserId}`
    );
  }

  async processBirthdayBonus(userId: string): Promise<void> {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    // Check if already received birthday bonus this year
    const existingBonus = await this.prisma.pointTransaction.findFirst({
      where: {
        userId,
        description: { contains: `Birthday bonus ${currentYear}` },
        type: 'EARNED',
      },
    });

    if (!existingBonus) {
      await this.earnPoints(
        userId,
        this.EARNING_RULES.BIRTHDAY,
        `Birthday bonus ${currentYear}`
      );
    }
  }

  async expirePoints(): Promise<void> {
    // Find expired points
    const expiredTransactions = await this.prisma.pointTransaction.findMany({
      where: {
        type: 'EARNED',
        expiresAt: { lte: new Date() },
        // Not already expired
        NOT: {
          pointTransaction: {
            some: {
              type: 'EXPIRED',
              description: { contains: 'Expired points from transaction' },
            },
          },
        },
      },
    });

    for (const transaction of expiredTransactions) {
      // Create expiration transaction
      await this.prisma.pointTransaction.create({
        data: {
          userId: transaction.userId,
          type: 'EXPIRED',
          points: -transaction.points,
          description: `Expired points from transaction ${transaction.id}`,
        },
      });

      // Update loyalty account
      await this.prisma.loyaltyAccount.update({
        where: { userId: transaction.userId },
        data: {
          points: { decrement: transaction.points },
        },
      });

      // Clear cache
      await this.clearLoyaltyCache(transaction.userId);
    }
  }

  private calculateTier(totalEarned: number): 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' {
    if (totalEarned >= this.TIER_THRESHOLDS.PLATINUM) return 'PLATINUM';
    if (totalEarned >= this.TIER_THRESHOLDS.GOLD) return 'GOLD';
    if (totalEarned >= this.TIER_THRESHOLDS.SILVER) return 'SILVER';
    return 'BRONZE';
  }

  private getNextTierPoints(tier: string, totalEarned: number): number {
    switch (tier) {
      case 'BRONZE':
        return this.TIER_THRESHOLDS.SILVER - totalEarned;
      case 'SILVER':
        return this.TIER_THRESHOLDS.GOLD - totalEarned;
      case 'GOLD':
        return this.TIER_THRESHOLDS.PLATINUM - totalEarned;
      case 'PLATINUM':
        return 0;
      default:
        return 0;
    }
  }

  private canAccessTier(userTier: string, requiredTier: string): boolean {
    const tierOrder = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
    return tierOrder.indexOf(userTier) >= tierOrder.indexOf(requiredTier);
  }

  private getAccessibleTiers(userTier: string): string[] {
    const tierOrder = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
    const userTierIndex = tierOrder.indexOf(userTier);
    return tierOrder.slice(0, userTierIndex + 1);
  }

  private async handleTierUpgrade(userId: string, newTier: string): Promise<void> {
    // Award tier upgrade bonus
    const bonusPoints = {
      SILVER: 100,
      GOLD: 250,
      PLATINUM: 500,
    }[newTier] || 0;

    if (bonusPoints > 0) {
      await this.earnPoints(
        userId,
        bonusPoints,
        `Tier upgrade bonus: ${newTier}`
      );
    }

    // Could send notification here
  }

  private async getReward(rewardId: string): Promise<LoyaltyReward | null> {
    const reward = await this.prisma.loyaltyReward.findUnique({
      where: { id: rewardId },
    });

    return reward ? this.mapLoyaltyReward(reward) : null;
  }

  private mapLoyaltyAccount(account: any): LoyaltyAccount {
    return {
      id: account.id,
      userId: account.userId,
      points: account.points,
      tier: account.tier,
      totalEarned: account.totalEarned,
      totalRedeemed: account.totalRedeemed,
      nextTierPoints: this.getNextTierPoints(account.tier, account.totalEarned),
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }

  private mapPointTransaction(transaction: any): PointTransaction {
    return {
      id: transaction.id,
      userId: transaction.userId,
      type: transaction.type,
      points: transaction.points,
      description: transaction.description,
      orderId: transaction.orderId,
      expiresAt: transaction.expiresAt,
      createdAt: transaction.createdAt,
    };
  }

  private mapLoyaltyReward(reward: any): LoyaltyReward {
    return {
      id: reward.id,
      name: reward.name,
      description: reward.description,
      pointsCost: reward.pointsCost,
      type: reward.type,
      value: reward.value,
      minTier: reward.minTier,
      maxRedemptions: reward.maxRedemptions,
      validUntil: reward.validUntil,
      isActive: reward.isActive,
      createdAt: reward.createdAt,
    };
  }

  private mapRedemptionHistory(redemption: any): RedemptionHistory {
    return {
      id: redemption.id,
      userId: redemption.userId,
      rewardId: redemption.rewardId,
      pointsUsed: redemption.pointsUsed,
      orderId: redemption.orderId,
      status: redemption.status,
      expiresAt: redemption.expiresAt,
      createdAt: redemption.createdAt,
      reward: this.mapLoyaltyReward(redemption.reward),
    };
  }

  private async clearLoyaltyCache(userId: string): Promise<void> {
    await this.cacheService.del(`loyalty:${userId}`);
  }
}
