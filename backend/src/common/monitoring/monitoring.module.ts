import { Module, Global, Controller, Get, Res } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MetricsService } from './metrics.service';
import { HealthService } from './health.service';
import { PerformanceTrackingInterceptor } from './performance.interceptor';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';

/**
 * Metrics endpoint controller
 * Exposes Prometheus metrics and health check endpoints
 */
@ApiTags('Monitoring')
@Controller('monitoring')
export class MonitoringController {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly healthService: HealthService,
  ) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get Prometheus metrics' })
  @ApiResponse({ status: 200, description: 'Prometheus metrics format' })
  async getMetrics(@Res() res: Response) {
    res.set('Content-Type', 'text/plain; version=0.0.4');
    const metrics = await this.metricsService.getMetrics();
    res.send(metrics);
  }

  @Get('health')
  @ApiOperation({ summary: 'Get full health status' })
  @ApiResponse({ status: 200, description: 'Full health check result' })
  async getHealth() {
    return await this.healthService.getFullHealthStatus();
  }

  @Get('health/live')
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiResponse({ status: 200, description: 'Liveness check' })
  async getLiveness() {
    return await this.healthService.getLivenessProbe();
  }

  @Get('health/ready')
  @ApiOperation({ summary: 'Readiness probe' })
  @ApiResponse({ status: 200, description: 'Readiness check' })
  async getReadiness() {
    return await this.healthService.getReadinessProbe();
  }

  @Get('health/dashboard')
  @ApiOperation({ summary: 'Health metrics for dashboard' })
  @ApiResponse({ status: 200, description: 'Dashboard metrics' })
  async getDashboardMetrics() {
    return await this.healthService.getDashboardMetrics();
  }

  @Get('metrics/json')
  @ApiOperation({ summary: 'Get metrics as JSON' })
  @ApiResponse({ status: 200, description: 'Metrics in JSON format' })
  async getMetricsJson() {
    return await this.metricsService.getMetricsAsJson();
  }
}

/**
 * Global monitoring module
 * Provides metrics collection and health checking capabilities
 * Automatically registered as a global module for application-wide monitoring
 */
@Global()
@Module({
  controllers: [MonitoringController],
  providers: [
    MetricsService,
    HealthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceTrackingInterceptor,
    },
  ],
  exports: [MetricsService, HealthService],
})
export class MonitoringModule {}
