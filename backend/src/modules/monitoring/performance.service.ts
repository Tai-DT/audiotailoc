import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from '../caching/cache.service';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  tags?: Record<string, string>;
}

interface RequestMetrics {
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
}

@Injectable()
export class PerformanceService {
  private readonly logger = new Logger(PerformanceService.name);
  private metrics: PerformanceMetric[] = [];
  private requestMetrics: RequestMetrics[] = [];
  private readonly maxMetrics = 10000; // Keep last 10k metrics in memory

  constructor(private readonly cacheService: CacheService) {
    // Clean up old metrics every hour
    setInterval(
      () => {
        this.cleanupMetrics();
      },
      60 * 60 * 1000,
    );
  }

  // Record a custom metric
  recordMetric(name: string, value: number, tags?: Record<string, string>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date(),
      tags,
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log significant metrics
    if (this.shouldLogMetric(name, value)) {
      this.logger.log(`Metric: ${name} = ${value}`, tags);
    }
  }

  // Record request performance
  recordRequest(metrics: RequestMetrics) {
    this.requestMetrics.push(metrics);

    // Keep only recent requests
    if (this.requestMetrics.length > this.maxMetrics) {
      this.requestMetrics = this.requestMetrics.slice(-this.maxMetrics);
    }

    // Log slow requests
    if (metrics.duration > 1000) {
      // > 1 second
      this.logger.warn(
        `Slow request: ${metrics.method} ${metrics.path} took ${metrics.duration}ms`,
      );
    }

    // Update cache with aggregated metrics
    this.updateAggregatedMetrics(metrics);
  }

  // Get performance statistics
  async getStats(timeRange: 'hour' | 'day' | 'week' = 'hour'): Promise<{
    requests: {
      total: number;
      averageResponseTime: number;
      errorRate: number;
      requestsPerMinute: number;
    };
    endpoints: Array<{
      path: string;
      method: string;
      count: number;
      averageResponseTime: number;
      errorRate: number;
    }>;
    system: {
      memoryUsage: NodeJS.MemoryUsage;
      uptime: number;
      cpuUsage: NodeJS.CpuUsage;
    };
    cache: {
      hitRate: number;
      keyCount: number;
      memoryUsage: string;
    };
  }> {
    const now = new Date();
    const timeRangeMs = this.getTimeRangeMs(timeRange);
    const cutoff = new Date(now.getTime() - timeRangeMs);

    // Filter recent requests
    const recentRequests = this.requestMetrics.filter(r => r.timestamp >= cutoff);

    // Calculate request statistics
    const totalRequests = recentRequests.length;
    const averageResponseTime =
      totalRequests > 0
        ? recentRequests.reduce((sum, r) => sum + r.duration, 0) / totalRequests
        : 0;
    const errorRequests = recentRequests.filter(r => r.statusCode >= 400).length;
    const errorRate = totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0;
    const requestsPerMinute = totalRequests / (timeRangeMs / 60000);

    // Calculate endpoint statistics
    const endpointStats = new Map<
      string,
      {
        count: number;
        totalDuration: number;
        errors: number;
        method: string;
      }
    >();

    recentRequests.forEach(request => {
      const key = `${request.method}:${request.path}`;
      const existing = endpointStats.get(key) || {
        count: 0,
        totalDuration: 0,
        errors: 0,
        method: request.method,
      };

      existing.count++;
      existing.totalDuration += request.duration;
      if (request.statusCode >= 400) {
        existing.errors++;
      }

      endpointStats.set(key, existing);
    });

    const endpoints = Array.from(endpointStats.entries())
      .map(([key, stats]) => ({
        path: key.split(':')[1],
        method: stats.method,
        count: stats.count,
        averageResponseTime: stats.totalDuration / stats.count,
        errorRate: (stats.errors / stats.count) * 100,
      }))
      .sort((a, b) => b.count - a.count);

    // Get system metrics
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    const cpuUsage = process.cpuUsage();

    // Get cache statistics
    const cacheStats = await this.cacheService.getStats();

    return {
      requests: {
        total: totalRequests,
        averageResponseTime,
        errorRate,
        requestsPerMinute,
      },
      endpoints,
      system: {
        memoryUsage,
        uptime,
        cpuUsage,
      },
      cache: {
        hitRate: 0, // Would need to track this separately
        keyCount: cacheStats.keysCount || 0,
        memoryUsage: cacheStats.memoryUsage || 'Unknown',
      },
    };
  }

  // Get real-time metrics
  getRealTimeMetrics(): {
    activeRequests: number;
    memoryUsage: NodeJS.MemoryUsage;
    uptime: number;
  } {
    return {
      activeRequests: this.getActiveRequestCount(),
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
    };
  }

