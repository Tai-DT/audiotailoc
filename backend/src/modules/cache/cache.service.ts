// This file is deprecated. Use UpstashCacheService from ../caching/cache.services.ts instead
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Redis = require('ioredis');

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

export interface CacheStats {
  connected: boolean;
  keyCount: number;
  memoryUsage: string;
  type?: string;
  error?: string;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private redis: any;
  private readonly defaultTTL = 3600; // 1 hour

  constructor(private readonly config: ConfigService) {
    // Initialize Redis connection
    this.initializeRedis();
  }

  private async initializeRedis() {
    // Skip Redis if REDIS_URL is not configured (empty or not set)
    const redisUrl = this.config.get('REDIS_URL', '');
    if (!redisUrl || redisUrl.trim() === '') {
      this.logger.log('Redis not configured (REDIS_URL is empty), using in-memory cache');
      this.redis = null;
      return;
    }

    try {
      this.redis = new Redis({
        host: this.config.get('REDIS_HOST', 'localhost'),
        port: this.config.get('REDIS_PORT', 6379),
        password: this.config.get('REDIS_PASSWORD'),
        db: this.config.get('REDIS_DB', 0),
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });

      this.redis.on('connect', () => {
        this.logger.log('Redis connected successfully');
      });

      this.redis.on('error', (error: any) => {
        this.logger.error('Redis connection error:', error);
      });

      await this.redis.connect();
    } catch (error) {
      this.logger.warn('Redis not available, using in-memory cache');
      this.redis = null;
    }
  }

  // Set cache with TTL
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const { ttl = this.defaultTTL, prefix = 'app' } = options;
    const fullKey = this.buildKey(key, prefix);

