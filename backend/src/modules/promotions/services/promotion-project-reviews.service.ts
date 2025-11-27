import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

export interface ProjectPromotionReview {
  id: string;
  projectId: string;
  promotionId: string;
  userId?: string;
  rating: number;
  title?: string;
  comment?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isVerified: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectPromotionReviewDto {
  projectId: string;
  promotionId: string;
  userId?: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateProjectPromotionReviewDto {
  rating?: number;
  title?: string;
  comment?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  isVerified?: boolean;
}

@Injectable()
export class PromotionProjectReviewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new project-promotion review
   */
  async createReview(data: CreateProjectPromotionReviewDto): Promise<ProjectPromotionReview> {
    try {
      // Validate rating
      if (data.rating < 1 || data.rating > 5) {
        throw new BadRequestException('Rating must be between 1 and 5');
      }

      // Verify project and promotion exist
      const [project, promotion] = await Promise.all([
        this.prisma.projects.findUnique({
          where: { id: data.projectId },
        }),
        this.prisma.promotions.findUnique({
          where: { id: data.promotionId },
        }),
      ]);

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (!promotion) {
        throw new NotFoundException('Promotion not found');
      }

      const review = await this.prisma.project_promotion_reviews.create({
        data: {
          id: uuidv4(),
          projectId: data.projectId,
          promotionId: data.promotionId,
          userId: data.userId,
          rating: data.rating,
          title: data.title,
          comment: data.comment,
          status: 'PENDING',
          isVerified: false,
          helpfulCount: 0,
        },
      });

      return this.formatReview(review);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create review: ${(error as any).message}`);
    }
  }

  /**
   * Get review by ID
   */
  async getReviewById(reviewId: string): Promise<ProjectPromotionReview | null> {
    try {
      const review = await this.prisma.project_promotion_reviews.findUnique({
        where: { id: reviewId },
      });

      if (!review) {
        return null;
      }

      return this.formatReview(review);
    } catch (error) {
      throw new BadRequestException(`Failed to get review: ${(error as any).message}`);
    }
  }

  /**
   * Get reviews for a project-promotion pair
   */
  async getReviewsForPromotion(
    projectId: string,
    promotionId: string,
    filters?: {
      status?: string;
      skip?: number;
      take?: number;
      orderBy?: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
    },
  ): Promise<{
    reviews: ProjectPromotionReview[];
    total: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
  }> {
    try {
      const skip = filters?.skip || 0;
      const take = filters?.take || 20;

      const whereCondition: any = {
        projectId,
        promotionId,
      };

      if (filters?.status) {
        whereCondition.status = filters.status;
      } else {
        // Default to showing only approved reviews to users
        whereCondition.status = 'APPROVED';
      }

      // Get total and reviews
      const [reviews, total] = await Promise.all([
        this.prisma.project_promotion_reviews.findMany({
          where: whereCondition,
          skip,
          take,
          include: { users: { select: { name: true, avatarUrl: true } } },
          orderBy: this.getOrderByClause(filters?.orderBy),
        }),
        this.prisma.project_promotion_reviews.count({
          where: whereCondition,
        }),
      ]);

      // Calculate statistics
      const allReviews = await this.prisma.project_promotion_reviews.findMany({
        where: {
          projectId,
          promotionId,
          status: 'APPROVED',
        },
        select: { rating: true },
      });

      const averageRating =
        allReviews.length > 0
          ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
          : 0;

      const ratingDistribution: Record<number, number> = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };

      allReviews.forEach(r => {
        ratingDistribution[r.rating]++;
      });

      return {
        reviews: reviews.map(r => this.formatReview(r)),
        total,
        averageRating: Math.round(averageRating * 100) / 100,
        ratingDistribution,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get reviews: ${(error as any).message}`);
    }
  }

