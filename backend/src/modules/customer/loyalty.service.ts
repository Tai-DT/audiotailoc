import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../caching/cache.service';

export interface LoyaltyAccount {
  id: string;
  userId: string;
  points: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PointTransaction {
  id: string;
  accountId: string;
  type: 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'ADJUSTED';
  amount: number;
  description?: string | null;
  expiresAt?: Date | null;
  createdAt: Date;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string | null;
  pointsCost: number;
  type: 'DISCOUNT' | 'FREE_SHIPPING' | 'PRODUCT' | 'CASHBACK';
  value: number;
  isActive: boolean;
  createdAt: Date;
}

export interface RedemptionHistory {
  id: string;
  accountId: string;
  rewardId: string;
  pointsUsed: number;
  status: 'COMPLETED' | 'PENDING' | 'USED' | 'EXPIRED';
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
          isActive: true,
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
        accountId: account.id,
        type: 'EARNED',
        amount: points,
        description,
        expiresAt: expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    });

    // Update loyalty account
    const newPoints = account.points + points;
    const newTier = this.calculateTier(newPoints);

    await this.prisma.loyaltyAccount.update({
      where: { userId },
      data: {
        points: newPoints,
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

    // Simplified schema: no validUntil/minTier; only check active and points

    if (account.points < reward.pointsCost) {
      throw new BadRequestException('Insufficient points');
    }

    // Simplified: no per-user max redemptions in schema

    // Create redemption record
    const redemption = await this.prisma.redemptionHistory.create({
      data: {
        accountId: account.id,
        rewardId,
        pointsUsed: reward.pointsCost,
        status: 'COMPLETED',
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
      },
    });

    // Create point transaction
    await this.prisma.pointTransaction.create({
      data: {
        accountId: account.id,
        type: 'REDEEMED',
        amount: -reward.pointsCost,
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

    const account = await this.getLoyaltyAccount(userId);
    const where: any = { accountId: account.id };
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
    const _account = await this.getLoyaltyAccount(userId);
    
    const rewards = await this.prisma.loyaltyReward.findMany({
      where: {
        isActive: true,
      },
      orderBy: { pointsCost: 'asc' },
    });

    return rewards.map(r => this.mapLoyaltyReward(r));
  }

  async getRedemptionHistory(userId: string): Promise<RedemptionHistory[]> {
    const account = await this.getLoyaltyAccount(userId);
    const redemptions = await this.prisma.redemptionHistory.findMany({
      where: { accountId: account.id },
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
    const account = await this.getLoyaltyAccount(userId);
    const existingTransaction = await this.prisma.pointTransaction.findFirst({
      where: {
        accountId: account.id,
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
    const account = await this.getLoyaltyAccount(userId);
    const existingBonus = await this.prisma.pointTransaction.findFirst({
      where: {
        accountId: account.id,
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
      },
    });

    for (const transaction of expiredTransactions) {
      // Create expiration transaction
      await this.prisma.pointTransaction.create({
        data: {
          accountId: transaction.accountId,
          type: 'EXPIRED',
          amount: -transaction.amount,
          description: `Expired points from transaction ${transaction.id}`,
        },
      });

      const account = await this.prisma.loyaltyAccount.findUnique({ where: { id: transaction.accountId } });
      if (account) {
        // Update loyalty account
        await this.prisma.loyaltyAccount.update({
          where: { id: account.id },
          data: {
            points: { decrement: transaction.amount },
          },
        });
        // Clear cache
        await this.clearLoyaltyCache(account.userId);
      }
    }
  }

  private calculateTier(points: number): 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' {
    if (points >= this.TIER_THRESHOLDS.PLATINUM) return 'PLATINUM';
    if (points >= this.TIER_THRESHOLDS.GOLD) return 'GOLD';
    if (points >= this.TIER_THRESHOLDS.SILVER) return 'SILVER';
    return 'BRONZE';
  }

  private getNextTierPoints(): number {
    return 0;
  }

  private canAccessTier(userTier: string, requiredTier: string): boolean {
    const tierOrder = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
    return tierOrder.indexOf(userTier) >= tierOrder.indexOf(requiredTier);
  }

  private getAccessibleTiers(): string[] { return ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']; }

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
      isActive: account.isActive,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }

  private mapPointTransaction(transaction: any): PointTransaction {
    return {
      id: transaction.id,
      accountId: transaction.accountId,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
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
      isActive: reward.isActive,
      createdAt: reward.createdAt,
    };
  }

  private mapRedemptionHistory(redemption: any): RedemptionHistory {
    return {
      id: redemption.id,
      accountId: redemption.accountId,
      rewardId: redemption.rewardId,
      pointsUsed: redemption.pointsUsed,
      status: redemption.status,
      createdAt: redemption.createdAt,
      reward: this.mapLoyaltyReward(redemption.reward),
    };
  }

  private async clearLoyaltyCache(userId: string): Promise<void> {
    await this.cacheService.del(`loyalty:${userId}`);
  }
}
