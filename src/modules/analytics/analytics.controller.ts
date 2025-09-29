import { Controller, Get, Query, UseGuards, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(AnalyticsController.name);

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

    const filters: AnalyticsFilters = {
      startDate,
      endDate,
    };

    const _dashboardData = await this.analyticsService.getDashboardData(filters);

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

  @Get('top-products')
  async getTopProducts(@Query('limit') limit: string = '5') {
    const limitNum = parseInt(limit) || 5;

    // Mock data for top products
    const topProducts = [
      { id: '1', name: 'Loa JBL Go 3', sold: 156, revenue: 46800000 },
      { id: '2', name: 'Ampli Yamaha A-S501', sold: 89, revenue: 26700000 },
      { id: '3', name: 'Tai nghe Sony WH-1000XM4', sold: 67, revenue: 20100000 },
      { id: '4', name: 'Microphone Shure SM7B', sold: 45, revenue: 13500000 },
      { id: '5', name: 'Cáp âm thanh Monster', sold: 34, revenue: 10200000 },
    ];

    return topProducts.slice(0, limitNum);
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

  @Get('user-activity')
  async getUserActivity(@Query('range') range: string = '7days') {
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

  @Get('download/:filename')
  async downloadAnalytics(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const filePath = `/tmp/${filename}`;

      // Check if file exists
      const fs = require('fs');
      if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      // Read and send file
      const fileContent = fs.readFileSync(filePath);
      const contentType = filename.endsWith('.pdf') ? 'application/pdf' :
                         filename.endsWith('.csv') ? 'text/csv' :
                         'application/json';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(fileContent);
    } catch (error) {
      this.logger.error('Failed to download analytics file', error);
      res.status(500).json({ error: 'Failed to download file' });
    }
  }
}
