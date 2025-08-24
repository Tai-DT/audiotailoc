import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @ApiResponse({ status: 503, description: 'Service is unhealthy' })
  async basicHealth() {
    return this.healthService.checkBasicHealth();
  }

  @Get('detailed')
  @UseGuards(AdminOrKeyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Detailed health check (Admin only)' })
  @ApiResponse({ status: 200, description: 'Detailed health information' })
  async detailedHealth() {
    return this.healthService.checkDetailedHealth();
  }

  @Get('database')
  @UseGuards(AdminOrKeyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Database health check' })
  @ApiResponse({ status: 200, description: 'Database health information' })
  async databaseHealth() {
    return this.healthService.checkDatabaseHealth();
  }

  @Get('performance')
  @UseGuards(AdminOrKeyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Performance metrics' })
  @ApiResponse({ status: 200, description: 'Performance information' })
  async performanceMetrics() {
    return this.healthService.getPerformanceMetrics();
  }

  @Get('system')
  @UseGuards(AdminOrKeyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'System information' })
  @ApiResponse({ status: 200, description: 'System information' })
  async systemInfo() {
    return this.healthService.getSystemInfo();
  }

  @Get('memory')
  @UseGuards(AdminOrKeyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Memory usage information' })
  @ApiResponse({ status: 200, description: 'Memory usage details' })
  async memoryUsage() {
    return this.healthService.getMemoryUsage();
  }

  @Get('uptime')
  @ApiOperation({ summary: 'Application uptime' })
  @ApiResponse({ status: 200, description: 'Uptime information' })
  async uptime() {
    return this.healthService.getUptime();
  }

  @Get('version')
  @ApiOperation({ summary: 'Application version' })
  @ApiResponse({ status: 200, description: 'Version information' })
  async version() {
    return this.healthService.getVersion();
  }

  @Get('dependencies')
  @UseGuards(AdminOrKeyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dependencies health check' })
  @ApiResponse({ status: 200, description: 'Dependencies status' })
  async dependenciesHealth() {
    return this.healthService.checkDependenciesHealth();
  }

  @Get('logs')
  @UseGuards(AdminOrKeyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Recent application logs' })
  @ApiResponse({ status: 200, description: 'Recent logs' })
  async recentLogs(@Query('lines') lines: string = '100') {
    return this.healthService.getRecentLogs(parseInt(lines));
  }

  @Get('errors')
  // @UseGuards(JwtGuard, AdminGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Recent error logs' })
  @ApiResponse({ status: 200, description: 'Recent errors' })
  async recentErrors(@Query('hours') hours: string = '24') {
    return this.healthService.getRecentErrors(parseInt(hours));
  }

  @Get('metrics')
  // @UseGuards(JwtGuard, AdminGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Application metrics' })
  @ApiResponse({ status: 200, description: 'Application metrics' })
  async applicationMetrics() {
    return this.healthService.getApplicationMetrics();
  }

  @Get('alerts')
  // @UseGuards(JwtGuard, AdminGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Active alerts' })
  @ApiResponse({ status: 200, description: 'Active alerts' })
  async activeAlerts() {
    return this.healthService.getActiveAlerts();
  }
}


