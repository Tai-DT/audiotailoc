import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CustomerBehaviorData {
  userId?: string;
  sessionId?: string;
  searchQueries: string[];
  viewedProducts: string[];
  viewedServices: string[];
  questions: string[];
  timeSpent: number;
  interactions: number;
  lastActivity: Date;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: any;
  customerCount: number;
  averageValue: number;
  preferences: string[];
}

export interface CustomerNeed {
  category: string;
  description: string;
  frequency: number;
  urgency: 'low' | 'medium' | 'high';
  satisfaction: number;
  suggestions: string[];
}

@Injectable()
export class CustomerInsightsService {
  private readonly logger = new Logger(CustomerInsightsService.name);

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // Analyze customer behavior patterns
  async analyzeCustomerBehavior(userId?: string, sessionId?: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where = {
      timestamp: { gte: startDate },
      ...(userId && { userId }),
      ...(sessionId && { sessionId }),
    };

    const [searchQueries, productViews, serviceViews, questions] = await Promise.all([
      this.prisma.searchQuery.findMany({
        where,
        select: { query: true, timestamp: true },
        orderBy: { timestamp: 'desc' },
      }),
      this.prisma.productView.findMany({
        where,
        select: { productId: true, timestamp: true, duration: true },
        orderBy: { timestamp: 'desc' },
      }),
      this.prisma.serviceView.findMany({
        where,
        select: { serviceId: true, timestamp: true, duration: true },
        orderBy: { timestamp: 'desc' },
      }),
      this.prisma.customerQuestion.findMany({
        where,
        select: { question: true, category: true, timestamp: true, satisfaction: true },
        orderBy: { timestamp: 'desc' },
      }),
    ]);

    const behaviorData: CustomerBehaviorData = {
      userId,
      sessionId,
      searchQueries: searchQueries.map(sq => sq.query),
      viewedProducts: productViews.map(pv => pv.productId),
      viewedServices: serviceViews.map(sv => sv.serviceId),
      questions: questions.map(q => q.question),
      timeSpent: productViews.reduce((sum, pv) => sum + (pv.duration || 0), 0) + 
                 serviceViews.reduce((sum, sv) => sum + (sv.duration || 0), 0),
      interactions: searchQueries.length + productViews.length + serviceViews.length + questions.length,
      lastActivity: searchQueries[0]?.timestamp || productViews[0]?.timestamp || serviceViews[0]?.timestamp || questions[0]?.timestamp,
    };

    return behaviorData;
  }

  // Generate customer segments using AI
  async generateCustomerSegments() {
    try {
      // Get all customer behavior data
      const customers = await this.prisma.user.findMany({
        where: { role: 'USER' },
        select: { id: true, email: true, name: true },
      });

      const segments: CustomerSegment[] = [];
      
      for (const customer of customers.slice(0, 10)) { // Limit for performance
        const behavior = await this.analyzeCustomerBehavior(customer.id);
        
        if (behavior.interactions > 0) {
          // AI analysis removed - using basic segmentation
          const segmentName = behavior.interactions > 50 ? 'High Engagement' : 
                             behavior.interactions > 20 ? 'Medium Engagement' : 'Low Engagement';
          
          segments.push({
            id: customer.id,
            name: segmentName,
            description: `Customer with ${behavior.interactions} interactions`,
            criteria: [`Interactions: ${behavior.interactions}`],
            customerCount: 1,
            averageValue: 0,
            preferences: [],
          });
        }
      }

      // Group similar segments
      const groupedSegments = this.groupSimilarSegments(segments);
      
      return groupedSegments;
    } catch (error) {
      this.logger.error(`Failed to generate customer segments: ${(error as Error).message}`);
      throw error;
    }
  }

