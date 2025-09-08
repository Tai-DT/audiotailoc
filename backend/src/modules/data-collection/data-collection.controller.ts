import { Body, Controller, Get, Post, Query, UseGuards, Req } from '@nestjs/common';
import { DataCollectionService, SearchQueryData, QuestionData, ProductViewData, ServiceViewData } from './data-collection.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { IsOptional, IsDateString, IsString, IsNumber, IsArray, IsIn, Min, Max } from 'class-validator';

class TrackSearchQueryDto {
  @IsString()
  query!: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsNumber()
  resultCount?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  clickedResults?: string[];

  @IsOptional()
  @IsNumber()
  searchDuration?: number;
}

class TrackQuestionDto {
  @IsString()
  question!: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsIn(['chat', 'contact', 'faq', 'support'])
  source?: 'chat' | 'contact' | 'faq' | 'support';

  @IsOptional()
  @IsIn(['answered', 'pending', 'escalated'])
  status?: 'answered' | 'pending' | 'escalated';

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  satisfaction?: number;
}

class TrackProductViewDto {
  @IsString()
  productId!: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsIn(['search', 'category', 'recommendation', 'direct'])
  source?: 'search' | 'category' | 'recommendation' | 'direct';

  @IsOptional()
  @IsString()
  referrer?: string;
}

class TrackServiceViewDto {
  @IsString()
  serviceId!: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsIn(['search', 'category', 'recommendation', 'direct'])
  source?: 'search' | 'category' | 'recommendation' | 'direct';

  @IsOptional()
  @IsString()
  referrer?: string;
}

class AnalyticsQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

@Controller('data-collection')
export class DataCollectionController {
  constructor(private readonly dataCollectionService: DataCollectionService) {}

  // Public endpoints for tracking (no authentication required)
  @Post('track/search')
  async trackSearchQuery(@Body() data: TrackSearchQueryDto, @Req() _req: any) {
    const searchData: SearchQueryData = {
      query: data.query,
      userId: data.userId,
      timestamp: new Date(),
    };
    return this.dataCollectionService.trackSearchQuery(searchData);
  }

  @Post('track/question')
  async trackQuestion(@Body() data: TrackQuestionDto, @Req() _req: any) {
    const questionData: QuestionData = {
      ...data,
    };

    return this.dataCollectionService.trackQuestion(questionData);
  }

  @Post('track/product-view')
  async trackProductView(@Body() data: TrackProductViewDto, @Req() _req: any) {
    const viewData: ProductViewData = {
      productId: data.productId,
      userId: data.userId,
      timestamp: new Date(),
      duration: data.duration,
    };
    return this.dataCollectionService.trackProductView(viewData);
  }

  @Post('track/service-view')
  async trackServiceView(@Body() data: TrackServiceViewDto, @Req() _req: any) {
    const viewData: ServiceViewData = {
      serviceId: data.serviceId,
      userId: data.userId,
      timestamp: new Date(),
      duration: data.duration,
    };
    return this.dataCollectionService.trackServiceView(viewData);
  }

  // Analytics endpoints (admin only)
  @Get('analytics/search')
  @UseGuards(AdminOrKeyGuard)
  async getSearchAnalytics(@Query() query: AnalyticsQueryDto) {
    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    return this.dataCollectionService.getSearchAnalytics(startDate, endDate);
  }

  @Get('analytics/questions')
  @UseGuards(AdminOrKeyGuard)
  async getQuestionAnalytics(@Query() query: AnalyticsQueryDto) {
    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    return this.dataCollectionService.getQuestionAnalytics(startDate, endDate);
  }

  @Get('analytics/product-views')
  @UseGuards(AdminOrKeyGuard)
  async getProductViewAnalytics(@Query() query: AnalyticsQueryDto) {
    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    return this.dataCollectionService.getProductViewAnalytics(startDate, endDate);
  }

  @Get('analytics/service-views')
  @UseGuards(AdminOrKeyGuard)
  async getServiceViewAnalytics(@Query() query: AnalyticsQueryDto) {
    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    return this.dataCollectionService.getServiceViewAnalytics(startDate, endDate);
  }

  @Get('analytics/summary')
  @UseGuards(AdminOrKeyGuard)
  async getAnalyticsSummary(@Query() query: AnalyticsQueryDto) {
    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    const [searchAnalytics, questionAnalytics, productViewAnalytics, serviceViewAnalytics] = await Promise.all([
      this.dataCollectionService.getSearchAnalytics(startDate, endDate),
      this.dataCollectionService.getQuestionAnalytics(startDate, endDate),
      this.dataCollectionService.getProductViewAnalytics(startDate, endDate),
      this.dataCollectionService.getServiceViewAnalytics(startDate, endDate),
    ]);

    return {
      search: searchAnalytics,
      questions: questionAnalytics,
      productViews: productViewAnalytics,
      serviceViews: serviceViewAnalytics,
      summary: {
        totalInteractions: searchAnalytics.totalSearches + questionAnalytics.totalQuestions + productViewAnalytics.totalViews + serviceViewAnalytics.totalViews,
        totalSearches: searchAnalytics.totalSearches,
        totalQuestions: questionAnalytics.totalQuestions,
        totalProductViews: productViewAnalytics.totalViews,
        totalServiceViews: serviceViewAnalytics.totalViews,
      },
    };
  }
}
