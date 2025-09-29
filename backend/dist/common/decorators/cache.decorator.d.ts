export interface CacheConfig {
    ttl?: number;
    prefix?: string;
    keyGenerator?: (...args: any[]) => string;
}
export declare const CACHE_KEY = "cache";
export declare const Cache: (config?: CacheConfig) => import("@nestjs/common").CustomDecorator<string>;
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { CacheService } from '../../modules/caching/cache.service';
export declare class CacheInterceptor implements NestInterceptor {
    private readonly cacheService;
    private readonly reflector;
    constructor(cacheService: CacheService, reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
    private generateCacheKey;
}
