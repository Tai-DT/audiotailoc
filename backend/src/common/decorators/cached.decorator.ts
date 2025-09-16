import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY = 'cache_key';
export const CACHE_TTL = 'cache_ttl';

export interface CacheOptions {
  key?: string;
  ttl?: number; // seconds
  condition?: (args: any[]) => boolean;
}

export function Cached(options: CacheOptions = {}) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(CACHE_KEY, options.key || propertyKey)(target, propertyKey, descriptor);
    SetMetadata(CACHE_TTL, options.ttl || 300)(target, propertyKey, descriptor);
    SetMetadata('cache_condition', options.condition)(target, propertyKey, descriptor);
  };
}

export function CacheKey(key: string) {
  return SetMetadata(CACHE_KEY, key);
}

export function CacheTTL(ttl: number) {
  return SetMetadata(CACHE_TTL, ttl);
}

