import { Injectable, Logger } from '@nestjs/common';

/**
 * Rate Limiter Configuration
 * Defines rate limiting rules for different types of endpoints
 * Supports dynamic configuration based on environment and endpoint patterns
 */

export interface RateLimiterRule {
  // Pattern to match routes (regex or simple string matching)
  pattern: string | RegExp;

  // Time window in milliseconds
  windowMs: number;

  // Maximum requests allowed per window
  maxRequests: number;

  // HTTP methods to apply the rule to (if empty, applies to all)
  methods?: string[];

  // Whether to skip rate limiting for successful responses
  skipSuccessfulRequests?: boolean;

  // Whether to skip rate limiting for failed responses
  skipFailedRequests?: boolean;

  // Custom error message
  message?: string;

  // Whether to enable in development
  enableInDev?: boolean;
}

export interface RateLimiterConfig {
  // Global default rule
  defaultRule: RateLimiterRule;

  // Endpoint-specific rules
  rules: RateLimiterRule[];

  // Whether to use IP address for identifying clients
  useIP?: boolean;

  // Whether to include user ID in rate limit key (if authenticated)
  includeUserID?: boolean;

  // Redis connection options (if using Redis for distributed rate limiting)
  redisOptions?: {
    host: string;
    port: number;
    db?: number;
  };

  // Headers to set in response
  headers?: {
    limit?: string;
    remaining?: string;
    reset?: string;
  };
}

@Injectable()
export class RateLimiterConfigService {
  private readonly logger = new Logger(RateLimiterConfigService.name);
  private readonly isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Get the complete rate limiter configuration
   */
  getConfig(): RateLimiterConfig {
    return {
      defaultRule: this.getDefaultRule(),
      rules: this.getEndpointRules(),
      useIP: true,
      includeUserID: true,
      headers: {
        limit: 'X-RateLimit-Limit',
        remaining: 'X-RateLimit-Remaining',
        reset: 'X-RateLimit-Reset',
      },
    };
  }

  /**
   * Get the default rate limiting rule
   * Applied to all endpoints that don't match specific rules
   */
  private getDefaultRule(): RateLimiterRule {
    return {
      pattern: '.*', // Match all
      windowMs: this.isDevelopment ? 60 * 1000 : 15 * 60 * 1000, // 1 min in dev, 15 min in prod
      maxRequests: this.isDevelopment ? 1000 : 100,
      message: 'Too many requests from this IP, please try again later',
      enableInDev: true,
    };
  }

  /**
   * Get endpoint-specific rate limiting rules
   * Rules are evaluated in order, first match wins
   */
  private getEndpointRules(): RateLimiterRule[] {
    const rules: RateLimiterRule[] = [
      // === Authentication Endpoints ===
      {
        pattern: '/auth/login',
        windowMs: this.isDevelopment ? 60 * 1000 : 15 * 60 * 1000,
        maxRequests: this.isDevelopment ? 1000 : 5,
        methods: ['POST'],
        message: 'Too many login attempts, please try again later',
        enableInDev: true,
      },
      {
        pattern: '/auth/register',
        windowMs: this.isDevelopment ? 60 * 1000 : 60 * 60 * 1000,
        maxRequests: this.isDevelopment ? 50 : 3,
        methods: ['POST'],
        message: 'Too many registration attempts, please try again later',
        enableInDev: true,
      },
      {
        pattern: '/auth/forgot-password',
        windowMs: this.isDevelopment ? 60 * 1000 : 60 * 60 * 1000,
        maxRequests: this.isDevelopment ? 50 : 3,
        methods: ['POST'],
        message: 'Too many password reset attempts, please try again later',
        enableInDev: true,
      },
      {
        pattern: '/auth/reset-password',
        windowMs: this.isDevelopment ? 60 * 1000 : 60 * 60 * 1000,
        maxRequests: this.isDevelopment ? 50 : 3,
        methods: ['POST'],
        message: 'Too many password reset attempts, please try again later',
        enableInDev: true,
      },
      {
        pattern: '/auth/refresh',
        windowMs: this.isDevelopment ? 60 * 1000 : 5 * 60 * 1000,
        maxRequests: this.isDevelopment ? 200 : 10,
        methods: ['POST'],
        message: 'Too many token refresh attempts, please try again later',
        enableInDev: true,
      },

      // === File Upload Endpoints ===
      // Files should have stricter rate limits to prevent storage abuse
      {
        pattern: '/upload|/files',
        windowMs: this.isDevelopment ? 60 * 1000 : 60 * 60 * 1000,
        maxRequests: this.isDevelopment ? 50 : 10, // 10 uploads per hour in production
        methods: ['POST', 'PUT'],
        message: 'Too many file uploads, please try again later',
        enableInDev: true,
      },

      // === Search Endpoints ===
      {
        pattern: '/search|/catalog',
        windowMs: this.isDevelopment ? 60 * 1000 : 60 * 1000,
        maxRequests: this.isDevelopment ? 200 : 60,
        methods: ['GET'],
        message: 'Too many search requests, please try again later',
        enableInDev: true,
      },

      // === API Write Operations ===
      // POST, PUT, DELETE requests (except auth which has stricter limits)
      {
        pattern: '/api/(?!auth)',
        windowMs: this.isDevelopment ? 60 * 1000 : 60 * 1000,
        maxRequests: this.isDevelopment ? 500 : 30,
        methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
        message: 'Too many requests, please try again later',
        enableInDev: true,
      },

      // === API Read Operations ===
      // GET requests typically have higher limits
      {
        pattern: '/api/',
        windowMs: this.isDevelopment ? 60 * 1000 : 5 * 60 * 1000,
        maxRequests: this.isDevelopment ? 2000 : 200,
        methods: ['GET', 'HEAD', 'OPTIONS'],
        message: 'Too many requests, please try again later',
        enableInDev: true,
      },

      // === Admin Endpoints ===
      // Stricter limits for sensitive admin operations
      {
        pattern: '/admin|/dashboard',
        windowMs: this.isDevelopment ? 60 * 1000 : 5 * 60 * 1000,
        maxRequests: this.isDevelopment ? 500 : 50,
        message: 'Too many admin requests, please try again later',
        enableInDev: true,
      },

      // === Payment Endpoints ===
      // Moderate limits for payment operations
      {
        pattern: '/payments|/checkout',
        windowMs: this.isDevelopment ? 60 * 1000 : 60 * 1000,
        maxRequests: this.isDevelopment ? 100 : 10,
        methods: ['POST'],
        message: 'Too many payment requests, please try again later',
        enableInDev: true,
      },

      // === Contact/Support Endpoints ===
      {
        pattern: '/contact|/support',
        windowMs: this.isDevelopment ? 60 * 1000 : 60 * 60 * 1000,
        maxRequests: this.isDevelopment ? 50 : 5,
        methods: ['POST'],
        message: 'Too many support requests, please try again later',
        enableInDev: true,
      },

      // === Health Check Endpoints ===
      // Unlimited for internal monitoring
      {
        pattern: '/health',
        windowMs: 60 * 1000,
        maxRequests: 10000,
        enableInDev: true,
      },
    ];

    return rules;
  }

