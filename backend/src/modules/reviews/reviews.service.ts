import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomUUID } from 'crypto';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { TelegramService } from '../notifications/telegram.service';
import { CacheService } from '../caching/cache.service';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService,
    private readonly cache: CacheService,
  ) {}

  private escapeHtml(text: string): string {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

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

    const [reviews, total] = await this.prisma.$transaction([
      this.prisma.product_reviews.findMany({
        where,
        skip,
        take: params.pageSize,
        include: {
          products: { select: { id: true, name: true } },
          users: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product_reviews.count({ where }),
    ]);

    const mappedReviews = reviews.map(review => ({
      ...review,
      images: review.images ? JSON.parse(review.images) : null,
    }));

    return {
      data: mappedReviews,
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
        products: { select: { id: true, name: true } },
        users: { select: { id: true, name: true } },
      },
    });
    if (!review) throw new NotFoundException('Review not found');

    return {
      ...review,
      images: review.images ? JSON.parse(review.images) : null,
    };
  }

  async create(dto: CreateReviewDto) {
    if (dto.rating < 1 || dto.rating > 5) throw new BadRequestException('Rating must be 1-5');

    const product = await this.prisma.products.findUnique({ where: { id: dto.productId } });
    if (!product || product.isDeleted) throw new NotFoundException('Product not found');

    if (dto.userId) {
      const existing = await this.prisma.product_reviews.findFirst({
        where: { userId: dto.userId, productId: dto.productId },
      });
      if (existing) throw new BadRequestException('Bạn đã đánh giá sản phẩm này rồi');
    }

    let isVerified = false;
    if (dto.userId) {
      const orderCount = await this.prisma.order_items.count({
        where: {
          productId: dto.productId,
          orders: { userId: dto.userId, status: 'COMPLETED' },
        },
      });
      isVerified = orderCount > 0;
    }

    const review = await this.prisma.product_reviews.create({
      data: {
        id: randomUUID(),
        userId: dto.userId,
        productId: dto.productId,
        rating: dto.rating,
        title: dto.title,
        comment: dto.comment,
        images: dto.images ? JSON.stringify(dto.images) : null,
        status: 'PENDING',
        isVerified,
      } as any,
    });

    try {
      const msg = `📢 <b>Đánh giá mới</b>: ${dto.rating}⭐ cho ${this.escapeHtml(
        product.name,
      )}\n💬 ${this.escapeHtml(dto.comment)}`;
      await this.telegram.sendMessage(msg);
    } catch {}

    return review;
  }

  async update(id: string, dto: UpdateReviewDto, isAdmin: boolean = false) {
    const review = await this.findById(id);

    const updateData: any = { ...dto };
    if (!isAdmin) {
      delete updateData.status;
    }

    if (dto.images) updateData.images = JSON.stringify(dto.images);

    const updatedReview = await this.prisma.product_reviews.update({
      where: { id },
      data: { ...updateData, updatedAt: new Date() },
    });

    if (updateData.status === 'APPROVED' || review.status === 'APPROVED') {
      await this.recalculateProductRating(review.productId);
    }

    return updatedReview;
  }

  async updateStatus(id: string, status: string) {
    return this.update(id, { status } as any, true);
  }

  async delete(id: string) {
    const review = await this.findById(id);
    await this.prisma.product_reviews.delete({ where: { id } });

    if (review.status === 'APPROVED') {
      await this.recalculateProductRating(review.productId);
    }
    return { success: true };
  }

  async markHelpful(id: string, helpful: boolean, _userId?: string) {
    const review = await this.findById(id);

    // Prevent helpfulCount from going negative
    const currentHelpful = (review as any).helpfulCount ?? 0;
    if (!helpful && currentHelpful <= 0) {
      return review;
    }

    return this.prisma.product_reviews.update({
      where: { id },
      data: {
        helpfulCount: helpful ? { increment: 1 } : { decrement: 1 },
      } as any,
    });
  }

  async getStats() {
    const stats = await this.prisma.product_reviews.groupBy({
      by: ['status'],
      _count: { id: true },
      _avg: { rating: true },
    });
    return stats;
  }

  private async recalculateProductRating(productId: string) {
    const agg = await this.prisma.product_reviews.aggregate({
      where: { productId, status: 'APPROVED' },
      _avg: { rating: true },
      _count: { id: true },
    });

    await this.prisma.products.update({
      where: { id: productId },
      data: {
        averageRating: agg._avg.rating || 0,
        reviewCount: agg._count.id || 0,
      } as any,
    });

    // Invalidate product cache
    await this.cache.del(`product:${productId}`);
    await this.cache.del(`product_detail:${productId}`);
    this.logger.log(`Invalidated cache for product ${productId} after rating update`);
  }
}