  // Get custom metrics
  getCustomMetrics(
    name?: string,
    timeRange: 'hour' | 'day' | 'week' = 'hour',
  ): PerformanceMetric[] {
    const now = new Date();
    const timeRangeMs = this.getTimeRangeMs(timeRange);
    const cutoff = new Date(now.getTime() - timeRangeMs);

    let filtered = this.metrics.filter(m => m.timestamp >= cutoff);

    if (name) {
      filtered = filtered.filter(m => m.name === name);
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Health check
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Array<{
      name: string;
      status: 'pass' | 'fail';
      message?: string;
      duration?: number;
    }>;
  }> {
    const checks: Array<{
      name: string;
      status: 'pass' | 'fail';
      message?: string;
      duration?: number;
    }> = [];
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const memoryUsagePercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

    checks.push({
      name: 'memory',
      status: memoryUsagePercent < 90 ? 'pass' : 'fail',
      message: `Memory usage: ${memoryUsagePercent.toFixed(1)}%`,
    });

    if (memoryUsagePercent > 90) {
      overallStatus = 'unhealthy';
    } else if (memoryUsagePercent > 80) {
      overallStatus = 'degraded';
    }

    // Check response times
    const recentRequests = this.requestMetrics.slice(-100); // Last 100 requests
    if (recentRequests.length > 0) {
      const avgResponseTime =
        recentRequests.reduce((sum, r) => sum + r.duration, 0) / recentRequests.length;

      checks.push({
        name: 'response_time',
        status: avgResponseTime < 1000 ? 'pass' : 'fail',
        message: `Average response time: ${avgResponseTime.toFixed(0)}ms`,
        duration: avgResponseTime,
      });

      if (avgResponseTime > 2000) {
        overallStatus = 'unhealthy';
      } else if (avgResponseTime > 1000 && overallStatus === 'healthy') {
        overallStatus = 'degraded';
      }
    }

    // Check error rate
    const recentErrors = recentRequests.filter(r => r.statusCode >= 500).length;
    const errorRate = recentRequests.length > 0 ? (recentErrors / recentRequests.length) * 100 : 0;

    checks.push({
      name: 'error_rate',
      status: errorRate < 5 ? 'pass' : 'fail',
      message: `Error rate: ${errorRate.toFixed(1)}%`,
    });

    if (errorRate > 10) {
      overallStatus = 'unhealthy';
    } else if (errorRate > 5 && overallStatus === 'healthy') {
      overallStatus = 'degraded';
    }

    // Check cache connectivity
    try {
      const cacheStats = await this.cacheService.getStats();
      checks.push({
        name: 'cache',
        status: cacheStats.connected ? 'pass' : 'fail',
        message: cacheStats.connected ? 'Cache connected' : 'Cache disconnected',
      });

      if (!cacheStats.connected && overallStatus === 'healthy') {
        overallStatus = 'degraded';
      }
    } catch (error) {
      checks.push({
        name: 'cache',
        status: 'fail',
        message: 'Cache check failed',
      });
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      checks,
    };
  }

  private shouldLogMetric(name: string, value: number): boolean {
    // Log database query times > 100ms
    if (name.includes('db_query') && value > 100) return true;

    // Log cache miss rates > 50%
    if (name.includes('cache_miss_rate') && value > 50) return true;

    // Log API response times > 500ms
    if (name.includes('api_response_time') && value > 500) return true;

    return false;
  }

  private updateAggregatedMetrics(request: RequestMetrics) {
    // Update metrics in cache for dashboard
    const key = `metrics:requests:${request.method}:${request.path}`;
    this.cacheService.increment(key, 1, { ttl: 3600 }); // 1 hour TTL
  }

  private getTimeRangeMs(timeRange: 'hour' | 'day' | 'week'): number {
    switch (timeRange) {
      case 'hour':
        return 60 * 60 * 1000;
      case 'day':
        return 24 * 60 * 60 * 1000;
      case 'week':
        return 7 * 24 * 60 * 60 * 1000;
      default:
        return 60 * 60 * 1000;
    }
  }

  private getActiveRequestCount(): number {
    // Return count of requests in the last 30 seconds as a proxy for active requests
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    return this.requestMetrics.filter(r => r.timestamp >= thirtySecondsAgo).length;
  }

  private cleanupMetrics() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    this.metrics = this.metrics.filter(m => m.timestamp > oneHourAgo);
    this.requestMetrics = this.requestMetrics.filter(r => r.timestamp > oneHourAgo);

    this.logger.log(
      `Cleaned up old metrics. Current count: ${this.metrics.length} metrics, ${this.requestMetrics.length} requests`,
    );
  }
}
