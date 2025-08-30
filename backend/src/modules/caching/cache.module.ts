import { Module, Global, DynamicModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheService } from './cache.service';
import { UpstashCacheService } from './upstash-cache.service';
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
          useClass: UpstashCacheService,
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
            const cacheService = new UpstashCacheService(configService);
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
