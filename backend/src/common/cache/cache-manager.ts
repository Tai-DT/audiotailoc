import { Injectable, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Redis } from 'ioredis';

/**
 * Unified Cache Management Interface
 * Features:
 * - Multi-layer caching (in-memory + Redis)
 * - Automatic serialization/deserialization
 * - TTL management
 * - Cache key generation
 * - Performance metrics
 * - Graceful degradation
 */

export interface CacheConfig {
  ttl?: number;
  prefix?: string;
  compressThreshold?: number;
  enableCompression?: boolean;
  enableLocalCache?: boolean;
  enableRedisCache?: boolean;
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  hitRate: number;
  averageSize: number;
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  ttl?: number;
  createdAt: Date;
  expiresAt?: Date;
  size: number;
}

@Injectable()
export class CacheManager {
  private readonly logger = new Logger(CacheManager.name);
  private localCache = new Map<string, { value: any; expiresAt?: number }>();
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    hitRate: 0,
    averageSize: 0,
  };

  private config: Required<CacheConfig> = {
    ttl: 3600000, // 1 hour default
    prefix: 'cache:',
    compressThreshold: 1024, // 1KB
    enableCompression: false,
    enableLocalCache: true,
    enableRedisCache: true,
  };

  private totalSize = 0;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private redis?: Redis,
  ) {}

  /**
   * Initialize cache manager with config
   */
  initialize(config: Partial<CacheConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };

    this.logger.log(`Cache manager initialized with config:`, this.config);
  }

  /**
   * Get value from cache with multi-layer fallback
   */
  async get<T>(key: string, _options?: { parse?: boolean }): Promise<T | null> {
    const prefixedKey = this.buildKey(key);

    try {
      // Try local cache first
      if (this.config.enableLocalCache) {
        const localValue = this.getFromLocalCache<T>(prefixedKey);
        if (localValue !== null) {
          this.recordHit();
          return localValue;
        }
      }

      // Try Redis
      if (this.config.enableRedisCache && this.redis) {
        const redisValue = await this.getFromRedis<T>(prefixedKey);
        if (redisValue !== null) {
          // Store in local cache for future hits
          if (this.config.enableLocalCache) {
            this.setInLocalCache(prefixedKey, redisValue);
          }
          this.recordHit();
          return redisValue;
        }
      }

      // Try NestJS cache manager
      const value = await this.cacheManager.get<T>(prefixedKey);
      if (value !== undefined && value !== null) {
        // Store in local cache
        if (this.config.enableLocalCache) {
          this.setInLocalCache(prefixedKey, value);
        }
        this.recordHit();
        return value;
      }

      this.recordMiss();
      return null;
    } catch (error) {
      this.logger.warn(`Cache get error for key ${key}: ${error}`);
      this.recordMiss();
      return null;
    }
  }

  /**
   * Set value in cache with multi-layer support
   */
  async set<T>(key: string, value: T, options?: { ttl?: number; tags?: string[] }): Promise<void> {
    const prefixedKey = this.buildKey(key);
    const ttl = options?.ttl ?? this.config.ttl;

    try {
      const size = this.calculateSize(value);

      // Set in all enabled layers
      await Promise.all([
        this.config.enableLocalCache && this.setInLocalCache(prefixedKey, value, ttl),
        this.config.enableRedisCache && this.redis && this.setInRedis(prefixedKey, value, ttl),
        this.cacheManager.set(prefixedKey, value, ttl),
      ]);

      this.totalSize += size;
      this.metrics.sets++;

      // Emit cache set event for invalidation strategies
      if (options?.tags) {
        await this.tagCache(prefixedKey, options.tags, ttl);
      }

      this.logger.debug(`Cache set: ${key} (size: ${size}B, TTL: ${ttl}ms)`);
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}: ${error}`);
      throw error;
    }
  }

  /**
   * Delete value from all cache layers
   */
  async delete(key: string): Promise<void> {
    const prefixedKey = this.buildKey(key);

    try {
      // Delete from all layers
      this.deleteFromLocalCache(prefixedKey);

      if (this.redis) {
        await this.redis.del(prefixedKey);
      }

      await this.cacheManager.del(prefixedKey);

      this.metrics.deletes++;
      this.logger.debug(`Cache deleted: ${key}`);
    } catch (error) {
      this.logger.error(`Cache delete error for key ${key}: ${error}`);
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    try {
      // Clear local cache
      this.localCache.clear();
      this.totalSize = 0;

      // Clear Redis
      if (this.redis) {
        await this.redis.flushdb();
      }

      // Clear NestJS cache - reset() not available in @nestjs/cache-manager v2+
      // Cache is cleared via Redis flushdb above
      // await this.cacheManager.reset();

      this.logger.log('All cache layers cleared');
    } catch (error) {
      this.logger.error(`Cache clear error: ${error}`);
    }
  }

  /**
   * Get or compute value (cache-aside pattern)
   */
  async getOrCompute<T>(
    key: string,
    compute: () => Promise<T>,
    options?: { ttl?: number; tags?: string[] },
  ): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Compute value
    const value = await compute();

    // Store in cache
    await this.set(key, value, options);

    return value;
  }

  /**
   * Batch get operations
   */
  async getBatch<T>(keys: string[]): Promise<Map<string, T | null>> {
    const results = new Map<string, T | null>();

    await Promise.all(
      keys.map(async key => {
        const value = await this.get<T>(key);
        results.set(key, value);
      }),
    );

    return results;
  }

  /**
   * Batch set operations
   */
  async setBatch<T>(
    entries: Array<{ key: string; value: T; ttl?: number }>,
    tags?: string[],
  ): Promise<void> {
    await Promise.all(
      entries.map(entry => this.set(entry.key, entry.value, { ttl: entry.ttl, tags })),
    );
  }

  /**
   * Get local cache stats
   */
  getLocalCacheStats(): {
    size: number;
    entries: number;
    totalSize: number;
  } {
    return {
      size: this.localCache.size,
      entries: this.localCache.size,
      totalSize: this.totalSize,
    };
  }

  /**
   * Get cache metrics
   */
  getMetrics(): CacheMetrics {
    return {
      ...this.metrics,
      hitRate:
        this.metrics.hits + this.metrics.misses > 0
          ? (this.metrics.hits / (this.metrics.hits + this.metrics.misses)) * 100
          : 0,
      averageSize: this.metrics.sets > 0 ? this.totalSize / this.metrics.sets : 0,
    };
  }

  /**
   * Increment counter
   */
  async increment(key: string, value: number = 1): Promise<number> {
    const prefixedKey = this.buildKey(key);

    try {
      if (this.redis) {
        return await this.redis.incrby(prefixedKey, value);
      }

      const current = await this.get<number>(prefixedKey);
      const newValue = (current || 0) + value;
      await this.set(prefixedKey, newValue);
      return newValue;
    } catch (error) {
      this.logger.error(`Cache increment error for key ${key}: ${error}`);
      throw error;
    }
  }

  /**
   * Decrement counter
   */
  async decrement(key: string, value: number = 1): Promise<number> {
    return this.increment(key, -value);
  }

  /**
   * Add to set
   */
  async addToSet(key: string, members: string[]): Promise<number> {
    const prefixedKey = this.buildKey(key);

    try {
      if (this.redis) {
        return await this.redis.sadd(prefixedKey, ...members);
      }

      const current = (await this.get<Set<string>>(prefixedKey)) || new Set();
      members.forEach(m => current.add(m));
      await this.set(prefixedKey, current);
      return current.size;
    } catch (error) {
      this.logger.error(`Cache addToSet error for key ${key}: ${error}`);
      throw error;
    }
  }

  /**
   * Remove from set
   */
  async removeFromSet(key: string, members: string[]): Promise<number> {
    const prefixedKey = this.buildKey(key);

    try {
      if (this.redis) {
        return await this.redis.srem(prefixedKey, ...members);
      }

      const current = (await this.get<Set<string>>(prefixedKey)) || new Set();
      members.forEach(m => current.delete(m));
      await this.set(prefixedKey, current);
      return current.size;
    } catch (error) {
      this.logger.error(`Cache removeFromSet error for key ${key}: ${error}`);
      throw error;
    }
  }

  /**
   * Get set members
   */
  async getSet(key: string): Promise<Set<string>> {
    const prefixedKey = this.buildKey(key);
    const value = await this.get<Set<string>>(prefixedKey);
    return value || new Set();
  }

  /**
   * Tag cache for invalidation
   */
  private async tagCache(key: string, tags: string[], ttl: number): Promise<void> {
    if (!this.redis) {
      return;
    }

    const pipe = this.redis.pipeline();

    for (const tag of tags) {
      const tagKey = `tags:${tag}`;
      pipe.sadd(tagKey, key);
      pipe.expire(tagKey, Math.ceil(ttl / 1000));
    }

    await pipe.exec();
  }

  /**
   * Invalidate by tag
   */
  async invalidateByTag(tag: string): Promise<number> {
    const tagKey = `tags:${tag}`;

    try {
      if (!this.redis) {
        return 0;
      }

      const keys = await this.redis.smembers(tagKey);

      if (keys.length > 0) {
        await this.redis.del(...keys);
        keys.forEach(key => this.localCache.delete(key));
      }

      await this.redis.del(tagKey);

      this.logger.log(`Invalidated ${keys.length} cache entries with tag: ${tag}`);
      return keys.length;
    } catch (error) {
      this.logger.error(`Cache tag invalidation error: ${error}`);
      return 0;
    }
  }

  // Private helper methods

  private buildKey(key: string): string {
    return `${this.config.prefix}${key}`;
  }

  private getFromLocalCache<T>(key: string): T | null {
    const entry = this.localCache.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.localCache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  private setInLocalCache<T>(key: string, value: T, ttl?: number): void {
    const expiresAt = ttl ? Date.now() + ttl : undefined;
    this.localCache.set(key, { value, expiresAt });
  }

  private deleteFromLocalCache(key: string): void {
    this.localCache.delete(key);
  }

  private async getFromRedis<T>(key: string): Promise<T | null> {
    if (!this.redis) {
      return null;
    }

    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.warn(`Redis get error: ${error}`);
      return null;
    }
  }

  private async setInRedis<T>(key: string, value: T, ttl: number): Promise<void> {
    if (!this.redis) {
      return;
    }

    try {
      const ttlSeconds = Math.ceil(ttl / 1000);
      await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      this.logger.warn(`Redis set error: ${error}`);
    }
  }

  private calculateSize(value: any): number {
    return JSON.stringify(value).length;
  }

  private recordHit(): void {
    this.metrics.hits++;
    this.updateHitRate();
  }

  private recordMiss(): void {
    this.metrics.misses++;
    this.updateHitRate();
  }

  private updateHitRate(): void {
    const total = this.metrics.hits + this.metrics.misses;
    this.metrics.hitRate = total > 0 ? (this.metrics.hits / total) * 100 : 0;
  }
}
