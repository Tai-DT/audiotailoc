import { Injectable, Logger } from '@nestjs/common';
import * as promClient from 'prom-client';

/**
 * Prometheus metrics service
 * Provides comprehensive metrics collection for monitoring and observability
 */
@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  // HTTP metrics
  private httpRequestDuration: promClient.Histogram;
  private httpRequestSize: promClient.Histogram;
  private httpResponseSize: promClient.Histogram;
  private httpRequestCount: promClient.Counter;
  private httpErrorCount: promClient.Counter;

  // Database metrics
  private dbQueryDuration: promClient.Histogram;
  private dbQueryCount: promClient.Counter;
  private dbConnectionPool: promClient.Gauge;
  private dbSlowQueries: promClient.Counter;

  // Cache metrics
  private cacheHitRate: promClient.Counter;
  private cacheMissRate: promClient.Counter;
  private cacheOperationDuration: promClient.Histogram;
  private cacheSize: promClient.Gauge;

  // Business metrics
  private bookingCount: promClient.Counter;
  private orderCount: promClient.Counter;
  private paymentCount: promClient.Counter;
  private userRegistrationCount: promClient.Counter;

  // System metrics
  private activeConnections: promClient.Gauge;
  private queueDepth: promClient.Gauge;
  private errorRate: promClient.Gauge;

  // Memory and GC metrics
  private heapSizeGauge: promClient.Gauge;
  private externalMemoryGauge: promClient.Gauge;
  private gcDurationSummary: promClient.Summary;

  constructor() {
    // Register default metrics (CPU, memory, event loop lag, etc.)
    promClient.collectDefaultMetrics();

    this.initializeHttpMetrics();
    this.initializeDatabaseMetrics();
    this.initializeCacheMetrics();
    this.initializeBusinessMetrics();
    this.initializeSystemMetrics();
    this.initializeMemoryMetrics();

    this.logger.log('Metrics service initialized');
  }

  /**
   * Initialize HTTP metrics
   */
  private initializeHttpMetrics() {
    this.httpRequestDuration = new promClient.Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request latency in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
    });

    this.httpRequestSize = new promClient.Histogram({
      name: 'http_request_size_bytes',
      help: 'HTTP request size in bytes',
      labelNames: ['method', 'route'],
      buckets: [100, 1000, 5000, 10000, 50000, 100000, 500000],
    });

    this.httpResponseSize = new promClient.Histogram({
      name: 'http_response_size_bytes',
      help: 'HTTP response size in bytes',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [100, 1000, 5000, 10000, 50000, 100000, 500000],
    });

    this.httpRequestCount = new promClient.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    this.httpErrorCount = new promClient.Counter({
      name: 'http_errors_total',
      help: 'Total number of HTTP errors',
      labelNames: ['method', 'route', 'status_code'],
    });
  }

  /**
   * Initialize database metrics
   */
  private initializeDatabaseMetrics() {
    this.dbQueryDuration = new promClient.Histogram({
      name: 'db_query_duration_seconds',
      help: 'Database query duration in seconds',
      labelNames: ['operation', 'model', 'status'],
      buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
    });

    this.dbQueryCount = new promClient.Counter({
      name: 'db_queries_total',
      help: 'Total number of database queries',
      labelNames: ['operation', 'model', 'status'],
    });

    this.dbConnectionPool = new promClient.Gauge({
      name: 'db_connection_pool_size',
      help: 'Database connection pool size',
      labelNames: ['status'],
    });

    this.dbSlowQueries = new promClient.Counter({
      name: 'db_slow_queries_total',
      help: 'Total number of slow database queries (>100ms)',
      labelNames: ['model'],
    });
  }

  /**
   * Initialize cache metrics
   */
  private initializeCacheMetrics() {
    this.cacheHitRate = new promClient.Counter({
      name: 'cache_hits_total',
      help: 'Total cache hits',
      labelNames: ['cache_type', 'key_pattern'],
    });

    this.cacheMissRate = new promClient.Counter({
      name: 'cache_misses_total',
      help: 'Total cache misses',
      labelNames: ['cache_type', 'key_pattern'],
    });

    this.cacheOperationDuration = new promClient.Histogram({
      name: 'cache_operation_duration_seconds',
      help: 'Cache operation duration in seconds',
      labelNames: ['operation', 'cache_type'],
      buckets: [0.0001, 0.001, 0.01, 0.05, 0.1],
    });

    this.cacheSize = new promClient.Gauge({
      name: 'cache_size_bytes',
      help: 'Cache size in bytes',
      labelNames: ['cache_type'],
    });
  }

  /**
   * Initialize business metrics
   */
  private initializeBusinessMetrics() {
    this.bookingCount = new promClient.Counter({
      name: 'bookings_total',
      help: 'Total number of bookings',
      labelNames: ['status'],
    });

    this.orderCount = new promClient.Counter({
      name: 'orders_total',
      help: 'Total number of orders',
      labelNames: ['status'],
    });

    this.paymentCount = new promClient.Counter({
      name: 'payments_total',
      help: 'Total number of payments',
      labelNames: ['status', 'method'],
    });

    this.userRegistrationCount = new promClient.Counter({
      name: 'user_registrations_total',
      help: 'Total number of user registrations',
      labelNames: ['provider'],
    });
  }

  /**
   * Initialize system metrics
   */
  private initializeSystemMetrics() {
    this.activeConnections = new promClient.Gauge({
      name: 'active_connections',
      help: 'Number of active connections',
    });

    this.queueDepth = new promClient.Gauge({
      name: 'queue_depth',
      help: 'Queue depth for async operations',
      labelNames: ['queue_name'],
    });

    this.errorRate = new promClient.Gauge({
      name: 'error_rate',
      help: 'Current error rate (percentage)',
    });
  }

  /**
   * Initialize memory and GC metrics
   */
  private initializeMemoryMetrics() {
    this.heapSizeGauge = new promClient.Gauge({
      name: 'nodejs_heap_size_used_bytes',
      help: 'Node.js heap size in bytes',
      labelNames: ['type'],
    });

    this.externalMemoryGauge = new promClient.Gauge({
      name: 'nodejs_external_memory_bytes',
      help: 'Node.js external memory in bytes',
    });

    this.gcDurationSummary = new promClient.Summary({
      name: 'nodejs_gc_duration_seconds',
      help: 'Garbage collection duration in seconds',
      labelNames: ['type'],
      percentiles: [0.5, 0.9, 0.99],
    });
  }

  // ==================== HTTP Metrics ====================

  /**
   * Record HTTP request metrics
   */
  recordHttpRequest(
    method: string,
    route: string,
    statusCode: number,
    duration: number,
    requestSize?: number,
    responseSize?: number,
  ) {
    const durationSeconds = duration / 1000;

    this.httpRequestDuration.labels(method, route, statusCode.toString()).observe(durationSeconds);
    this.httpRequestCount.labels(method, route, statusCode.toString()).inc();

    if (requestSize) {
      this.httpRequestSize.labels(method, route).observe(requestSize);
    }

    if (responseSize) {
      this.httpResponseSize.labels(method, route, statusCode.toString()).observe(responseSize);
    }

    if (statusCode >= 400) {
      this.httpErrorCount.labels(method, route, statusCode.toString()).inc();
    }
  }

  // ==================== Database Metrics ====================

  /**
   * Record database query metrics
   */
  recordDatabaseQuery(
    operation: string,
    model: string,
    duration: number,
    status: 'success' | 'error' = 'success',
  ) {
    const durationSeconds = duration / 1000;

    this.dbQueryDuration.labels(operation, model, status).observe(durationSeconds);
    this.dbQueryCount.labels(operation, model, status).inc();

    // Record slow queries
    if (duration > 100) {
      this.dbSlowQueries.labels(model).inc();
    }
  }

  /**
   * Set database connection pool metrics
   */
  setDatabaseConnectionPool(available: number, inUse: number, total: number) {
    this.dbConnectionPool.labels('available').set(available);
    this.dbConnectionPool.labels('in_use').set(inUse);
    this.dbConnectionPool.labels('total').set(total);
  }

  // ==================== Cache Metrics ====================

  /**
   * Record cache hit
   */
  recordCacheHit(cacheType: string, keyPattern: string) {
    this.cacheHitRate.labels(cacheType, keyPattern).inc();
  }

  /**
   * Record cache miss
   */
  recordCacheMiss(cacheType: string, keyPattern: string) {
    this.cacheMissRate.labels(cacheType, keyPattern).inc();
  }

  /**
   * Record cache operation duration
   */
  recordCacheOperation(
    operation: 'get' | 'set' | 'delete' | 'clear',
    cacheType: string,
    duration: number,
  ) {
    const durationSeconds = duration / 1000;
    this.cacheOperationDuration.labels(operation, cacheType).observe(durationSeconds);
  }

  /**
   * Set cache size
   */
  setCacheSize(cacheType: string, sizeBytes: number) {
    this.cacheSize.labels(cacheType).set(sizeBytes);
  }

  /**
   * Get cache hit rate
   */
  getCacheHitRate(_cacheType: string): number {
    const registry = promClient.register;
    const metrics = registry.getMetricsAsArray().filter(m => m.name === 'cache_hits_total');
    const misses = registry.getMetricsAsArray().filter(m => m.name === 'cache_misses_total');

    // Calculate hit rate percentage
    const totalHits = metrics.reduce((sum, m) => sum + ((m as any).values?.length || 0), 0);
    const totalMisses = misses.reduce((sum, m) => sum + ((m as any).values?.length || 0), 0);
    const total = totalHits + totalMisses;

    return total > 0 ? (totalHits / total) * 100 : 0;
  }

  // ==================== Business Metrics ====================

  /**
   * Record booking
   */
  recordBooking(status: string = 'created') {
    this.bookingCount.labels(status).inc();
  }

  /**
   * Record order
   */
  recordOrder(status: string = 'created') {
    this.orderCount.labels(status).inc();
  }

  /**
   * Record payment
   */
  recordPayment(status: string = 'completed', method: string = 'card') {
    this.paymentCount.labels(status, method).inc();
  }

  /**
   * Record user registration
   */
  recordUserRegistration(provider: string = 'email') {
    this.userRegistrationCount.labels(provider).inc();
  }

  // ==================== System Metrics ====================

  /**
   * Set active connections
   */
  setActiveConnections(count: number) {
    this.activeConnections.set(count);
  }

  /**
   * Set queue depth
   */
  setQueueDepth(queueName: string, depth: number) {
    this.queueDepth.labels(queueName).set(depth);
  }

  /**
   * Set error rate
   */
  setErrorRate(percentage: number) {
    this.errorRate.set(percentage);
  }

  // ==================== Memory Metrics ====================

  /**
   * Update memory metrics
   */
  updateMemoryMetrics() {
    const memUsage = process.memoryUsage();

    this.heapSizeGauge.labels('heap_used').set(memUsage.heapUsed);
    this.heapSizeGauge.labels('heap_total').set(memUsage.heapTotal);
    this.heapSizeGauge.labels('rss').set(memUsage.rss);
    this.externalMemoryGauge.set(memUsage.external || 0);
  }

  /**
   * Record garbage collection duration
   */
  recordGarbageCollection(type: string, duration: number) {
    this.gcDurationSummary.labels(type).observe(duration / 1000);
  }

  // ==================== Metrics Export ====================

  /**
   * Get all metrics in Prometheus format
   */
  async getMetrics(): Promise<string> {
    this.updateMemoryMetrics();
    return promClient.register.metrics();
  }

  /**
   * Get metrics as JSON
   */
  async getMetricsAsJson(): Promise<Record<string, any>> {
    this.updateMemoryMetrics();
    return {
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      cpuUsage: process.cpuUsage(),
    };
  }

  /**
   * Get Prometheus registry
   */
  getRegistry(): promClient.Registry {
    return promClient.register;
  }

  /**
   * Clear all metrics (use with caution)
   */
  clearMetrics() {
    promClient.register.clear();
    this.logger.warn('All metrics cleared');
  }
}
