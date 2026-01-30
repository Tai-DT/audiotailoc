/**
 * Dashboard Logger Utility
 * 
 * Provides structured logging for dashboard application with:
 * - Environment-based log levels
 * - Sensitive data filtering
 * - Optional error tracking integration
 * - Development vs Production modes
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMetadata {
  [key: string]: any;
}

class Logger {
  private isDevelopment: boolean;
  private logLevel: LogLevel;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    // Set log level based on environment
    // In production, only log warnings and errors
    this.logLevel = this.isDevelopment ? 'debug' : 'warn';
  }

  /**
   * Check if a log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * Filter sensitive data from logs
   */
  private filterSensitiveData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

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
      'adminKey',
    ];

    const filtered: any = Array.isArray(data) ? [] : {};

    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
        filtered[key] = '[REDACTED]';
      } else if (value && typeof value === 'object') {
        filtered[key] = this.filterSensitiveData(value);
      } else {
        filtered[key] = value;
      }
    }

    return filtered;
  }

  /**
   * Format log message with metadata
   */
  private formatMessage(level: LogLevel, message: string, metadata?: LogMetadata): string {
    const timestamp = new Date().toISOString();
    const filteredMetadata = metadata ? this.filterSensitiveData(metadata) : {};
    
    if (this.isDevelopment) {
      return `[${timestamp}] [${level.toUpperCase()}] ${message}${Object.keys(filteredMetadata).length > 0 ? ` ${JSON.stringify(filteredMetadata)}` : ''}`;
    }
    
    return message;
  }

  /**
   * Debug level logging (only in development)
   */
  debug(message: string, metadata?: LogMetadata): void {
    if (!this.shouldLog('debug')) return;
    
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, metadata));
    }
  }

  /**
   * Info level logging
   */
  info(message: string, metadata?: LogMetadata): void {
    if (!this.shouldLog('info')) return;
    
    if (this.isDevelopment) {
      console.info(this.formatMessage('info', message, metadata));
    }
  }

  /**
   * Warning level logging
   */
  warn(message: string, metadata?: LogMetadata): void {
    if (!this.shouldLog('warn')) return;
    
    console.warn(this.formatMessage('warn', message, metadata));
    
    // In production, you might want to send warnings to error tracking
    // Example: Sentry.captureMessage(message, 'warning');
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error | unknown, metadata?: LogMetadata): void {
    if (!this.shouldLog('error')) return;
    
    const errorMetadata: LogMetadata = {
      ...metadata,
      ...(error instanceof Error
        ? {
            errorMessage: error.message,
            errorStack: error.stack,
            errorName: error.name,
          }
        : { error: String(error) }),
    };

    console.error(this.formatMessage('error', message, errorMetadata));
    
    // In production, send errors to error tracking service
    // Example: Sentry.captureException(error, { extra: errorMetadata });
  }

  /**
   * Log performance metrics
   */
  performance(operation: string, duration: number, metadata?: LogMetadata): void {
    const level = duration > 1000 ? 'warn' : 'info';
    const message = `Performance: ${operation} took ${duration}ms`;
    
    if (level === 'warn') {
      this.warn(message, metadata);
    } else {
      this.info(message, metadata);
    }
  }

  /**
   * Log admin actions for audit trail
   */
  audit(action: string, userId?: string, metadata?: LogMetadata): void {
    const auditMetadata: LogMetadata = {
      ...metadata,
      action,
      userId,
      timestamp: new Date().toISOString(),
    };
    
    // In production, send to audit service
    // Example: auditService.log(action, auditMetadata);
    
    if (this.isDevelopment) {
      this.info(`Audit: ${action}`, auditMetadata);
    } else {
      // Always log audit events, even in production
      this.warn(`Audit: ${action}`, auditMetadata);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export class for testing
export { Logger };
