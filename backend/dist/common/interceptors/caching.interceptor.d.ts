import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
export declare class CachingInterceptor implements NestInterceptor {
    private reflector;
    private redisClient?;
    private cache;
    constructor(reflector: Reflector, redisClient?: any);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private handleInMemoryCache;
    private generateCacheKey;
    private isValid;
    private cleanup;
    clearCache(pattern?: string): void;
    getCacheStats(): {
        size: number;
        keys: string[];
    };
}
