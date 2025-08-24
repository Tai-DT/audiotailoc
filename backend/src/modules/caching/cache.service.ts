import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { createHash } from 'crypto';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  keyPrefix?: string;
  tags?: string[]; // Cache tags for bulk invalidation
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
}

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private redis!: Redis;
  private defaultTtl: number;
  private isConnected = false;
  private stats = {
    hits: 0,
    misses: 0,
    totalRequests: 0,
  };

  constructor(private configService: ConfigService) {
    this.defaultTtl = this.configService.get('CACHE_TTL', 3600); // 1 hour default
  }

  async onModuleInit() {
    await this.initializeRedis();
  }

  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit();
    }
  }

  private async initializeRedis() {
    try {
      const redisUrl = this.configService.get('REDIS_URL', 'redis://localhost:6379');
      const redisPassword = this.configService.get('REDIS_PASSWORD');
      const redisDb = this.configService.get('REDIS_DB', 0);

      this.redis = new Redis(redisUrl, {
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

      this.redis.on('error', (error) => {
        this.isConnected = false;
        this.logger.error('Redis connection error', error);
      });

      this.redis.on('ready', () => {
        this.logger.log('Redis is ready to receive commands');
      });

      await this.redis.connect();

      // Test connection
      await this.redis.ping();
      this.logger.log('Redis connection test successful');

    } catch (error) {
      this.logger.error('Failed to initialize Redis', error);
      // Continue without cache if Redis is not available
      this.isConnected = false;
    }
  }

  // Generate cache key
  generateKey(key: string, prefix?: string): string {
    const keyPrefix = prefix || 'audiotailoc';
    const hashedKey = createHash('sha256').update(key).digest('hex').substring(0, 16);
    return `${keyPrefix}:${hashedKey}`;
  }

  // Generate key from object
  generateKeyFromObject(obj: any, prefix?: string): string {
    const sortedObj = this.sortObjectKeys(obj);
    const key = JSON.stringify(sortedObj);
    return this.generateKey(key, prefix);
  }

  // Get cache entry
  async get<T = any>(key: string, options?: { prefix?: string }): Promise<T | null> {
    if (!this.isConnected || !this.redis) {
      return null;
    }

    this.stats.totalRequests++;

    try {
      const cacheKey = this.generateKey(key, options?.prefix);
      const cached = await this.redis.get(cacheKey);

      if (cached) {
        this.stats.hits++;
        const entry: CacheEntry<T> = JSON.parse(cached);

        // Check if entry has expired
        if (entry.ttl && Date.now() - entry.timestamp > entry.ttl * 1000) {
          await this.del(key, options);
          this.stats.misses++;
          return null;
        }

        return entry.data;
      }

      this.stats.misses++;
      return null;
    } catch (error) {
      this.logger.error(`Cache get error for key ${key}`, error);
      return null;
    }
  }

  // Set cache entry
  async set<T = any>(
    key: string,
    value: T,
    options?: CacheOptions
  ): Promise<boolean> {
    if (!this.isConnected || !this.redis) {
      return false;
    }

    try {
      const cacheKey = this.generateKey(key, options?.keyPrefix);
      const ttl = options?.ttl || this.defaultTtl;
      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
        ttl,
        tags: options?.tags,
      };

      // Set cache entry
      await this.redis.setex(cacheKey, ttl, JSON.stringify(entry));

      // Store tags for invalidation
      if (options?.tags) {
        for (const tag of options.tags) {
          await this.redis.sadd(`tag:${tag}`, cacheKey);
        }
      }

      return true;
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}`, error);
      return false;
    }
  }

  // Delete cache entry
  async del(key: string, options?: { prefix?: string }): Promise<boolean> {
    if (!this.isConnected || !this.redis) {
      return false;
    }

    try {
      const cacheKey = this.generateKey(key, options?.prefix);
      const result = await this.redis.del(cacheKey);
      return result > 0;
    } catch (error) {
      this.logger.error(`Cache delete error for key ${key}`, error);
      return false;
    }
  }

  // Clear all cache entries with a prefix
  async clearByPrefix(prefix: string): Promise<number> {
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
    } catch (error) {
      this.logger.error(`Cache clear error for prefix ${prefix}`, error);
      return 0;
    }
  }

  // Invalidate cache by tags
  async invalidateByTags(tags: string[]): Promise<number> {
    if (!this.isConnected || !this.redis) {
      return 0;
    }

    try {
      let totalInvalidated = 0;

      for (const tag of tags) {
        const tagKey = `tag:${tag}`;
        const keys = await this.redis.smembers(tagKey);

        if (keys.length > 0) {
          // Delete cache entries
          const result = await this.redis.del(...keys);
          totalInvalidated += result;

          // Remove tag set
          await this.redis.del(tagKey);
        }
      }

      this.logger.log(`Invalidated ${totalInvalidated} cache entries for tags: ${tags.join(', ')}`);
      return totalInvalidated;
    } catch (error) {
      this.logger.error(`Cache invalidation error for tags ${tags.join(', ')}`, error);
      return 0;
    }
  }

  // Get or set (cache-aside pattern)
  async getOrSet<T = any>(
    key: string,
    factory: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key, { prefix: options?.keyPrefix });
    if (cached !== null) {
      return cached;
    }

    // If not in cache, execute factory function
    try {
      const result = await factory();

      // Cache the result
      await this.set(key, result, options);

      return result;
    } catch (error) {
      this.logger.error(`Factory function error for key ${key}`, error);
      throw error;
    }
  }

  // Multi-get operation
  async mget<T = any>(keys: string[], options?: { prefix?: string }): Promise<(T | null)[]> {
    if (!this.isConnected || !this.redis) {
      return new Array(keys.length).fill(null);
    }

    try {
      const cacheKeys = keys.map(key => this.generateKey(key, options?.prefix));
      const cachedValues = await this.redis.mget(...cacheKeys);

      this.stats.totalRequests += keys.length;

      return cachedValues.map((cached, index) => {
        if (cached) {
          this.stats.hits++;
          const entry: CacheEntry<T> = JSON.parse(cached);

          // Check expiration
          if (entry.ttl && Date.now() - entry.timestamp > entry.ttl * 1000) {
            return null;
          }

          return entry.data;
        }

        this.stats.misses++;
        return null;
      });
    } catch (error) {
      this.logger.error('Cache mget error', error);
      return new Array(keys.length).fill(null);
    }
  }

  // Multi-set operation
  async mset(keyValuePairs: { key: string; value: any }[], options?: CacheOptions): Promise<boolean> {
    if (!this.isConnected || !this.redis) {
      return false;
    }

    try {
      const ttl = options?.ttl || this.defaultTtl;
      const pipeline = this.redis.pipeline();

      for (const { key, value } of keyValuePairs) {
        const cacheKey = this.generateKey(key, options?.keyPrefix);
        const entry: CacheEntry = {
          data: value,
          timestamp: Date.now(),
          ttl,
          tags: options?.tags,
        };

        pipeline.setex(cacheKey, ttl, JSON.stringify(entry));

        // Add to tags
        if (options?.tags) {
          for (const tag of options.tags) {
            pipeline.sadd(`tag:${tag}`, cacheKey);
          }
        }
      }

      await pipeline.exec();
      return true;
    } catch (error) {
      this.logger.error('Cache mset error', error);
      return false;
    }
  }

  // Get cache statistics
  getStats(): CacheStats {
    const hitRate = this.stats.totalRequests > 0
      ? (this.stats.hits / this.stats.totalRequests) * 100
      : 0;

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: Math.round(hitRate * 100) / 100,
      totalRequests: this.stats.totalRequests,
      keysCount: 0, // Would need Redis INFO command to get this
      memoryUsage: 'N/A', // Would need Redis INFO command to get this
    };
  }

  // Reset statistics
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      totalRequests: 0,
    };
  }

  // Check if Redis is connected
  isHealthy(): boolean {
    return this.isConnected && this.redis?.status === 'ready';
  }

  // Get Redis info
  async getRedisInfo(): Promise<any> {
    if (!this.isConnected || !this.redis) {
      return null;
    }

    try {
      const info = await this.redis.info();
      return this.parseRedisInfo(info);
    } catch (error) {
      this.logger.error('Failed to get Redis info', error);
      return null;
    }
  }

  // Health check
  async ping(): Promise<boolean> {
    if (!this.isConnected || !this.redis) {
      return false;
    }

    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }

  // Utility methods
  private sortObjectKeys(obj: any): any {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
      return obj;
    }

    const sorted: any = {};
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = this.sortObjectKeys(obj[key]);
    });

    return sorted;
  }

  private parseRedisInfo(info: string): any {
    const lines = info.split('\r\n');
    const parsed: any = {};

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

  // Cache warming (preload frequently accessed data)
  async warmUp(cacheEntries: { key: string; value: any; options?: CacheOptions }[]): Promise<number> {
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
    } catch (error) {
      this.logger.error('Cache warmup error', error);
      return 0;
    }
  }

  // Cache analytics
  async getAnalytics(): Promise<any> {
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
    } catch (error) {
      this.logger.error('Failed to get cache analytics', error);
      return null;
    }
  }
}
