import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export interface CacheOptions {
    ttl?: number;
    keyPrefix?: string;
    prefix?: string;
    tags?: string[];
}
export interface CacheEntry<T = any> {
    data: T;
    timestamp: number;
    ttl?: number;
    tags?: string[];
}
export interface CacheStats {
    hits: number;
    misses: number;
    hitRate: number;
    totalRequests: number;
    keysCount: number;
    memoryUsage: string;
    connected: boolean;
}
export declare class CacheService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private readonly logger;
    private redis;
    private defaultTtl;
    private isConnected;
    private stats;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private initializeRedis;
    generateKey(key: string, prefix?: string): string;
    generateKeyFromObject(obj: any, prefix?: string): string;
    get<T = any>(key: string, options?: {
        prefix?: string;
    }): Promise<T | null>;
    set<T = any>(key: string, value: T, options?: CacheOptions): Promise<boolean>;
    del(key: string, options?: {
        prefix?: string;
    }): Promise<boolean>;
    clearByPrefix(prefix: string): Promise<number>;
    invalidateByTags(tags: string[]): Promise<number>;
    increment(key: string, value?: number, options?: {
        prefix?: string;
        ttl?: number;
    }): Promise<number>;
    deletePattern(pattern: string, prefix?: string): Promise<void>;
    getOrSet<T = any>(key: string, factory: () => Promise<T>, options?: CacheOptions): Promise<T>;
    mget<T = any>(keys: string[], options?: {
        prefix?: string;
    }): Promise<(T | null)[]>;
    mset(keyValuePairs: {
        key: string;
        value: any;
    }[], options?: CacheOptions): Promise<boolean>;
    getStats(): CacheStats;
    resetStats(): void;
    isHealthy(): boolean;
    getRedisInfo(): Promise<any>;
    ping(): Promise<boolean>;
    private sortObjectKeys;
    private parseRedisInfo;
    warmUp(cacheEntries: {
        key: string;
        value: any;
        options?: CacheOptions;
    }[]): Promise<number>;
    getAnalytics(): Promise<any>;
}
