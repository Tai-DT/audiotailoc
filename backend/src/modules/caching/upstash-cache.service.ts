import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  keyPrefix?: string;
  prefix?: string; // Alternative name for keyPrefix
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
  connected: boolean; // Connection status
}

@Injectable()
export class UpstashCacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(UpstashCacheService.name);
  private restUrl: string;
  private restToken: string;
  private defaultTtl: number;
  private isConnected = false;
  private stats = {
    hits: 0,
    misses: 0,
    totalRequests: 0,
  };

  constructor(private configService: ConfigService) {
    this.restUrl = this.configService.get('UPSTASH_REDIS_REST_URL', '');
    this.restToken = this.configService.get('UPSTASH_REDIS_REST_TOKEN', '');
    this.defaultTtl = this.configService.get('CACHE_TTL', 3600); // 1 hour default
  }

  async onModuleInit() {
    await this.initializeUpstash();
  }

  async onModuleDestroy() {
    // No cleanup needed for Upstash REST API
  }

  private async initializeUpstash() {
    if (!this.restUrl || !this.restToken) {
      this.logger.warn('Upstash Redis credentials not configured, cache will be disabled');
      this.isConnected = false;
      return;
    }

    try {
      // Test connection with PING command
      const response = await this.makeRequest('POST', '/ping');
      if (response && response.result === 'PONG') {
        this.isConnected = true;
        this.logger.log('Upstash Redis connected successfully');
      } else {
        throw new Error('PING test failed');
      }
    } catch (error) {
      this.logger.error('Failed to initialize Upstash Redis');
      this.logger.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      this.isConnected = false;
    }
  }

  private async makeRequest(method: string, path: string, body?: any): Promise<any> {
    const url = `${this.restUrl}${path}`;
    const headers = {
      Authorization: `Bearer ${this.restToken}`,
      'Content-Type': 'application/json',
    };

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (body) {
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      // Gracefully degrade to disabled state to avoid noisy logs
      this.logger.error(`Upstash API error: ${response.status} ${response.statusText}`);
      if (response.status >= 400) {
        this.isConnected = false;
      }
      throw new Error(`Upstash API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
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
    if (!this.isConnected) {
      return null;
    }

    this.stats.totalRequests++;

    try {
      const cacheKey = this.generateKey(key, options?.prefix);
      const response = await this.makeRequest('GET', `/get/${encodeURIComponent(cacheKey)}`);

      if (response.result) {
        this.stats.hits++;
        const entry: CacheEntry<T> = JSON.parse(response.result);

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
  async set<T = any>(key: string, value: T, options?: CacheOptions): Promise<boolean> {
    if (!this.isConnected) {
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

      const response = await this.makeRequest('POST', '/setex', {
        key: cacheKey,
        ex: ttl,
        value: JSON.stringify(entry),
      });

      if (response.result === 'OK') {
        // Store tags for invalidation
        if (options?.tags) {
          for (const tag of options.tags) {
            await this.sadd(`tag:${tag}`, cacheKey);
          }
        }
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}`, error);
      return false;
    }
  }

  // Delete cache entry
  async del(key: string, options?: { prefix?: string }): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      const cacheKey = this.generateKey(key, options?.prefix);
      const response = await this.makeRequest('POST', '/del', {
        keys: [cacheKey],
      });
      return response.result > 0;
    } catch (error) {
      this.logger.error(`Cache delete error for key ${key}`, error);
      return false;
    }
  }

  // Set operations for tags
  private async sadd(key: string, member: string): Promise<boolean> {
    try {
      const response = await this.makeRequest('POST', '/sadd', {
        key,
        members: [member],
      });
      return response.result > 0;
    } catch (error) {
      this.logger.error(`Cache sadd error for key ${key}`, error);
      return false;
    }
  }

  private async smembers(key: string): Promise<string[]> {
    try {
      const response = await this.makeRequest('GET', `/smembers/${encodeURIComponent(key)}`);
      return response.result || [];
    } catch (error) {
      this.logger.error(`Cache smembers error for key ${key}`, error);
      return [];
    }
  }

  // Clear all cache entries with a prefix
  async clearByPrefix(prefix: string): Promise<number> {
    if (!this.isConnected) {
      return 0;
    }

    try {
      // Get all keys with pattern (this is a simplified approach)
      // Upstash doesn't support KEYS command directly, so we'll use a different approach
      const _pattern = `${prefix}:*`;
      this.logger.log(`Clearing cache entries with prefix ${prefix}`);
      // For now, return 0 as we need to implement key scanning
      return 0;
    } catch (error) {
      this.logger.error(`Cache clear error for prefix ${prefix}`, error);
      return 0;
    }
  }

  // Invalidate cache by tags
  async invalidateByTags(tags: string[]): Promise<number> {
    if (!this.isConnected) {
      return 0;
    }

    try {
      let totalInvalidated = 0;

      for (const tag of tags) {
        const tagKey = `tag:${tag}`;
        const keys = await this.smembers(tagKey);

        if (keys.length > 0) {
          // Delete cache entries
          const response = await this.makeRequest('POST', '/del', {
            keys,
          });
          totalInvalidated += response.result;

          // Remove tag set
          await this.makeRequest('POST', '/del', {
            keys: [tagKey],
          });
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
    options?: CacheOptions,
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
    if (!this.isConnected) {
      return new Array(keys.length).fill(null);
    }

    this.stats.totalRequests += keys.length;

    try {
      const cacheKeys = keys.map(key => this.generateKey(key, options?.prefix));

      // Upstash doesn't support MGET directly, so we'll make individual requests
      const results = await Promise.all(
        cacheKeys.map(async cacheKey => {
          try {
            const response = await this.makeRequest('GET', `/get/${encodeURIComponent(cacheKey)}`);
            if (response.result) {
              this.stats.hits++;
              const entry: CacheEntry<T> = JSON.parse(response.result);

              // Check expiration
              if (entry.ttl && Date.now() - entry.timestamp > entry.ttl * 1000) {
                return null;
              }

              return entry.data;
            }
            this.stats.misses++;
            return null;
          } catch {
            this.stats.misses++;
            return null;
          }
        }),
      );

      return results;
    } catch (error) {
      this.logger.error('Cache mget error', error);
      return new Array(keys.length).fill(null);
    }
  }

  // Multi-set operation
  async mset(
    keyValuePairs: { key: string; value: any }[],
    options?: CacheOptions,
  ): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      const ttl = options?.ttl || this.defaultTtl;

      for (const { key, value } of keyValuePairs) {
        const cacheKey = this.generateKey(key, options?.keyPrefix);
        const entry: CacheEntry = {
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

        // Add to tags
        if (options?.tags) {
          for (const tag of options.tags) {
            await this.sadd(`tag:${tag}`, cacheKey);
          }
        }
      }

      return true;
    } catch (error) {
      this.logger.error('Cache mset error', error);
      return false;
    }
  }

  // Get cache statistics
  getStats(): CacheStats {
    const hitRate =
      this.stats.totalRequests > 0 ? (this.stats.hits / this.stats.totalRequests) * 100 : 0;

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: Math.round(hitRate * 100) / 100,
      totalRequests: this.stats.totalRequests,
      keysCount: 0, // Would need additional API calls to get this
      memoryUsage: 'N/A', // Not available via REST API
      connected: this.isConnected,
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

  // Check if Upstash is connected
  isHealthy(): boolean {
    return this.isConnected;
  }

  // Health check
  async ping(): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      const response = await this.makeRequest('GET', '/');
      return response.ok || response.result === 'PONG';
    } catch {
      this.isConnected = false;
      return false;
    }
  }

  // Delete pattern (simplified implementation)
  async deletePattern(pattern: string, _prefix: string = 'app'): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      this.logger.log(`Delete pattern not fully implemented for Upstash: ${pattern}`);
      // Note: Upstash doesn't support KEYS command, so this is a no-op
      // In a real implementation, you might need to maintain a separate index
    } catch (error) {
      this.logger.error(`Cache deletePattern error for ${pattern}`, error);
    }
  }

  // Increment counter
  async increment(key: string, amount: number = 1, options?: CacheOptions): Promise<number> {
    if (!this.isConnected) {
      return 0;
    }

    try {
      const cacheKey = this.generateKey(key, options?.keyPrefix);
      const ttl = options?.ttl || this.defaultTtl;

      // Get current value
      let currentValue = 0;
      try {
        const getResponse = await this.makeRequest('GET', `/get/${encodeURIComponent(cacheKey)}`);
        if (getResponse.result) {
          const entry: CacheEntry<number> = JSON.parse(getResponse.result);
          currentValue = entry.data || 0;
        }
      } catch {
        // Key doesn't exist, start from 0
      }

      const newValue = currentValue + amount;
      const entry: CacheEntry<number> = {
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
    } catch (error) {
      this.logger.error(`Cache increment error for key ${key}`, error);
      return 0;
    }
  }

  // Utility methods
  private sortObjectKeys(obj: any): any {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
      return obj;
    }

    const sorted: any = {};
    Object.keys(obj)
      .sort()
      .forEach(key => {
        sorted[key] = this.sortObjectKeys(obj[key]);
      });

    return sorted;
  }
}
