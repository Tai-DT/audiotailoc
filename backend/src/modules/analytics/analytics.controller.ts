import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { AnalyticsService, AnalyticsFilters } from './analytics.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { IsOptional, IsDateString, IsArray, IsString } from 'class-validator';

class AnalyticsQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsString()
  customerSegment?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  channel?: string;
}

@Controller('analytics')
@UseGuards(AdminOrKeyGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboardData(@Query() query: AnalyticsQueryDto) {
    const filters: AnalyticsFilters = {
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      productIds: query.productIds,
      categoryIds: query.categoryIds,
      customerSegment: query.customerSegment,
      region: query.region,
      channel: query.channel,
    };

    return this.analyticsService.getDashboardData(filters);
  }

  @Get('sales')
  async getSalesMetrics(@Query() query: AnalyticsQueryDto) {
    const filters: AnalyticsFilters = {
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      productIds: query.productIds,
      categoryIds: query.categoryIds,
      customerSegment: query.customerSegment,
      region: query.region,
      channel: query.channel,
    };

    return this.analyticsService.getSalesMetrics(filters);
  }

  @Get('customers')
  async getCustomerMetrics(@Query() query: AnalyticsQueryDto) {
    const filters: AnalyticsFilters = {
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      productIds: query.productIds,
      categoryIds: query.categoryIds,
      customerSegment: query.customerSegment,
      region: query.region,
      channel: query.channel,
    };

    return this.analyticsService.getCustomerMetrics(filters);
  }

  @Get('inventory')
  async getInventoryMetrics(@Query() query: AnalyticsQueryDto) {
    const filters: AnalyticsFilters = {
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      productIds: query.productIds,
      categoryIds: query.categoryIds,
      customerSegment: query.customerSegment,
      region: query.region,
      channel: query.channel,
    };

    return this.analyticsService.getInventoryMetrics(filters);
  }

  @Get('kpis')
  async getBusinessKPIs(@Query() query: AnalyticsQueryDto) {
    const filters: AnalyticsFilters = {
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      productIds: query.productIds,
      categoryIds: query.categoryIds,
      customerSegment: query.customerSegment,
      region: query.region,
      channel: query.channel,
    };

    return this.analyticsService.getBusinessKPIs(filters);
  }

  @Get('export/:type')
  async exportAnalytics(
    @Param('type') type: 'sales' | 'customers' | 'inventory' | 'all',
    @Query('format') format: 'csv' | 'excel' | 'pdf' = 'csv',
    @Query() query: AnalyticsQueryDto
  ) {
    const filters: AnalyticsFilters = {
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      productIds: query.productIds,
      categoryIds: query.categoryIds,
      customerSegment: query.customerSegment,
      region: query.region,
      channel: query.channel,
    };

    const filename = await this.analyticsService.exportAnalytics(type, format, filters);
    return { filename, downloadUrl: `/api/v1/analytics/download/${filename}` };
  }

  @Get('realtime/sales')
  async getRealTimeSales() {
    // Real-time sales data for dashboard widgets
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const filters: AnalyticsFilters = {
      startDate: today,
      endDate: now,
    };

    return this.analyticsService.getSalesMetrics(filters);
  }

  @Get('realtime/orders')
  async getRealTimeOrders() {
    // Real-time order tracking
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const filters: AnalyticsFilters = {
      startDate: today,
      endDate: now,
    };

    const salesMetrics = await this.analyticsService.getSalesMetrics(filters);
    
    return {
      todayOrders: salesMetrics.totalOrders,
      todayRevenue: salesMetrics.totalRevenue,
      averageOrderValue: salesMetrics.averageOrderValue,
      lastUpdated: new Date(),
    };
  }
}
