import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggingService } from './logging.service';

export interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  level: 'error' | 'warning' | 'info';
  timestamp: Date;
  environment: string;
  release?: string;
  user?: {
    id: string;
    email?: string;
    ip?: string;
  };
  request?: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: any;
  };
  context?: Record<string, any>;
  fingerprint?: string;
  count: number;
  firstSeen: Date;
  lastSeen: Date;
}

export interface ErrorStats {
  totalErrors: number;
  newErrors: number;
  resolvedErrors: number;
  errorRate: number;
  topErrors: Array<{
    message: string;
    count: number;
    lastSeen: Date;
  }>;
  errorsByEndpoint: Array<{
    endpoint: string;
    count: number;
    errorRate: number;
  }>;
  errorsByUser: Array<{
    userId: string;
    count: number;
  }>;
}

@Injectable()
export class ErrorTrackingService {
  private readonly logger = new Logger(ErrorTrackingService.name);
  private readonly errors = new Map<string, ErrorReport>();
  private readonly maxErrors = 10000; // Keep last 10k errors in memory

  constructor(
    private readonly config: ConfigService,
    private readonly loggingService: LoggingService,
  ) {
    // Clean up old errors every hour
    setInterval(
      () => {
        this.cleanupOldErrors();
      },
      60 * 60 * 1000,
    );
  }

  // Capture and track errors
  captureError(
    error: Error,
    context?: {
      userId?: string;
      userEmail?: string;
      ip?: string;
      method?: string;
      url?: string;
      headers?: Record<string, string>;
      body?: any;
      level?: 'error' | 'warning' | 'info';
      tags?: Record<string, string>;
    },
  ): string {
    const errorId = this.generateErrorId();
    const fingerprint = this.generateFingerprint(error, context);
    const timestamp = new Date();

    // Check if this error already exists
    const existingError = this.findExistingError(fingerprint);

    if (existingError) {
      // Update existing error
      existingError.count++;
      existingError.lastSeen = timestamp;

      // Log the occurrence
      this.loggingService.error(`Recurring error: ${error.message}`, {
        errorId: existingError.id,
        count: existingError.count,
        fingerprint,
        ...context,
      });

      return existingError.id;
    }

    // Create new error report
    const errorReport: ErrorReport = {
      id: errorId,
      message: error.message,
      stack: error.stack,
      level: context?.level || 'error',
      timestamp,
      environment: this.config.get<string>('NODE_ENV') || 'development',
      release: this.config.get<string>('APP_VERSION'),
      user: context?.userId
        ? {
            id: context.userId,
            email: context.userEmail,
            ip: context.ip,
          }
        : undefined,
      request: context?.method
        ? {
            method: context.method,
            url: context.url || '',
            headers: this.sanitizeHeaders(context.headers || {}),
            body: this.sanitizeBody(context.body),
          }
        : undefined,
      context: {
        ...context?.tags,
        errorType: error.constructor.name,
      },
      fingerprint,
      count: 1,
      firstSeen: timestamp,
      lastSeen: timestamp,
    };

    // Store the error
    this.errors.set(fingerprint, errorReport);

    // Keep only recent errors
    if (this.errors.size > this.maxErrors) {
      this.cleanupOldErrors();
    }

    // Log the error
    this.loggingService.error(`New error captured: ${error.message}`, {
      errorId,
      fingerprint,
      ...context,
    });

    // Send to external error tracking service
    this.sendToExternalService(errorReport);

    // Check for critical errors
    if (this.isCriticalError(errorReport)) {
      this.handleCriticalError(errorReport);
    }

    return errorId;
  }

