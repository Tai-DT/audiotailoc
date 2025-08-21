import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { ProductReview as ProductReviewModel, ProductReviewVote, ProductReviewReport } from '@prisma/client';

export interface ProductReview {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  reported: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  product?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedReviews: number;
  recentReviews: ProductReview[];
}

export interface CreateReviewDto {
  productId: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
}

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService
  ) {}

  async createReview(userId: string, data: CreateReviewDto): Promise<ProductReview> {
    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if user has already reviewed this product
    const existingReview = await this.prisma.productReview.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: data.productId,
        },
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this product');
    }

    // Check if user has purchased this product (for verified reviews)
    const hasPurchased = await this.prisma.orderItem.findFirst({
      where: {
        productId: data.productId,
        order: {
          userId,
          status: { in: ['COMPLETED', 'DELIVERED'] },
        },
      },
    });

    // Create review
    const review = await this.prisma.productReview.create({
      data: {
        userId,
        productId: data.productId,
        rating: data.rating,
        title: data.title,
        content: data.content,
        images: data.images || [],
        verified: !!hasPurchased,
        status: 'PENDING', // Reviews need approval
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    // Clear cache
    await this.clearProductReviewsCache(data.productId);

    return this.mapReview(review as any);
  }

  async updateReview(userId: string, reviewId: string, data: Partial<CreateReviewDto>): Promise<ProductReview> {
    const review = await this.prisma.productReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new BadRequestException('You can only update your own reviews');
    }

    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const updatedReview = await this.prisma.productReview.update({
      where: { id: reviewId },
      data: {
        rating: data.rating,
        title: data.title,
        content: data.content,
        images: data.images,
        status: 'PENDING', // Reset to pending after update
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    // Clear cache
    await this.clearProductReviewsCache(review.productId);

    return this.mapReview(updatedReview as any);
  }

  async deleteReview(userId: string, reviewId: string): Promise<void> {
    const review = await this.prisma.productReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new BadRequestException('You can only delete your own reviews');
    }

    await this.prisma.productReview.delete({
      where: { id: reviewId },
    });

    // Clear cache
    await this.clearProductReviewsCache(review.productId);
  }

  async getProductReviews(
    productId: string,
    options: {
      page?: number;
      pageSize?: number;
      rating?: number;
      verified?: boolean;
      sortBy?: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful';
    } = {}
  ): Promise<{
    reviews: ProductReview[];
    pagination: {
      page: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  }> {
    const {
      page = 1,
      pageSize = 10,
      rating,
      verified,
      sortBy = 'newest',
    } = options;

    const cacheKey = `product_reviews:${productId}:${JSON.stringify(options)}`;
    const cached = await this.cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const where: any = {
      productId,
      status: 'APPROVED',
    };

    if (rating) {
      where.rating = rating;
    }

    if (verified !== undefined) {
      where.verified = verified;
    }

    // Build order by clause
    let orderBy: any = { createdAt: 'desc' };
    switch (sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'rating_high':
        orderBy = { rating: 'desc' };
        break;
      case 'rating_low':
        orderBy = { rating: 'asc' };
        break;
      case 'helpful':
        orderBy = { upvotes: 'desc' };
        break;
    }

    const [reviews, totalItems] = await Promise.all([
      this.prisma.productReview.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.productReview.count({ where }),
    ]);

    const result = {
      reviews: reviews.map(review => this.mapReview(review as any)),
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    };

    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, result, { ttl: 300 });

    return result;
  }

  async getReviewStats(productId: string): Promise<ReviewStats> {
    const cacheKey = `review_stats:${productId}`;
    const cached = await this.cacheService.get<ReviewStats>(cacheKey);
    if (cached) return cached;

    const reviews = await this.prisma.productReview.findMany({
      where: {
        productId,
        status: 'APPROVED',
      },
      select: {
        rating: true,
        verified: true,
        createdAt: true,
      },
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / totalReviews
      : 0;

    const ratingDistribution = {
      1: reviews.filter((r: { rating: number }) => r.rating === 1).length,
      2: reviews.filter((r: { rating: number }) => r.rating === 2).length,
      3: reviews.filter((r: { rating: number }) => r.rating === 3).length,
      4: reviews.filter((r: { rating: number }) => r.rating === 4).length,
      5: reviews.filter((r: { rating: number }) => r.rating === 5).length,
    };

    const verifiedReviews = reviews.filter((r: { verified: boolean }) => r.verified).length;

    // Get recent reviews
    const recentReviewsData = await this.prisma.productReview.findMany({
      where: {
        productId,
        status: 'APPROVED',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const recentReviews = recentReviewsData.map(review => this.mapReview(review as any));

    const stats: ReviewStats = {
      totalReviews,
      averageRating,
      ratingDistribution,
      verifiedReviews,
      recentReviews,
    };

    // Cache for 10 minutes
    await this.cacheService.set(cacheKey, stats, { ttl: 600 });

    return stats;
  }

  async getUserReviews(userId: string): Promise<ProductReview[]> {
    const reviews = await this.prisma.productReview.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map(review => this.mapReview(review as any));
  }

  async markReviewHelpful(userId: string, reviewId: string): Promise<void> {
    // Check if user has already marked this review as helpful
    const existingVote = await this.prisma.productReviewVote.findUnique({
      where: {
        reviewId_userId: {
          userId,
          reviewId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.isUpvote) {
        // Remove helpful vote
        await this.prisma.productReviewVote.delete({
          where: { id: existingVote.id },
        });
        await this.prisma.productReview.update({
          where: { id: reviewId },
          data: { upvotes: { decrement: 1 } },
        });
      } else {
        // Change from report to helpful
        await this.prisma.productReviewVote.update({
          where: { id: existingVote.id },
          data: { isUpvote: true },
        });
        await this.prisma.productReview.update({
          where: { id: reviewId },
          data: {
            upvotes: { increment: 1 },
            downvotes: { decrement: 1 },
          },
        });
      }
    } else {
      // Add new helpful vote
      await this.prisma.productReviewVote.create({
        data: {
          userId,
          reviewId,
          isUpvote: true,
        },
      });
      await this.prisma.productReview.update({
        where: { id: reviewId },
        data: { upvotes: { increment: 1 } },
      });
    }
  }

  async reportReview(userId: string, reviewId: string, reason: string): Promise<void> {
    // Check if user has already voted on this review
    const existingVote = await this.prisma.productReviewVote.findUnique({
      where: {
        reviewId_userId: {
          userId,
          reviewId,
        },
      },
    });

    if (existingVote) {
      if (!existingVote.isUpvote) {
        return; // Already reported
      } else {
        // Change from helpful to report
        await this.prisma.productReviewVote.update({
          where: { id: existingVote.id },
          data: { isUpvote: false },
        });
        await this.prisma.productReview.update({
          where: { id: reviewId },
          data: {
            upvotes: { decrement: 1 },
            downvotes: { increment: 1 },
          },
        });
      }
    } else {
      // Add new report
      await this.prisma.productReviewVote.create({
        data: {
          userId,
          reviewId,
          isUpvote: false,
        },
      });
      await this.prisma.productReview.update({
        where: { id: reviewId },
        data: { downvotes: { increment: 1 } },
      });
    }

    // Log the report for admin review
    await this.prisma.productReviewReport.create({
      data: {
        reviewId,
        userId,
        reason,
      },
    });
  }

  // Admin methods
  async approveReview(reviewId: string): Promise<void> {
    const review = await this.prisma.productReview.update({
      where: { id: reviewId },
      data: { status: 'APPROVED' },
    });

    await this.clearProductReviewsCache(review.productId);
  }

  async rejectReview(reviewId: string): Promise<void> {
    const review = await this.prisma.productReview.update({
      where: { id: reviewId },
      data: { status: 'REJECTED' },
    });

    await this.clearProductReviewsCache(review.productId);
  }

  private mapReview(review: any): ProductReview {
    return {
      id: review.id,
      userId: review.userId,
      productId: review.productId,
      rating: review.rating,
      title: review.title,
      content: review.content,
      images: review.images || [],
      verified: review.verified,
      helpful: review.upvotes || 0,
      reported: review.downvotes || 0,
      status: review.status,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user: review.user,
      product: review.product,
    };
  }

  private async clearProductReviewsCache(productId: string): Promise<void> {
    // Clear all review-related cache for this product
    const patterns = [
      `product_reviews:${productId}:*`,
      `review_stats:${productId}`,
    ];

    for (const pattern of patterns) {
      await this.cacheService.flush(pattern);
    }
  }
}
