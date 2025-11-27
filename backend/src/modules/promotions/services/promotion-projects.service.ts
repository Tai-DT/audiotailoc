import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export interface ProjectPromotion {
  projectId: string;
  promotionId: string;
  discountPercentage: number;
  discountAmount?: number;
  priority: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectPromotionReview {
  reviewId: string;
  projectId: string;
  promotionId: string;
  authorId: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  wouldRecommend: boolean;
  helpfulCount: number;
  unhelpfulCount: number;
  verifiedPurchase: boolean;
  promotionImpact: 'positive' | 'negative' | 'neutral';
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectReviewSummary {
  projectId: string;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
  positivePromotionReviews: number;
  negativePromotionReviews: number;
  verifiedPurchaseCount: number;
  recommendationRate: number;
  topPositiveKeywords: string[];
  topNegativeKeywords: string[];
  averagePromotionImpact: number;
}

@Injectable()
export class PromotionProjectsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Link promotion to project
   */
  async linkPromotionToProject(
    projectId: string,
    promotionId: string,
    data: {
      discountPercentage: number;
      discountAmount?: number;
      priority?: number;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<ProjectPromotion> {
    const projectPromotion: ProjectPromotion = {
      projectId,
      promotionId,
      discountPercentage: data.discountPercentage,
      discountAmount: data.discountAmount,
      priority: data.priority || 0,
      isActive: true,
      startDate: data.startDate,
      endDate: data.endDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store in database (placeholder)
    await this.storeProjectPromotion(projectPromotion);

    return projectPromotion;
  }

  /**
   * Unlink promotion from project
   */
  async unlinkPromotionFromProject(projectId: string, promotionId: string): Promise<boolean> {
    return this.removeProjectPromotion(projectId, promotionId);
  }

  /**
   * Get all promotions for a project
   */
  async getProjectPromotions(projectId: string): Promise<ProjectPromotion[]> {
    const now = new Date();
    const promotions = await this.getAllProjectPromotions(projectId);

    // Filter active promotions
    return promotions.filter(p => {
      if (!p.isActive) return false;
      if (p.startDate && p.startDate > now) return false;
      if (p.endDate && p.endDate < now) return false;
      return true;
    });
  }

  /**
   * Get best promotions for a project (sorted by priority and discount)
   */
  async getBestPromotionsForProject(
    projectId: string,
    limit: number = 5,
  ): Promise<ProjectPromotion[]> {
    const promotions = await this.getProjectPromotions(projectId);

    return promotions
      .sort((a, b) => {
        // Sort by priority first, then by discount percentage
        if (b.priority !== a.priority) {
          return b.priority - a.priority;
        }
        return b.discountPercentage - a.discountPercentage;
      })
      .slice(0, limit);
  }

  /**
   * Add review for project promotion
   */
  async addPromotionReview(
    projectId: string,
    promotionId: string,
    authorId: string,
    data: {
      rating: number;
      title: string;
      comment: string;
      wouldRecommend: boolean;
      verifiedPurchase: boolean;
      promotionImpact: 'positive' | 'negative' | 'neutral';
    },
  ): Promise<ProjectPromotionReview> {
    const review: ProjectPromotionReview = {
      reviewId: `review_${Date.now()}_${Math.random()}`,
      projectId,
      promotionId,
      authorId,
      rating: Math.max(1, Math.min(5, data.rating)),
      title: data.title,
      comment: data.comment,
      wouldRecommend: data.wouldRecommend,
      helpfulCount: 0,
      unhelpfulCount: 0,
      verifiedPurchase: data.verifiedPurchase,
      promotionImpact: data.promotionImpact,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.storePromotionReview(review);

    return review;
  }

  /**
   * Get reviews for project promotion
   */
  async getPromotionReviews(
    projectId: string,
    promotionId: string,
    filters?: {
      minRating?: number;
      verifiedOnly?: boolean;
      promotionImpact?: 'positive' | 'negative' | 'neutral';
      skip?: number;
      take?: number;
    },
  ): Promise<{
    reviews: ProjectPromotionReview[];
    total: number;
  }> {
    let reviews = await this.getAllPromotionReviews(projectId, promotionId);

    // Apply filters
    if (filters?.minRating) {
      reviews = reviews.filter(r => r.rating >= filters.minRating!);
    }

    if (filters?.verifiedOnly) {
      reviews = reviews.filter(r => r.verifiedPurchase);
    }

    if (filters?.promotionImpact) {
      reviews = reviews.filter(r => r.promotionImpact === filters.promotionImpact);
    }

    const total = reviews.length;
    const skip = filters?.skip || 0;
    const take = filters?.take || 20;

    return {
      reviews: reviews.slice(skip, skip + take),
      total,
    };
  }

  /**
   * Get project review summary with promotion analytics
   */
  async getProjectReviewSummary(projectId: string): Promise<ProjectReviewSummary> {
    const allReviews = await this.getAllProjectReviews(projectId);

    if (allReviews.length === 0) {
      return {
        projectId,
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: {
          fiveStar: 0,
          fourStar: 0,
          threeStar: 0,
          twoStar: 0,
          oneStar: 0,
        },
        positivePromotionReviews: 0,
        negativePromotionReviews: 0,
        verifiedPurchaseCount: 0,
        recommendationRate: 0,
        topPositiveKeywords: [],
        topNegativeKeywords: [],
        averagePromotionImpact: 0,
      };
    }

    // Calculate rating distribution
    const ratingDistribution = {
      fiveStar: allReviews.filter(r => r.rating === 5).length,
      fourStar: allReviews.filter(r => r.rating === 4).length,
      threeStar: allReviews.filter(r => r.rating === 3).length,
      twoStar: allReviews.filter(r => r.rating === 2).length,
      oneStar: allReviews.filter(r => r.rating === 1).length,
    };

    // Calculate average rating
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allReviews.length;

    // Count promotion impact
    const positivePromotionReviews = allReviews.filter(
      r => r.promotionImpact === 'positive',
    ).length;
    const negativePromotionReviews = allReviews.filter(
      r => r.promotionImpact === 'negative',
    ).length;

    // Count verified purchases
    const verifiedPurchaseCount = allReviews.filter(r => r.verifiedPurchase).length;

    // Calculate recommendation rate
    const recommendationCount = allReviews.filter(r => r.wouldRecommend).length;
    const recommendationRate = (recommendationCount / allReviews.length) * 100;

    // Extract keywords from positive and negative reviews
    const positiveReviews = allReviews.filter(r => r.promotionImpact === 'positive');
    const negativeReviews = allReviews.filter(r => r.promotionImpact === 'negative');

    const topPositiveKeywords = this.extractKeywords(
      positiveReviews.map(r => r.comment).join(' '),
      5,
    );
    const topNegativeKeywords = this.extractKeywords(
      negativeReviews.map(r => r.comment).join(' '),
      5,
    );

    // Calculate average promotion impact score
    const impactScore = allReviews.reduce((sum, r) => {
      if (r.promotionImpact === 'positive') return sum + 1;
      if (r.promotionImpact === 'negative') return sum - 1;
      return sum;
    }, 0);
    const averagePromotionImpact = impactScore / allReviews.length;

    return {
      projectId,
      totalReviews: allReviews.length,
      averageRating: Math.round(averageRating * 100) / 100,
      ratingDistribution,
      positivePromotionReviews,
      negativePromotionReviews,
      verifiedPurchaseCount,
      recommendationRate: Math.round(recommendationRate * 100) / 100,
      topPositiveKeywords,
      topNegativeKeywords,
      averagePromotionImpact: Math.round(averagePromotionImpact * 100) / 100,
    };
  }

  /**
   * Mark review as helpful
   */
  async markReviewAsHelpful(reviewId: string): Promise<ProjectPromotionReview | null> {
    const review = await this.retrievePromotionReview(reviewId);

    if (!review) {
      return null;
    }

    const updated: ProjectPromotionReview = {
      ...review,
      helpfulCount: review.helpfulCount + 1,
      updatedAt: new Date(),
    };

    await this.storePromotionReview(updated);

    return updated;
  }

  /**
   * Mark review as unhelpful
   */
  async markReviewAsUnhelpful(reviewId: string): Promise<ProjectPromotionReview | null> {
    const review = await this.retrievePromotionReview(reviewId);

    if (!review) {
      return null;
    }

    const updated: ProjectPromotionReview = {
      ...review,
      unhelpfulCount: review.unhelpfulCount + 1,
      updatedAt: new Date(),
    };

    await this.storePromotionReview(updated);

    return updated;
  }

  /**
   * Get promotion effectiveness based on reviews
   */
  async getPromotionEffectiveness(
    projectId: string,
    promotionId: string,
  ): Promise<{
    effectivenessScore: number; // 0-100
    sentimentScore: number; // -100 to 100
    recommendationScore: number; // 0-100
    verificationScore: number; // 0-100
    overallScore: number; // 0-100
  }> {
    const { reviews } = await this.getPromotionReviews(projectId, promotionId);

    if (reviews.length === 0) {
      return {
        effectivenessScore: 0,
        sentimentScore: 0,
        recommendationScore: 0,
        verificationScore: 0,
        overallScore: 0,
      };
    }

    // Effectiveness based on average rating
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const effectivenessScore = (avgRating / 5) * 100;

    // Sentiment based on promotion impact
    const sentimentCount = reviews.reduce((sum, r) => {
      if (r.promotionImpact === 'positive') return sum + 1;
      if (r.promotionImpact === 'negative') return sum - 1;
      return sum;
    }, 0);
    const sentimentScore = (sentimentCount / reviews.length) * 100;

    // Recommendation score
    const recommendCount = reviews.filter(r => r.wouldRecommend).length;
    const recommendationScore = (recommendCount / reviews.length) * 100;

    // Verification score (trust factor)
    const verifiedCount = reviews.filter(r => r.verifiedPurchase).length;
    const verificationScore = (verifiedCount / reviews.length) * 100;

    // Overall score is weighted average
    const overallScore =
      effectivenessScore * 0.3 +
      sentimentScore * 0.3 +
      recommendationScore * 0.2 +
      verificationScore * 0.2;

    return {
      effectivenessScore: Math.round(effectivenessScore),
      sentimentScore: Math.round(sentimentScore),
      recommendationScore: Math.round(recommendationScore),
      verificationScore: Math.round(verificationScore),
      overallScore: Math.round(overallScore),
    };
  }

  /**
   * Get related promotions based on review sentiment
   */
  async getRelatedPromotionsByReviewSentiment(
    projectId: string,
    limit: number = 5,
  ): Promise<
    Array<{
      promotionId: string;
      sentimentScore: number;
      reviewCount: number;
    }>
  > {
    const promotions = await this.getProjectPromotions(projectId);
    const promotionScores: Array<{
      promotionId: string;
      sentimentScore: number;
      reviewCount: number;
    }> = [];

    for (const promo of promotions) {
      const effectiveness = await this.getPromotionEffectiveness(projectId, promo.promotionId);
      promotionScores.push({
        promotionId: promo.promotionId,
        sentimentScore: effectiveness.sentimentScore,
        reviewCount: promo.priority, // Using priority as proxy for popularity
      });
    }

    return promotionScores.sort((a, b) => b.sentimentScore - a.sentimentScore).slice(0, limit);
  }

  /**
   * Get promotion comparison based on reviews
   */
  async comparePromotionsByReviews(
    projectId: string,
    promotionIds: string[],
  ): Promise<
    Array<{
      promotionId: string;
      avgRating: number;
      reviewCount: number;
      positiveReviews: number;
      negativeReviews: number;
      recommendationRate: number;
    }>
  > {
    const comparison = [];

    for (const promotionId of promotionIds) {
      const { reviews } = await this.getPromotionReviews(projectId, promotionId);

      if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        const positiveCount = reviews.filter(r => r.promotionImpact === 'positive').length;
        const negativeCount = reviews.filter(r => r.promotionImpact === 'negative').length;
        const recommendCount = reviews.filter(r => r.wouldRecommend).length;
        const recommendationRate = (recommendCount / reviews.length) * 100;

        comparison.push({
          promotionId,
          avgRating: Math.round(avgRating * 100) / 100,
          reviewCount: reviews.length,
          positiveReviews: positiveCount,
          negativeReviews: negativeCount,
          recommendationRate: Math.round(recommendationRate * 100) / 100,
        });
      }
    }

    return comparison.sort((a, b) => b.avgRating - a.avgRating);
  }

  /**
   * Get trending promotions based on recent positive reviews
   */
  async getTrendingPromotions(
    projectId: string,
    daysBack: number = 30,
    limit: number = 10,
  ): Promise<
    Array<{
      promotionId: string;
      trendScore: number;
      recentPositiveReviews: number;
      momentum: number; // -1 to 1
    }>
  > {
    const promotions = await this.getProjectPromotions(projectId);
    const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

    const trends = [];

    for (const promo of promotions) {
      const { reviews } = await this.getPromotionReviews(projectId, promo.promotionId);

      const recentReviews = reviews.filter(r => new Date(r.createdAt) >= cutoffDate);
      const positiveRecent = recentReviews.filter(r => r.promotionImpact === 'positive').length;
      const negativeRecent = recentReviews.filter(r => r.promotionImpact === 'negative').length;

      if (recentReviews.length > 0) {
        const momentum = (positiveRecent - negativeRecent) / recentReviews.length;
        const trendScore = positiveRecent + momentum * 10;

        trends.push({
          promotionId: promo.promotionId,
          trendScore,
          recentPositiveReviews: positiveRecent,
          momentum,
        });
      }
    }

    return trends.sort((a, b) => b.trendScore - a.trendScore).slice(0, limit);
  }

  /**
   * Extract keywords from text (simple implementation)
   */
  private extractKeywords(text: string, limit: number = 5): string[] {
    const commonWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'from',
      'is',
      'are',
      'was',
      'were',
      'be',
      'been',
      'have',
      'has',
      'do',
      'does',
      'did',
      'will',
      'would',
      'could',
      'should',
    ]);

    const words = text
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3 && !commonWords.has(word));

    const wordFreq: Record<string, number> = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    return Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([word]) => word);
  }

  /**
   * Private helper methods
   */

  private async storeProjectPromotion(projectPromotion: ProjectPromotion): Promise<void> {
    // Store in database (placeholder)
    console.log(
      `Storing project promotion: ${projectPromotion.projectId} -> ${projectPromotion.promotionId}`,
    );
    // TODO: Implement actual storage when projects_promotions table is added
  }

  private async removeProjectPromotion(projectId: string, promotionId: string): Promise<boolean> {
    // Remove from database (placeholder)
    console.log(`Removing project promotion: ${projectId} -> ${promotionId}`);
    return true;
    // TODO: Implement actual removal
  }

  private async getAllProjectPromotions(projectId: string): Promise<ProjectPromotion[]> {
    // Get from database (placeholder)
    return [];
    // TODO: Implement actual retrieval
  }

  private async storePromotionReview(review: ProjectPromotionReview): Promise<void> {
    // Store in database (placeholder)
    console.log(`Storing review: ${review.reviewId}`);
    // TODO: Implement actual storage when promotion_reviews table is added
  }

  private async getAllProjectReviews(projectId: string): Promise<ProjectPromotionReview[]> {
    // Get from database (placeholder)
    return [];
    // TODO: Implement actual retrieval
  }

  private async getAllPromotionReviews(
    projectId: string,
    promotionId: string,
  ): Promise<ProjectPromotionReview[]> {
    // Get from database (placeholder)
    return [];
    // TODO: Implement actual retrieval
  }

  private async retrievePromotionReview(reviewId: string): Promise<ProjectPromotionReview | null> {
    // Get from database (placeholder)
    return null;
    // TODO: Implement actual retrieval
  }
}
