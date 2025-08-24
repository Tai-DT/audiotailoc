import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { CustomerInsightsService } from './customer-insights.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { IsOptional, IsDateString, IsNumber, Min, Max } from 'class-validator';

class InsightsQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  days?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

@Controller('customer-insights')
@UseGuards(AdminOrKeyGuard)
export class CustomerInsightsController {
  constructor(private readonly customerInsightsService: CustomerInsightsService) {}

  @Get('behavior/:userId')
  async analyzeCustomerBehavior(
    @Param('userId') userId: string,
    @Query() query: InsightsQueryDto,
  ) {
    const days = query.days || 30;
    return this.customerInsightsService.analyzeCustomerBehavior(userId, undefined, days);
  }

  @Get('behavior/session/:sessionId')
  async analyzeSessionBehavior(
    @Param('sessionId') sessionId: string,
    @Query() query: InsightsQueryDto,
  ) {
    const days = query.days || 30;
    return this.customerInsightsService.analyzeCustomerBehavior(undefined, sessionId, days);
  }

  @Get('segments')
  async generateCustomerSegments() {
    return this.customerInsightsService.generateCustomerSegments();
  }

  @Get('needs')
  async analyzeCustomerNeeds(@Query() query: InsightsQueryDto) {
    const days = query.days || 30;
    return this.customerInsightsService.analyzeCustomerNeeds(days);
  }

  @Get('improvements')
  async generateImprovementSuggestions() {
    return this.customerInsightsService.generateImprovementSuggestions();
  }

  @Get('satisfaction-trends')
  async getCustomerSatisfactionTrends(@Query() query: InsightsQueryDto) {
    const days = query.days || 30;
    return this.customerInsightsService.getCustomerSatisfactionTrends(days);
  }

  @Get('engagement-metrics')
  async getCustomerEngagementMetrics(@Query() query: InsightsQueryDto) {
    const days = query.days || 30;
    return this.customerInsightsService.getCustomerEngagementMetrics(days);
  }

  @Get('summary')
  async getInsightsSummary(@Query() query: InsightsQueryDto) {
    const days = query.days || 30;
    
    const [customerNeeds, engagementMetrics, satisfactionTrends, improvementSuggestions] = await Promise.all([
      this.customerInsightsService.analyzeCustomerNeeds(days),
      this.customerInsightsService.getCustomerEngagementMetrics(days),
      this.customerInsightsService.getCustomerSatisfactionTrends(days),
      this.customerInsightsService.generateImprovementSuggestions(),
    ]);

    return {
      customerNeeds,
      engagementMetrics,
      satisfactionTrends,
      improvementSuggestions,
      summary: {
        totalInteractions: engagementMetrics.totalInteractions,
        engagementRate: engagementMetrics.engagementRate,
        averageSatisfaction: satisfactionTrends.length > 0 
          ? satisfactionTrends.reduce((sum, trend) => sum + (trend.averageSatisfaction || 0), 0) / satisfactionTrends.length 
          : 0,
        keyInsights: Array.isArray(customerNeeds) ? customerNeeds.slice(0, 5) : [], // Top 5 customer needs
        priorityImprovements: Array.isArray(improvementSuggestions) ? improvementSuggestions.slice(0, 3) : [], // Top 3 improvements
      },
    };
  }
}
