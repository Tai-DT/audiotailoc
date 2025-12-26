import { Module, Global, DynamicModule, ModuleMetadata } from '@nestjs/common';
import {
  CacheModule as NestCacheModule,
  CacheModuleOptions as NestCacheModuleOptions,
} from '@nestjs/cache-manager';
import { EventEmitterModule } from '@nestjs/event-emitter';
import * as redisStore from 'cache-manager-redis-store';
import { Redis } from 'ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CacheManager } from './cache-manager';
import { CacheInvalidation } from './cache-invalidation';

/**
 * Comprehensive Cache Module
 * Integrates:
 * - Redis for distributed caching
 * - In-memory caching for performance
 * - Cache invalidation strategies
 * - Cache warming
 * - Event-driven cache management
 */

export interface CacheModuleOptions extends NestCacheModuleOptions {
  redis?: {
    host: string;
    port: number;
    password?: string;
    db?: number;
  };
  defaultTtl?: number;
  enableCompression?: boolean;
  enableMetrics?: boolean;
  enableWarming?: boolean;
  warmingInterval?: number;
}

@Global()
@Module({})
export class CacheModule {
  /**
   * Register cache module with configuration
   */
  static register(options?: Partial<CacheModuleOptions>): DynamicModule {
    return {
      module: CacheModule,
      imports: [
        ConfigModule,
        EventEmitterModule.forRoot({
          wildcard: true,
          delimiter: '.',
          maxListeners: 20,
        }),
        NestCacheModule.register({
          isGlobal: true,
          ttl: options?.defaultTtl ?? 3600000, // 1 hour
          max: 100000, // Max items in store
        }),
      ],
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useFactory: async (configService: ConfigService) => {
            if (!options?.redis && !configService.get('REDIS_URL')) {
              return null;
            }

            const redisUrl = options?.redis || {
              host: configService.get('REDIS_HOST', 'localhost'),
              port: configService.get('REDIS_PORT', 6379),
              password: configService.get('REDIS_PASSWORD'),
              db: configService.get('REDIS_DB', 0),
            };

            const redis = new Redis({
              host: redisUrl.host,
              port: redisUrl.port,
              password: redisUrl.password,
              db: redisUrl.db,
              retryStrategy: times => {
                const delay = Math.min(times * 50, 2000);
                return delay;
              },
              enableReadyCheck: true,
              enableOfflineQueue: true,
            });

            redis.on('error', err => {
              console.error('Redis connection error:', err);
            });

            redis.on('connect', () => {
              console.log('Redis connected');
            });

            return redis;
          },
          inject: [ConfigService],
        },
        {
          provide: CacheManager,
          useFactory: (cacheManager: any, redisClient: Redis | null) => {
            const manager = new CacheManager(cacheManager, redisClient || undefined);

            manager.initialize({
              ttl: options?.defaultTtl ?? 3600000,
              enableCompression: options?.enableCompression ?? false,
              enableLocalCache: true,
              enableRedisCache: !!redisClient,
            });

            return manager;
          },
          inject: ['CACHE_MANAGER', 'REDIS_CLIENT'],
        },
        {
          provide: CacheInvalidation,
          useFactory: (cacheManager: CacheManager, eventEmitter: any) => {
            const invalidation = new CacheInvalidation(cacheManager, eventEmitter);

            // Setup cache warming if enabled
            if (options?.enableWarming) {
              invalidation.setupCacheWarming({
                enabled: true,
                interval: options?.warmingInterval ?? 300000,
                items: [],
              });
            }

            return invalidation;
          },
          inject: [CacheManager, 'EventEmitter2'],
        },
      ],
      exports: [CacheManager, CacheInvalidation, 'REDIS_CLIENT'],
    };
  }

  /**
   * Register async (for dynamic configuration)
   */
  static registerAsync(options?: Partial<CacheModuleOptions>): DynamicModule {
    return {
      module: CacheModule,
      imports: [
        ConfigModule,
        EventEmitterModule.forRoot({
          wildcard: true,
          delimiter: '.',
          maxListeners: 20,
        }),
        NestCacheModule.registerAsync({
          isGlobal: true,
          useFactory: () => ({
            ttl: options?.defaultTtl ?? 3600000,
            max: 100000,
          }),
        }),
      ],
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useFactory: async (configService: ConfigService) => {
            const redisUrl = options?.redis || {
              host: configService.get('REDIS_HOST', 'localhost'),
              port: configService.get('REDIS_PORT', 6379),
              password: configService.get('REDIS_PASSWORD'),
              db: configService.get('REDIS_DB', 0),
            };

            try {
              const redis = new Redis({
                host: redisUrl.host,
                port: redisUrl.port,
                password: redisUrl.password,
                db: redisUrl.db,
                retryStrategy: times => {
                  const delay = Math.min(times * 50, 2000);
                  return delay;
                },
                enableReadyCheck: true,
                enableOfflineQueue: true,
              });

              redis.on('error', err => {
                console.error('Redis connection error:', err);
              });

              redis.on('connect', () => {
                console.log('Redis connected');
              });

              return redis;
            } catch (error) {
              console.error('Failed to create Redis client:', error);
              return null;
            }
          },
          inject: [ConfigService],
        },
        {
          provide: CacheManager,
          useFactory: (cacheManager: any, redisClient: Redis | null) => {
            const manager = new CacheManager(cacheManager, redisClient || undefined);

            manager.initialize({
              ttl: options?.defaultTtl ?? 3600000,
              enableCompression: options?.enableCompression ?? false,
              enableLocalCache: true,
              enableRedisCache: !!redisClient,
            });

            return manager;
          },
          inject: ['CACHE_MANAGER', 'REDIS_CLIENT'],
        },
        {
          provide: CacheInvalidation,
          useFactory: (cacheManager: CacheManager, eventEmitter: any) => {
            const invalidation = new CacheInvalidation(cacheManager, eventEmitter);

            if (options?.enableWarming) {
              invalidation.setupCacheWarming({
                enabled: true,
                interval: options?.warmingInterval ?? 300000,
                items: [],
              });
            }

            return invalidation;
          },
          inject: [CacheManager, 'EventEmitter2'],
        },
      ],
      exports: [CacheManager, CacheInvalidation, 'REDIS_CLIENT'],
    };
  }
}

