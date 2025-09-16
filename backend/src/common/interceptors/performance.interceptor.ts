import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PerformanceService } from '../../modules/monitoring/performance.service';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);

  constructor(private readonly performanceService: PerformanceService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'];

    return next.handle().pipe(
      tap({
        next: () => {
          this.recordMetrics(startTime, method, url, response.statusCode, ip, userAgent);
        },
        error: (error) => {
          const statusCode = error.status || 500;
          this.recordMetrics(startTime, method, url, statusCode, ip, userAgent);
        },
      }),
    );
  }

  private recordMetrics(
    startTime: number,
    method: string,
    path: string,
    statusCode: number,
    ip: string,
    userAgent: string,
  ) {
    const duration = Date.now() - startTime;

    // Clean up the path (remove query parameters and IDs)
    const cleanPath = this.cleanPath(path);

    // Record request metrics
    this.performanceService.recordRequest({
      method,
      path: cleanPath,
      statusCode,
      duration,
      timestamp: new Date(),
      userAgent,
      ip,
    });

    // Record custom metrics
    this.performanceService.recordMetric('api_response_time', duration, {
      method,
      path: cleanPath,
      status: statusCode.toString(),
    });

    // Log slow requests
    if (duration > 1000) {
      this.logger.warn(`Slow request: ${method} ${cleanPath} - ${duration}ms`);
    }

    // Log errors
    if (statusCode >= 400) {
      this.logger.error(`Error request: ${method} ${cleanPath} - ${statusCode} - ${duration}ms`);
    }
  }

  private cleanPath(path: string): string {
    // Remove query parameters
    const pathWithoutQuery = path.split('?')[0];
    
    // Replace UUIDs and numeric IDs with placeholders
    return pathWithoutQuery
      .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
      .replace(/\/\d+/g, '/:id')
      .replace(/\/[a-z0-9-]+$/i, '/:slug'); // Replace potential slugs at the end
  }
}
