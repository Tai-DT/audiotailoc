"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitGuard = exports.RateLimitMiddleware = void 0;
exports.RateLimit = RateLimit;
const common_1 = require("@nestjs/common");
const cache_service_1 = require("../../modules/caching/cache.service");
let RateLimitMiddleware = class RateLimitMiddleware {
    constructor(cacheService) {
        this.cacheService = cacheService;
    }
    use(req, res, next) {
        const options = {
            windowMs: 15 * 60 * 1000,
            maxRequests: 100,
            message: 'Too many requests, please try again later',
            keyGenerator: (req) => this.getClientIdentifier(req),
        };
        const endpoint = req.path;
        const method = req.method;
        const isDevelopment = process.env.NODE_ENV === 'development';
        if (endpoint.includes('/auth/login')) {
            options.windowMs = isDevelopment ? 60 * 1000 : 15 * 60 * 1000;
            options.maxRequests = isDevelopment ? 100 : 5;
            options.message = 'Too many login attempts, please try again later';
        }
        else if (endpoint.includes('/auth/register')) {
            options.windowMs = isDevelopment ? 60 * 1000 : 60 * 60 * 1000;
            options.maxRequests = isDevelopment ? 50 : 3;
            options.message = 'Too many registration attempts, please try again later';
        }
        else if (endpoint.includes('/auth/forgot-password')) {
            options.windowMs = isDevelopment ? 60 * 1000 : 60 * 60 * 1000;
            options.maxRequests = isDevelopment ? 50 : 3;
            options.message = 'Too many password reset attempts, please try again later';
        }
        else if (method === 'POST' && endpoint.includes('/api/')) {
            options.windowMs = isDevelopment ? 60 * 1000 : 60 * 1000;
            options.maxRequests = isDevelopment ? 500 : 30;
        }
        else if (endpoint.includes('/search')) {
            options.windowMs = isDevelopment ? 60 * 1000 : 60 * 1000;
            options.maxRequests = isDevelopment ? 200 : 60;
        }
        else {
            options.windowMs = isDevelopment ? 60 * 1000 : 15 * 60 * 1000;
            options.maxRequests = isDevelopment ? 1000 : 100;
        }
        this.applyRateLimit(req, res, next, options);
    }
    async applyRateLimit(req, res, next, options) {
        try {
            const key = options.keyGenerator(req);
            const cacheKey = `rate_limit:${key}:${req.path}`;
            const currentCount = await this.cacheService.get(cacheKey) || 0;
            if (currentCount >= options.maxRequests) {
                const ttl = await this.getRemainingTTL(cacheKey);
                res.set({
                    'X-RateLimit-Limit': options.maxRequests.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': new Date(Date.now() + ttl).toISOString(),
                    'Retry-After': Math.ceil(ttl / 1000).toString(),
                });
                throw new common_1.HttpException({
                    statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS,
                    message: options.message,
                    error: 'Too Many Requests',
                }, common_1.HttpStatus.TOO_MANY_REQUESTS);
            }
            await this.cacheService.increment(cacheKey, 1, {
                ttl: Math.ceil(options.windowMs / 1000),
            });
            const remaining = Math.max(0, options.maxRequests - currentCount - 1);
            res.set({
                'X-RateLimit-Limit': options.maxRequests.toString(),
                'X-RateLimit-Remaining': remaining.toString(),
                'X-RateLimit-Reset': new Date(Date.now() + options.windowMs).toISOString(),
            });
            next();
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            console.error('Rate limiting error:', error);
            next();
        }
    }
    getClientIdentifier(req) {
        const forwarded = req.get('X-Forwarded-For');
        const realIP = req.get('X-Real-IP');
        const ip = forwarded?.split(',')[0] || realIP || req.ip || req.connection.remoteAddress;
        const userId = req.user?.id;
        if (userId) {
            return `user:${userId}:${ip}`;
        }
        const userAgent = req.get('User-Agent') || '';
        const userAgentHash = this.hashString(userAgent);
        return `ip:${ip}:${userAgentHash}`;
    }
    async getRemainingTTL(_key) {
        try {
            return 15 * 60 * 1000;
        }
        catch (error) {
            return 15 * 60 * 1000;
        }
    }
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }
};
exports.RateLimitMiddleware = RateLimitMiddleware;
exports.RateLimitMiddleware = RateLimitMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService])
], RateLimitMiddleware);
function RateLimit(_options) {
    return function (target, propertyName, descriptor) {
        const method = descriptor.value;
        descriptor.value = async function (...args) {
            return method.apply(this, args);
        };
    };
}
const common_2 = require("@nestjs/common");
let RateLimitGuard = class RateLimitGuard {
    constructor(cacheService, options) {
        this.cacheService = cacheService;
        this.options = options;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const key = this.options.keyGenerator?.(request) || this.getDefaultKey(request);
        const cacheKey = `rate_limit:${key}`;
        const currentCount = await this.cacheService.get(cacheKey) || 0;
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
    getDefaultKey(request) {
        const ip = request.ip || request.connection.remoteAddress;
        const userId = request.user?.id;
        return userId ? `user:${userId}` : `ip:${ip}`;
    }
};
exports.RateLimitGuard = RateLimitGuard;
exports.RateLimitGuard = RateLimitGuard = __decorate([
    (0, common_2.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService, Object])
], RateLimitGuard);
//# sourceMappingURL=rate-limit.middleware.js.map