import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as path from 'path';
import 'winston-daily-rotate-file';

export interface LogContext {
  correlationId?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  ip?: string;
  userAgent?: string;
  duration?: number;
  statusCode?: number;
  error?: {
    code: string;
    message: string;
    stack?: string;
    details?: any;
  };
  metadata?: Record<string, any>;
}

export type LogLevelType = 'error' | 'warn' | 'info' | 'debug' | 'verbose';

@Injectable()
export class LoggingService implements LoggerService {
  private winstonLogger!: winston.Logger;
  private nestLogger!: LoggerService;
  private contextMap = new Map<string, LogContext>();

  constructor(private configService: ConfigService) {
    this.initializeWinston();
  }

  private initializeWinston() {
    const logLevel = this.configService.get('LOG_LEVEL', 'info') as LogLevelType;
    const logDir = this.configService.get('LOG_DIR', './logs');
    const maxFiles = this.configService.get('LOG_MAX_FILES', '30d');
    const maxSize = this.configService.get('LOG_MAX_SIZE', '20m');

    const transports: winston.transport[] = [
      // Console transport for development
      new winston.transports.Console({
        level: logLevel,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const correlationId = meta.correlationId ? ` [${meta.correlationId}]` : '';
            const context = meta.context ? ` [${meta.context}]` : '';
            return `${timestamp} ${level}${correlationId}${context}: ${message}`;
          }),
        ),
      }),
    ];

    // File transports for production
    if (this.configService.get('NODE_ENV') === 'production') {
      transports.push(
        // Error logs
        new winston.transports.DailyRotateFile({
          filename: path.join(logDir, 'error-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxSize: maxSize,
          maxFiles: maxFiles,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
        }),

        // Combined logs
        new winston.transports.DailyRotateFile({
          filename: path.join(logDir, 'combined-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          maxSize: maxSize,
          maxFiles: maxFiles,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),

        // Security logs
        new winston.transports.DailyRotateFile({
          filename: path.join(logDir, 'security-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          level: 'warn',
          maxSize: maxSize,
          maxFiles: maxFiles,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      );
    }

    this.winstonLogger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports,
      exceptionHandlers: [
        new winston.transports.File({
          filename: path.join(logDir, 'exceptions.log'),
        }),
      ],
      rejectionHandlers: [
        new winston.transports.File({
          filename: path.join(logDir, 'rejections.log'),
        }),
      ],
    });
  }

  // NestJS LoggerService implementation
  log(message: any, context?: string) {
    this.winstonLogger.info(message, { context });
  }

  error(message: any, trace?: string, context?: string) {
    this.winstonLogger.error(message, { context, trace });
  }

  warn(message: any, context?: string) {
    this.winstonLogger.warn(message, { context });
  }

  debug(message: any, context?: string) {
    this.winstonLogger.debug(message, { context });
  }

  verbose(message: any, context?: string) {
    this.winstonLogger.verbose(message, { context });
  }

  // Enhanced logging methods with context
  logWithContext(level: LogLevelType, message: string, context: LogContext = {}) {
    const logEntry = {
      message,
      timestamp: new Date().toISOString(),
      level,
      ...context,
    };

    // Store context for correlation
    if (context.correlationId) {
      this.contextMap.set(context.correlationId, {
        ...this.contextMap.get(context.correlationId),
        ...context,
      });
    }

    this.winstonLogger.log(level, message, logEntry);
  }

  // Request logging
  logRequest(context: LogContext) {
    this.logWithContext('info', 'HTTP Request', {
      ...context,
      metadata: {
        ...context.metadata,
        event: 'request_start',
      },
    });
  }

  logResponse(context: LogContext) {
    const level = context.statusCode && context.statusCode >= 400 ? 'warn' : 'info';
    this.logWithContext(level, 'HTTP Response', {
      ...context,
      metadata: {
        ...context.metadata,
        event: 'request_complete',
      },
    });
  }

  // Error logging with full context
  logError(error: Error, context: LogContext = {}) {
    this.logWithContext('error', error.message, {
      ...context,
      metadata: {
        ...context.metadata,
        event: 'error',
      },
      error: {
        code: (error as any).code || 'UNKNOWN_ERROR',
        message: error.message,
        stack: error.stack,
      },
    });
  }

  // Security event logging
  logSecurityEvent(event: string, context: LogContext = {}) {
    this.logWithContext('warn', `Security Event: ${event}`, {
      ...context,
      metadata: {
        ...context.metadata,
        event: 'security',
        securityEvent: event,
      },
    });
  }

  // Business logic logging
  logBusinessEvent(event: string, data: any, context: LogContext = {}) {
    this.logWithContext('info', `Business Event: ${event}`, {
      ...context,
      metadata: {
        ...context.metadata,
        event: 'business',
        businessEvent: event,
        data,
      },
    });
  }

  // Performance logging
  logPerformance(operation: string, duration: number, context: LogContext = {}) {
    this.logWithContext('info', `Performance: ${operation}`, {
      ...context,
      metadata: {
        ...context.metadata,
        event: 'performance',
        operation,
        duration,
      },
    });
  }

  // Database operation logging
  logDatabase(operation: string, collection: string, context: LogContext = {}) {
    this.logWithContext('debug', `Database: ${operation} on ${collection}`, {
      ...context,
      metadata: {
        ...context.metadata,
        event: 'database',
        operation,
        collection,
      },
    });
  }

  // AI/ML operation logging
  logAI(operation: string, model: string, context: LogContext = {}) {
    this.logWithContext('info', `AI Operation: ${operation} with ${model}`, {
      ...context,
      metadata: {
        ...context.metadata,
        event: 'ai',
        operation,
        model,
      },
    });
  }

  // Payment operation logging
  logPayment(operation: string, amount: number, currency: string, context: LogContext = {}) {
    this.logWithContext('info', `Payment: ${operation}`, {
      ...context,
      metadata: {
        ...context.metadata,
        event: 'payment',
        operation,
        amount,
        currency,
      },
    });
  }

  // Get correlation context
  getCorrelationContext(correlationId: string): LogContext | undefined {
    return this.contextMap.get(correlationId);
  }

  // Update correlation context
  updateCorrelationContext(correlationId: string, updates: Partial<LogContext>) {
    const existing = this.contextMap.get(correlationId) || {};
    this.contextMap.set(correlationId, { ...existing, ...updates });
  }

  // Clear correlation context (for cleanup)
  clearCorrelationContext(correlationId: string) {
    this.contextMap.delete(correlationId);
  }

  // Generate structured log entry for external services
  createStructuredLog(level: LogLevelType, event: string, data: any, context: LogContext = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      event,
      data,
      context: {
        correlationId: context.correlationId,
        userId: context.userId,
        sessionId: context.sessionId,
        requestId: context.requestId,
        endpoint: context.endpoint,
        method: context.method,
        ip: context.ip,
        userAgent: context.userAgent,
        duration: context.duration,
        statusCode: context.statusCode,
        ...context.metadata,
      },
    };
  }

  // Log for compliance and audit
  logAudit(action: string, subject: string, object: string, context: LogContext = {}) {
    this.logWithContext('info', `Audit: ${action} ${subject} on ${object}`, {
      ...context,
      metadata: {
        ...context.metadata,
        event: 'audit',
        audit: {
          action,
          subject,
          object,
          timestamp: new Date().toISOString(),
        },
      },
    });
  }

  // Log API version usage
  logVersionUsage(version: string, endpoint: string, context: LogContext = {}) {
    this.logWithContext('info', `API Version Usage: ${version}`, {
      ...context,
      metadata: {
        ...context.metadata,
        event: 'version_usage',
        version,
        endpoint,
      },
    });
  }

  // Log deprecated feature usage
  logDeprecation(feature: string, replacement?: string, context: LogContext = {}) {
    this.logWithContext('warn', `Deprecated Feature Used: ${feature}`, {
      ...context,
      metadata: {
        ...context.metadata,
        event: 'deprecation',
        feature,
        replacement,
      },
    });
  }

  // Health check logging
  logHealthCheck(component: string, status: 'healthy' | 'unhealthy', details?: any, context: LogContext = {}) {
    const level = status === 'healthy' ? 'info' : 'error';
    this.logWithContext(level, `Health Check: ${component} is ${status}`, {
      ...context,
      metadata: {
        ...context.metadata,
        event: 'health_check',
        component,
        status,
        details,
      },
    });
  }

  // Get logger statistics
  getLoggerStats() {
    return {
      contextMapSize: this.contextMap.size,
      winstonLoggerLevel: this.winstonLogger.level,
      transports: this.winstonLogger.transports.map(t => ({
        name: t.constructor.name,
        level: (t as any).level,
        silent: (t as any).silent,
      })),
    };
  }
}
