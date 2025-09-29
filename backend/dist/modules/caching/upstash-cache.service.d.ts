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
export declare class UpstashCacheService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private readonly logger;
    private restUrl;
    private restToken;
    private defaultTtl;
    private isConnected;
    private stats;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private initializeUpstash;
    private makeRequest;
    generateKey(key: string, prefix?: string): string;
    generateKeyFromObject(obj: any, prefix?: string): string;
    get<T = any>(key: string, options?: {
        prefix?: string;
    }): Promise<T | null>;
    set<T = any>(key: string, value: T, options?: CacheOptions): Promise<boolean>;
    del(key: string, options?: {
        prefix?: string;
    }): Promise<boolean>;
    private sadd;
    private smembers;
    clearByPrefix(prefix: string): Promise<number>;
    invalidateByTags(tags: string[]): Promise<number>;
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
    ping(): Promise<boolean>;
    deletePattern(pattern: string, _prefix?: string): Promise<void>;
    increment(key: string, amount?: number, options?: CacheOptions): Promise<number>;
    private sortObjectKeys;
}
