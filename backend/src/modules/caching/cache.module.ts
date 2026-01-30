import { Module, Global, DynamicModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheService } from './cache.service';
import { UpstashCacheService } from './upstash-cache.service';
import { CacheInterceptor } from './cache.interceptor';
import { ConfigService } from '@nestjs/config';

export interface CacheModuleOptions {
  isGlobal?: boolean;
  ttl?: number;
}

@Global()
@Module({})
export class CacheModule {
  static forRoot(options: CacheModuleOptions = {}): DynamicModule {
    const { isGlobal = true, ttl: _ttl = 3600 } = options;

    return {
      module: CacheModule,
      global: isGlobal,
      providers: [
        // Choose cache backend at runtime: prefer Upstash only when properly configured
        {
          provide: CacheService,
          useFactory: (config: ConfigService) => {
            const backend = String(config.get('CACHE_BACKEND') || '').toLowerCase();
            const restUrl = config.get<string>('UPSTASH_REDIS_REST_URL', '');
            const restToken = config.get<string>('UPSTASH_REDIS_REST_TOKEN', '');
            const enableUpstash =
              backend === 'upstash' ||
              String(config.get('ENABLE_UPSTASH') ?? '').toLowerCase() === 'true';
            if (enableUpstash && restUrl && restToken) {
              return new UpstashCacheService(config);
            }
            // Default to local Redis (ioredis) to avoid remote 400 errors
            return new CacheService(config);
          },
          inject: [ConfigService],
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
          useFactory: async (config: ConfigService, _moduleOptions: CacheModuleOptions) => {
            const backend = String(config.get('CACHE_BACKEND') || '').toLowerCase();
            const restUrl = config.get<string>('UPSTASH_REDIS_REST_URL', '');
            const restToken = config.get<string>('UPSTASH_REDIS_REST_TOKEN', '');
            const enableUpstash =
              backend === 'upstash' ||
              String(config.get('ENABLE_UPSTASH') ?? '').toLowerCase() === 'true';
            if (enableUpstash && restUrl && restToken) {
              return new UpstashCacheService(config);
            }
            return new CacheService(config);
          },
          inject: [ConfigService, 'CACHE_MODULE_OPTIONS'],
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
