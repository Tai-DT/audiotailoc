import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { MonitoringService } from '../../modules/monitoring/monitoring.service';
import * as crypto from 'crypto';

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    path: string;
    correlationId?: string;
    stack?: string;
  };
}

@Catch()
export class EnhancedExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(EnhancedExceptionFilter.name);

  constructor(
    private configService: ConfigService,
    private monitoringService: MonitoringService,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId = this.generateCorrelationId();
    const timestamp = new Date().toISOString();
    const path = request.url;
    const method = request.method;
    const userAgent = request.get('User-Agent') || '';

    // Determine status code
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // Get error details
    const errorDetails = this.getErrorDetails(exception);

    // Log error
    this.logError(exception, {
      status,
      method,
      path,
      correlationId,
      userAgent,
      ip: this.getClientIP(request),
      error: errorDetails,
    });

    // Record error in monitoring
    if (this.monitoringService) {
      this.monitoringService.recordError(errorDetails.code, path);
    }

    // Create error response
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: errorDetails.code,
        message: errorDetails.message,
        details: this.shouldIncludeDetails(status) ? errorDetails.details : undefined,
        timestamp,
        path,
        correlationId,
        stack: this.shouldIncludeStack(status) ? errorDetails.stack : undefined,
      },
    };

    // Add correlation ID to response headers
    response.setHeader('X-Correlation-ID', correlationId);
    response.setHeader('X-Request-ID', correlationId);

    // Send error response
    response.status(status).json(errorResponse);
  }

  private generateCorrelationId(): string {
    // SECURITY: Use cryptographically secure random for correlation IDs
    const randomBytes = crypto.randomBytes(6).toString('hex');
    return `req_${Date.now()}_${randomBytes}`;
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

  private getErrorDetails(exception: any): {
    code: string;
    message: string;
    details?: any;
    stack?: string;
  } {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const message =
        typeof response === 'string'
          ? response
          : typeof response === 'object' && response && 'message' in response
            ? (response as any).message
            : exception.message;
      const code =
        typeof response === 'object' && response && 'code' in response
          ? (response as any).code
          : this.getErrorCode(exception.constructor.name, exception.getStatus());

      return {
        code,
        message: Array.isArray(message) ? message.join(', ') : message,
        details: typeof response === 'object' ? response : undefined,
      };
    }

    // Handle specific error types
    if (exception.name === 'ValidationError') {
      return {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: exception.errors,
      };
    }

    if (exception.name === 'CastError') {
      return {
        code: 'INVALID_ID',
        message: 'Invalid ID format',
        details: { value: exception.value, path: exception.path },
      };
    }

    if (exception.code === 11000) {
      return {
        code: 'DUPLICATE_KEY',
        message: 'Duplicate key error',
        details: { key: Object.keys(exception.keyValue)[0] },
      };
    }

    // Default error
    return {
      code: 'INTERNAL_ERROR',
      message: exception.message || 'Internal server error',
      stack: exception.stack,
    };
  }

  private getErrorCode(className: string, status: number): string {
    const errorCodes: Record<string, string> = {
      BadRequestException: 'BAD_REQUEST',
      UnauthorizedException: 'UNAUTHORIZED',
      ForbiddenException: 'FORBIDDEN',
      NotFoundException: 'NOT_FOUND',
      ConflictException: 'CONFLICT',
      GoneException: 'GONE',
      PayloadTooLargeException: 'PAYLOAD_TOO_LARGE',
      UnsupportedMediaTypeException: 'UNSUPPORTED_MEDIA_TYPE',
      UnprocessableEntityException: 'VALIDATION_ERROR',
      InternalServerErrorException: 'INTERNAL_ERROR',
      NotImplementedException: 'NOT_IMPLEMENTED',
      BadGatewayException: 'BAD_GATEWAY',
      ServiceUnavailableException: 'SERVICE_UNAVAILABLE',
      GatewayTimeoutException: 'GATEWAY_TIMEOUT',
    };

    return errorCodes[className] || `HTTP_${status}`;
  }

  private shouldIncludeDetails(status: number): boolean {
    // Include details for client errors but not server errors
    return status >= 400 && status < 500;
  }

  private shouldIncludeStack(status: number): boolean {
    // SECURITY: Never include stack traces in production to prevent information leakage
    // Stack traces can reveal file paths, internal structure, and implementation details
    const isDevelopment = this.configService.get('NODE_ENV') !== 'production';
    // Only include stack trace in development mode
    return isDevelopment;
  }

  private logError(exception: any, context: any) {
    const { status, method, path, correlationId, userAgent, ip, error } = context;

    const logContext = {
      correlationId,
      status,
      method,
      path,
      ip,
      userAgent,
      error: {
        code: error.code,
        message: error.message,
        stack: error.stack,
      },
    };

    if (status >= 500) {
      this.logger.error(`Server Error: ${error.message}`, logContext, exception.stack);
    } else if (status >= 400) {
      this.logger.warn(`Client Error: ${error.message}`, logContext);
    } else {
      this.logger.log(`Request Error: ${error.message}`, logContext);
    }
  }
}
