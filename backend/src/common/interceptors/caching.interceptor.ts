import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of, tap } from 'rxjs';
import { CACHE_KEY, CACHE_TTL } from '../decorators/cached.decorator';

interface CacheEntry {
  value: any;
  timestamp: number;
  ttl: number;
}

@Injectable()
export class CachingInterceptor implements NestInterceptor {
  private cache = new Map<string, CacheEntry>();

  constructor(
    private reflector: Reflector,
    @Optional() @Inject('REDIS_CLIENT') private redisClient?: any,
  ) {
    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const cacheKey = this.reflector.get<string>(CACHE_KEY, context.getHandler());
    const cacheTtl = this.reflector.get<number>(CACHE_TTL, context.getHandler());

    if (!cacheKey) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const args = Object.values(request.params || {}).concat(Object.values(request.query || {}));
    const fullCacheKey = this.generateCacheKey(cacheKey, args);

    // Try to get from Redis first (if available)
    if (this.redisClient) {
      return new Observable(subscriber => {
        this.redisClient
          .get(fullCacheKey)
          .then((cached: string | null) => {
            if (cached) {
              const parsed = JSON.parse(cached);
              subscriber.next(parsed);
              subscriber.complete();
            } else {
              // Execute the handler and cache the result
              next
                .handle()
                .pipe(
                  tap(data => {
                    this.redisClient.setex(fullCacheKey, cacheTtl || 300, JSON.stringify(data));
                  }),
                )
                .subscribe({
                  next: data => subscriber.next(data),
                  error: err => subscriber.error(err),
                  complete: () => subscriber.complete(),
                });
            }
          })
          .catch(() => {
            // Fall back to in-memory cache if Redis fails
            this.handleInMemoryCache(fullCacheKey, cacheTtl || 300, next).subscribe({
              next: data => subscriber.next(data),
              error: err => subscriber.error(err),
              complete: () => subscriber.complete(),
            });
          });
      });
    }

    // Use in-memory cache
    return this.handleInMemoryCache(fullCacheKey, cacheTtl || 300, next);
  }

  private handleInMemoryCache(cacheKey: string, ttl: number, next: CallHandler): Observable<any> {
    const cached = this.cache.get(cacheKey);

    if (cached && this.isValid(cached)) {
      return of(cached.value);
    }

    return next.handle().pipe(
      tap(data => {
        this.cache.set(cacheKey, {
          value: data,
          timestamp: Date.now(),
          ttl,
        });
      }),
    );
  }

  private generateCacheKey(baseKey: string, args: any[]): string {
    if (args.length === 0) return baseKey;

    const argsString = args
      .filter(arg => arg !== undefined && arg !== null)
      .map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
      .join(':');

    return `${baseKey}:${argsString}`;
  }

  private isValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < entry.ttl * 1000;
  }

  private cleanup(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (!this.isValid(entry)) {
        this.cache.delete(key);
      }
    }
  }

  // Public methods for cache management
  public clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}