  /**
   * Get all reviews for a project
   */
  async getProjectReviews(
    projectId: string,
    filters?: {
      skip?: number;
      take?: number;
      status?: string;
    },
  ): Promise<{
    reviews: ProjectPromotionReview[];
    total: number;
  }> {
    try {
      const skip = filters?.skip || 0;
      const take = filters?.take || 20;

      const whereCondition: any = { projectId };

      if (filters?.status) {
        whereCondition.status = filters.status;
      }

      const [reviews, total] = await Promise.all([
        this.prisma.project_promotion_reviews.findMany({
          where: whereCondition,
          skip,
          take,
          include: { users: { select: { name: true, avatarUrl: true } } },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.project_promotion_reviews.count({ where: whereCondition }),
      ]);

      return {
        reviews: reviews.map(r => this.formatReview(r)),
        total,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get project reviews: ${(error as any).message}`);
    }
  }

  /**
   * Update review
   */
  async updateReview(
    reviewId: string,
    updates: UpdateProjectPromotionReviewDto,
  ): Promise<ProjectPromotionReview | null> {
    try {
      const review = await this.prisma.project_promotion_reviews.findUnique({
        where: { id: reviewId },
      });

      if (!review) {
        throw new NotFoundException('Review not found');
      }

      if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
        throw new BadRequestException('Rating must be between 1 and 5');
      }

      const updated = await this.prisma.project_promotion_reviews.update({
        where: { id: reviewId },
        data: {
          rating: updates.rating,
          title: updates.title,
          comment: updates.comment,
          status: updates.status,
          isVerified: updates.isVerified,
        },
      });

      return this.formatReview(updated);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update review: ${(error as any).message}`);
    }
  }

  /**
   * Delete review
   */
  async deleteReview(reviewId: string): Promise<boolean> {
    try {
      const review = await this.prisma.project_promotion_reviews.findUnique({
        where: { id: reviewId },
      });

      if (!review) {
        throw new NotFoundException('Review not found');
      }

      await this.prisma.project_promotion_reviews.delete({
        where: { id: reviewId },
      });

      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete review: ${(error as any).message}`);
    }
  }

  /**
   * Approve review
   */
  async approveReview(reviewId: string): Promise<ProjectPromotionReview | null> {
    try {
      const review = await this.prisma.project_promotion_reviews.findUnique({
        where: { id: reviewId },
      });

      if (!review) {
        throw new NotFoundException('Review not found');
      }

      const updated = await this.prisma.project_promotion_reviews.update({
        where: { id: reviewId },
        data: { status: 'APPROVED' },
      });

      return this.formatReview(updated);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to approve review: ${(error as any).message}`);
    }
  }

  /**
   * Reject review
   */
  async rejectReview(reviewId: string): Promise<ProjectPromotionReview | null> {
    try {
      const review = await this.prisma.project_promotion_reviews.findUnique({
        where: { id: reviewId },
      });

      if (!review) {
        throw new NotFoundException('Review not found');
      }

      const updated = await this.prisma.project_promotion_reviews.update({
        where: { id: reviewId },
        data: { status: 'REJECTED' },
      });

      return this.formatReview(updated);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to reject review: ${(error as any).message}`);
    }
  }

  /**
   * Mark review as helpful
   */
  async markAsHelpful(reviewId: string): Promise<ProjectPromotionReview | null> {
    try {
      const review = await this.prisma.project_promotion_reviews.findUnique({
        where: { id: reviewId },
      });

      if (!review) {
        throw new NotFoundException('Review not found');
      }

      const updated = await this.prisma.project_promotion_reviews.update({
        where: { id: reviewId },
        data: {
          helpfulCount: {
            increment: 1,
          },
        },
      });

      return this.formatReview(updated);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to mark review as helpful: ${(error as any).message}`);
    }
  }

