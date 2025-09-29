import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Request, Response } from 'express';
import { LoggingService, LogContext } from './logging.service';
import { CorrelationService } from './correlation.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();

    // Extract or generate correlation ID
    let correlationId = CorrelationService.extractFromHeaders(request.headers);
    if (!correlationId) {
      correlationId = CorrelationService.generateCorrelationId();
    }

    // Start correlation context
    const correlationContext = CorrelationService.startContext(correlationId);

    // Set user ID if available (from JWT or session)
    const userId = this.extractUserId(request);
    if (userId) {
      CorrelationService.setUserId(userId);
    }

    // Add metadata
    CorrelationService.addMetadata('endpoint', request.path);
    CorrelationService.addMetadata('method', request.method);
    CorrelationService.addMetadata('ip', this.getClientIP(request));
    CorrelationService.addMetadata('userAgent', request.get('User-Agent'));

    // Create log context
    const logContext: LogContext = {
      correlationId,
      userId,
      requestId: correlationContext.requestId,
      endpoint: request.path,
      method: request.method,
      ip: this.getClientIP(request),
      userAgent: request.get('User-Agent'),
    };

    // Log request start
    this.loggingService.logRequest(logContext);

    return next.handle().pipe(
      tap((data) => {
        // Log successful response
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;

        this.loggingService.logResponse({
          ...logContext,
          duration,
          statusCode,
          metadata: {
            responseSize: this.getResponseSize(data),
          },
        });

        // Add correlation headers to response
        CorrelationService.addToHeaders(response.getHeaders());
      }),
      catchError((error) => {
        // Log error response
        const duration = Date.now() - startTime;

        this.loggingService.logError(error, {
          ...logContext,
          duration,
          statusCode: error.status || 500,
          error: {
            code: error.code || error.name || 'UNKNOWN_ERROR',
            message: error.message,
            stack: error.stack,
            details: error.details || error.response,
          },
        });

        // Add correlation headers even on error
        CorrelationService.addToHeaders(response.getHeaders());

        return throwError(() => error);
      }),
    );
  }

  private extractUserId(request: Request): string | undefined {
    // Try to get user ID from various sources
    return (
      (request as any).user?.id ||
      (request as any).user?.userId ||
      request.headers['x-user-id'] as string ||
      request.query.userId as string
    );
  }

  private getClientIP(request: Request): string {
    return (
      request.ip ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      request.headers['x-forwarded-for'] as string ||
      request.headers['x-real-ip'] as string ||
      'unknown'
    ).split(',')[0].trim();
  }

  private safeStringify(obj: any): string {
    const seen = new WeakSet();
    return JSON.stringify(obj, function (_key, value) {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return '[Circular]';
        seen.add(value);
        if (value instanceof Map) {
          try {
            return Object.fromEntries(value);
          } catch {
            return '[Map]';
          }
        }
      }
      return value;
    });
  }

  private getResponseSize(data: any): number {
    try {
      if (typeof data === 'string') {
        return Buffer.byteLength(data, 'utf8');
      }
      const jsonString = this.safeStringify(data);
      return Buffer.byteLength(jsonString, 'utf8');
    } catch {
      return 0;
    }
  }
}