    try {
      if (this.redis) {
        await this.redis.setex(fullKey, ttl, JSON.stringify(value));
      } else {
        // Fallback to in-memory cache
        this.setInMemory(fullKey, value, ttl);
      }
    } catch (error) {
      this.logger.error(`Failed to set cache for key ${fullKey}:`, error);
    }
  }

  // Get cache value
  async get<T>(key: string, optionsOrPrefix: any = 'app'): Promise<T | null> {
    const prefix =
      typeof optionsOrPrefix === 'string' ? optionsOrPrefix : (optionsOrPrefix?.prefix ?? 'app');
    const fullKey = this.buildKey(key, prefix);

    try {
      if (this.redis) {
        const value = await this.redis.get(fullKey);
        return value ? JSON.parse(value) : null;
      } else {
        return this.getFromMemory(fullKey);
      }
    } catch (error) {
      this.logger.error(`Failed to get cache for key ${fullKey}:`, error);
      return null;
    }
  }

  // Delete cache
  async delete(key: string, prefix: string = 'app'): Promise<void> {
    const fullKey = this.buildKey(key, prefix);

    try {
      if (this.redis) {
        await this.redis.del(fullKey);
      } else {
        this.deleteFromMemory(fullKey);
      }
    } catch (error) {
      this.logger.error(`Failed to delete cache for key ${fullKey}:`, error);
    }
  }

  // Delete multiple keys by pattern
  async deletePattern(pattern: string, prefix: string = 'app'): Promise<void> {
    const fullPattern = this.buildKey(pattern, prefix);

    try {
      if (this.redis) {
        const keys = await this.redis.keys(fullPattern);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      } else {
        this.deletePatternFromMemory(fullPattern);
      }
    } catch (error) {
      this.logger.error(`Failed to delete cache pattern ${fullPattern}:`, error);
    }
  }

  // Check if key exists
  async exists(key: string, prefix: string = 'app'): Promise<boolean> {
    const fullKey = this.buildKey(key, prefix);

    try {
      if (this.redis) {
        return (await this.redis.exists(fullKey)) === 1;
      } else {
        return this.existsInMemory(fullKey);
      }
    } catch (error) {
      this.logger.error(`Failed to check cache existence for key ${fullKey}:`, error);
      return false;
    }
  }

  // Increment counter
  async increment(
    key: string,
    valueOrAmount: any = 1,
    optionsOrPrefix: any = 'app',
  ): Promise<number> {
    const amount = typeof valueOrAmount === 'number' ? valueOrAmount : 1;
    const options = typeof optionsOrPrefix === 'object' ? optionsOrPrefix : {};
    const prefix =
      typeof optionsOrPrefix === 'string' ? optionsOrPrefix : (options?.prefix ?? 'app');
    const ttl = options?.ttl;
    const fullKey = this.buildKey(key, prefix);

    try {
      let result: number;
      if (this.redis) {
        result = await this.redis.incrby(fullKey, amount);
        // Set TTL if provided
        if (ttl) {
          await this.redis.expire(fullKey, ttl);
        }
      } else {
        result = this.incrementInMemory(fullKey, amount);
        if (ttl) {
          // For in-memory, we need to update the TTL
          const item = this.memoryCache.get(fullKey);
          if (item) {
            item.expires = Date.now() + ttl * 1000;
          }
        }
      }
      return result;
    } catch (error) {
      this.logger.error(`Failed to increment cache for key ${fullKey}:`, error as any);
      return 0;
    }
  }

  // Set cache with expiration
  async setex<T>(key: string, ttl: number, value: T, prefix: string = 'app'): Promise<void> {
    return this.set(key, value, { ttl, prefix });
  }

  // Get or set cache (cache-aside pattern)
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options: CacheOptions = {},
  ): Promise<T> {
    const cached = await this.get<T>(key, options.prefix);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, options);
    return value;
  }

  // Cache with tags for easier invalidation
  async setWithTags<T>(
    key: string,
    value: T,
    tags: string[],
    options: CacheOptions = {},
  ): Promise<void> {
    await this.set(key, value, options);

    // Store tags for this key
    const tagKey = `tags:${key}`;
    await this.set(tagKey, tags, { ttl: options.ttl || this.defaultTTL });
  }

  // Invalidate cache by tags
  async invalidateByTags(tags: string[]): Promise<void> {
    try {
      if (this.redis) {
        // Get all keys with matching tags
        const pattern = `tags:*`;
        const tagKeys = await this.redis.keys(pattern);

        for (const tagKey of tagKeys) {
          const keyTags = await this.get<string[]>(tagKey.replace('tags:', ''));
          if (keyTags && keyTags.some(tag => tags.includes(tag))) {
            const key = tagKey.replace('tags:', '');
            await this.delete(key);
            await this.delete(tagKey);
          }
        }
      }
    } catch (error) {
      this.logger.error('Failed to invalidate cache by tags:', error);
    }
  }

  // Cache statistics
  async getStats(): Promise<CacheStats> {
    try {
      if (this.redis) {
        const keys = await this.redis.dbsize();
        const memory = await this.redis.info('memory');
        const memoryUsage = memory ? this.parseMemoryUsage(memory) : 'Unknown';

        return {
          connected: true,
          keyCount: keys || 0,
          memoryUsage,
        };
      } else {
        return {
          connected: true,
          keyCount: this.getMemoryStats(),
          memoryUsage: `${this.getMemoryStats()} keys`,
          type: 'memory',
        };
      }
    } catch (error) {
      this.logger.error('Failed to get cache stats:', error as any);
      return {
        connected: false,
        keyCount: 0,
        memoryUsage: 'Unknown',
        error: (error as any).message,
      };
    }
  }

  // Clear all cache
  async clear(): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.flushdb();
      } else {
        this.clearMemory();
      }
      this.logger.log('Cache cleared successfully');
    } catch (error) {
      this.logger.error('Failed to clear cache:', error);
    }
  }

  // Build cache key with prefix
  private buildKey(key: string, prefix: string): string {
    return `${prefix}:${key}`;
  }

  // In-memory cache fallback
  private memoryCache = new Map<string, { value: any; expires: number }>();

  private setInMemory(key: string, value: any, ttl: number): void {
    const expires = Date.now() + ttl * 1000;
    this.memoryCache.set(key, { value, expires });
  }

  private getFromMemory<T>(key: string): T | null {
    const item = this.memoryCache.get(key);
    if (!item) return null;

    if (Date.now() > item.expires) {
      this.memoryCache.delete(key);
      return null;
    }

    return item.value;
  }

  private deleteFromMemory(key: string): void {
    this.memoryCache.delete(key);
  }

  private deletePatternFromMemory(pattern: string): void {
    const regex = new RegExp(pattern.replace('*', '.*'));
    for (const key of this.memoryCache.keys()) {
      if (regex.test(key)) {
        this.memoryCache.delete(key);
      }
    }
  }

  private existsInMemory(key: string): boolean {
    return this.memoryCache.has(key);
  }

  private incrementInMemory(key: string, value: number): number {
    const current = this.getFromMemory<number>(key) || 0;
    const newValue = current + value;
    this.setInMemory(key, newValue, this.defaultTTL);
    return newValue;
  }

  private getMemoryStats(): number {
    return this.memoryCache.size;
  }

  private clearMemory(): void {
    this.memoryCache.clear();
  }

  private parseMemoryUsage(info: string): string {
    const lines = info.split('\n');
    for (const line of lines) {
      if (line.startsWith('used_memory:')) {
        const bytes = parseInt(line.split(':')[1]);
        const mb = (bytes / 1024 / 1024).toFixed(2);
        return `${mb} MB`;
      }
    }
    return 'Unknown';
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      if (this.redis) {
        await this.redis.ping();
        return true;
      } else {
        return true; // In-memory cache is always available
      }
    } catch (error) {
      this.logger.error('Cache health check failed:', error);
      return false;
    }
  }
}
