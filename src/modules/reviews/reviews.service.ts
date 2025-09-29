import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

interface ReviewQuery {
  status?: string;
  rating?: number;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async getReviews(query: ReviewQuery) {
    const {
      status = 'all',
      rating,
      search,
      page = 1,
      limit = 20,
    } = query;

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Math.min(Number(limit) || 20, 100));
    const skip = (pageNumber - 1) * pageSize;

    const where: any = {};

    if (status && status.toLowerCase() !== 'all') {
      const normalizedStatus = status.toUpperCase() as keyof typeof ReviewStatus;
      if (!ReviewStatus[normalizedStatus]) {
        throw new BadRequestException('Invalid review status filter');
      }
      where.status = ReviewStatus[normalizedStatus];
    }

    if (typeof rating !== 'undefined' && rating !== null) {
      const ratingNumber = Number(rating);
      if (Number.isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
        throw new BadRequestException('Invalid rating filter');
      }
      where.rating = ratingNumber;
    }

    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { comment: { contains: term, mode: 'insensitive' } },
        { title: { contains: term, mode: 'insensitive' } },
        { users: { name: { contains: term, mode: 'insensitive' } } },
        { products: { name: { contains: term, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.product_reviews.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          products: {
            select: {
              id: true,
              name: true,
            },
          },
          product_review_reports: true,
        },
      }),
      this.prisma.product_reviews.count({ where }),
    ]);

    const stats = await this.buildStats();

    const reviews = items.map((review) => ({
      id: review.id,
      userId: review.userId,
      userName: review.users?.name || review.users?.email || 'Người dùng',
      productId: review.productId,
      productName: review.products?.name,
      serviceId: null,
      serviceName: null,
      rating: review.rating,
      comment: review.comment ?? '',
      images: this.parseImages(review.images),
      status: review.status.toLowerCase(),
      response: review.response ?? null,
      helpfulCount: review.upvotes ?? 0,
      reportCount: review.downvotes ?? review.product_review_reports.length ?? 0,
      isVerified: review.isVerified,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    }));

    return {
      reviews,
      stats,
      meta: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: total > 0 ? Math.ceil(total / pageSize) : 1,
      },
    };
  }

  async approveReview(id: string) {
    await this.getReviewOrFail(id);
    return this.prisma.product_reviews.update({
      where: { id },
      data: { status: ReviewStatus.APPROVED },
    });
  }

  async rejectReview(id: string, reason?: string) {
    await this.getReviewOrFail(id);
    const trimmedReason = reason?.trim();
    return this.prisma.product_reviews.update({
      where: { id },
      data: {
        status: ReviewStatus.REJECTED,
        response: trimmedReason || null,
      },
    });
  }

  async respondToReview(id: string, response: string) {
    if (!response || !response.trim()) {
      throw new BadRequestException('Response message is required');
    }

    await this.getReviewOrFail(id);
    return this.prisma.product_reviews.update({
      where: { id },
      data: {
        response: response.trim(),
        status: ReviewStatus.APPROVED,
      },
    });
  }

  async deleteReview(id: string) {
    await this.getReviewOrFail(id);
    await this.prisma.product_reviews.delete({ where: { id } });
    return { message: 'Review deleted successfully' };
  }

  async markHelpful(id: string) {
    await this.getReviewOrFail(id);
    return this.prisma.product_reviews.update({
      where: { id },
      data: {
        upvotes: { increment: 1 },
      },
    });
  }

  async reportReview(id: string, reason?: string) {
    await this.getReviewOrFail(id);
    const moderatorId = await this.resolveModeratorUserId();
    const message = reason?.trim() || 'Reported by moderator';

    await this.prisma.product_review_reports.create({
      data: {
        reviewId: id,
        userId: moderatorId,
        reason: message.length > 250 ? message.slice(0, 250) : message,
      },
    });

    return this.prisma.product_reviews.update({
      where: { id },
      data: {
        downvotes: { increment: 1 },
      },
    });
  }

  async createReview(userId: string, dto: CreateReviewDto) {
    const { productId, rating, title, comment, images } = dto;

    // Check if product exists
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
      select: { id: true, name: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Get user info
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    // Check if user already reviewed this product
    const existingReview = await this.prisma.product_reviews.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this product');
    }

    // Create the review
    const review = await this.prisma.product_reviews.create({
      data: {
        userId,
        productId,
        rating,
        title: title?.trim() || null,
        comment: comment?.trim() || null,
        images: images || null,
        status: ReviewStatus.PENDING, // Chờ phê duyệt
      },
    });

    return {
      id: review.id,
      userId: review.userId,
      userName: user?.name || user?.email || 'Người dùng',
      productId: review.productId,
      productName: product.name,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      images: this.parseImages(review.images),
      status: review.status.toLowerCase(),
      isVerified: review.isVerified,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    };
  }

  private async resolveModeratorUserId() {
    const moderator = await this.prisma.users.findFirst({
      where: {
        role: {
          in: ['SUPER_ADMIN', 'ADMIN'],
        },
      },
      orderBy: { createdAt: 'asc' },
      select: { id: true },
    });

    if (!moderator) {
      throw new BadRequestException('No moderator user found to complete the action');
    }

    return moderator.id;
  }

  private async getReviewOrFail(id: string) {
    const review = await this.prisma.product_reviews.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  private parseImages(images?: string | null): string[] {
    if (!images) {
      return [];
    }

    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        return parsed.filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
      }
    } catch {
      // Fallback to comma separated values
      return images
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
    }

    return [];
  }

  private async buildStats() {
    const [
      totals,
      pending,
      approved,
      rejected,
      responded,
      average,
      distribution,
    ] = await Promise.all([
      this.prisma.product_reviews.count(),
      this.prisma.product_reviews.count({ where: { status: ReviewStatus.PENDING } }),
      this.prisma.product_reviews.count({ where: { status: ReviewStatus.APPROVED } }),
      this.prisma.product_reviews.count({ where: { status: ReviewStatus.REJECTED } }),
      this.prisma.product_reviews.count({ where: { NOT: { response: null } } }),
      this.prisma.product_reviews.aggregate({ _avg: { rating: true } }),
      this.prisma.product_reviews.groupBy({
        by: ['rating'],
        _count: { rating: true },
      }),
    ]);

    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    } satisfies Record<1 | 2 | 3 | 4 | 5, number>;

    distribution.forEach((item) => {
      if (item.rating >= 1 && item.rating <= 5) {
        const key = item.rating as 1 | 2 | 3 | 4 | 5;
        ratingDistribution[key] = item._count.rating;
      }
    });

    const responseRate = totals > 0 ? Math.round((responded / totals) * 100) : 0;

    return {
      totalReviews: totals,
      averageRating: average._avg.rating ? Number(average._avg.rating.toFixed(2)) : 0,
      pendingReviews: pending,
      approvedReviews: approved,
      rejectedReviews: rejected,
      responseRate,
      ratingDistribution,
    };
  }
}
