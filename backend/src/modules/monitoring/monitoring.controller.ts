import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { MonitoringService } from './monitoring.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('metrics')
  async getMetrics(@Res() response: Response) {
    try {
      const metrics = await this.monitoringService.getMetrics();
      response.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
      response.send(metrics);
    } catch (error) {
      response.status(500).send('Error generating metrics');
    }
  }

  @Get('health')
  getHealth() {
    return this.monitoringService.getHealthCheck();
  }

  @Get('health/detailed')
  getDetailedHealth() {
    return this.monitoringService.getDetailedHealth();
  }

  @Get('readiness')
  getReadiness() {
    // Add actual readiness checks here
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'ready',
        redis: 'ready',
        externalServices: 'ready',
      },
    };
  }

  @Get('liveness')
  getLiveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }
}
