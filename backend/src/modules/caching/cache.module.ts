import { Module, Global, DynamicModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheService } from './cache.service';
import { CacheInterceptor } from './cache.interceptor';

export interface CacheModuleOptions {
  isGlobal?: boolean;
  ttl?: number;
}

@Global()
@Module({})
export class CacheModule {
  static forRoot(options: CacheModuleOptions = {}): DynamicModule {
    const { isGlobal = true, ttl = 3600 } = options;

    return {
      module: CacheModule,
      global: isGlobal,
      providers: [
        {
          provide: CacheService,
          useFactory: () => {
            // You can inject ConfigService here if needed
            return new CacheService({
              get: (key: string, defaultValue?: any) => {
                // This would be replaced with actual config service
                if (key === 'CACHE_TTL') return ttl;
                if (key === 'REDIS_URL') return process.env.REDIS_URL || 'redis://localhost:6379';
                if (key === 'REDIS_PASSWORD') return process.env.REDIS_PASSWORD;
                if (key === 'REDIS_DB') return parseInt(process.env.REDIS_DB || '0', 10);
                return defaultValue;
              },
            } as any);
          },
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: CacheInterceptor,
        },
      ],
      exports: [CacheService],
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<CacheModuleOptions> | CacheModuleOptions;
    inject?: any[];
  }): DynamicModule {
    return {
      module: CacheModule,
      global: true,
      providers: [
        {
          provide: 'CACHE_MODULE_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: CacheService,
          useFactory: async (configService: any, options: CacheModuleOptions) => {
            const cacheService = new CacheService(configService);
            const { ttl = 3600 } = options;
            // Set default TTL
            return cacheService;
          },
          inject: ['CACHE_MODULE_OPTIONS'],
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: CacheInterceptor,
        },
      ],
      exports: [CacheService],
    };
  }
}
