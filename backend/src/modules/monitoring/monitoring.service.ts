import { Injectable } from '@nestjs/common';
import { Counter, Histogram, Gauge, register } from 'prom-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MonitoringService {
  private readonly requestCounter: Counter<string>;
  private readonly responseTimeHistogram: Histogram<string>;
  private readonly activeConnectionsGauge: Gauge<string>;
  private readonly dbConnectionPoolGauge: Gauge<string>;
  private readonly memoryUsageGauge: Gauge<string>;
  private readonly errorCounter: Counter<string>;

  constructor(private configService: ConfigService) {
    // Request metrics
    this.requestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    // Response time metrics
    this.responseTimeHistogram = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5, 10],
    });

    // Active connections
    this.activeConnectionsGauge = new Gauge({
      name: 'active_websocket_connections',
      help: 'Number of active WebSocket connections',
      labelNames: ['type'],
    });

    // Database connection pool
    this.dbConnectionPoolGauge = new Gauge({
      name: 'database_connection_pool_size',
      help: 'Database connection pool size',
      labelNames: ['state'],
    });

    // Memory usage
    this.memoryUsageGauge = new Gauge({
      name: 'memory_usage_bytes',
      help: 'Memory usage in bytes',
      labelNames: ['type'],
    });

    // Error counter
    this.errorCounter = new Counter({
      name: 'application_errors_total',
      help: 'Total number of application errors',
      labelNames: ['type', 'endpoint'],
    });

    // Update memory metrics every 30 seconds
    setInterval(() => this.updateMemoryMetrics(), 30000);
  }

  recordRequest(method: string, route: string, statusCode: number, duration: number) {
    this.requestCounter.inc({ method, route, status_code: statusCode.toString() });
    this.responseTimeHistogram.observe(
      { method, route, status_code: statusCode.toString() },
      duration / 1000,
    );
  }

  updateActiveConnections(type: string, count: number) {
    this.activeConnectionsGauge.set({ type }, count);
  }

  updateDatabasePoolMetrics(used: number, available: number, pending: number) {
    this.dbConnectionPoolGauge.set({ state: 'used' }, used);
    this.dbConnectionPoolGauge.set({ state: 'available' }, available);
    this.dbConnectionPoolGauge.set({ state: 'pending' }, pending);
  }

  recordError(type: string, endpoint: string) {
    this.errorCounter.inc({ type, endpoint });
  }

  private updateMemoryMetrics() {
    const memUsage = process.memoryUsage();
    this.memoryUsageGauge.set({ type: 'rss' }, memUsage.rss);
    this.memoryUsageGauge.set({ type: 'heapUsed' }, memUsage.heapUsed);
    this.memoryUsageGauge.set({ type: 'heapTotal' }, memUsage.heapTotal);
    this.memoryUsageGauge.set({ type: 'external' }, memUsage.external);
  }

  getMetrics() {
    return register.metrics();
  }

  getHealthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  getDetailedHealth() {
    const memUsage = process.memoryUsage();
    const totalMemory = memUsage.heapUsed + memUsage.heapTotal;

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(memUsage.heapUsed / 1024 / 1024),
        total: Math.round(totalMemory / 1024 / 1024),
        percentage: Math.round((memUsage.heapUsed / totalMemory) * 100),
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        pid: process.pid,
      },
      database: {
        status: 'connected', // This should be checked from actual DB connection
        lastCheck: new Date().toISOString(),
      },
    };
  }
}
