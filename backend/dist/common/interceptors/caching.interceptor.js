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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const cached_decorator_1 = require("../decorators/cached.decorator");
let CachingInterceptor = class CachingInterceptor {
    constructor(reflector, redisClient) {
        this.reflector = reflector;
        this.redisClient = redisClient;
        this.cache = new Map();
        setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }
    intercept(context, next) {
        const cacheKey = this.reflector.get(cached_decorator_1.CACHE_KEY, context.getHandler());
        const cacheTtl = this.reflector.get(cached_decorator_1.CACHE_TTL, context.getHandler());
        if (!cacheKey) {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        const args = Object.values(request.params || {}).concat(Object.values(request.query || {}));
        const fullCacheKey = this.generateCacheKey(cacheKey, args);
        if (this.redisClient) {
            return new rxjs_1.Observable(subscriber => {
                this.redisClient
                    .get(fullCacheKey)
                    .then((cached) => {
                    if (cached) {
                        const parsed = JSON.parse(cached);
                        subscriber.next(parsed);
                        subscriber.complete();
                    }
                    else {
                        next
                            .handle()
                            .pipe((0, rxjs_1.tap)(data => {
                            this.redisClient.setex(fullCacheKey, cacheTtl || 300, JSON.stringify(data));
                        }))
                            .subscribe({
                            next: data => subscriber.next(data),
                            error: err => subscriber.error(err),
                            complete: () => subscriber.complete(),
                        });
                    }
                })
                    .catch(() => {
                    this.handleInMemoryCache(fullCacheKey, cacheTtl || 300, next).subscribe({
                        next: data => subscriber.next(data),
                        error: err => subscriber.error(err),
                        complete: () => subscriber.complete(),
                    });
                });
            });
        }
        return this.handleInMemoryCache(fullCacheKey, cacheTtl || 300, next);
    }
    handleInMemoryCache(cacheKey, ttl, next) {
        const cached = this.cache.get(cacheKey);
        if (cached && this.isValid(cached)) {
            return (0, rxjs_1.of)(cached.value);
        }
        return next.handle().pipe((0, rxjs_1.tap)(data => {
            this.cache.set(cacheKey, {
                value: data,
                timestamp: Date.now(),
                ttl,
            });
        }));
    }
    generateCacheKey(baseKey, args) {
        if (args.length === 0)
            return baseKey;
        const argsString = args
            .filter(arg => arg !== undefined && arg !== null)
            .map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
            .join(':');
        return `${baseKey}:${argsString}`;
    }
    isValid(entry) {
        return Date.now() - entry.timestamp < entry.ttl * 1000;
    }
    cleanup() {
        for (const [key, entry] of this.cache.entries()) {
            if (!this.isValid(entry)) {
                this.cache.delete(key);
            }
        }
    }
    clearCache(pattern) {
        if (pattern) {
            for (const key of this.cache.keys()) {
                if (key.includes(pattern)) {
                    this.cache.delete(key);
                }
            }
        }
        else {
            this.cache.clear();
        }
    }
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
};
exports.CachingInterceptor = CachingInterceptor;
exports.CachingInterceptor = CachingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [core_1.Reflector, Object])
], CachingInterceptor);
//# sourceMappingURL=caching.interceptor.js.map