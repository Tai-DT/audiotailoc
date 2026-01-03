import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomUUID } from 'crypto';
import {
  CreateServiceReviewDto,
  UpdateServiceReviewDto,
  ServiceReviewQueryDto,
} from './dto/service-review.dto';
import { TelegramService } from '../notifications/telegram.service';

@Injectable()
export class ServiceReviewsService {
  private readonly logger = new Logger(ServiceReviewsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService,
  ) {}

  async findAll(params: ServiceReviewQueryDto) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (params.serviceId) where.serviceId = params.serviceId;
    if (params.rating) where.rating = params.rating;
    if (params.status) where.status = params.status;

    const [reviews, total] = await Promise.all([
      this.prisma.service_reviews.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          services: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.service_reviews.count({ where }),
    ]);

    return {
      items: reviews,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findById(id: string) {
    const review = await this.prisma.service_reviews.findUnique({
      where: { id },
      include: {
        services: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Service review not found');
    }

    return review;
  }

  async findByServiceId(serviceId: string, params?: { page?: number; pageSize?: number }) {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const where = {
      serviceId,
      status: 'APPROVED' as const,
    };

    const [reviews, total, stats] = await Promise.all([
      this.prisma.service_reviews.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          users: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.service_reviews.count({ where }),
      this.prisma.service_reviews.aggregate({
        where: { serviceId, status: 'APPROVED' },
        _avg: { rating: true },
        _count: { id: true },
      }),
    ]);

    // Calculate rating distribution
    const ratingDistribution = await this.prisma.service_reviews.groupBy({
      by: ['rating'],
      where: { serviceId, status: 'APPROVED' },
      _count: { rating: true },
    });

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingDistribution.forEach(item => {
      distribution[item.rating] = item._count.rating;
    });

    return {
      items: reviews,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      stats: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count.id,
        distribution,
      },
    };
  }

  async create(createReviewDto: CreateServiceReviewDto) {
    // Validate serviceId
    if (!createReviewDto.serviceId) {
      throw new BadRequestException('serviceId is required');
    }

    // Validate rating
    if (createReviewDto.rating < 1 || createReviewDto.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Check if service exists
    const service = await this.prisma.services.findUnique({
      where: { id: createReviewDto.serviceId },
      select: { id: true, name: true },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Check if user has a completed booking for verification
    let isVerified = false;
    if (createReviewDto.bookingId) {
      const booking = await this.prisma.service_bookings.findFirst({
        where: {
          id: createReviewDto.bookingId,
          userId: createReviewDto.userId,
          serviceId: createReviewDto.serviceId,
          status: 'COMPLETED',
        },
      });
      isVerified = !!booking;
    } else {
      // Check if user has any completed booking for this service
      const hasBooking = await this.prisma.service_bookings.findFirst({
        where: {
          userId: createReviewDto.userId,
          serviceId: createReviewDto.serviceId,
          status: 'COMPLETED',
        },
      });
      isVerified = !!hasBooking;
    }

    const review = await this.prisma.service_reviews.create({
      data: {
        id: randomUUID(),
        userId: createReviewDto.userId,
        serviceId: createReviewDto.serviceId,
        bookingId: createReviewDto.bookingId,
        rating: createReviewDto.rating,
        title: createReviewDto.title,
        comment: createReviewDto.comment,
        images: createReviewDto.images ? JSON.stringify(createReviewDto.images) : null,
        status: 'PENDING',
        isVerified,
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        services: {
          select: {
            id: true,
            name: true,
            slug: true,
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

    this.logger.log(`Service review created: ${review.id} for service: ${service.name}`);

    // Send Telegram notification
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: createReviewDto.userId },
        select: { name: true },
      });

      await this.telegram.sendNewReviewNotification({
        id: review.id,
        productName: `[Dịch vụ] ${service.name}`,
        userName: user?.name,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      });
    } catch (error) {
      this.logger.error('Failed to send service review notification:', error);
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateServiceReviewDto) {
    const review = await this.findById(id);

    if (updateReviewDto.rating && (updateReviewDto.rating < 1 || updateReviewDto.rating > 5)) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const updated = await this.prisma.service_reviews.update({
      where: { id },
      data: {
        title: updateReviewDto.title ?? review.title,
        comment: updateReviewDto.comment ?? review.comment,
        rating: updateReviewDto.rating ?? review.rating,
        response: updateReviewDto.response ?? review.response,
        updatedAt: new Date(),
      },
      include: {
        services: {
          select: {
            id: true,
            name: true,
            slug: true,
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

    this.logger.log(`Service review updated: ${id}`);
    return updated;
  }

  async updateStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') {
    await this.findById(id);

    const updated = await this.prisma.service_reviews.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        services: {
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

    this.logger.log(`Service review status updated: ${id} -> ${status}`);
    return updated;
  }

  async delete(id: string) {
    await this.findById(id);

    await this.prisma.service_reviews.delete({
      where: { id },
    });

    this.logger.log(`Service review deleted: ${id}`);
    return { message: 'Service review deleted successfully' };
  }

  async getStats() {
    const [total, approved, pending, rejected, avgRating] = await Promise.all([
      this.prisma.service_reviews.count(),
      this.prisma.service_reviews.count({ where: { status: 'APPROVED' } }),
      this.prisma.service_reviews.count({ where: { status: 'PENDING' } }),
      this.prisma.service_reviews.count({ where: { status: 'REJECTED' } }),
      this.prisma.service_reviews.aggregate({
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

    const updated = await this.prisma.service_reviews.update({
      where: { id },
      data: {
        upvotes: isHelpful ? review.upvotes + 1 : review.upvotes,
        downvotes: !isHelpful ? review.downvotes + 1 : review.downvotes,
        updatedAt: new Date(),
      },
    });

    return updated;
  }

  async getServiceAverageRating(serviceId: string) {
    const stats = await this.prisma.service_reviews.aggregate({
      where: { serviceId, status: 'APPROVED' },
      _avg: { rating: true },
      _count: { id: true },
    });

    return {
      serviceId,
      averageRating: stats._avg.rating || 0,
      totalReviews: stats._count.id,
    };
  }
}
