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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
const crypto_1 = require("crypto");
let CacheService = CacheService_1 = class CacheService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(CacheService_1.name);
        this.isConnected = false;
        this.stats = {
            hits: 0,
            misses: 0,
            totalRequests: 0,
        };
        this.defaultTtl = this.configService.get('CACHE_TTL', 3600);
    }
    async onModuleInit() {
        await this.initializeRedis();
    }
    async onModuleDestroy() {
        if (this.redis) {
            await this.redis.quit();
        }
    }
    async initializeRedis() {
        try {
            const redisUrl = this.configService.get('REDIS_URL', 'redis://localhost:6379');
            const redisPassword = this.configService.get('REDIS_PASSWORD');
            const redisDb = this.configService.get('REDIS_DB', 0);
            this.redis = new ioredis_1.default(redisUrl, {
                password: redisPassword,
                db: redisDb,
                enableReadyCheck: false,
                maxRetriesPerRequest: 3,
                lazyConnect: true,
            });
            this.redis.on('connect', () => {
                this.isConnected = true;
                this.logger.log('Redis connected successfully');
            });
            this.redis.on('error', error => {
                this.isConnected = false;
                this.logger.error('Redis connection error', error);
            });
            this.redis.on('ready', () => {
                this.logger.log('Redis is ready to receive commands');
            });
            await this.redis.connect();
            await this.redis.ping();
            this.logger.log('Redis connection test successful');
        }
        catch (error) {
            this.logger.error('Failed to initialize Redis', error);
            this.isConnected = false;
        }
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
        if (!this.isConnected || !this.redis) {
            return null;
        }
        this.stats.totalRequests++;
        try {
            const cacheKey = this.generateKey(key, options?.prefix);
            const cached = await this.redis.get(cacheKey);
            if (cached) {
                this.stats.hits++;
                const entry = JSON.parse(cached);
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
        if (!this.isConnected || !this.redis) {
            return false;
        }
        try {
            const cacheKey = this.generateKey(key, options?.prefix || options?.keyPrefix);
            const ttl = options?.ttl || this.defaultTtl;
            const entry = {
                data: value,
                timestamp: Date.now(),
                ttl,
                tags: options?.tags,
            };
            await this.redis.setex(cacheKey, ttl, JSON.stringify(entry));
            if (options?.tags) {
                for (const tag of options.tags) {
                    await this.redis.sadd(`tag:${tag}`, cacheKey);
                }
            }
            return true;
        }
        catch (error) {
            this.logger.error(`Cache set error for key ${key}`, error);
            return false;
        }
    }
    async del(key, options) {
        if (!this.isConnected || !this.redis) {
            return false;
        }
        try {
            const cacheKey = this.generateKey(key, options?.prefix);
            const result = await this.redis.del(cacheKey);
            return result > 0;
        }
        catch (error) {
            this.logger.error(`Cache delete error for key ${key}`, error);
            return false;
        }
    }
    async clearByPrefix(prefix) {
        if (!this.isConnected || !this.redis) {
            return 0;
        }
        try {
            const pattern = `${prefix}:*`;
            const keys = await this.redis.keys(pattern);
            if (keys.length > 0) {
                const result = await this.redis.del(...keys);
                this.logger.log(`Cleared ${result} cache entries with prefix ${prefix}`);
                return result;
            }
            return 0;
        }
        catch (error) {
            this.logger.error(`Cache clear error for prefix ${prefix}`, error);
            return 0;
        }
    }
    async invalidateByTags(tags) {
        if (!this.isConnected || !this.redis) {
            return 0;
        }
        try {
            let totalInvalidated = 0;
            for (const tag of tags) {
                const tagKey = `tag:${tag}`;
                const keys = await this.redis.smembers(tagKey);
                if (keys.length > 0) {
                    const result = await this.redis.del(...keys);
                    totalInvalidated += result;
                    await this.redis.del(tagKey);
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
    async increment(key, value = 1, options) {
        if (!this.isConnected || !this.redis) {
            this.logger.warn('Redis not connected, increment operation skipped');
            return 0;
        }
        const prefix = options?.prefix || '';
        const fullKey = prefix ? `${prefix}:${key}` : key;
        try {
            const result = await this.redis.incrby(fullKey, value);
            if (options?.ttl) {
                await this.redis.expire(fullKey, options.ttl);
            }
            return result;
        }
        catch (error) {
            this.logger.error(`Cache increment error for key ${fullKey}`, error);
            return 0;
        }
    }
    async deletePattern(pattern, prefix) {
        if (!this.isConnected || !this.redis) {
            this.logger.warn('Redis not connected, deletePattern operation skipped');
            return;
        }
        const fullPattern = prefix ? `${prefix}:${pattern}` : pattern;
        try {
            const keys = await this.redis.keys(fullPattern);
            if (keys.length > 0) {
                await this.redis.del(...keys);
                this.logger.log(`Deleted ${keys.length} cache entries matching pattern ${fullPattern}`);
            }
        }
        catch (error) {
            this.logger.error(`Cache deletePattern error for pattern ${fullPattern}`, error);
        }
    }
    async getOrSet(key, factory, options) {
        const cached = await this.get(key, { prefix: options?.prefix || options?.keyPrefix });
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
        if (!this.isConnected || !this.redis) {
            return new Array(keys.length).fill(null);
        }
        try {
            const cacheKeys = keys.map(key => this.generateKey(key, options?.prefix));
            const cachedValues = await this.redis.mget(...cacheKeys);
            this.stats.totalRequests += keys.length;
            return cachedValues.map((cached, _index) => {
                if (cached) {
                    this.stats.hits++;
                    const entry = JSON.parse(cached);
                    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl * 1000) {
                        return null;
                    }
                    return entry.data;
                }
                this.stats.misses++;
                return null;
            });
        }
        catch (error) {
            this.logger.error('Cache mget error', error);
            return new Array(keys.length).fill(null);
        }
    }
    async mset(keyValuePairs, options) {
        if (!this.isConnected || !this.redis) {
            return false;
        }
        try {
            const ttl = options?.ttl || this.defaultTtl;
            const pipeline = this.redis.pipeline();
            for (const { key, value } of keyValuePairs) {
                const cacheKey = this.generateKey(key, options?.prefix || options?.keyPrefix);
                const entry = {
                    data: value,
                    timestamp: Date.now(),
                    ttl,
                    tags: options?.tags,
                };
                pipeline.setex(cacheKey, ttl, JSON.stringify(entry));
                if (options?.tags) {
                    for (const tag of options.tags) {
                        pipeline.sadd(`tag:${tag}`, cacheKey);
                    }
                }
            }
            await pipeline.exec();
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
        return this.isConnected && this.redis?.status === 'ready';
    }
    async getRedisInfo() {
        if (!this.isConnected || !this.redis) {
            return null;
        }
        try {
            const info = await this.redis.info();
            return this.parseRedisInfo(info);
        }
        catch (error) {
            this.logger.error('Failed to get Redis info', error);
            return null;
        }
    }
    async ping() {
        if (!this.isConnected || !this.redis) {
            return false;
        }
        try {
            const result = await this.redis.ping();
            return result === 'PONG';
        }
        catch {
            return false;
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
    parseRedisInfo(info) {
        const lines = info.split('\r\n');
        const parsed = {};
        lines.forEach(line => {
            if (line && !line.startsWith('#')) {
                const [key, value] = line.split(':');
                if (key && value) {
                    parsed[key] = value;
                }
            }
        });
        return parsed;
    }
    async warmUp(cacheEntries) {
        if (!this.isConnected || !this.redis) {
            return 0;
        }
        try {
            let warmed = 0;
            for (const entry of cacheEntries) {
                const success = await this.set(entry.key, entry.value, entry.options);
                if (success) {
                    warmed++;
                }
            }
            this.logger.log(`Cache warmup completed: ${warmed}/${cacheEntries.length} entries`);
            return warmed;
        }
        catch (error) {
            this.logger.error('Cache warmup error', error);
            return 0;
        }
    }
    async getAnalytics() {
        if (!this.isConnected || !this.redis) {
            return null;
        }
        try {
            const info = await this.getRedisInfo();
            const stats = this.getStats();
            return {
                redis: {
                    version: info.redis_version,
                    uptime: info.uptime_in_seconds,
                    connectedClients: info.connected_clients,
                    usedMemory: info.used_memory_human,
                    totalKeys: await this.redis.dbsize(),
                },
                cache: {
                    ...stats,
                    isHealthy: this.isHealthy(),
                },
            };
        }
        catch (error) {
            this.logger.error('Failed to get cache analytics', error);
            return null;
        }
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = CacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CacheService);
//# sourceMappingURL=cache.service.js.map