import { Controller, Get } from '@nestjs/common';
import { SimpleAnalyticsService } from './simple-analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: SimpleAnalyticsService) {}

  @Get('dashboard')
  async getDashboardData() {
    return this.analyticsService.getDashboardData();
  }

  @Get('sales')
  async getSalesMetrics() {
    return this.analyticsService.getSalesMetrics();
  }
}