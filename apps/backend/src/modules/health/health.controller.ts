import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { HealthService, HealthCheckResult } from './health.service';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('/health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @ApiResponse({ status: 503, description: 'Service is unhealthy' })
  async health(): Promise<HealthCheckResult> {
    return this.healthService.check();
  }

  @Get('/healthz')
  @ApiOperation({ summary: 'Simple health check' })
  @ApiResponse({ status: 200, description: 'Service is running' })
  healthz() {
    return { status: 'ok' };
  }

  @Get('/ready')
  @ApiOperation({ summary: 'Readiness probe' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  @ApiResponse({ status: 503, description: 'Service is not ready' })
  async readiness() {
    return this.healthService.readiness();
  }

  @Get('/live')
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  async liveness() {
    return this.healthService.liveness();
  }

  @UseGuards(JwtGuard)
  @Get('/healthz/secure')
  @ApiOperation({ summary: 'Secure health check' })
  @ApiResponse({ status: 200, description: 'Authenticated health check' })
  secure() {
    return { status: 'ok', secure: true };
  }
}


