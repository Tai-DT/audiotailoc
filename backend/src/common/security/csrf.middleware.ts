import { Injectable, NestMiddleware, Logger, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

/**
 * CSRF Protection Middleware
 * 
 * Protects against Cross-Site Request Forgery (CSRF) attacks by:
 * 1. Verifying Origin header for state-changing requests (POST, PUT, DELETE, PATCH)
 * 2. Checking Referer header as fallback
 * 3. Allowing same-origin requests
 * 
 * Note: This is a basic implementation. For production, consider using
 * csurf package or implementing proper CSRF tokens.
 */
@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CsrfMiddleware.name);
  private readonly allowedOrigins: string[];
  private readonly isDevelopment: boolean;

  constructor(private readonly configService: ConfigService) {
    // Get allowed origins from config
    const corsOrigins =
      this.configService.get('CORS_ORIGIN') ||
      this.configService.get('CORS_ORIGINS') ||
      'http://localhost:3000,http://localhost:3001,http://localhost:3002';

    this.allowedOrigins = corsOrigins.split(',').map(origin => origin.trim());
    this.isDevelopment = this.configService.get('NODE_ENV') === 'development';
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Only check CSRF for state-changing methods
    const stateChangingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
    if (!stateChangingMethods.includes(req.method)) {
      return next();
    }

    // Skip CSRF check for health checks and public endpoints
    const publicPaths = ['/health', '/api/v1/health', '/api/v1/auth/login', '/api/v1/auth/register'];
    if (publicPaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    // In development, allow requests without Origin (for testing with Postman, etc.)
    if (this.isDevelopment && !req.headers.origin && !req.headers.referer) {
      this.logger.debug('Development mode: Allowing request without Origin header');
      return next();
    }

    // Get Origin or Referer header
    const origin = req.headers.origin as string;
    const referer = req.headers.referer as string;

    // Extract origin from referer if origin header is missing
    let requestOrigin = origin;
    if (!requestOrigin && referer) {
      try {
        const refererUrl = new URL(referer);
        requestOrigin = refererUrl.origin;
      } catch (error) {
        // Invalid referer URL
      }
    }

    // If no origin/referer, reject in production
    if (!requestOrigin) {
      if (this.isDevelopment) {
        this.logger.warn('Request without Origin/Referer header in development mode');
        return next();
      }
      this.logger.warn(`CSRF check failed: No Origin or Referer header for ${req.method} ${req.path}`);
      throw new BadRequestException('Missing Origin header. CSRF protection enabled.');
    }

    // Check if origin is allowed
    const isAllowed = this.isOriginAllowed(requestOrigin);

    if (!isAllowed) {
      this.logger.warn(`CSRF check failed: Origin ${requestOrigin} not allowed for ${req.method} ${req.path}`);
      throw new BadRequestException('Origin not allowed. CSRF protection enabled.');
    }

    // CSRF check passed
    this.logger.debug(`CSRF check passed for ${requestOrigin}`);
    next();
  }

  /**
   * Check if origin is in allowed list
   */
  private isOriginAllowed(origin: string): boolean {
    const originUrl = new URL(origin);
    const originHostname = originUrl.hostname;

    // Check exact match
    if (this.allowedOrigins.includes(origin)) {
      return true;
    }

    // Allow localhost in development even if port differs
    if (this.isDevelopment && (originHostname === 'localhost' || originHostname === '127.0.0.1')) {
      return true;
    }

    // Check wildcard patterns (e.g., https://*.vercel.app)
    for (const allowedOrigin of this.allowedOrigins) {
      if (allowedOrigin.includes('*')) {
        const pattern = allowedOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace('\\*', '.*');
        const regex = new RegExp(`^${pattern}$`);
        if (regex.test(origin)) {
          return true;
        }
      }
    }

    // Fallback: Check if it's the same base domain for Vercel previews
    if (originHostname.endsWith('.vercel.app')) {
      const isVercelAllowed = this.allowedOrigins.some(ao => ao.includes('.vercel.app'));
      if (isVercelAllowed) return true;
    }

    return false;
  }
}
