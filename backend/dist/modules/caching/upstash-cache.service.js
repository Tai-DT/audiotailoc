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
var UpstashCacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpstashCacheService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
let UpstashCacheService = UpstashCacheService_1 = class UpstashCacheService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(UpstashCacheService_1.name);
        this.isConnected = false;
        this.stats = {
            hits: 0,
            misses: 0,
            totalRequests: 0,
        };
        this.restUrl = this.configService.get('UPSTASH_REDIS_REST_URL', '');
        this.restToken = this.configService.get('UPSTASH_REDIS_REST_TOKEN', '');
        this.defaultTtl = this.configService.get('CACHE_TTL', 3600);
    }
    async onModuleInit() {
        await this.initializeUpstash();
    }
    async onModuleDestroy() {
    }
    async initializeUpstash() {
        if (!this.restUrl || !this.restToken) {
            this.logger.warn('Upstash Redis credentials not configured, cache will be disabled');
            this.isConnected = false;
            return;
        }
        try {
            const response = await this.makeRequest('POST', '/ping');
            if (response && response.result === 'PONG') {
                this.isConnected = true;
                this.logger.log('Upstash Redis connected successfully');
            }
            else {
                throw new Error('PING test failed');
            }
        }
        catch (error) {
            this.logger.error('Failed to initialize Upstash Redis');
            this.logger.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            this.isConnected = false;
        }
    }
    async makeRequest(method, path, body) {
        const url = `${this.restUrl}${path}`;
        const headers = {
            Authorization: `Bearer ${this.restToken}`,
            'Content-Type': 'application/json',
        };
        const requestOptions = {
            method,
            headers,
        };
        if (body) {
            requestOptions.body = JSON.stringify(body);
        }
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            this.logger.error(`Upstash API error: ${response.status} ${response.statusText}`);
            if (response.status >= 400) {
                this.isConnected = false;
            }
            throw new Error(`Upstash API error: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }
    generateKey(key, prefix) {
        const keyPrefix = prefix || 'audiotailoc';
        const hashedKey = (0, crypto_1.createHash)('sha256').update(key).digest('hex').substring(0, 16);
        return `${keyPrefix}:${hashedKey}`;
    }
    generateKeyFromObject(obj, prefix) {
        const sortedObj = this.sortObjectKeys(obj);
        const key = JSON.stringify(sortedObj);
        return this.generateKey(key, prefix);
    }
    async get(key, options) {
        if (!this.isConnected) {
            return null;
        }
        this.stats.totalRequests++;
        try {
            const cacheKey = this.generateKey(key, options?.prefix);
            const response = await this.makeRequest('GET', `/get/${encodeURIComponent(cacheKey)}`);
            if (response.result) {
                this.stats.hits++;
                const entry = JSON.parse(response.result);
                if (entry.ttl && Date.now() - entry.timestamp > entry.ttl * 1000) {
                    await this.del(key, options);
                    this.stats.misses++;
                    return null;
                }
                return entry.data;
            }
            this.stats.misses++;
            return null;
        }
        catch (error) {
            this.logger.error(`Cache get error for key ${key}`, error);
            return null;
        }
    }
    async set(key, value, options) {
        if (!this.isConnected) {
            return false;
        }
        try {
            const cacheKey = this.generateKey(key, options?.keyPrefix);
            const ttl = options?.ttl || this.defaultTtl;
            const entry = {
                data: value,
                timestamp: Date.now(),
                ttl,
                tags: options?.tags,
            };
            const response = await this.makeRequest('POST', '/setex', {
                key: cacheKey,
                ex: ttl,
                value: JSON.stringify(entry),
            });
            if (response.result === 'OK') {
                if (options?.tags) {
                    for (const tag of options.tags) {
                        await this.sadd(`tag:${tag}`, cacheKey);
                    }
                }
                return true;
            }
            return false;
        }
        catch (error) {
            this.logger.error(`Cache set error for key ${key}`, error);
            return false;
        }
    }
    async del(key, options) {
        if (!this.isConnected) {
            return false;
        }
        try {
            const cacheKey = this.generateKey(key, options?.prefix);
            const response = await this.makeRequest('POST', '/del', {
                keys: [cacheKey],
            });
            return response.result > 0;
        }
        catch (error) {
            this.logger.error(`Cache delete error for key ${key}`, error);
            return false;
        }
    }
    async sadd(key, member) {
        try {
            const response = await this.makeRequest('POST', '/sadd', {
                key,
                members: [member],
            });
            return response.result > 0;
        }
        catch (error) {
            this.logger.error(`Cache sadd error for key ${key}`, error);
            return false;
        }
    }
    async smembers(key) {
        try {
            const response = await this.makeRequest('GET', `/smembers/${encodeURIComponent(key)}`);
            return response.result || [];
        }
        catch (error) {
            this.logger.error(`Cache smembers error for key ${key}`, error);
            return [];
        }
    }
    async clearByPrefix(prefix) {
        if (!this.isConnected) {
            return 0;
        }
        try {
            const _pattern = `${prefix}:*`;
            this.logger.log(`Clearing cache entries with prefix ${prefix}`);
            return 0;
        }
        catch (error) {
            this.logger.error(`Cache clear error for prefix ${prefix}`, error);
            return 0;
        }
    }
    async invalidateByTags(tags) {
        if (!this.isConnected) {
            return 0;
        }
        try {
            let totalInvalidated = 0;
            for (const tag of tags) {
                const tagKey = `tag:${tag}`;
                const keys = await this.smembers(tagKey);
                if (keys.length > 0) {
                    const response = await this.makeRequest('POST', '/del', {
                        keys,
                    });
                    totalInvalidated += response.result;
                    await this.makeRequest('POST', '/del', {
                        keys: [tagKey],
                    });
                }
            }
            this.logger.log(`Invalidated ${totalInvalidated} cache entries for tags: ${tags.join(', ')}`);
            return totalInvalidated;
        }
        catch (error) {
            this.logger.error(`Cache invalidation error for tags ${tags.join(', ')}`, error);
            return 0;
        }
    }
    async getOrSet(key, factory, options) {
        const cached = await this.get(key, { prefix: options?.keyPrefix });
        if (cached !== null) {
            return cached;
        }
        try {
            const result = await factory();
            await this.set(key, result, options);
            return result;
        }
        catch (error) {
            this.logger.error(`Factory function error for key ${key}`, error);
            throw error;
        }
    }
    async mget(keys, options) {
        if (!this.isConnected) {
            return new Array(keys.length).fill(null);
        }
        this.stats.totalRequests += keys.length;
        try {
            const cacheKeys = keys.map(key => this.generateKey(key, options?.prefix));
            const results = await Promise.all(cacheKeys.map(async (cacheKey) => {
                try {
                    const response = await this.makeRequest('GET', `/get/${encodeURIComponent(cacheKey)}`);
                    if (response.result) {
                        this.stats.hits++;
                        const entry = JSON.parse(response.result);
                        if (entry.ttl && Date.now() - entry.timestamp > entry.ttl * 1000) {
                            return null;
                        }
                        return entry.data;
                    }
                    this.stats.misses++;
                    return null;
                }
                catch {
                    this.stats.misses++;
                    return null;
                }
            }));
            return results;
        }
        catch (error) {
            this.logger.error('Cache mget error', error);
            return new Array(keys.length).fill(null);
        }
    }
    async mset(keyValuePairs, options) {
        if (!this.isConnected) {
            return false;
        }
        try {
            const ttl = options?.ttl || this.defaultTtl;
            for (const { key, value } of keyValuePairs) {
                const cacheKey = this.generateKey(key, options?.keyPrefix);
                const entry = {
                    data: value,
                    timestamp: Date.now(),
                    ttl,
                    tags: options?.tags,
                };
                await this.makeRequest('POST', '/setex', {
                    key: cacheKey,
                    ex: ttl,
                    value: JSON.stringify(entry),
                });
                if (options?.tags) {
                    for (const tag of options.tags) {
                        await this.sadd(`tag:${tag}`, cacheKey);
                    }
                }
            }
            return true;
        }
        catch (error) {
            this.logger.error('Cache mset error', error);
            return false;
        }
    }
    getStats() {
        const hitRate = this.stats.totalRequests > 0 ? (this.stats.hits / this.stats.totalRequests) * 100 : 0;
        return {
            hits: this.stats.hits,
            misses: this.stats.misses,
            hitRate: Math.round(hitRate * 100) / 100,
            totalRequests: this.stats.totalRequests,
            keysCount: 0,
            memoryUsage: 'N/A',
            connected: this.isConnected,
        };
    }
    resetStats() {
        this.stats = {
            hits: 0,
            misses: 0,
            totalRequests: 0,
        };
    }
    isHealthy() {
        return this.isConnected;
    }
    async ping() {
        if (!this.isConnected) {
            return false;
        }
        try {
            const response = await this.makeRequest('GET', '/');
            return response.ok || response.result === 'PONG';
        }
        catch {
            this.isConnected = false;
            return false;
        }
    }
    async deletePattern(pattern, _prefix = 'app') {
        if (!this.isConnected) {
            return;
        }
        try {
            this.logger.log(`Delete pattern not fully implemented for Upstash: ${pattern}`);
        }
        catch (error) {
            this.logger.error(`Cache deletePattern error for ${pattern}`, error);
        }
    }
    async increment(key, amount = 1, options) {
        if (!this.isConnected) {
            return 0;
        }
        try {
            const cacheKey = this.generateKey(key, options?.keyPrefix);
            const ttl = options?.ttl || this.defaultTtl;
            let currentValue = 0;
            try {
                const getResponse = await this.makeRequest('GET', `/get/${encodeURIComponent(cacheKey)}`);
                if (getResponse.result) {
                    const entry = JSON.parse(getResponse.result);
                    currentValue = entry.data || 0;
                }
            }
            catch {
            }
            const newValue = currentValue + amount;
            const entry = {
                data: newValue,
                timestamp: Date.now(),
                ttl,
                tags: options?.tags,
            };
            const setResponse = await this.makeRequest('POST', '/setex', {
                key: cacheKey,
                ex: ttl,
                value: JSON.stringify(entry),
            });
            if (setResponse.result === 'OK') {
                return newValue;
            }
            return currentValue;
        }
        catch (error) {
            this.logger.error(`Cache increment error for key ${key}`, error);
            return 0;
        }
    }
    sortObjectKeys(obj) {
        if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
            return obj;
        }
        const sorted = {};
        Object.keys(obj)
            .sort()
            .forEach(key => {
            sorted[key] = this.sortObjectKeys(obj[key]);
        });
        return sorted;
    }
};
exports.UpstashCacheService = UpstashCacheService;
exports.UpstashCacheService = UpstashCacheService = UpstashCacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UpstashCacheService);
//# sourceMappingURL=upstash-cache.service.js.map