  // Analyze customer needs using AI
  async analyzeCustomerNeeds(days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const [questions, searchQueries, productViews] = await Promise.all([
        this.prisma.customerQuestion.findMany({
          where: { timestamp: { gte: startDate } },
          select: { question: true, category: true, satisfaction: true },
        }),
        this.prisma.searchQuery.findMany({
          where: { timestamp: { gte: startDate } },
          select: { query: true },
        }),
        this.prisma.productView.findMany({
          where: { timestamp: { gte: startDate } },
          select: { productId: true, duration: true },
        }),
      ]);

      // Prepare data for AI analysis
      const analysisData = {
        questions: questions.map(q => ({ text: q.question, category: q.category, satisfaction: q.satisfaction })),
        searchQueries: searchQueries.map(sq => sq.query),
        popularProducts: this.getPopularItems(productViews.map(pv => pv.productId)),
        totalInteractions: questions.length + searchQueries.length + productViews.length,
      };

      // AI analysis removed - returning basic analysis
      return {
        needs: analysisData.popularProducts,
        preferences: [],
        recommendations: ['Check product catalog', 'Review search history'],
        insights: [`Total interactions: ${analysisData.totalInteractions}`]
      };
    } catch (error) {
      this.logger.error(`Failed to analyze customer needs: ${(error as Error).message}`);
      throw error;
    }
  }

  // Generate improvement suggestions
  async generateImprovementSuggestions() {
    try {
      // Removed Promise.all call since results are not needed without AI
      return {
        suggestions: [
          'Improve product search functionality',
          'Add more product categories',
          'Enhance customer support',
          'Optimize site performance'
        ],
        priority: 'medium',
        estimatedImpact: 'moderate'
      };
    } catch (error) {
      this.logger.error(`Failed to generate improvement suggestions: ${(error as Error).message}`);
      throw error;
    }
  }

  // Get customer satisfaction trends
  async getCustomerSatisfactionTrends(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const satisfactionData = await this.prisma.customerQuestion.groupBy({
      by: ['timestamp'],
      where: {
        timestamp: { gte: startDate },
        satisfaction: { not: null },
      },
      _avg: { satisfaction: true },
      _count: { satisfaction: true },
    });

    return satisfactionData.map(data => ({
      date: data.timestamp,
      averageSatisfaction: data._avg.satisfaction,
      responseCount: data._count.satisfaction,
    }));
  }

  // Get customer engagement metrics
  async getCustomerEngagementMetrics(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [totalUsers, activeUsers, searchQueries, productViews, questions] = await Promise.all([
      this.prisma.user.count({ where: { role: 'USER' } }),
      this.prisma.searchQuery.groupBy({
        by: ['userId'],
        where: { timestamp: { gte: startDate } },
        _count: { userId: true },
      }),
      this.prisma.searchQuery.count({ where: { timestamp: { gte: startDate } } }),
      this.prisma.productView.count({ where: { timestamp: { gte: startDate } } }),
      this.prisma.customerQuestion.count({ where: { timestamp: { gte: startDate } } }),
    ]);

    return {
      totalUsers,
      activeUsers: activeUsers.length,
      engagementRate: (activeUsers.length / totalUsers) * 100,
      totalInteractions: searchQueries + productViews + questions,
      averageInteractionsPerUser: activeUsers.length > 0 ? (searchQueries + productViews + questions) / activeUsers.length : 0,
    };
  }

  // Private helper methods
  private groupSimilarSegments(segments: CustomerSegment[]): CustomerSegment[] {
    const grouped: { [key: string]: CustomerSegment } = {};

    segments.forEach(segment => {
      const key = segment.name.toLowerCase().replace(/\s+/g, '_');
      
      if (grouped[key]) {
        grouped[key].customerCount += segment.customerCount;
        grouped[key].averageValue = (grouped[key].averageValue + segment.averageValue) / 2;
        grouped[key].preferences = [...new Set([...grouped[key].preferences, ...segment.preferences])];
      } else {
        grouped[key] = { ...segment };
      }
    });

    return Object.values(grouped);
  }

  private getPopularItems(items: string[]): { [key: string]: number } {
    const counts: { [key: string]: number } = {};
    items.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });
    return counts;
  }

  private async getPopularSearchQueries(limit: number = 20) {
    const popularQueries = await this.prisma.searchQuery.groupBy({
      by: ['query'],
      _count: { query: true },
      orderBy: { _count: { query: 'desc' } },
      take: limit,
    });

    return popularQueries.map(q => ({
      query: q.query,
      count: q._count.query,
    }));
  }

  private async getPopularProducts(limit: number = 20) {
    const popularProducts = await this.prisma.productView.groupBy({
      by: ['productId'],
      _count: { productId: true },
      orderBy: { _count: { productId: 'desc' } },
      take: limit,
    });

    return popularProducts.map(p => ({
      productId: p.productId,
      views: p._count.productId,
    }));
  }

  private async getFrequentQuestions(limit: number = 20) {
    const frequentQuestions = await this.prisma.customerQuestion.groupBy({
      by: ['question'],
      _count: { question: true },
      orderBy: { _count: { question: 'desc' } },
      take: limit,
    });

    return frequentQuestions.map(q => ({
      question: q.question,
      frequency: q._count.question,
    }));
  }
}
