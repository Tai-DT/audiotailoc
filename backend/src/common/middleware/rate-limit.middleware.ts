import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../../modules/caching/cache.service';

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: Request) => string;
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor(private readonly cacheService: CacheService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Default rate limiting configuration
    const options: RateLimitOptions = {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100, // 100 requests per window
      message: 'Too many requests, please try again later',
      keyGenerator: (req) => this.getClientIdentifier(req),
    };

    // Apply different limits based on endpoint
    const endpoint = req.path;
    const method = req.method;

    if (endpoint.includes('/auth/login')) {
      options.windowMs = 15 * 60 * 1000; // 15 minutes
      options.maxRequests = 5; // 5 login attempts
      options.message = 'Too many login attempts, please try again later';
    } else if (endpoint.includes('/auth/register')) {
      options.windowMs = 60 * 60 * 1000; // 1 hour
      options.maxRequests = 3; // 3 registration attempts
      options.message = 'Too many registration attempts, please try again later';
    } else if (endpoint.includes('/auth/forgot-password')) {
      options.windowMs = 60 * 60 * 1000; // 1 hour
      options.maxRequests = 3; // 3 password reset attempts
      options.message = 'Too many password reset attempts, please try again later';
    } else if (method === 'POST' && endpoint.includes('/api/')) {
      options.windowMs = 60 * 1000; // 1 minute
      options.maxRequests = 30; // 30 POST requests per minute
    } else if (endpoint.includes('/search')) {
      options.windowMs = 60 * 1000; // 1 minute
      options.maxRequests = 60; // 60 search requests per minute
    }

    this.applyRateLimit(req, res, next, options);
  }

  private async applyRateLimit(
    req: Request,
    res: Response,
    next: NextFunction,
    options: RateLimitOptions
  ) {
    try {
      const key = options.keyGenerator!(req);
      const cacheKey = `rate_limit:${key}:${req.path}`;
      
      // Get current request count
      const currentCount = await this.cacheService.get<number>(cacheKey) || 0;
      
      // Check if limit exceeded
      if (currentCount >= options.maxRequests) {
        // Get remaining time
        const ttl = await this.getRemainingTTL(cacheKey);
        
        res.set({
          'X-RateLimit-Limit': options.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + ttl).toISOString(),
          'Retry-After': Math.ceil(ttl / 1000).toString(),
        });

        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: options.message,
            error: 'Too Many Requests',
          },
          HttpStatus.TOO_MANY_REQUESTS
        );
      }

      // Increment counter
      await this.cacheService.increment(cacheKey, 1, {
        ttl: Math.ceil(options.windowMs / 1000),
      });

      // Set response headers
      const remaining = Math.max(0, options.maxRequests - currentCount - 1);
      res.set({
        'X-RateLimit-Limit': options.maxRequests.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': new Date(Date.now() + options.windowMs).toISOString(),
      });

      next();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      // If rate limiting fails, allow the request but log the error
      console.error('Rate limiting error:', error);
      next();
    }
  }

  private getClientIdentifier(req: Request): string {
    // Try to get the real IP address
    const forwarded = req.get('X-Forwarded-For');
    const realIP = req.get('X-Real-IP');
    const ip = forwarded?.split(',')[0] || realIP || req.ip || req.connection.remoteAddress;
    
    // For authenticated users, use user ID + IP
    const userId = (req as any).user?.id;
    if (userId) {
      return `user:${userId}:${ip}`;
    }
    
    // For anonymous users, use IP + User-Agent hash
    const userAgent = req.get('User-Agent') || '';
    const userAgentHash = this.hashString(userAgent);
    
    return `ip:${ip}:${userAgentHash}`;
  }

  private async getRemainingTTL(_key: string): Promise<number> {
    try {
      // This would need to be implemented in the cache service
      // For now, return default window
      return 15 * 60 * 1000; // 15 minutes
    } catch (error) {
      return 15 * 60 * 1000; // Default fallback
    }
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
}

// Decorator for applying rate limiting to specific routes
export function RateLimit(_options: Partial<RateLimitOptions>) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      // This would be implemented as a guard or interceptor in a real application
      return method.apply(this, args);
    };
  };
}

// Rate limiting guard for specific endpoints
import { Injectable as GuardInjectable, CanActivate, ExecutionContext } from '@nestjs/common';

@GuardInjectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly cacheService: CacheService,
    private readonly options: RateLimitOptions
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const key = this.options.keyGenerator?.(request) || this.getDefaultKey(request);
    const cacheKey = `rate_limit:${key}`;
    
    const currentCount = await this.cacheService.get<number>(cacheKey) || 0;
    
    if (currentCount >= this.options.maxRequests) {
      response.status(429).json({
        statusCode: 429,
        message: this.options.message || 'Too many requests',
        error: 'Too Many Requests',
      });
      return false;
    }
    
    await this.cacheService.increment(cacheKey, 1, {
      ttl: Math.ceil(this.options.windowMs / 1000),
    });
    
    return true;
  }

  private getDefaultKey(request: any): string {
    const ip = request.ip || request.connection.remoteAddress;
    const userId = request.user?.id;
    return userId ? `user:${userId}` : `ip:${ip}`;
  }
}
