import {
  Controller,
  Get,
  Post,
  Delete,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { GracefulShutdownService } from './graceful-shutdown.service';
import { ApiStandardResponses } from '../documentation/documentation.decorators';

@Controller('api/v1/shutdown')
export class GracefulShutdownController {
  private readonly logger = new Logger(GracefulShutdownController.name);

  constructor(private readonly shutdownService: GracefulShutdownService) {}

  // Get shutdown status
  @Get('status')
  @ApiStandardResponses.success('Shutdown status retrieved successfully', {
    type: 'object',
    properties: {
      isShuttingDown: { type: 'boolean', example: false },
      activeConnections: { type: 'integer', example: 5 },
      shutdownTimeoutMs: { type: 'integer', example: 30000 },
      forceShutdownTimeoutMs: { type: 'integer', example: 5000 },
      serverListening: { type: 'boolean', example: true },
    },
  })
  async getStatus() {
    try {
      const status = this.shutdownService.getShutdownStatus();

      this.logger.log('Shutdown status requested', status);

      return {
        success: true,
        data: status,
      };
    } catch (error) {
      this.logger.error('Error getting shutdown status', error);
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'STATUS_ERROR',
            message: 'Failed to get shutdown status',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get health status
  @Get('health')
  @ApiStandardResponses.success('Health status retrieved successfully', {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'healthy' },
      uptime: { type: 'number', example: 3600 },
      memory: {
        type: 'object',
        properties: {
          rss: { type: 'number', example: 67108864 },
          heapTotal: { type: 'number', example: 41943040 },
          heapUsed: { type: 'number', example: 33554432 },
          external: { type: 'number', example: 0 },
        },
      },
      activeConnections: { type: 'integer', example: 5 },
      pid: { type: 'integer', example: 12345 },
    },
  })
  async getHealth() {
    try {
      const health = await this.shutdownService.getHealthStatus();

      return {
        success: true,
        data: health,
      };
    } catch (error) {
      this.logger.error('Error getting health status', error);
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'HEALTH_ERROR',
            message: 'Failed to get health status',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Readiness check (for load balancers)
  @Get('ready')
  async getReadiness() {
    const isReady = this.shutdownService.isReady();

    if (isReady) {
      return {
        success: true,
        data: {
          status: 'ready',
          timestamp: new Date().toISOString(),
        },
      };
    } else {
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'NOT_READY',
            message: 'Service is not ready',
          },
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  // Liveness check (for orchestrators like Kubernetes)
  @Get('alive')
  async getLiveness() {
    const isAlive = this.shutdownService.isAlive();

    if (isAlive) {
      return {
        success: true,
        data: {
          status: 'alive',
          timestamp: new Date().toISOString(),
        },
      };
    } else {
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'NOT_ALIVE',
            message: 'Service is not alive',
          },
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  // Get process information
  @Get('process')
  @ApiStandardResponses.success('Process information retrieved successfully', {
    type: 'object',
    properties: {
      pid: { type: 'integer', example: 12345 },
      platform: { type: 'string', example: 'linux' },
      version: { type: 'string', example: 'v18.17.0' },
      uptime: { type: 'number', example: 3600 },
      memory: {
        type: 'object',
        properties: {
          rss: { type: 'number', example: 67108864 },
          heapTotal: { type: 'number', example: 41943040 },
          heapUsed: { type: 'number', example: 33554432 },
          external: { type: 'number', example: 0 },
        },
      },
      cpu: {
        type: 'object',
        properties: {
          user: { type: 'number', example: 100000 },
          system: { type: 'number', example: 50000 },
        },
      },
      activeConnections: { type: 'integer', example: 5 },
      isShuttingDown: { type: 'boolean', example: false },
    },
  })
  async getProcessInfo() {
    try {
      const processInfo = this.shutdownService.getProcessInfo();

      this.logger.log('Process info requested', {
        pid: processInfo.pid,
        uptime: processInfo.uptime,
        activeConnections: processInfo.activeConnections,
      });

      return {
        success: true,
        data: processInfo,
      };
    } catch (error) {
      this.logger.error('Error getting process info', error);
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'PROCESS_INFO_ERROR',
            message: 'Failed to get process information',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Trigger graceful shutdown (admin only)
  @Post('shutdown')
  @ApiStandardResponses.success('Graceful shutdown initiated successfully', {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Graceful shutdown initiated' },
      reason: { type: 'string', example: 'MANUAL_TRIGGER' },
      timestamp: { type: 'string', format: 'date-time' },
    },
  })
  async triggerShutdown() {
    try {
      this.logger.warn('Manual shutdown triggered via API');

      // Trigger shutdown in background
      setImmediate(() => {
        this.shutdownService.manualShutdown('MANUAL_API_TRIGGER');
      });

      return {
        success: true,
        data: {
          message: 'Graceful shutdown initiated',
          reason: 'MANUAL_API_TRIGGER',
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      this.logger.error('Error triggering shutdown', error);
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'SHUTDOWN_TRIGGER_ERROR',
            message: 'Failed to trigger shutdown',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Force immediate shutdown (emergency only)
  @Delete('shutdown')
  @ApiStandardResponses.success('Force shutdown initiated successfully', {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Force shutdown initiated' },
      reason: { type: 'string', example: 'EMERGENCY_FORCE_SHUTDOWN' },
      timestamp: { type: 'string', format: 'date-time' },
    },
  })
  async forceShutdown() {
    try {
      this.logger.error('Force shutdown triggered via API');

      return {
        success: true,
        data: {
          message: 'Force shutdown initiated',
          reason: 'EMERGENCY_FORCE_SHUTDOWN',
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      this.logger.error('Error triggering force shutdown', error);
    } finally {
      // Force shutdown regardless of errors
      setTimeout(() => {
        this.shutdownService.forceShutdown('EMERGENCY_FORCE_SHUTDOWN');
      }, 100);
    }
  }

  // Get system metrics
  @Get('metrics')
  @ApiStandardResponses.success('System metrics retrieved successfully', {
    type: 'object',
    properties: {
      process: {
        type: 'object',
        properties: {
          pid: { type: 'integer', example: 12345 },
          platform: { type: 'string', example: 'linux' },
          version: { type: 'string', example: 'v18.17.0' },
          uptime: { type: 'number', example: 3600 },
        },
      },
      memory: {
        type: 'object',
        properties: {
          rss: { type: 'number', example: 67108864 },
          heapTotal: { type: 'number', example: 41943040 },
          heapUsed: { type: 'number', example: 33554432 },
          external: { type: 'number', example: 0 },
          percentage: { type: 'number', example: 65.5 },
        },
      },
      cpu: {
        type: 'object',
        properties: {
          user: { type: 'number', example: 100000 },
          system: { type: 'number', example: 50000 },
          percentage: { type: 'number', example: 12.5 },
        },
      },
      connections: {
        type: 'object',
        properties: {
          active: { type: 'integer', example: 5 },
          max: { type: 'integer', example: 100 },
        },
      },
      timestamp: { type: 'string', format: 'date-time' },
    },
  })
  async getMetrics() {
    try {
      const processInfo = this.shutdownService.getProcessInfo();
      const memoryUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();

      // Calculate memory percentage
      const memoryPercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

      // Calculate CPU percentage (rough estimate)
      const totalCpu = cpuUsage.user + cpuUsage.system;
      const cpuPercentage = (totalCpu / (process.uptime() * 1000000)) * 100;

      const metrics = {
        process: {
          pid: process.pid,
          platform: process.platform,
          version: process.version,
          uptime: Math.round(process.uptime()),
        },
        memory: {
          rss: memoryUsage.rss,
          heapTotal: memoryUsage.heapTotal,
          heapUsed: memoryUsage.heapUsed,
          external: memoryUsage.external,
          percentage: Math.round(memoryPercentage * 100) / 100,
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system,
          percentage: Math.round(cpuPercentage * 100) / 100,
        },
        connections: {
          active: processInfo.activeConnections,
          max: 100, // This could be configurable
        },
        timestamp: new Date().toISOString(),
      };

      this.logger.log('System metrics requested', {
        memoryPercent: metrics.memory.percentage,
        cpuPercent: metrics.cpu.percentage,
        activeConnections: metrics.connections.active,
      });

      return {
        success: true,
        data: metrics,
      };
    } catch (error) {
      this.logger.error('Error getting system metrics', error);
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'METRICS_ERROR',
            message: 'Failed to get system metrics',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get shutdown configuration
  @Get('config')
  @ApiStandardResponses.success('Shutdown configuration retrieved successfully', {
    type: 'object',
    properties: {
      shutdownTimeoutMs: { type: 'integer', example: 30000 },
      forceShutdownTimeoutMs: { type: 'integer', example: 5000 },
      shutdownSignals: {
        type: 'array',
        items: { type: 'string' },
        example: ['SIGTERM', 'SIGINT', 'SIGUSR2'],
      },
      maxConnections: { type: 'integer', example: 100 },
      environment: { type: 'string', example: 'production' },
    },
  })
  async getConfig() {
    try {
      // This would typically come from the config service
      const config = {
        shutdownTimeoutMs: 30000,
        forceShutdownTimeoutMs: 5000,
        shutdownSignals: ['SIGTERM', 'SIGINT', 'SIGUSR2'],
        maxConnections: 100,
        environment: process.env.NODE_ENV || 'development',
      };

      return {
        success: true,
        data: config,
      };
    } catch (error) {
      this.logger.error('Error getting shutdown config', error);
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'CONFIG_ERROR',
            message: 'Failed to get shutdown configuration',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get application status overview
  @Get('overview')
  @ApiStandardResponses.success('Application status overview retrieved successfully', {
    type: 'object',
    properties: {
      application: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Audio Tài Lộc API' },
          version: { type: 'string', example: '2.0.0' },
          environment: { type: 'string', example: 'production' },
          uptime: { type: 'number', example: 3600 },
        },
      },
      system: {
        type: 'object',
        properties: {
          platform: { type: 'string', example: 'linux' },
          nodeVersion: { type: 'string', example: 'v18.17.0' },
          pid: { type: 'integer', example: 12345 },
        },
      },
      health: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'healthy' },
          isReady: { type: 'boolean', example: true },
          isAlive: { type: 'boolean', example: true },
          activeConnections: { type: 'integer', example: 5 },
        },
      },
      timestamp: { type: 'string', format: 'date-time' },
    },
  })
  async getOverview() {
    try {
      const health = await this.shutdownService.getHealthStatus();
      const processInfo = this.shutdownService.getProcessInfo();

      const overview = {
        application: {
          name: 'Audio Tài Lộc API',
          version: '2.0.0',
          environment: process.env.NODE_ENV || 'development',
          uptime: Math.round(process.uptime()),
        },
        system: {
          platform: process.platform,
          nodeVersion: process.version,
          pid: process.pid,
        },
        health: {
          status: health.status,
          isReady: this.shutdownService.isReady(),
          isAlive: this.shutdownService.isAlive(),
          activeConnections: processInfo.activeConnections,
        },
        timestamp: new Date().toISOString(),
      };

      this.logger.log('Application overview requested', {
        status: overview.health.status,
        uptime: overview.application.uptime,
        connections: overview.health.activeConnections,
      });

      return {
        success: true,
        data: overview,
      };
    } catch (error) {
      this.logger.error('Error getting application overview', error);
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'OVERVIEW_ERROR',
            message: 'Failed to get application overview',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
