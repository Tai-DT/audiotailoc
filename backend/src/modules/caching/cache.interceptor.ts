import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { CacheService, CacheOptions } from './cache.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInterceptor.name);
  private readonly defaultTtl = 3600; // 1 hour

  constructor(
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // Skip caching for non-GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    // Check if endpoint should be cached
    const shouldCache = this.shouldCache(context);
    if (!shouldCache) {
      return next.handle();
    }

    // Generate cache key from request
    const cacheKey = this.generateCacheKey(request);

    try {
      // Try to get from cache
      const cachedResponse = await this.cacheService.get(cacheKey);

      if (cachedResponse) {
        this.logger.debug(`Cache hit for ${request.method} ${request.path}`);
        response.setHeader('X-Cache', 'HIT');
        return of(cachedResponse);
      }

      this.logger.debug(`Cache miss for ${request.method} ${request.path}`);
      response.setHeader('X-Cache', 'MISS');

    } catch (error) {
      this.logger.error('Cache retrieval error', error);
      // Continue without cache on error
    }

    // Execute request and cache response
    return next.handle().pipe(
      map(async (data) => {
        try {
          // Get cache configuration from metadata
          const cacheOptions = this.getCacheOptions(context);

          // Cache the response
          await this.cacheService.set(cacheKey, data, cacheOptions);

          this.logger.debug(`Response cached for ${request.method} ${request.path}`);
          response.setHeader('X-Cache', 'MISS-STORED');

        } catch (error) {
          this.logger.error('Cache storage error', error);
          // Continue even if caching fails
        }

        return data;
      }),
    );
  }

  private shouldCache(context: ExecutionContext): boolean {
    // Check for @Cache decorator or cache metadata
    const handler = context.getHandler();
    const controller = context.getClass();

    const hasCacheDecorator = this.reflector.getAll('cache:enabled', [handler, controller]);
    const cacheDisabled = this.reflector.getAll('cache:disabled', [handler, controller]);

    // Cache is enabled by default for GET requests unless explicitly disabled
    return hasCacheDecorator.length > 0 || cacheDisabled.length === 0;
  }

  private generateCacheKey(request: Request): string {
    // Create cache key from request path, query parameters, and user ID (if authenticated)
    const keyData = {
      path: request.path,
      method: request.method,
      query: this.sortObjectKeys(request.query),
      userId: (request as any).user?.id,
      headers: this.getRelevantHeaders(request.headers),
    };

    return this.cacheService.generateKeyFromObject(keyData, 'http');
  }

  private getCacheOptions(context: ExecutionContext): CacheOptions {
    const handler = context.getHandler();
    const controller = context.getClass();

    // Get cache TTL from metadata or use default
    const ttlArray = this.reflector.getAll('cache:ttl', [handler, controller]);
    const ttl = ttlArray.length > 0 ? ttlArray[0] : this.defaultTtl;

    // Get cache tags from metadata
    const tags = this.reflector.getAll('cache:tags', [handler, controller]) || [];

    return {
      ttl,
      tags,
      keyPrefix: 'http',
    };
  }

  private getRelevantHeaders(headers: Record<string, any>): Record<string, any> {
    // Only include headers that affect response (e.g., Accept-Language)
    const relevantHeaders = ['accept-language', 'accept', 'authorization'];

    const filtered: Record<string, any> = {};
    relevantHeaders.forEach(header => {
      if (headers[header]) {
        filtered[header] = headers[header];
      }
    });

    return filtered;
  }

  private sortObjectKeys(obj: any): any {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
      return obj;
    }

    const sorted: any = {};
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = this.sortObjectKeys(obj[key]);
    });

    return sorted;
  }
}
