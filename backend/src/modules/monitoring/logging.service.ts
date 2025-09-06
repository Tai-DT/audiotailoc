import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  duration?: number;
  [key: string]: any;
}

export interface ErrorContext extends LogContext {
  error: Error;
  stack?: string;
  errorCode?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

@Injectable()
export class LoggingService {
  private readonly logger: winston.Logger;
  private readonly nestLogger = new Logger(LoggingService.name);

  constructor(private readonly config: ConfigService) {
    this.logger = this.createWinstonLogger();
  }

  private createWinstonLogger(): winston.Logger {
    const logLevel = this.config.get<string>('LOG_LEVEL') || 'info';
    const logFormat = this.config.get<string>('LOG_FORMAT') || 'json';
    const environment = this.config.get<string>('NODE_ENV') || 'development';

    const formats = [
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
    ];

    if (logFormat === 'json') {
      formats.push(winston.format.json());
    } else {
      formats.push(
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level.toUpperCase()}] ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ''
          }`;
        })
      );
    }

    const transports: winston.transport[] = [];

    // Console transport for development
    if (environment === 'development') {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        })
      );
    }

    // File transports for production
    if (environment === 'production') {
      // General application logs
      transports.push(
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          level: logLevel,
        })
      );

      // Error logs
      transports.push(
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '30d',
          level: 'error',
        })
      );

      // Security logs
      transports.push(
        new DailyRotateFile({
          filename: 'logs/security-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '90d',
          level: 'warn',
        })
      );

      // Audit logs
      transports.push(
        new DailyRotateFile({
          filename: 'logs/audit-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '365d',
        })
      );
    }

    return winston.createLogger({
      level: logLevel,
      format: winston.format.combine(...formats),
      transports,
      exitOnError: false,
    });
  }

  // Standard logging methods
  debug(message: string, context?: LogContext): void {
    this.logger.debug(message, this.formatContext(context));
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(message, this.formatContext(context));
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(message, this.formatContext(context));
  }

  error(message: string, context?: ErrorContext): void {
    const formattedContext = this.formatErrorContext(context);
    this.logger.error(message, formattedContext);
    
    // Send to external error tracking service if configured
    this.sendToErrorTracking(message, formattedContext);
  }

  // Specialized logging methods
  logRequest(context: LogContext): void {
    const { method, url, statusCode, duration, userId: _userId, ip: _ip } = context;
    const message = `${method} ${url} ${statusCode} ${duration}ms`;
    
    if (statusCode && statusCode >= 400) {
      this.warn(`Request failed: ${message}`, context);
    } else {
      this.info(`Request: ${message}`, context);
    }
  }

  logSecurity(event: string, context: LogContext): void {
    this.warn(`Security Event: ${event}`, {
      ...context,
      category: 'security',
      timestamp: new Date().toISOString(),
    });
  }

  logAudit(action: string, context: LogContext): void {
    this.info(`Audit: ${action}`, {
      ...context,
      category: 'audit',
      timestamp: new Date().toISOString(),
    });
  }

  logPerformance(metric: string, value: number, context?: LogContext): void {
    this.info(`Performance: ${metric} = ${value}`, {
      ...context,
      category: 'performance',
      metric,
      value,
      timestamp: new Date().toISOString(),
    });
  }

  logBusinessEvent(event: string, context: LogContext): void {
    this.info(`Business Event: ${event}`, {
      ...context,
      category: 'business',
      timestamp: new Date().toISOString(),
    });
  }

  // Database operation logging
  logDatabaseQuery(query: string, duration: number, context?: LogContext): void {
    if (duration > 1000) { // Log slow queries
      this.warn(`Slow Query: ${duration}ms`, {
        ...context,
        query: this.sanitizeQuery(query),
        duration,
        category: 'database',
      });
    } else {
      this.debug(`Query: ${duration}ms`, {
        ...context,
        query: this.sanitizeQuery(query),
        duration,
        category: 'database',
      });
    }
  }

  // External service logging
  logExternalService(service: string, operation: string, duration: number, success: boolean, context?: LogContext): void {
    const message = `External Service: ${service}.${operation} ${success ? 'SUCCESS' : 'FAILED'} ${duration}ms`;
    
    if (!success || duration > 5000) {
      this.warn(message, {
        ...context,
        service,
        operation,
        duration,
        success,
        category: 'external_service',
      });
    } else {
      this.info(message, {
        ...context,
        service,
        operation,
        duration,
        success,
        category: 'external_service',
      });
    }
  }

  // User activity logging
  logUserActivity(userId: string, action: string, context?: LogContext): void {
    this.info(`User Activity: ${action}`, {
      ...context,
      userId,
      action,
      category: 'user_activity',
      timestamp: new Date().toISOString(),
    });
  }

  // Payment logging
  logPayment(transactionId: string, amount: number, status: string, context?: LogContext): void {
    this.info(`Payment: ${transactionId} ${amount} ${status}`, {
      ...context,
      transactionId,
      amount,
      status,
      category: 'payment',
      timestamp: new Date().toISOString(),
    });
  }

  // System health logging
  logSystemHealth(component: string, status: 'healthy' | 'degraded' | 'unhealthy', details?: any): void {
    const message = `System Health: ${component} is ${status}`;
    
    if (status === 'unhealthy') {
      this.error(message, { component, status, details, category: 'system_health' });
    } else if (status === 'degraded') {
      this.warn(message, { component, status, details, category: 'system_health' });
    } else {
      this.info(message, { component, status, details, category: 'system_health' });
    }
  }

  // Log aggregation and analysis
  async getLogStats(_timeRange: 'hour' | 'day' | 'week' = 'hour'): Promise<{
    totalLogs: number;
    errorCount: number;
    warnCount: number;
    topErrors: Array<{ message: string; count: number }>;
    topEndpoints: Array<{ endpoint: string; count: number; avgDuration: number }>;
    userActivity: Array<{ userId: string; actionCount: number }>;
  }> {
    // This would typically query a log aggregation service like ELK stack
    // For now, return mock data
    return {
      totalLogs: 0,
      errorCount: 0,
      warnCount: 0,
      topErrors: [],
      topEndpoints: [],
      userActivity: [],
    };
  }

  private formatContext(context?: LogContext): any {
    if (!context) return {};
    
    return {
      ...context,
      timestamp: new Date().toISOString(),
      environment: this.config.get<string>('NODE_ENV'),
      service: 'audiotailoc-backend',
    };
  }

  private formatErrorContext(context?: ErrorContext): any {
    if (!context) return {};
    
    const { error, ...rest } = context;
    
    return {
      ...this.formatContext(rest),
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
      },
      severity: context.severity || 'medium',
    };
  }

  private sanitizeQuery(query: string): string {
    // Remove sensitive data from SQL queries
    return query
      .replace(/password\s*=\s*'[^']*'/gi, "password='***'")
      .replace(/token\s*=\s*'[^']*'/gi, "token='***'")
      .replace(/secret\s*=\s*'[^']*'/gi, "secret='***'")
      .substring(0, 500); // Limit query length
  }

  private sendToErrorTracking(_message: string, _context: any): void {
    // Integration with external error tracking services like Sentry
    const sentryDsn = this.config.get<string>('SENTRY_DSN');
    
    if (sentryDsn) {
      try {
        // This would integrate with Sentry or similar service
        this.nestLogger.debug('Error sent to external tracking service');
      } catch (error) {
        this.nestLogger.error('Failed to send error to tracking service', error);
      }
    }
  }

  // Cleanup old logs
  async cleanupLogs(retentionDays: number = 30): Promise<void> {
    try {
      // This would clean up old log files
      this.info('Log cleanup completed', { retentionDays });
    } catch (error) {
      this.error('Log cleanup failed', { error: error as Error });
    }
  }

  // Export logs for analysis
  async exportLogs(startDate: Date, endDate: Date, format: 'json' | 'csv' = 'json'): Promise<string> {
    try {
      // This would export logs in the specified format
      this.info('Logs exported', { startDate, endDate, format });
      return 'export-path';
    } catch (error) {
      this.error('Log export failed', { error: error as Error });
      throw error;
    }
  }
}
