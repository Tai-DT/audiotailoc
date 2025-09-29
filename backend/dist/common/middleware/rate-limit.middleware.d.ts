import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../../modules/caching/cache.service';
export interface RateLimitOptions {
    windowMs: number;
    maxRequests: number;
    message?: string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
    keyGenerator?: (req: Request) => string;
}
export declare class RateLimitMiddleware implements NestMiddleware {
    private readonly cacheService;
    constructor(cacheService: CacheService);
    use(req: Request, res: Response, next: NextFunction): void;
    private applyRateLimit;
    private getClientIdentifier;
    private getRemainingTTL;
    private hashString;
}
export declare function RateLimit(_options: Partial<RateLimitOptions>): (target: any, propertyName: string, descriptor: PropertyDescriptor) => void;
import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class RateLimitGuard implements CanActivate {
    private readonly cacheService;
    private readonly options;
    constructor(cacheService: CacheService, options: RateLimitOptions);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getDefaultKey;
}
