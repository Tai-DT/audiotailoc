import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Define the interface for sentry/node package.
 * Note: @sentry/node must be installed via: npm install @sentry/node
 */
interface _SentryError extends Error {
  statusCode?: number;
  code?: string;
}

interface SentryEvent {
  message?: string;
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  tags?: Record<string, string>;
  contexts?: Record<string, any>;
  extra?: Record<string, any>;
  user?: {
    id?: string;
    email?: string;
    username?: string;
    ip_address?: string;
  };
}

interface BreadcrumbOptions {
  message: string;
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  category?: string;
  data?: Record<string, any>;
}

/**
 * Sentry error tracking and monitoring service
 * Handles error reporting, breadcrumb tracking, and performance monitoring
 * with proper filtering of sensitive data.
 *
 * Setup:
 * 1. Install: npm install @sentry/node
 * 2. Set environment variables:
 *    - SENTRY_DSN: Your Sentry DSN
 *    - SENTRY_ENVIRONMENT: Environment name (development, staging, production)
 *    - SENTRY_TRACE_SAMPLE_RATE: Sampling rate for transactions (0.0-1.0, default: 0.1)
 */
@Injectable()
export class SentryService implements OnModuleInit {
  private sentry: any;
  private isInitialized = false;
  private currentUser: any = null;

  constructor(private configService: ConfigService) {}

  onModuleInit(): void {
    this.initialize();
  }

  /**
   * Initialize Sentry with the DSN from environment variables
   */
  private initialize(): void {
    const dsn = this.configService.get<string>('SENTRY_DSN');

    if (!dsn) {
      console.warn(
        'Sentry DSN not configured. Error tracking is disabled. Set SENTRY_DSN environment variable to enable.',
      );
      this.isInitialized = false;
      return;
    }

    try {
      // Dynamically import Sentry to avoid hard dependency
      this.sentry = require('@sentry/node');

      const environment =
        this.configService.get<string>('SENTRY_ENVIRONMENT') ||
        process.env.NODE_ENV ||
        'development';
      const traceSampleRate =
        parseFloat(this.configService.get<string>('SENTRY_TRACE_SAMPLE_RATE') || '0.1') || 0.1;

      this.sentry.init({
        dsn,
        environment,
        tracesSampleRate: traceSampleRate,
        integrations: [
          new this.sentry.Integrations.Http({ tracing: true }),
          new this.sentry.Integrations.OnUncaughtException(),
          new this.sentry.Integrations.OnUnhandledRejection(),
        ],
        // Configure which errors to ignore
        beforeSend: (event: any) => this.beforeSend(event),
        // Configure which breadcrumbs to ignore
        beforeBreadcrumb: (breadcrumb: any) => this.beforeBreadcrumb(breadcrumb),
      });

      this.isInitialized = true;
      console.log(`Sentry initialized successfully for ${environment} environment`);
    } catch (error) {
      console.error(
        'Failed to initialize Sentry:',
        error instanceof Error ? error.message : String(error),
      );
      this.isInitialized = false;
    }
  }

  /**
   * Capture an exception and send it to Sentry
   */
  captureException(
    error: Error,
    context?: SentryEvent & { userId?: string; requestId?: string },
  ): void {
    if (!this.isInitialized || !this.sentry) {
      return;
    }

    try {
      const { userId, requestId, ...eventData } = context || {};

      this.sentry.captureException(error, {
        tags: {
          ...(eventData.tags || {}),
          ...(userId && { userId }),
          ...(requestId && { requestId }),
        },
        contexts: {
          ...(eventData.contexts || {}),
          app: {
            service: 'audiotailoc-backend',
            timestamp: new Date().toISOString(),
          },
        },
        extra: eventData.extra || {},
        user: this.currentUser,
      });
    } catch (err) {
      console.error(
        'Error capturing exception in Sentry:',
        err instanceof Error ? err.message : String(err),
      );
    }
  }

  /**
   * Capture a message and send it to Sentry
   */
  captureMessage(
    message: string,
    level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
    context?: Record<string, any>,
  ): void {
    if (!this.isInitialized || !this.sentry) {
      return;
    }

    try {
      this.sentry.captureMessage(message, level);
      if (context) {
        this.sentry.addBreadcrumb({
          message,
          level,
          data: context,
          timestamp: Date.now() / 1000,
        });
      }
    } catch (err) {
      console.error(
        'Error capturing message in Sentry:',
        err instanceof Error ? err.message : String(err),
      );
    }
  }

