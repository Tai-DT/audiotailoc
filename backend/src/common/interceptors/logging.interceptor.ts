import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, ip, user } = request;
    const userAgent = request.get('User-Agent') || '';

    const startTime = Date.now();

    const safeStringify = (obj: any) => {
      try {
        return JSON.stringify(obj, (_k, v) => (typeof v === 'bigint' ? v.toString() : v));
      } catch {
        return '';
      }
    };

    // Log incoming request
    this.logger.log(
      `[${method}] ${url} - IP: ${ip} - User: ${user?.id || 'anonymous'} - UA: ${userAgent}`,
    );

    return next.handle().pipe(
      tap({
        next: data => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          // Log successful response
          this.logger.log(
            `[${method}] ${url} - ${statusCode} - ${duration}ms - Size: ${safeStringify(data).length}`,
          );
        },
        error: error => {
          const duration = Date.now() - startTime;

          // Log error response
          this.logger.error(
            `[${method}] ${url} - ${error.status || 500} - ${duration}ms - Error: ${error.message}`,
            error.stack,
          );
        },
      }),
    );
  }
}
