import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';
import { CorrelationService } from './correlation.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  constructor(private readonly loggingService: LoggingService) {}

  use(request: Request, response: Response, next: NextFunction) {
    const startTime = Date.now();

    // Extract or generate correlation ID
    let correlationId = CorrelationService.extractFromHeaders(request.headers);
    if (!correlationId) {
      correlationId = CorrelationService.generateCorrelationId();
    }

    // Start correlation context early
    const correlationContext = CorrelationService.startContext(correlationId);

    // Set user ID if available (from JWT middleware that runs before this)
    const userId = this.extractUserId(request);
    if (userId) {
      CorrelationService.setUserId(userId);
    }

    // Add request metadata
    CorrelationService.addMetadata('endpoint', request.path);
    CorrelationService.addMetadata('method', request.method);
    CorrelationService.addMetadata('ip', this.getClientIP(request));
    CorrelationService.addMetadata('userAgent', request.get('User-Agent'));
    CorrelationService.addMetadata('query', JSON.stringify(request.query));
    CorrelationService.addMetadata('params', JSON.stringify(request.params));

    // Log incoming request
    this.loggingService.logWithContext('info', `Incoming ${request.method} ${request.path}`, {
      correlationId,
      requestId: correlationContext.requestId,
      endpoint: request.path,
      method: request.method,
      ip: this.getClientIP(request),
      userAgent: request.get('User-Agent'),
      metadata: {
        query: request.query,
        headers: this.sanitizeHeaders(request.headers),
      },
    });

    // Override response.end to log response
    const originalEnd = response.end;
    const self = this;
    response.end = function (chunk?: any, encoding?: BufferEncoding | (() => void)) {
      const duration = Date.now() - startTime;

      // Log response
      self.loggingService.logWithContext(
        response.statusCode >= 400 ? 'warn' : 'info',
        `Response ${request.method} ${request.path} - ${response.statusCode}`,
        {
          correlationId,
          requestId: correlationContext.requestId,
          endpoint: request.path,
          method: request.method,
          statusCode: response.statusCode,
          duration,
          metadata: {
            responseSize: chunk ? chunk.length : 0,
          },
        },
      );

      // Add correlation headers
      CorrelationService.addToHeaders(response.getHeaders());

      // Call original end method
      if (typeof encoding === 'function') {
        return (originalEnd as any).call(this, chunk, encoding);
      } else {
        return (originalEnd as any).call(this, chunk, encoding);
      }
    };

    // Override response.json to capture response data
    const originalJson = response.json;
    response.json = function (data: any) {
      // Add correlation ID to response
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        data._correlationId = correlationId;
      }

      return originalJson.call(this, data);
    };

    next();
  }

  private extractUserId(request: Request): string | undefined {
    // Try to get user ID from various sources
    return (
      (request as any).users?.id ||
      (request as any).users?.userId ||
      (request.headers['x-user-id'] as string) ||
      (request.query.userId as string)
    );
  }

  private getClientIP(request: Request): string {
    return (
      request.ip ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      (request.headers['x-forwarded-for'] as string) ||
      (request.headers['x-real-ip'] as string) ||
      'unknown'
    )
      .split(',')[0]
      .trim();
  }

  private sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'password'];
    const sanitized = { ...headers };

    sensitiveHeaders.forEach(header => {
      if (sanitized[header.toLowerCase()]) {
        sanitized[header.toLowerCase()] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}
