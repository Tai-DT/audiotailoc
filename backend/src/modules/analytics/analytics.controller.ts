import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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

  @Get('overview')
  async getOverview(@Query('range') range: string = '7days') {
    // Use real data from service - includes all growth metrics calculated correctly
    return this.analyticsService.getOverview(range);
  }

  @Get('trends')
  async getTrends(@Query('range') range: string = '7days') {
    // Use real data from service
    return this.analyticsService.getTrends(range);
  }

  @Get('revenue')
  async getRevenue(@Query('period') period: string = 'month') {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case 'day':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 1);
    }

    const filters: AnalyticsFilters = {
      startDate,
      endDate,
    };

    const salesMetrics = await this.analyticsService.getSalesMetrics(filters);

    return {
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalRevenue: salesMetrics.totalRevenue || 0,
      totalOrders: salesMetrics.totalOrders || 0,
      averageOrderValue: salesMetrics.averageOrderValue || 0,
      revenueGrowth: salesMetrics.revenueGrowth || 0,
    };
  }

  @Get('revenue/chart')
  @ApiOperation({ summary: 'Get revenue chart data for dashboard' })
  async getRevenueChart(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days) : 7;
    const result = await this.analyticsService.getRevenueChartData(daysNum);
    return result;
  }

  @Get('products/top-selling-real')
  @ApiOperation({ summary: 'Get real top selling products from orders' })
  async getTopSellingProductsReal(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 5;
    const result = await this.analyticsService.getTopSellingProductsReal(limitNum);
    return result;
  }

  @Get('growth-metrics')
  @ApiOperation({ summary: 'Get growth metrics for orders and customers' })
  async getGrowthMetricsReal() {
    const result = await this.analyticsService.getGrowthMetricsReal();
    return result;
  }

  @Get('services/bookings-today-real')
  @ApiOperation({ summary: 'Get real service bookings count for today' })
  async getBookingsTodayReal() {
    const result = await this.analyticsService.getBookingsTodayReal();
    return result;
  }

  @Get('top-services')
  async getTopServices(@Query('limit') limit: string = '5') {
    const limitNum = parseInt(limit) || 5;

    // Use real data from service
    return this.analyticsService.getTopServices(limitNum);
  }

  @Get('top-products')
  async getTopProducts(@Query('limit') limit: string = '5') {
    const limitNum = parseInt(limit) || 5;

    // Use real data from service
    return this.analyticsService.getTopProducts(limitNum);
  }

  @Get('user-activity')
  async getUserActivity(@Query('range') range: string = '7days') {
    // Use the service to get real data from database
    return this.analyticsService.getUserActivity(range);
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
    @Query() query: AnalyticsQueryDto,
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
