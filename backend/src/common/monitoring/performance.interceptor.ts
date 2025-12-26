import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap, throwError } from 'rxjs';
import { MetricsService } from './metrics.service';

/**
 * Performance tracking interceptor
 * Records request metrics and performance data for monitoring
 * Integrates with MetricsService for Prometheus metrics collection
 */
@Injectable()
export class PerformanceTrackingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceTrackingInterceptor.name);
  private activeRequests = new Map<string, number>();

  constructor(private readonly metricsService: MetricsService) {
    this.startMemoryMonitoring();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'unknown';
    const requestId = this.generateRequestId();

    // Clean up the URL path for better metrics aggregation
    const cleanPath = this.cleanPath(url);
    const route = this.normalizeRoute(method, cleanPath);

    const startTime = Date.now();
    const startMemory = process.memoryUsage();

    // Track active request
    this.trackActiveRequest(requestId, 1);

    // Log incoming request (debug level)
    this.logger.debug(`[${requestId}] Incoming request: ${method} ${cleanPath} - IP: ${ip}`);

    return next.handle().pipe(
      tap(
        data => {
          this.onSuccess(
            requestId,
            data,
            method,
            route,
            cleanPath,
            response.statusCode,
            startTime,
            startMemory,
          );
        },
        error => {
          this.onError(requestId, error, method, route, cleanPath, startTime);
        },
      ),
      // Ensure cleanup happens even with errors
      tap({
        next: () => {
          this.trackActiveRequest(requestId, -1);
        },
        error: () => {
          this.trackActiveRequest(requestId, -1);
        },
      }),
    );
  }

  /**
   * Handle successful response
   */
  private onSuccess(
    requestId: string,
    data: any,
    method: string,
    route: string,
    fullPath: string,
    statusCode: number,
    startTime: number,
    startMemory: NodeJS.MemoryUsage,
  ) {
    const duration = Date.now() - startTime;
    const endMemory = process.memoryUsage();

    // Calculate memory delta
    const memoryDelta = {
      heapUsed: endMemory.heapUsed - startMemory.heapUsed,
      external: (endMemory.external || 0) - (startMemory.external || 0),
    };

    // Determine response size
    let responseSize = 0;
    if (data) {
      responseSize = JSON.stringify(data).length;
    }

    // Record metrics
    this.metricsService.recordHttpRequest(
      method,
      route,
      statusCode,
      duration,
      undefined,
      responseSize,
    );

    // Log performance metrics
    const logLevel = this.getLogLevel(duration, statusCode);
    const logMessage = `[${requestId}] ${method} ${fullPath} - ${statusCode} - ${duration}ms - Mem: ${(memoryDelta.heapUsed / 1024).toFixed(2)}KB`;

    if (logLevel === 'warn') {
      this.logger.warn(logMessage);
    } else if (logLevel === 'error') {
      this.logger.error(logMessage);
    } else {
      this.logger.debug(logMessage);
    }

    // Set active connections metric
    this.metricsService.setActiveConnections(this.activeRequests.size);
  }

  /**
   * Handle error response
   */
  private onError(
    requestId: string,
    error: any,
    method: string,
    route: string,
    fullPath: string,
    startTime: number,
  ) {
    const duration = Date.now() - startTime;
    const statusCode = error.status || error.statusCode || 500;

    // Record error metrics
    this.metricsService.recordHttpRequest(method, route, statusCode, duration);

    // Log error
    this.logger.error(
      `[${requestId}] ${method} ${fullPath} - ${statusCode} - ${duration}ms - Error: ${error.message}`,
      error.stack,
    );

    // Set active connections metric
    this.metricsService.setActiveConnections(this.activeRequests.size);
  }

  /**
   * Clean URL path by removing query parameters
   */
  private cleanPath(url: string): string {
    return url.split('?')[0];
  }

  /**
   * Normalize route by replacing IDs with placeholders
   */
  private normalizeRoute(method: string, path: string): string {
    const normalized = path
      // Replace UUID patterns
      .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
      // Replace numeric IDs
      .replace(/\/\d+(?=\/|$)/g, '/:id')
      // Replace slugs that look like they end the path
      .replace(/\/[a-z0-9-]+(?:\/)?$/i, '/:slug');

    return `${method} ${normalized}`;
  }

  /**
   * Determine logging level based on duration and status
   */
  private getLogLevel(duration: number, statusCode: number): 'debug' | 'warn' | 'error' {
    if (statusCode >= 500) return 'error';
    if (statusCode >= 400) return 'warn';
    if (duration > 2000) return 'warn';
    if (duration > 1000) return 'warn';
    return 'debug';
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Track active requests
   */
  private trackActiveRequest(requestId: string, delta: number) {
    const current = this.activeRequests.get(requestId) || 0;
    const newCount = current + delta;

    if (newCount <= 0) {
      this.activeRequests.delete(requestId);
    } else {
      this.activeRequests.set(requestId, newCount);
    }
  }

  /**
   * Start memory monitoring
   */
  private startMemoryMonitoring() {
    // Update memory metrics every 30 seconds
    setInterval(() => {
      this.metricsService.updateMemoryMetrics();
    }, 30000);

    // Monitor for memory leaks
    let lastMemory = process.memoryUsage().heapUsed;
    setInterval(() => {
      const currentMemory = process.memoryUsage().heapUsed;
      const delta = currentMemory - lastMemory;

      if (delta > 10 * 1024 * 1024) {
        // More than 10MB increase
        this.logger.warn(
          `Potential memory leak detected: ${(delta / 1024 / 1024).toFixed(2)}MB increase`,
        );
      }

      lastMemory = currentMemory;
    }, 60000); // Check every minute
  }

  /**
   * Get active request count (for testing)
   */
  getActiveRequestCount(): number {
    return this.activeRequests.size;
  }

  /**
   * Get active requests (for testing)
   */
  getActiveRequests(): Map<string, number> {
    return new Map(this.activeRequests);
  }
}
