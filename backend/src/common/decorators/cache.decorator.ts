import { SetMetadata } from '@nestjs/common';

export interface CacheConfig {
  ttl?: number;
  prefix?: string;
  keyGenerator?: (...args: any[]) => string;
}

export const CACHE_KEY = 'cache';

export const Cache = (config: CacheConfig = {}) => SetMetadata(CACHE_KEY, config);

// Cache interceptor
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../../modules/caching/cache.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const cacheConfig = this.reflector.get<CacheConfig>(CACHE_KEY, context.getHandler());

    if (!cacheConfig) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const cacheKey = this.generateCacheKey(context, cacheConfig, request);

    // Try to get from cache
    const cachedResult = await this.cacheService.get(cacheKey, {
      prefix: cacheConfig.prefix,
    });

    if (cachedResult !== null) {
      return of(cachedResult);
    }

    // Execute the method and cache the result
    return next.handle().pipe(
      tap(async result => {
        await this.cacheService.set(cacheKey, result, {
          ttl: cacheConfig.ttl,
          prefix: cacheConfig.prefix,
        });
      }),
    );
  }

  private generateCacheKey(context: ExecutionContext, config: CacheConfig, request: any): string {
    if (config.keyGenerator) {
      const args = context.getArgs();
      return config.keyGenerator(...args);
    }

    const className = context.getClass().name;
    const methodName = context.getHandler().name;
    const url = request.url;
    const query = JSON.stringify(request.query || {});
    const params = JSON.stringify(request.params || {});

    return `${className}:${methodName}:${url}:${query}:${params}`;
  }
}