  /**
   * Add a breadcrumb to track user actions
   */
  addBreadcrumb(options: BreadcrumbOptions): void {
    if (!this.isInitialized || !this.sentry) {
      return;
    }

    try {
      this.sentry.addBreadcrumb({
        message: options.message,
        level: options.level || 'info',
        category: options.category || 'general',
        data: this.filterSensitiveData(options.data),
        timestamp: Date.now() / 1000,
      });
    } catch (err) {
      console.error(
        'Error adding breadcrumb to Sentry:',
        err instanceof Error ? err.message : String(err),
      );
    }
  }

  /**
   * Set the current user for error tracking context
   */
  setUser(user: { id: string; email?: string; username?: string; ip_address?: string }): void {
    this.currentUser = user;
    if (this.isInitialized && this.sentry) {
      this.sentry.setUser(user);
    }
  }

  /**
   * Clear the current user
   */
  clearUser(): void {
    this.currentUser = null;
    if (this.isInitialized && this.sentry) {
      this.sentry.setUser(null);
    }
  }

  /**
   * Set a tag to categorize errors
   */
  setTag(key: string, value: string): void {
    if (this.isInitialized && this.sentry) {
      this.sentry.setTag(key, value);
    }
  }

  /**
   * Set extra context data
   */
  setExtra(key: string, value: any): void {
    if (this.isInitialized && this.sentry) {
      this.sentry.setContext(key, this.filterSensitiveData(value));
    }
  }

  /**
   * Start a transaction for performance monitoring
   */
  startTransaction(name: string, op: string = 'http.request'): any {
    if (!this.isInitialized || !this.sentry) {
      return null;
    }

    try {
      return this.sentry.startTransaction({
        name,
        op,
      });
    } catch (err) {
      console.error(
        'Error starting transaction in Sentry:',
        err instanceof Error ? err.message : String(err),
      );
      return null;
    }
  }

  /**
   * Get the Sentry scope for manual operations
   */
  getScope(): any {
    if (!this.isInitialized || !this.sentry) {
      return null;
    }
    return this.sentry.getCurrentScope();
  }

  /**
   * Check if Sentry is properly initialized
   */
  isEnabled(): boolean {
    return this.isInitialized;
  }

  /**
   * Filter sensitive data before sending to Sentry
   */
  private filterSensitiveData(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.filterSensitiveData(item));
    }

    const sensitivePatterns = [
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
      'phoneNumber',
      'socialSecurityNumber',
    ];

    const result: any = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitivePatterns.some(pattern =>
        lowerKey.includes(pattern.toLowerCase()),
      );

      if (isSensitive) {
        result[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this.filterSensitiveData(value);
      } else if (typeof value === 'string' && this.looksLikeSensitiveData(key, value)) {
        result[key] = '[REDACTED]';
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Determine if a value looks like sensitive data
   */
  private looksLikeSensitiveData(key: string, value: string): boolean {
    // Check if it looks like a JWT token (very long, contains dots)
    if (value.length > 100 && value.includes('.')) {
      return true;
    }

    // Check for email patterns in sensitive fields
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('email') && !lowerKey.includes('contact')) {
      // Allow contact emails, filter others
      return false;
    }

    // Check for hash patterns (very long hex strings)
    if (/^[a-f0-9]{64,}$/i.test(value)) {
      return true;
    }

    return false;
  }

  /**
   * Hook to filter events before sending to Sentry
   */
  private beforeSend(event: any): any {
    // Filter out health check and ping endpoints
    if (event.request?.url?.includes('/health') || event.request?.url?.includes('/ping')) {
      return null;
    }

    // Filter out 404 errors
    if (event.exception?.values?.[0]?.type === 'NotFoundException') {
      return null;
    }

    // Redact sensitive data in all event parts
    if (event.request?.headers) {
      event.request.headers = this.filterSensitiveData(event.request.headers);
    }

    if (event.extra) {
      event.extra = this.filterSensitiveData(event.extra);
    }

    if (event.contexts) {
      event.contexts = this.filterSensitiveData(event.contexts);
    }

    return event;
  }

  /**
   * Hook to filter breadcrumbs before sending to Sentry
   */
  private beforeBreadcrumb(breadcrumb: any): any {
    // Filter out noisy breadcrumbs
    if (
      breadcrumb.category === 'http' &&
      (breadcrumb.data?.url?.includes('/health') || breadcrumb.data?.url?.includes('/ping'))
    ) {
      return null;
    }

    // Redact sensitive data in breadcrumbs
    if (breadcrumb.data) {
      breadcrumb.data = this.filterSensitiveData(breadcrumb.data);
    }

    return breadcrumb;
  }
}