  /**
   * Get review summary for a project-promotion pair
   */
  async getReviewSummary(
    projectId: string,
    promotionId: string,
  ): Promise<{
    totalReviews: number;
    approvedReviews: number;
    pendingReviews: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
    helpfulnessScore: number;
  }> {
    try {
      const reviews = await this.prisma.project_promotion_reviews.findMany({
        where: {
          projectId,
          promotionId,
        },
        select: {
          rating: true,
          status: true,
          helpfulCount: true,
        },
      });

      const approved = reviews.filter(r => r.status === 'APPROVED');
      const pending = reviews.filter(r => r.status === 'PENDING');

      const averageRating =
        approved.length > 0 ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length : 0;

      const ratingDistribution: Record<number, number> = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };

      approved.forEach(r => {
        ratingDistribution[r.rating]++;
      });

      const totalHelpful = reviews.reduce((sum, r) => sum + r.helpfulCount, 0);
      const helpfulnessScore =
        reviews.length > 0 ? Math.round((totalHelpful / (reviews.length * 10)) * 100) : 0;

      return {
        totalReviews: reviews.length,
        approvedReviews: approved.length,
        pendingReviews: pending.length,
        averageRating: Math.round(averageRating * 100) / 100,
        ratingDistribution,
        helpfulnessScore: Math.min(helpfulnessScore, 100),
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get review summary: ${(error as any).message}`);
    }
  }

  /**
   * Get pending reviews for admin approval
   */
  async getPendingReviews(filters?: {
    projectId?: string;
    promotionId?: string;
    skip?: number;
    take?: number;
  }): Promise<{
    reviews: ProjectPromotionReview[];
    total: number;
  }> {
    try {
      const skip = filters?.skip || 0;
      const take = filters?.take || 20;

      const whereCondition: any = {
        status: 'PENDING',
      };

      if (filters?.projectId) {
        whereCondition.projectId = filters.projectId;
      }

      if (filters?.promotionId) {
        whereCondition.promotionId = filters.promotionId;
      }

      const [reviews, total] = await Promise.all([
        this.prisma.project_promotion_reviews.findMany({
          where: whereCondition,
          skip,
          take,
          include: { users: { select: { name: true, email: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' },
        }),
        this.prisma.project_promotion_reviews.count({
          where: whereCondition,
        }),
      ]);

      return {
        reviews: reviews.map(r => this.formatReview(r)),
        total,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get pending reviews: ${(error as any).message}`);
    }
  }

  /**
   * Verify review (mark as verified purchase)
   */
  async verifyReview(reviewId: string): Promise<ProjectPromotionReview | null> {
    try {
      const review = await this.prisma.project_promotion_reviews.findUnique({
        where: { id: reviewId },
      });

      if (!review) {
        throw new NotFoundException('Review not found');
      }

      const updated = await this.prisma.project_promotion_reviews.update({
        where: { id: reviewId },
        data: { isVerified: true },
      });

      return this.formatReview(updated);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to verify review: ${(error as any).message}`);
    }
  }

  /**
   * Get user reviews
   */
  async getUserReviews(
    userId: string,
    filters?: {
      skip?: number;
      take?: number;
    },
  ): Promise<{
    reviews: ProjectPromotionReview[];
    total: number;
  }> {
    try {
      const skip = filters?.skip || 0;
      const take = filters?.take || 20;

      const [reviews, total] = await Promise.all([
        this.prisma.project_promotion_reviews.findMany({
          where: { userId },
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: { projects: { select: { name: true } }, promotions: { select: { name: true } } },
        }),
        this.prisma.project_promotion_reviews.count({ where: { userId } }),
      ]);

      return {
        reviews: reviews.map(r => this.formatReview(r)),
        total,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get user reviews: ${(error as any).message}`);
    }
  }

  /**
   * Bulk approve reviews
   */
  async bulkApproveReviews(reviewIds: string[]): Promise<number> {
    try {
      const result = await this.prisma.project_promotion_reviews.updateMany({
        where: {
          id: { in: reviewIds },
        },
        data: {
          status: 'APPROVED',
        },
      });

      return result.count;
    } catch (error) {
      throw new BadRequestException(`Failed to bulk approve reviews: ${(error as any).message}`);
    }
  }

  /**
   * Bulk reject reviews
   */
  async bulkRejectReviews(reviewIds: string[]): Promise<number> {
    try {
      const result = await this.prisma.project_promotion_reviews.updateMany({
        where: {
          id: { in: reviewIds },
        },
        data: {
          status: 'REJECTED',
        },
      });

      return result.count;
    } catch (error) {
      throw new BadRequestException(`Failed to bulk reject reviews: ${(error as any).message}`);
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private formatReview(review: any): ProjectPromotionReview {
    return {
      id: review.id,
      projectId: review.projectId,
      promotionId: review.promotionId,
      userId: review.userId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      status: review.status,
      isVerified: review.isVerified,
      helpfulCount: review.helpfulCount,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  private getOrderByClause(orderBy?: string): any {
    switch (orderBy) {
      case 'oldest':
        return { createdAt: 'asc' };
      case 'highest':
        return { rating: 'desc' };
      case 'lowest':
        return { rating: 'asc' };
      case 'helpful':
        return { helpfulCount: 'desc' };
      case 'newest':
      default:
        return { createdAt: 'desc' };
    }
  }
}
