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
var CacheInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const cache_service_1 = require("./cache.service");
const core_1 = require("@nestjs/core");
let CacheInterceptor = CacheInterceptor_1 = class CacheInterceptor {
    constructor(cacheService, reflector) {
        this.cacheService = cacheService;
        this.reflector = reflector;
        this.logger = new common_1.Logger(CacheInterceptor_1.name);
        this.defaultTtl = 3600;
    }
    async intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        if (request.method !== 'GET') {
            return next.handle();
        }
        const shouldCache = this.shouldCache(context);
        if (!shouldCache) {
            return next.handle();
        }
        const cacheKey = this.generateCacheKey(request);
        try {
            const cachedResponse = await this.cacheService.get(cacheKey);
            if (cachedResponse) {
                this.logger.debug(`Cache hit for ${request.method} ${request.path}`);
                response.setHeader('X-Cache', 'HIT');
                return (0, rxjs_1.of)(cachedResponse);
            }
            this.logger.debug(`Cache miss for ${request.method} ${request.path}`);
            response.setHeader('X-Cache', 'MISS');
        }
        catch (error) {
            this.logger.error('Cache retrieval error', error);
        }
        return next.handle().pipe((0, operators_1.map)(async (data) => {
            try {
                const cacheOptions = this.getCacheOptions(context);
                await this.cacheService.set(cacheKey, data, cacheOptions);
                this.logger.debug(`Response cached for ${request.method} ${request.path}`);
                response.setHeader('X-Cache', 'MISS-STORED');
            }
            catch (error) {
                this.logger.error('Cache storage error', error);
            }
            return data;
        }));
    }
    shouldCache(context) {
        const handler = context.getHandler();
        const controller = context.getClass();
        const hasCacheDecorator = this.reflector.getAll('cache:enabled', [handler, controller]);
        const cacheDisabled = this.reflector.getAll('cache:disabled', [handler, controller]);
        return hasCacheDecorator.length > 0 || cacheDisabled.length === 0;
    }
    generateCacheKey(request) {
        const keyData = {
            path: request.path,
            method: request.method,
            query: this.sortObjectKeys(request.query),
            userId: request.user?.id,
            headers: this.getRelevantHeaders(request.headers),
        };
        return this.cacheService.generateKeyFromObject(keyData, 'http');
    }
    getCacheOptions(context) {
        const handler = context.getHandler();
        const controller = context.getClass();
        const ttlArray = this.reflector.getAll('cache:ttl', [handler, controller]);
        const ttl = ttlArray.length > 0 ? ttlArray[0] : this.defaultTtl;
        const tags = this.reflector.getAll('cache:tags', [handler, controller]) || [];
        return {
            ttl,
            tags,
            keyPrefix: 'http',
        };
    }
    getRelevantHeaders(headers) {
        const relevantHeaders = ['accept-language', 'accept', 'authorization'];
        const filtered = {};
        relevantHeaders.forEach(header => {
            if (headers[header]) {
                filtered[header] = headers[header];
            }
        });
        return filtered;
    }
    sortObjectKeys(obj) {
        if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
            return obj;
        }
        const sorted = {};
        Object.keys(obj).sort().forEach(key => {
            sorted[key] = this.sortObjectKeys(obj[key]);
        });
        return sorted;
    }
};
exports.CacheInterceptor = CacheInterceptor;
exports.CacheInterceptor = CacheInterceptor = CacheInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        core_1.Reflector])
], CacheInterceptor);
//# sourceMappingURL=cache.interceptor.js.map