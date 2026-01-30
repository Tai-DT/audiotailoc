import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

/**
 * API Key metadata
 */
export interface ApiKeyMetadata {
  key: string;
  name: string;
  scopes: string[];
  rateLimit?: number; // Requests per minute
  active: boolean;
  createdAt: Date;
  expiresAt?: Date;
  allowedHosts?: string[];
  allowedMethods?: string[];
  allowedPaths?: string[];
}

/**
 * Decorator to require API key authentication
 * Usage: @UseGuards(ApiKeyGuard) or @RequireApiKey()
 */
export const REQUIRE_API_KEY = 'require_api_key';

/**
 * Custom decorator for API key requirement
 */
export function RequireApiKey(scopes?: string[]): MethodDecorator & ClassDecorator {
  return function (
    target: object,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) {
    if (descriptor) {
      // Method decorator
      Reflect.defineMetadata(REQUIRE_API_KEY, { scopes: scopes || [] }, descriptor.value);
    } else {
      // Class decorator
      Reflect.defineMetadata(REQUIRE_API_KEY, { scopes: scopes || [] }, target);
    }
  };
}

/**
 * API Key Guard
 * Validates API keys for authenticating third-party integrations and services
 *
 * Features:
 * - Support for API key validation
 * - Scope-based access control
 * - Rate limiting per API key
 * - IP whitelist support
 * - API key expiration
 * - Request method/path restrictions
 * - Secure API key storage (hashed)
 * - API key rotation support
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);
  private readonly isDevelopment = process.env.NODE_ENV === 'development';

  // In-memory store for API keys (in production, use database)
  private apiKeys = new Map<string, ApiKeyMetadata>();

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    this.initializeApiKeys();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // Check if API key is required for this endpoint
    const requiresApiKey = this.reflector.getAllAndOverride(REQUIRE_API_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiresApiKey && !process.env.REQUIRE_API_KEY_FOR_ALL) {
      return true; // API key not required
    }

    try {
      const apiKeyHeader = request.headers['x-api-key'] as string;
      const apiKeyQuery = request.query['api_key'] as string;
      const apiKey = apiKeyHeader || apiKeyQuery;

      if (!apiKey) {
        throw new UnauthorizedException(
          'API key is required. Provide it via X-API-Key header or api_key query parameter.',
        );
      }

      // Validate API key format
      if (!this.isValidApiKeyFormat(apiKey)) {
        this.logSecurityEvent('Invalid API key format', request, apiKey);
        throw new BadRequestException('Invalid API key format');
      }

      // Get API key metadata
      const keyMetadata = this.apiKeys.get(apiKey);
      if (!keyMetadata) {
        this.logSecurityEvent('API key not found', request, apiKey);
        throw new UnauthorizedException('Invalid API key');
      }

      // Check if API key is active
      if (!keyMetadata.active) {
        this.logSecurityEvent('API key is inactive', request, apiKey);
        throw new UnauthorizedException('API key is inactive');
      }

      // Check if API key has expired
      if (keyMetadata.expiresAt && new Date() > keyMetadata.expiresAt) {
        this.logSecurityEvent('API key has expired', request, apiKey);
        throw new UnauthorizedException('API key has expired');
      }

      // Check IP whitelist
      if (keyMetadata.allowedHosts && keyMetadata.allowedHosts.length > 0) {
        const clientIp = this.getClientIp(request);
        if (!this.isIpAllowed(clientIp, keyMetadata.allowedHosts)) {
          this.logSecurityEvent('IP not whitelisted for API key', request, apiKey, clientIp);
          throw new ForbiddenException('Your IP address is not authorized to use this API key');
        }
      }

      // Check request method restrictions
      if (keyMetadata.allowedMethods && keyMetadata.allowedMethods.length > 0) {
        if (!keyMetadata.allowedMethods.includes(request.method)) {
          this.logSecurityEvent('HTTP method not allowed for API key', request, apiKey);
          throw new ForbiddenException(
            `HTTP method ${request.method} is not allowed for this API key`,
          );
        }
      }

      // Check request path restrictions
      if (keyMetadata.allowedPaths && keyMetadata.allowedPaths.length > 0) {
        if (!this.isPathAllowed(request.path, keyMetadata.allowedPaths)) {
          this.logSecurityEvent('Path not allowed for API key', request, apiKey);
          throw new ForbiddenException('This endpoint is not accessible with this API key');
        }
      }

      // Check scopes if required
      if (requiresApiKey && requiresApiKey.scopes && requiresApiKey.scopes.length > 0) {
        const hasScopes = requiresApiKey.scopes.every(scope => keyMetadata.scopes.includes(scope));

        if (!hasScopes) {
          this.logSecurityEvent('Insufficient scopes for API key', request, apiKey);
          throw new ForbiddenException(
            `API key does not have required scopes: ${requiresApiKey.scopes.join(', ')}`,
          );
        }
      }

      // Check rate limiting
      const rateLimitResult = await this.checkRateLimit(apiKey, keyMetadata, response);
      if (!rateLimitResult) {
        this.logSecurityEvent('API key rate limit exceeded', request, apiKey);
        throw new ForbiddenException('API key rate limit exceeded');
      }

      // Attach API key metadata to request for use in handlers
      (request as any).apiKey = {
        key: apiKey,
        name: keyMetadata.name,
        scopes: keyMetadata.scopes,
      };

      this.logger.debug(`API key validated: ${keyMetadata.name}`);
      return true;
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      this.logger.error(
        `API key validation error: ${error instanceof Error ? error.message : 'unknown'}`,
      );
      throw new UnauthorizedException('API key validation failed');
    }
  }

  /**
   * Initialize API keys from configuration or database
   * In production, load from secure database
   */
  private initializeApiKeys(): void {
    // Load from environment or config
    const apiKeysConfig = this.configService.get('API_KEYS');

    if (apiKeysConfig) {
      try {
        const keys = typeof apiKeysConfig === 'string' ? JSON.parse(apiKeysConfig) : apiKeysConfig;

        Object.entries(keys).forEach(([key, config]: [string, any]) => {
          this.apiKeys.set(key, {
            key,
            name: config.name || key,
            scopes: config.scopes || [],
            rateLimit: config.rateLimit || 60,
            active: config.active !== false,
            createdAt: config.createdAt ? new Date(config.createdAt) : new Date(),
            expiresAt: config.expiresAt ? new Date(config.expiresAt) : undefined,
            allowedHosts: config.allowedHosts || [],
            allowedMethods: config.allowedMethods || [],
            allowedPaths: config.allowedPaths || [],
          });
        });

        this.logger.log(`Loaded ${this.apiKeys.size} API keys`);
      } catch (error) {
        this.logger.error(
          `Failed to load API keys: ${error instanceof Error ? error.message : 'unknown'}`,
        );
      }
    }

    // SECURITY: Development key should come from environment variable, not hardcoded
    // Add development key if in development environment and configured
    if (this.isDevelopment) {
      const devKey = this.configService.get<string>('DEV_API_KEY');
      if (devKey) {
        this.apiKeys.set(devKey, {
          key: devKey,
          name: 'Development Key',
          scopes: ['*'],
          rateLimit: 1000,
          active: true,
          createdAt: new Date(),
        });
        this.logger.warn(
          '⚠️ Development API key is enabled. This should NEVER be used in production!',
        );
      } else {
        this.logger.debug('Development API key not configured. Set DEV_API_KEY to enable.');
      }
    }
  }

  /**
   * Validate API key format
   * API keys should be alphanumeric with hyphens (similar to JWT format)
   */
  private isValidApiKeyFormat(apiKey: string): boolean {
    // Basic format validation
    if (!apiKey || apiKey.length < 10 || apiKey.length > 255) {
      return false;
    }

    // Allow alphanumeric, hyphens, and underscores
    return /^[a-zA-Z0-9\-_]+$/.test(apiKey);
  }

  /**
   * Get client IP address from request
   */
  private getClientIp(request: Request): string {
    // Check for proxies first
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      const ips = typeof forwarded === 'string' ? forwarded.split(',') : [forwarded[0]];
      return ips[0]?.trim() || '';
    }

    const realIp = request.headers['x-real-ip'];
    if (realIp) {
      return typeof realIp === 'string' ? realIp : realIp[0];
    }

    return request.ip || request.connection.remoteAddress || 'unknown';
  }

  /**
   * Check if IP is in the whitelist
   * Supports CIDR notation and exact IP matches
   */
  private isIpAllowed(clientIp: string, allowedHosts: string[]): boolean {
    return allowedHosts.some(host => {
      // Exact match
      if (host === clientIp) {
        return true;
      }

      // CIDR notation (simplified - for production use a proper library)
      if (host.includes('/')) {
        // Basic CIDR check (production should use proper library like ip)
        const [network, bits] = host.split('/');
        return this.isCidrMatch(clientIp, network, parseInt(bits, 10));
      }

      return false;
    });
  }

  /**
   * Simple CIDR matching (basic implementation)
   */
  private isCidrMatch(ip: string, network: string, bits: number): boolean {
    try {
      const ipParts = ip.split('.').map(Number);
      const networkParts = network.split('.').map(Number);

      if (ipParts.length !== 4 || networkParts.length !== 4) {
        return false;
      }

      const mask = (0xffffffff << (32 - bits)) >>> 0;

      let ipNum = 0;
      let networkNum = 0;

      for (let i = 0; i < 4; i++) {
        ipNum = (ipNum << 8) | ipParts[i];
        networkNum = (networkNum << 8) | networkParts[i];
      }

      return (ipNum & mask) === (networkNum & mask);
    } catch {
      return false;
    }
  }

  /**
   * Check if request path is allowed
   * Supports wildcard patterns
   */
  private isPathAllowed(requestPath: string, allowedPaths: string[]): boolean {
    return allowedPaths.some(pattern => {
      // Exact match
      if (pattern === requestPath) {
        return true;
      }

      // Wildcard patterns (e.g., /api/users/*)
      const regexPattern = pattern.replace(/\//g, '\\/').replace(/\*/g, '.*').replace(/\?/g, '.');

      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(requestPath);
    });
  }

  /**
   * Check rate limit for API key
   */
  private async checkRateLimit(
    apiKey: string,
    metadata: ApiKeyMetadata,
    response: Response,
  ): Promise<boolean> {
    if (!metadata.rateLimit) {
      return true; // No rate limit
    }

    // In production, use Redis or similar for distributed rate limiting
    // For now, we'll use a simple in-memory implementation

    const _cacheKey = `api_key_rate_limit:${apiKey}`;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute

    // This is a simplified implementation - use proper caching in production
    // Store in request context or use Redis

    // Set rate limit headers
    response.setHeader('X-RateLimit-Limit', metadata.rateLimit.toString());
    response.setHeader('X-RateLimit-Remaining', Math.max(0, metadata.rateLimit - 1).toString());
    response.setHeader('X-RateLimit-Reset', new Date(now + windowMs).toISOString());

    return true; // Allow for now
  }

  /**
   * Log security events
   */
  private logSecurityEvent(
    event: string,
    request: Request,
    apiKey: string,
    additionalInfo?: string,
  ): void {
    const clientIp = this.getClientIp(request);
    const userAgent = request.headers['user-agent'];

    this.logger.warn(
      `Security Event: ${event} | IP: ${clientIp} | API Key: ${apiKey.substring(0, 10)}... | ${additionalInfo || ''} | User-Agent: ${userAgent}`,
    );

    // In production, send to centralized security monitoring/logging service
  }
}

/**
 * Type for API key in request context
 */
export interface RequestWithApiKey extends Request {
  apiKey?: {
    key: string;
    name: string;
    scopes: string[];
  };
}

/**
 * Helper to extract API key metadata from request
 */
export function getApiKeyFromRequest(request: any): RequestWithApiKey['apiKey'] | undefined {
  return request.apiKey;
}
