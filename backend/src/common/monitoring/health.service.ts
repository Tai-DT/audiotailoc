import { Injectable, Logger, Inject, Optional } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Health check indicators
 */
export enum HealthStatus {
  UP = 'UP',
  DOWN = 'DOWN',
  DEGRADED = 'DEGRADED',
}

/**
 * Individual health check result
 */
export interface HealthCheckResult {
  status: HealthStatus;
  name: string;
  message?: string;
  details?: Record<string, any>;
  responseTime?: number;
}

/**
 * Overall health response
 */
export interface HealthResponse {
  status: HealthStatus;
  timestamp: string;
  uptime: number;
  checks: HealthCheckResult[];
  systemMetrics?: {
    memory: {
      heapUsed: number;
      heapTotal: number;
      percentage: number;
    };
    eventLoopLag?: number;
  };
}

/**
 * Comprehensive health check service
 * Monitors database, cache, external APIs, and system resources
 */
@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private eventLoopLagSamples: number[] = [];
  private lastMemoryCheck = process.memoryUsage();

  constructor(
    private prisma: PrismaService,
    @Optional() @Inject('REDIS_CLIENT') private redisClient?: any,
  ) {
    this.initializeEventLoopMonitoring();
  }

  /**
   * Perform full health check
   */
  async getFullHealthStatus(): Promise<HealthResponse> {
    const startTime = Date.now();
    const checks: HealthCheckResult[] = [];

    // Parallel health checks
    const [dbHealth, cacheHealth, memoryHealth] = await Promise.allSettled([
      this.checkDatabase(),
      this.checkCache(),
      this.checkMemory(),
    ]);

    if (dbHealth.status === 'fulfilled') {
      checks.push(dbHealth.value);
    } else {
      checks.push({
        status: HealthStatus.DOWN,
        name: 'database',
        message: 'Database health check failed',
      });
    }

    if (cacheHealth.status === 'fulfilled') {
      checks.push(cacheHealth.value);
    } else {
      checks.push({
        status: HealthStatus.DOWN,
        name: 'cache',
        message: 'Cache health check failed',
      });
    }

    if (memoryHealth.status === 'fulfilled') {
      checks.push(memoryHealth.value);
    } else {
      checks.push({
        status: HealthStatus.DOWN,
        name: 'memory',
        message: 'Memory health check failed',
      });
    }

    const _responseTime = Date.now() - startTime;
    const overallStatus = this.determineOverallStatus(checks);
    const memUsage = process.memoryUsage();

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
      systemMetrics: {
        memory: {
          heapUsed: memUsage.heapUsed,
          heapTotal: memUsage.heapTotal,
          percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100,
        },
        eventLoopLag: this.getAverageEventLoopLag(),
      },
    };
  }

  /**
   * Check database connectivity and performance
   */
  private async checkDatabase(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    try {
      // Simple query to verify connection
      await this.prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;

      const status = responseTime > 1000 ? HealthStatus.DEGRADED : HealthStatus.UP;

      return {
        status,
        name: 'database',
        message: 'Database is healthy',
        responseTime,
        details: {
          responseTime: `${responseTime}ms`,
        },
      };
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return {
        status: HealthStatus.DOWN,
        name: 'database',
        message: 'Database connection failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Check cache (Redis) connectivity
   */
  private async checkCache(): Promise<HealthCheckResult> {
    // If no Redis client is available, return UP (in-memory cache is always available)
    if (!this.redisClient) {
      return {
        status: HealthStatus.UP,
        name: 'cache',
        message: 'In-memory cache is available',
      };
    }

    const startTime = Date.now();
    try {
      // PING Redis
      await this.redisClient.ping();
      const responseTime = Date.now() - startTime;

      // Get memory info
      const info = await this.redisClient.info('memory');
      const memoryUsage = this.parseRedisMemory(info);

      const status =
        responseTime > 100 || memoryUsage.percentage > 90 ? HealthStatus.DEGRADED : HealthStatus.UP;

      return {
        status,
        name: 'cache',
        message: 'Cache is healthy',
        responseTime,
        details: {
          responseTime: `${responseTime}ms`,
          memory: memoryUsage,
        },
      };
    } catch (error) {
      this.logger.error('Cache health check failed:', error);
      return {
        status: HealthStatus.DOWN,
        name: 'cache',
        message: 'Cache connection failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Check memory usage
   */
  private async checkMemory(): Promise<HealthCheckResult> {
    const memUsage = process.memoryUsage();
    const heapPercentage = (memUsage.heapUsed / memUsage.heapTotal) * 100;

    let status = HealthStatus.UP;
    if (heapPercentage > 90) {
      status = HealthStatus.DOWN;
    } else if (heapPercentage > 75) {
      status = HealthStatus.DEGRADED;
    }

    return {
      status,
      name: 'memory',
      message: `Memory usage: ${heapPercentage.toFixed(2)}%`,
      details: {
        heapUsed: `${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        rss: `${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`,
        percentage: heapPercentage.toFixed(2),
      },
    };
  }

  /**
   * Check database query performance
   */
  async checkDatabasePerformance(): Promise<HealthCheckResult> {
    try {
      const queries = [
        this.prisma.$queryRaw`SELECT COUNT(*) as count FROM "User"`,
        this.prisma.$queryRaw`SELECT COUNT(*) as count FROM "Order"`,
        this.prisma.$queryRaw`SELECT COUNT(*) as count FROM "Booking"`,
      ];

      const startTime = Date.now();
      await Promise.all(queries);
      const responseTime = Date.now() - startTime;

      const status = responseTime > 500 ? HealthStatus.DEGRADED : HealthStatus.UP;

      return {
        status,
        name: 'database_performance',
        message: 'Database queries performed within acceptable time',
        responseTime,
        details: {
          responseTime: `${responseTime}ms`,
        },
      };
    } catch (error) {
      return {
        status: HealthStatus.DOWN,
        name: 'database_performance',
        message: 'Database performance check failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Check external API connectivity (PayOS, Cloudinary, etc.)
   */
  async checkExternalApis(): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = [];

    // Check PayOS API
    results.push(await this.checkPaymentGateway());

    // Check Cloudinary API
    results.push(await this.checkMediaService());

    return results;
  }

  /**
   * Check payment gateway (PayOS)
   */
  private async checkPaymentGateway(): Promise<HealthCheckResult> {
    try {
      // This would depend on your PayOS implementation
      // For now, we'll just return UP if configured
      const apiKey = process.env.PAYOS_API_KEY;

      if (!apiKey) {
        return {
          status: HealthStatus.UP,
          name: 'payment_gateway',
          message: 'Payment gateway not configured',
        };
      }

      return {
        status: HealthStatus.UP,
        name: 'payment_gateway',
        message: 'Payment gateway is configured',
      };
    } catch (error) {
      return {
        status: HealthStatus.DOWN,
        name: 'payment_gateway',
        message: 'Payment gateway check failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Check media service (Cloudinary)
   */
  private async checkMediaService(): Promise<HealthCheckResult> {
    try {
      const cloudinaryKey = process.env.CLOUDINARY_API_KEY;

      if (!cloudinaryKey) {
        return {
          status: HealthStatus.UP,
          name: 'media_service',
          message: 'Media service not configured',
        };
      }

      return {
        status: HealthStatus.UP,
        name: 'media_service',
        message: 'Media service is configured',
      };
    } catch (error) {
      return {
        status: HealthStatus.DOWN,
        name: 'media_service',
        message: 'Media service check failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Liveness probe (quick check if service is running)
   */
  async getLivenessProbe(): Promise<HealthResponse> {
    const memUsage = process.memoryUsage();

    return {
      status: HealthStatus.UP,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: [
        {
          status: HealthStatus.UP,
          name: 'liveness',
          message: 'Service is running',
        },
      ],
      systemMetrics: {
        memory: {
          heapUsed: memUsage.heapUsed,
          heapTotal: memUsage.heapTotal,
          percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100,
        },
      },
    };
  }

  /**
   * Readiness probe (checks if service is ready to accept traffic)
   */
  async getReadinessProbe(): Promise<HealthResponse> {
    try {
      // Check database connectivity
      await this.prisma.$queryRaw`SELECT 1`;

      const memUsage = process.memoryUsage();

      return {
        status: HealthStatus.UP,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        checks: [
          {
            status: HealthStatus.UP,
            name: 'readiness',
            message: 'Service is ready to accept traffic',
          },
        ],
        systemMetrics: {
          memory: {
            heapUsed: memUsage.heapUsed,
            heapTotal: memUsage.heapTotal,
            percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100,
          },
        },
      };
    } catch (error) {
      return {
        status: HealthStatus.DOWN,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        checks: [
          {
            status: HealthStatus.DOWN,
            name: 'readiness',
            message: 'Service is not ready',
            details: {
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          },
        ],
      };
    }
  }

  /**
   * Determine overall health status from individual checks
   */
  private determineOverallStatus(checks: HealthCheckResult[]): HealthStatus {
    const hasDown = checks.some(c => c.status === HealthStatus.DOWN);
    if (hasDown) return HealthStatus.DOWN;

    const hasDegraded = checks.some(c => c.status === HealthStatus.DEGRADED);
    if (hasDegraded) return HealthStatus.DEGRADED;

    return HealthStatus.UP;
  }

  /**
   * Parse Redis memory info
   */
  private parseRedisMemory(info: string): { used: string; percentage: number } {
    const lines = info.split('\r\n');
    let usedMemory = 0;
    let maxMemory = 0;

    for (const line of lines) {
      if (line.startsWith('used_memory:')) {
        usedMemory = parseInt(line.split(':')[1]);
      }
      if (line.startsWith('maxmemory:')) {
        maxMemory = parseInt(line.split(':')[1]);
      }
    }

    const used = `${(usedMemory / 1024 / 1024).toFixed(2)} MB`;
    const percentage = maxMemory > 0 ? (usedMemory / maxMemory) * 100 : 0;

    return { used, percentage };
  }

  /**
   * Initialize event loop lag monitoring
   */
  private initializeEventLoopMonitoring() {
    // Sample event loop lag every 1 second
    setInterval(() => {
      const start = process.hrtime.bigint();

      setImmediate(() => {
        const end = process.hrtime.bigint();
        const lag = Number(end - start) / 1000000; // Convert to milliseconds

        this.eventLoopLagSamples.push(lag);

        // Keep only last 60 samples (1 minute)
        if (this.eventLoopLagSamples.length > 60) {
          this.eventLoopLagSamples.shift();
        }
      });
    }, 1000);
  }

  /**
   * Get average event loop lag
   */
  private getAverageEventLoopLag(): number {
    if (this.eventLoopLagSamples.length === 0) {
      return 0;
    }

    const sum = this.eventLoopLagSamples.reduce((a, b) => a + b, 0);
    return sum / this.eventLoopLagSamples.length;
  }

  /**
   * Get health metrics for dashboard
   */
  async getDashboardMetrics(): Promise<Record<string, any>> {
    const health = await this.getFullHealthStatus();
    const memUsage = process.memoryUsage();

    return {
      status: health.status,
      uptime: health.uptime,
      memory: {
        heapUsed: (memUsage.heapUsed / 1024 / 1024).toFixed(2),
        heapTotal: (memUsage.heapTotal / 1024 / 1024).toFixed(2),
        rss: (memUsage.rss / 1024 / 1024).toFixed(2),
        percentage: ((memUsage.heapUsed / memUsage.heapTotal) * 100).toFixed(2),
      },
      checks: health.checks.map(check => ({
        name: check.name,
        status: check.status,
        message: check.message,
        responseTime: check.responseTime,
      })),
      timestamp: health.timestamp,
    };
  }
}
