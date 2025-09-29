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
exports.CacheInterceptor = exports.Cache = exports.CACHE_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.CACHE_KEY = 'cache';
const Cache = (config = {}) => (0, common_1.SetMetadata)(exports.CACHE_KEY, config);
exports.Cache = Cache;
const common_2 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const cache_service_1 = require("../../modules/caching/cache.service");
let CacheInterceptor = class CacheInterceptor {
    constructor(cacheService, reflector) {
        this.cacheService = cacheService;
        this.reflector = reflector;
    }
    async intercept(context, next) {
        const cacheConfig = this.reflector.get(exports.CACHE_KEY, context.getHandler());
        if (!cacheConfig) {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        const cacheKey = this.generateCacheKey(context, cacheConfig, request);
        const cachedResult = await this.cacheService.get(cacheKey, {
            prefix: cacheConfig.prefix,
        });
        if (cachedResult !== null) {
            return (0, rxjs_1.of)(cachedResult);
        }
        return next.handle().pipe((0, operators_1.tap)(async (result) => {
            await this.cacheService.set(cacheKey, result, {
                ttl: cacheConfig.ttl,
                prefix: cacheConfig.prefix,
            });
        }));
    }
    generateCacheKey(context, config, request) {
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
};
exports.CacheInterceptor = CacheInterceptor;
exports.CacheInterceptor = CacheInterceptor = __decorate([
    (0, common_2.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        core_1.Reflector])
], CacheInterceptor);
//# sourceMappingURL=cache.decorator.js.map