  // Get error statistics
  getErrorStats(timeRange: 'hour' | 'day' | 'week' = 'day'): ErrorStats {
    const now = new Date();
    const timeRangeMs = this.getTimeRangeMs(timeRange);
    const cutoff = new Date(now.getTime() - timeRangeMs);

    const recentErrors = Array.from(this.errors.values()).filter(error => error.lastSeen >= cutoff);

    const totalErrors = recentErrors.reduce((sum, error) => sum + error.count, 0);
    const newErrors = recentErrors.filter(error => error.firstSeen >= cutoff).length;
    const resolvedErrors = 0; // Would track resolved errors in a real implementation

    // Calculate error rate (errors per minute)
    const errorRate = totalErrors / (timeRangeMs / 60000);

    // Top errors by count
    const topErrors = recentErrors
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(error => ({
        message: error.message,
        count: error.count,
        lastSeen: error.lastSeen,
      }));

    // Errors by endpoint
    const endpointErrors = new Map<string, { count: number; total: number }>();
    recentErrors.forEach(error => {
      if (error.request?.url) {
        const endpoint = this.normalizeEndpoint(error.request.url);
        const existing = endpointErrors.get(endpoint) || { count: 0, total: 0 };
        existing.count += error.count;
        existing.total += error.count; // Would include successful requests in real implementation
        endpointErrors.set(endpoint, existing);
      }
    });

    const errorsByEndpoint = Array.from(endpointErrors.entries())
      .map(([endpoint, stats]) => ({
        endpoint,
        count: stats.count,
        errorRate: (stats.count / stats.total) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Errors by user
    const userErrors = new Map<string, number>();
    recentErrors.forEach(error => {
      if (error.user?.id) {
        const existing = userErrors.get(error.user.id) || 0;
        userErrors.set(error.user.id, existing + error.count);
      }
    });

    const errorsByUser = Array.from(userErrors.entries())
      .map(([userId, count]) => ({ userId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalErrors,
      newErrors,
      resolvedErrors,
      errorRate,
      topErrors,
      errorsByEndpoint,
      errorsByUser,
    };
  }

  // Get specific error details
  getError(errorId: string): ErrorReport | null {
    for (const error of this.errors.values()) {
      if (error.id === errorId) {
        return error;
      }
    }
    return null;
  }

  // Get errors by fingerprint
  getErrorsByFingerprint(fingerprint: string): ErrorReport | null {
    return this.errors.get(fingerprint) || null;
  }

  // Mark error as resolved
  resolveError(fingerprint: string): boolean {
    const error = this.errors.get(fingerprint);
    if (error) {
      this.errors.delete(fingerprint);
      this.loggingService.info(`Error resolved: ${error.message}`, {
        errorId: error.id,
        fingerprint,
      });
      return true;
    }
    return false;
  }

  // Get error trends
  getErrorTrends(_timeRange: 'hour' | 'day' | 'week' = 'day'): Array<{
    timestamp: Date;
    errorCount: number;
    newErrorCount: number;
  }> {
    // This would analyze error trends over time
    // For now, return mock data
    return [];
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateFingerprint(error: Error, context?: any): string {
    // Create a unique fingerprint for grouping similar errors
    const components = [
      error.name,
      error.message,
      this.getStackSignature(error.stack),
      context?.url ? this.normalizeEndpoint(context.url) : '',
    ];

    return this.hashString(components.join('|'));
  }

  private getStackSignature(stack?: string): string {
    if (!stack) return '';

    // Extract the first few lines of the stack trace for fingerprinting
    const lines = stack.split('\n').slice(0, 3);
    return lines
      .map(line => line.replace(/:\d+:\d+/g, '')) // Remove line numbers
      .join('|');
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private findExistingError(fingerprint: string): ErrorReport | null {
    return this.errors.get(fingerprint) || null;
  }

  private normalizeEndpoint(url: string): string {
    // Normalize URLs for grouping (remove IDs, query params, etc.)
    return url
      .split('?')[0] // Remove query parameters
      .replace(/\/\d+/g, '/:id') // Replace numeric IDs
      .replace(/\/[a-f0-9-]{36}/g, '/:uuid') // Replace UUIDs
      .replace(/\/[a-z0-9-]+$/i, '/:slug'); // Replace potential slugs
  }

  private sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    const sanitized = { ...headers };

    // Remove sensitive headers
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body;

    const sanitized = { ...body };

    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'creditCard'];
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  private isCriticalError(error: ErrorReport): boolean {
    // Define criteria for critical errors
    const criticalPatterns = [
      /database.*connection/i,
      /payment.*failed/i,
      /security.*breach/i,
      /authentication.*failed/i,
    ];

    return (
      criticalPatterns.some(pattern => pattern.test(error.message)) ||
      (error.level === 'error' && error.count > 10)
    );
  }

  private handleCriticalError(error: ErrorReport): void {
    this.logger.error(`CRITICAL ERROR DETECTED: ${error.message}`, {
      errorId: error.id,
      count: error.count,
    });

    // Send alerts (email, Slack, etc.)
    this.sendCriticalErrorAlert(error);
  }

  private sendCriticalErrorAlert(error: ErrorReport): void {
    // This would send alerts via email, Slack, etc.
    this.loggingService.error('Critical error alert sent', {
      errorId: error.id,
      message: error.message,
    });
  }

  private sendToExternalService(_error: ErrorReport): void {
    // Integration with external services like Sentry, Bugsnag, etc.
    const sentryDsn = this.config.get<string>('SENTRY_DSN');

    if (sentryDsn) {
      try {
        // This would send to Sentry or similar service
        this.logger.debug('Error sent to external tracking service');
      } catch (err) {
        this.logger.error('Failed to send error to external service', err);
      }
    }
  }

  private getTimeRangeMs(timeRange: 'hour' | 'day' | 'week'): number {
    switch (timeRange) {
      case 'hour':
        return 60 * 60 * 1000;
      case 'day':
        return 24 * 60 * 60 * 1000;
      case 'week':
        return 7 * 24 * 60 * 60 * 1000;
      default:
        return 24 * 60 * 60 * 1000;
    }
  }

  private cleanupOldErrors(): void {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    for (const [fingerprint, error] of this.errors.entries()) {
      if (error.lastSeen < oneWeekAgo) {
        this.errors.delete(fingerprint);
      }
    }

    this.logger.log(`Cleaned up old errors. Current count: ${this.errors.size}`);
  }
}