  /**
   * Find the matching rate limit rule for a given request
   */
  getMatchingRule(path: string, method: string): RateLimiterRule {
    const rules = this.getEndpointRules();

    for (const rule of rules) {
      // Check if pattern matches
      const isPatternMatch =
        typeof rule.pattern === 'string'
          ? path.includes(rule.pattern)
          : (rule.pattern as RegExp).test(path);

      if (!isPatternMatch) {
        continue;
      }

      // Check if method matches (if methods are specified)
      if (rule.methods && rule.methods.length > 0) {
        if (!rule.methods.includes(method)) {
          continue;
        }
      }

      // Check if rule should be applied in current environment
      if (rule.enableInDev === false && this.isDevelopment) {
        continue;
      }

      return rule;
    }

    // Return default rule if no specific rule matches
    return this.getDefaultRule();
  }

  /**
   * Generate rate limit key for a request
   * Used to identify unique clients for rate limiting
   */
  generateRateLimitKey(
    ip: string,
    userID?: string | number,
    userAgent?: string
  ): string {
    const parts: string[] = [];

    // Include user ID if available (authenticated requests)
    if (userID) {
      parts.push(`user:${userID}`);
    } else {
      // For unauthenticated requests, use IP + User-Agent hash
      parts.push(`ip:${ip}`);

      if (userAgent) {
        const uaHash = this.hashString(userAgent);
        parts.push(`ua:${uaHash}`);
      }
    }

    return parts.join(':');
  }

  /**
   * Simple hash function for User-Agent
   */
  private hashString(str: string): string {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(36);
  }

  /**
   * Calculate retry-after header value in seconds
   */
  getRetryAfterSeconds(windowMs: number): number {
    return Math.ceil(windowMs / 1000);
  }

  /**
   * Log rate limit configuration for debugging
   */
  logConfiguration(): void {
    const config = this.getConfig();

    this.logger.log(
      `Rate Limiter Configuration (Environment: ${this.isDevelopment ? 'development' : 'production'})`
    );
    this.logger.log(`Default Rule: ${config.defaultRule.maxRequests} requests per ${config.defaultRule.windowMs}ms`);
    this.logger.log(`Endpoint-specific Rules: ${config.rules.length}`);

    config.rules.forEach((rule) => {
      this.logger.debug(
        `  ${rule.pattern}: ${rule.maxRequests} requests per ${rule.windowMs}ms`
      );
    });
  }
}

/**
 * Factory function to create a rate limiter configuration
 */
export function createRateLimiterConfig(): RateLimiterConfigService {
  return new RateLimiterConfigService();
}