/**
 * Standalone cache configuration helper
 */
export class CacheConfig {
  static getRedisOptions(configService: ConfigService): any {
    return {
      store: redisStore,
      host: configService.get('REDIS_HOST', 'localhost'),
      port: configService.get('REDIS_PORT', 6379),
      password: configService.get('REDIS_PASSWORD'),
      db: configService.get('REDIS_DB', 0),
      ttl: configService.get('CACHE_TTL', 3600),
    };
  }

  static getMemoryOptions(ttl: number = 3600000): any {
    return {
      ttl,
      max: 100000,
    };
  }
}

/**
 * Cache factory for creating isolated cache instances
 */
export class CacheFactory {
  static createCacheManager(cacheManager: any, redis?: Redis): CacheManager {
    const manager = new CacheManager(cacheManager, redis);

    manager.initialize({
      enableLocalCache: true,
      enableRedisCache: !!redis,
    });

    return manager;
  }
}

/**
 * Preset cache configurations
 */
export const CACHE_PRESETS = {
  AGGRESSIVE: {
    ttl: 300000, // 5 minutes
    enableCompression: true,
    enableLocalCache: true,
    enableRedisCache: true,
  },
  MODERATE: {
    ttl: 3600000, // 1 hour
    enableCompression: false,
    enableLocalCache: true,
    enableRedisCache: true,
  },
  LIGHT: {
    ttl: 1800000, // 30 minutes
    enableCompression: false,
    enableLocalCache: true,
    enableRedisCache: false,
  },
  MEMORY_ONLY: {
    ttl: 3600000, // 1 hour
    enableCompression: false,
    enableLocalCache: true,
    enableRedisCache: false,
  },
  DISTRIBUTED: {
    ttl: 7200000, // 2 hours
    enableCompression: true,
    enableLocalCache: false,
    enableRedisCache: true,
  },
};

/**
 * Cache key builders for common patterns
 */
export const CacheKeyBuilder = {
  product: (id: string) => `product:${id}`,
  productList: (filters?: string) => `product:list${filters ? `:${filters}` : ''}`,
  category: (id: string) => `category:${id}`,
  categoryList: () => `category:list`,
  service: (id: string) => `service:${id}`,
  serviceList: (filters?: string) => `service:list${filters ? `:${filters}` : ''}`,
  order: (id: string) => `order:${id}`,
  user: (id: string) => `user:${id}`,
  userProfile: (id: string) => `user:profile:${id}`,
  cart: (userId: string) => `cart:${userId}`,
  cart_items: (userId: string) => `cart:items:${userId}`,
  search: (query: string, page: number) => `search:${query}:${page}`,
  analytics: (metric: string, period: string) => `analytics:${metric}:${period}`,
  config: (key: string) => `config:${key}`,
  session: (sessionId: string) => `session:${sessionId}`,
};
