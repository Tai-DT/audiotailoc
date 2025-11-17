import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
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
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    switch (range) {
      case '7days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    const filters: AnalyticsFilters = {
      startDate,
      endDate,
    };

    const dashboardData = await this.analyticsService.getDashboardData(filters);

    return {
      totalRevenue: dashboardData.sales?.totalRevenue || 0,
      totalOrders: dashboardData.sales?.totalOrders || 0,
      totalCustomers: dashboardData.customers?.totalCustomers || 0,
      newCustomers: dashboardData.customers?.newCustomers || 0,
      conversionRate: dashboardData.sales?.conversionRate || 0,
      revenueGrowth: dashboardData.sales?.revenueGrowth || 0,
      ordersGrowth: dashboardData.sales?.orderGrowth || 0,
      customersGrowth: 0, // Will be calculated from customer metrics
    };
  }

  @Get('trends')
  async getTrends(@Query('range') range: string = '7days') {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    switch (range) {
      case '7days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    const _filters: AnalyticsFilters = {
      startDate,
      endDate,
    };

    // Generate trend data (simplified for now)
    const trends = [];
    const days = range === '7days' ? 7 : range === '30days' ? 30 : 7;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      trends.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 10000) + 1000, // Mock data
        orders: Math.floor(Math.random() * 50) + 5, // Mock data
        customers: Math.floor(Math.random() * 20) + 2, // Mock data
      });
    }

    return trends;
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
      revenueGrowth: salesMetrics.revenueGrowth || 0
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

    // Mock data for top services
    const topServices = [
      { id: '1', name: 'Sửa chữa loa', bookings: 45, revenue: 13500000 },
      { id: '2', name: 'Bảo dưỡng ampli', bookings: 32, revenue: 9600000 },
      { id: '3', name: 'Thay linh kiện', bookings: 28, revenue: 8400000 },
      { id: '4', name: 'Tư vấn hệ thống', bookings: 21, revenue: 6300000 },
      { id: '5', name: 'Cài đặt âm thanh', bookings: 18, revenue: 5400000 },
    ];

    return topServices.slice(0, limitNum);
  }

  @Get('top-products')
  async getTopProducts(@Query('limit') limit: string = '5') {
    const limitNum = parseInt(limit) || 5;

    // Mock data for top products
    const topProducts = [
      { id: '1', name: 'Loa Bluetooth Sony', sold: 125, revenue: 37500000 },
      { id: '2', name: 'Ampli Denon', sold: 89, revenue: 26700000 },
      { id: '3', name: 'Micro không dây', sold: 67, revenue: 20100000 },
      { id: '4', name: 'Dàn karaoke', sold: 45, revenue: 13500000 },
      { id: '5', name: 'Tai nghe gaming', sold: 34, revenue: 10200000 },
    ];

    return topProducts.slice(0, limitNum);
  }

  @Get('user-activity')
  async getUserActivity(@Query('range') range: string = '7days') {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    switch (range) {
      case '7days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    // Mock user activity data
    const userActivity = {
      pageViews: Math.floor(Math.random() * 10000) + 5000,
      sessions: Math.floor(Math.random() * 1000) + 500,
      avgSessionDuration: Math.floor(Math.random() * 300) + 120, // seconds
      bounceRate: Math.floor(Math.random() * 30) + 20, // percentage
      uniqueVisitors: Math.floor(Math.random() * 500) + 200,
      returnVisitors: Math.floor(Math.random() * 300) + 100,
      topPages: [
        { path: '/san-pham', views: Math.floor(Math.random() * 1000) + 500 },
        { path: '/dich-vu', views: Math.floor(Math.random() * 800) + 300 },
        { path: '/lien-he', views: Math.floor(Math.random() * 400) + 100 },
      ]
    };

    return userActivity;
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
