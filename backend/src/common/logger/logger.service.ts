import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
// @ts-ignore - Import style for winston-daily-rotate-file
import * as DailyRotateFileNamespace from 'winston-daily-rotate-file';
import { join } from 'path';

const DailyRotateFile = (DailyRotateFileNamespace as any).default || DailyRotateFileNamespace;

export interface LogContext {
  userId?: string;
  requestId?: string;
  module?: string;
  action?: string;
  [key: string]: any;
}

export interface LogMetadata {
  timestamp?: string;
  level?: string;
  context?: LogContext;
  stack?: string;
  error?: Error;
  [key: string]: any;
}

/**
 * Production-ready logger service with Winston and daily rotation
 * Features:
 * - Console and file transports with daily rotation
 * - Structured logging with context tracking
 * - Sensitive data filtering (passwords, tokens, API keys)
 * - Performance metrics logging
 * - Audit trail logging
 */
@Injectable()
export class LoggerService {
  private logger: winston.Logger;
  private context: LogContext = {};

  constructor() {
    this.logger = this.createLogger();
  }

  private createLogger(): winston.Logger {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const logsDir = process.env.LOGS_DIR || join(process.cwd(), 'logs');

    // Custom format for structured logging
    const customFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.ms(),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json(),
    );

    const consoleFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const context = meta.context as any;
        const contextStr = context ? ` [${context.module || 'APP'}]` : '';
        const { context: _, ...otherMeta } = meta;
        const metaStr = Object.keys(otherMeta).length ? ` ${JSON.stringify(otherMeta)}` : '';
        return `${timestamp} [${level}]${contextStr}: ${message}${metaStr}`;
      }),
    );

    const transports: winston.transport[] = [
      // Console transport
      new winston.transports.Console({
        format: consoleFormat,
        level: isDevelopment ? 'debug' : 'info',
      }),

      // Error log file (all errors)
      new DailyRotateFile({
        filename: join(logsDir, 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
        level: 'error',
        format: customFormat,
      }),

      // Combined log file (all levels)
      new DailyRotateFile({
        filename: join(logsDir, 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '7d',
        format: customFormat,
      }),
    ];

    // Add debug log file only in development
    if (isDevelopment) {
      transports.push(
        new DailyRotateFile({
          filename: join(logsDir, 'debug-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '3d',
          level: 'debug',
          format: customFormat,
        }),
      );
    }

    return winston.createLogger({
      level: isDevelopment ? 'debug' : 'info',
      defaultMeta: { service: 'audiotailoc-backend' },
      transports,
    });
  }

  /**
   * Set context for subsequent log messages
   */
  setContext(context: Partial<LogContext>): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Clear the current context
   */
  clearContext(): void {
    this.context = {};
  }

  /**
   * Get current context
   */
  getContext(): LogContext {
    return { ...this.context };
  }

  /**
   * Log info level messages
   */
  log(message: string, metadata?: LogMetadata): void {
    this.logger.info(message, {
      context: this.context,
      ...this.filterSensitiveData(metadata),
    });
  }

  /**
   * Log error level messages
   */
  error(message: string, trace?: string, metadata?: LogMetadata): void {
    this.logger.error(message, {
      context: this.context,
      stack: trace,
      ...this.filterSensitiveData(metadata),
    });
  }

  /**
   * Log warning level messages
   */
  warn(message: string, metadata?: LogMetadata): void {
    this.logger.warn(message, {
      context: this.context,
      ...this.filterSensitiveData(metadata),
    });
  }

  /**
   * Log debug level messages
   */
  debug(message: string, metadata?: LogMetadata): void {
    this.logger.debug(message, {
      context: this.context,
      ...this.filterSensitiveData(metadata),
    });
  }

  /**
   * Log verbose level messages
   */
  verbose(message: string, metadata?: LogMetadata): void {
    this.logger.debug(message, {
      context: this.context,
      ...this.filterSensitiveData(metadata),
    });
  }

  /**
   * Log critical/fatal level messages
   */
  fatal(message: string, metadata?: LogMetadata): void {
    this.logger.error(message, {
      context: this.context,
      severity: 'critical',
      ...this.filterSensitiveData(metadata),
    });
  }

  /**
   * Log performance metrics
   */
  logPerformance(operation: string, duration: number, metadata?: LogMetadata): void {
    const level = duration > 5000 ? 'warn' : 'info';
    this.logger.log(level as any, `Performance: ${operation}`, {
      context: { ...this.context, action: `${operation}_performance` },
      duration_ms: duration,
      ...this.filterSensitiveData(metadata),
    });
  }

  /**
   * Log audit trail for security-relevant operations
   */
  logAudit(action: string, userId: string, target: string, details?: Record<string, any>): void {
    this.logger.info(`Audit: ${action}`, {
      context: {
        ...this.context,
        userId,
        auditAction: action,
        auditTarget: target,
      },
      auditDetails: details,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Filter sensitive data from logs
   */
  private filterSensitiveData(metadata?: LogMetadata): LogMetadata {
    if (!metadata) {
      return {};
    }

    const filtered = { ...metadata };
    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'apiKey',
      'authorization',
      'creditCard',
      'ssn',
      'privateKey',
      'refreshToken',
      'accessToken',
    ];

    const redactValue = (obj: any): any => {
      if (obj === null || obj === undefined) {
        return obj;
      }

      if (typeof obj !== 'object') {
        return obj;
      }

      if (Array.isArray(obj)) {
        return obj.map(item => redactValue(item));
      }

      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
          result[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
          result[key] = redactValue(value);
        } else {
          result[key] = value;
        }
      }
      return result;
    };

    return redactValue(filtered);
  }

  /**
   * Get the underlying Winston logger instance
   */
  getWinstonLogger(): winston.Logger {
    return this.logger;
  }
}
