import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomUUID } from 'crypto';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { TelegramService } from '../notifications/telegram.service';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService,
  ) {}

  async findAll(params: {
    page: number;
    pageSize: number;
    productId?: string;
    rating?: number;
    status?: string;
  }) {
    const skip = (params.page - 1) * params.pageSize;

    const where: any = {};
    if (params.productId) where.productId = params.productId;
    if (params.rating) where.rating = params.rating;
    if (params.status) where.status = params.status;

    const [reviews, total] = await Promise.all([
      this.prisma.product_reviews.findMany({
        where,
        skip,
        take: params.pageSize,
        include: {
          products: {
            select: {
              id: true,
              name: true,
            },
          },
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product_reviews.count({ where }),
    ]);

    return {
      data: reviews,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize),
    };
  }

  async findById(id: string) {
    const review = await this.prisma.product_reviews.findUnique({
      where: { id },
      include: {
        products: {
          select: {
            id: true,
            name: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async create(createReviewDto: CreateReviewDto) {
    // Validate productId
    if (!createReviewDto.productId) {
      throw new BadRequestException('productId is required');
    }

    // Validate rating
    if (createReviewDto.rating < 1 || createReviewDto.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const review = await this.prisma.product_reviews.create({
      data: {
        id: randomUUID(),
        userId: createReviewDto.userId,
        productId: createReviewDto.productId,
        rating: createReviewDto.rating,
        title: createReviewDto.title,
        comment: createReviewDto.comment,
        images: createReviewDto.images,
        status: 'PENDING',
        isVerified: false,
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(`Review created: ${review.id}`);

    // Send Telegram notification
    try {
      // Fetch product name for notification
      const product = await this.prisma.products.findUnique({
        where: { id: createReviewDto.productId },
        select: { name: true },
      });

      await this.telegram.sendNewReviewNotification({
        id: review.id,
        productName: product?.name,
        userName: review.users?.name,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      });
    } catch (error) {
      this.logger.error('Failed to send review notification:', error);
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.findById(id);

    if (updateReviewDto.rating && (updateReviewDto.rating < 1 || updateReviewDto.rating > 5)) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const updated = await this.prisma.product_reviews.update({
      where: { id },
      data: {
        title: updateReviewDto.title ?? review.title,
        comment: updateReviewDto.comment ?? review.comment,
        rating: updateReviewDto.rating ?? review.rating,
        response: updateReviewDto.response ?? review.response,
        updatedAt: new Date(),
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(`Review updated: ${id}`);
    return updated;
  }

  async updateStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') {
    const review = await this.findById(id);

    const updated = await this.prisma.product_reviews.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(`Review status updated: ${id} -> ${status}`);
    return updated;
  }

  async delete(id: string) {
    await this.findById(id);

    await this.prisma.product_reviews.delete({
      where: { id },
    });

    this.logger.log(`Review deleted: ${id}`);
    return { message: 'Review deleted successfully' };
  }

  async getStats() {
    const [total, approved, pending, rejected, avgRating] = await Promise.all([
      this.prisma.product_reviews.count(),
      this.prisma.product_reviews.count({ where: { status: 'APPROVED' } }),
      this.prisma.product_reviews.count({ where: { status: 'PENDING' } }),
      this.prisma.product_reviews.count({ where: { status: 'REJECTED' } }),
      this.prisma.product_reviews.aggregate({
        _avg: { rating: true },
      }),
    ]);

    return {
      total,
      approved,
      pending,
      rejected,
      averageRating: avgRating._avg.rating || 0,
    };
  }

  async markHelpful(id: string, isHelpful: boolean) {
    const review = await this.findById(id);

    const updated = await this.prisma.product_reviews.update({
      where: { id },
      data: {
        upvotes: isHelpful ? review.upvotes + 1 : review.upvotes,
        downvotes: !isHelpful ? review.downvotes + 1 : review.downvotes,
        updatedAt: new Date(),
      },
    });

    return updated;
  }
}
