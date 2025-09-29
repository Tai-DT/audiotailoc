"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CacheModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const cache_service_1 = require("./cache.service");
const upstash_cache_service_1 = require("./upstash-cache.service");
const cache_interceptor_1 = require("./cache.interceptor");
const config_1 = require("@nestjs/config");
let CacheModule = CacheModule_1 = class CacheModule {
    static forRoot(options = {}) {
        const { isGlobal = true, ttl: _ttl = 3600 } = options;
        return {
            module: CacheModule_1,
            global: isGlobal,
            providers: [
                {
                    provide: cache_service_1.CacheService,
                    useFactory: (config) => {
                        const backend = String(config.get('CACHE_BACKEND') || '').toLowerCase();
                        const restUrl = config.get('UPSTASH_REDIS_REST_URL', '');
                        const restToken = config.get('UPSTASH_REDIS_REST_TOKEN', '');
                        const enableUpstash = backend === 'upstash' || String(config.get('ENABLE_UPSTASH') ?? '').toLowerCase() === 'true';
                        if (enableUpstash && restUrl && restToken) {
                            return new upstash_cache_service_1.UpstashCacheService(config);
                        }
                        return new cache_service_1.CacheService(config);
                    },
                    inject: [config_1.ConfigService],
                },
                {
                    provide: core_1.APP_INTERCEPTOR,
                    useClass: cache_interceptor_1.CacheInterceptor,
                },
            ],
            exports: [cache_service_1.CacheService],
        };
    }
    static forRootAsync(options) {
        return {
            module: CacheModule_1,
            global: true,
            providers: [
                {
                    provide: 'CACHE_MODULE_OPTIONS',
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                },
                {
                    provide: cache_service_1.CacheService,
                    useFactory: async (config, _moduleOptions) => {
                        const backend = String(config.get('CACHE_BACKEND') || '').toLowerCase();
                        const restUrl = config.get('UPSTASH_REDIS_REST_URL', '');
                        const restToken = config.get('UPSTASH_REDIS_REST_TOKEN', '');
                        const enableUpstash = backend === 'upstash' || String(config.get('ENABLE_UPSTASH') ?? '').toLowerCase() === 'true';
                        if (enableUpstash && restUrl && restToken) {
                            return new upstash_cache_service_1.UpstashCacheService(config);
                        }
                        return new cache_service_1.CacheService(config);
                    },
                    inject: [config_1.ConfigService, 'CACHE_MODULE_OPTIONS'],
                },
                {
                    provide: core_1.APP_INTERCEPTOR,
                    useClass: cache_interceptor_1.CacheInterceptor,
                },
            ],
            exports: [cache_service_1.CacheService],
        };
    }
};
exports.CacheModule = CacheModule;
exports.CacheModule = CacheModule = CacheModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], CacheModule);
//# sourceMappingURL=cache.module.js.map