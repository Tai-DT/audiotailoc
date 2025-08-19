import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface HealthCheckResult {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  checks: {
    database: {
      status: 'ok' | 'error';
      responseTime?: number;
      error?: string;
    };
    memory: {
      status: 'ok' | 'error';
      used: number;
      total: number;
      percentage: number;
    };
  };
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();
    const environment = process.env.NODE_ENV || 'development';
    const version = process.env.npm_package_version || '1.0.0';

    // Check database
    const dbCheck = await this.checkDatabase();

    // Check memory usage
    const memoryCheck = this.checkMemory();

    const responseTime = Date.now() - startTime;

    this.logger.log(`Health check completed in ${responseTime}ms`);

    return {
      status: dbCheck.status === 'ok' && memoryCheck.status === 'ok' ? 'ok' : 'error',
      timestamp,
      uptime,
      environment,
      version,
      checks: {
        database: dbCheck,
        memory: memoryCheck,
      },
    };
  }

  private async checkDatabase(): Promise<{ status: 'ok' | 'error'; responseTime?: number; error?: string }> {
    const startTime = Date.now();
    
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'ok',
        responseTime,
      };
    } catch (error) {
      this.logger.error('Database health check failed', error);
      
      return {
        status: 'error',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown database error',
      };
    }
  }

  private checkMemory(): { status: 'ok' | 'error'; used: number; total: number; percentage: number } {
    const memUsage = process.memoryUsage();
    const used = Math.round(memUsage.heapUsed / 1024 / 1024); // MB
    const total = Math.round(memUsage.heapTotal / 1024 / 1024); // MB
    const percentage = Math.round((used / total) * 100);

    // Consider memory usage high if > 80%
    const status = percentage > 80 ? 'error' : 'ok';

    return {
      status,
      used,
      total,
      percentage,
    };
  }

  async readiness(): Promise<{ status: 'ok' | 'error'; message: string }> {
    try {
      // Check if database is ready
      await this.prisma.$queryRaw`SELECT 1`;
      
      return {
        status: 'ok',
        message: 'Service is ready to accept requests',
      };
    } catch (error) {
      this.logger.error('Readiness check failed', error);
      
      return {
        status: 'error',
        message: 'Service is not ready',
      };
    }
  }

  async liveness(): Promise<{ status: 'ok' | 'error'; message: string }> {
    // Simple liveness check - just check if the process is running
    return {
      status: 'ok',
      message: 'Service is alive',
    };
  }
}
