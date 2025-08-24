import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface SearchQueryData {
  query: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
  timestamp?: Date;
  resultCount?: number;
  clickedResults?: string[];
  searchDuration?: number;
}

export interface QuestionData {
  question: string;
  userId?: string;
  sessionId?: string;
  category?: string;
  timestamp?: Date;
  source?: 'chat' | 'contact' | 'faq' | 'support';
  status?: 'answered' | 'pending' | 'escalated';
  satisfaction?: number;
}

export interface ProductViewData {
  productId: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
  timestamp?: Date;
  duration?: number;
  source?: 'search' | 'category' | 'recommendation' | 'direct';
  referrer?: string;
}

export interface ServiceViewData {
  serviceId: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
  timestamp?: Date;
  duration?: number;
  source?: 'search' | 'category' | 'recommendation' | 'direct';
  referrer?: string;
}

@Injectable()
export class DataCollectionService {
  private readonly logger = new Logger(DataCollectionService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Search Query Tracking
  async trackSearchQuery(data: SearchQueryData) {
    try {
      const searchQuery = await this.prisma.searchQuery.create({
        data: {
          query: data.query,
          userId: data.userId,
          sessionId: data.sessionId,
          userAgent: data.userAgent,
          ipAddress: data.ipAddress,
          timestamp: data.timestamp || new Date(),
          resultCount: data.resultCount,
          clickedResults: data.clickedResults,
          searchDuration: data.searchDuration,
        },
      });

      this.logger.log(`Search query tracked: ${data.query}`);
      return searchQuery;
    } catch (error) {
      this.logger.error(`Failed to track search query: ${(error as Error).message}`);
      throw error;
    }
  }

  // Question Tracking
  async trackQuestion(data: QuestionData) {
    try {
      const question = await this.prisma.customerQuestion.create({
        data: {
          question: data.question,
          userId: data.userId,
          sessionId: data.sessionId,
          category: data.category,
          timestamp: data.timestamp || new Date(),
          source: data.source,
          status: data.status || 'pending',
          satisfaction: data.satisfaction,
        },
      });

      this.logger.log(`Question tracked: ${data.question.substring(0, 50)}...`);
      return question;
    } catch (error) {
      this.logger.error(`Failed to track question: ${(error as Error).message}`);
      throw error;
    }
  }

  // Product View Tracking
  async trackProductView(data: ProductViewData) {
    try {
      const productView = await this.prisma.productView.create({
        data: {
          productId: data.productId,
          userId: data.userId,
          sessionId: data.sessionId,
          userAgent: data.userAgent,
          ipAddress: data.ipAddress,
          timestamp: data.timestamp || new Date(),
          duration: data.duration,
          source: data.source,
          referrer: data.referrer,
        },
      });

      this.logger.log(`Product view tracked: ${data.productId}`);
      return productView;
    } catch (error) {
      this.logger.error(`Failed to track product view: ${(error as Error).message}`);
      throw error;
    }
  }

  // Service View Tracking
  async trackServiceView(data: ServiceViewData) {
    try {
      const serviceView = await this.prisma.serviceView.create({
        data: {
          serviceId: data.serviceId,
          userId: data.userId,
          sessionId: data.sessionId,
          userAgent: data.userAgent,
          ipAddress: data.ipAddress,
          timestamp: data.timestamp || new Date(),
          duration: data.duration,
          source: data.source,
          referrer: data.referrer,
        },
      });

      this.logger.log(`Service view tracked: ${data.serviceId}`);
      return serviceView;
    } catch (error) {
      this.logger.error(`Failed to track service view: ${(error as Error).message}`);
      throw error;
    }
  }

  // Get Search Analytics
  async getSearchAnalytics(startDate?: Date, endDate?: Date) {
    const where = {
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    };

    const [totalSearches, uniqueQueries, popularQueries, searchTrends] = await Promise.all([
      this.prisma.searchQuery.count({ where }),
      this.prisma.searchQuery.groupBy({
        by: ['query'],
        where,
        _count: { query: true },
        orderBy: { _count: { query: 'desc' } },
        take: 10,
      }),
      this.prisma.searchQuery.groupBy({
        by: ['query'],
        where,
        _count: { query: true },
        orderBy: { _count: { query: 'desc' } },
        take: 20,
      }),
      this.prisma.searchQuery.groupBy({
        by: ['timestamp'],
        where,
        _count: { timestamp: true },
      }),
    ]);

    return {
      totalSearches,
      uniqueQueries: uniqueQueries.length,
      popularQueries,
      searchTrends,
    };
  }

  // Get Question Analytics
  async getQuestionAnalytics(startDate?: Date, endDate?: Date) {
    const where = {
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    };

    const [totalQuestions, questionsByCategory, questionsByStatus, satisfactionScore] = await Promise.all([
      this.prisma.customerQuestion.count({ where }),
      this.prisma.customerQuestion.groupBy({
        by: ['category'],
        where,
        _count: { category: true },
      }),
      this.prisma.customerQuestion.groupBy({
        by: ['status'],
        where,
        _count: { status: true },
      }),
      this.prisma.customerQuestion.aggregate({
        where: { ...where, satisfaction: { not: null } },
        _avg: { satisfaction: true },
      }),
    ]);

    return {
      totalQuestions,
      questionsByCategory,
      questionsByStatus,
      averageSatisfaction: satisfactionScore._avg.satisfaction,
    };
  }

  // Get Product View Analytics
  async getProductViewAnalytics(startDate?: Date, endDate?: Date) {
    const where = {
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    };

    const [totalViews, popularProducts, viewsBySource, averageDuration] = await Promise.all([
      this.prisma.productView.count({ where }),
      this.prisma.productView.groupBy({
        by: ['productId'],
        where,
        _count: { productId: true },
        orderBy: { _count: { productId: 'desc' } },
        take: 10,
      }),
      this.prisma.productView.groupBy({
        by: ['source'],
        where,
        _count: { source: true },
      }),
      this.prisma.productView.aggregate({
        where: { ...where, duration: { not: null } },
        _avg: { duration: true },
      }),
    ]);

    return {
      totalViews,
      popularProducts,
      viewsBySource,
      averageDuration: averageDuration._avg.duration,
    };
  }

  // Get Service View Analytics
  async getServiceViewAnalytics(startDate?: Date, endDate?: Date) {
    const where = {
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    };

    const [totalViews, popularServices, viewsBySource, averageDuration] = await Promise.all([
      this.prisma.serviceView.count({ where }),
      this.prisma.serviceView.groupBy({
        by: ['serviceId'],
        where,
        _count: { serviceId: true },
        orderBy: { _count: { serviceId: 'desc' } },
        take: 10,
      }),
      this.prisma.serviceView.groupBy({
        by: ['source'],
        where,
        _count: { source: true },
      }),
      this.prisma.serviceView.aggregate({
        where: { ...where, duration: { not: null } },
        _avg: { duration: true },
      }),
    ]);

    return {
      totalViews,
      popularServices,
      viewsBySource,
      averageDuration: averageDuration._avg.duration,
    };
  }
}
