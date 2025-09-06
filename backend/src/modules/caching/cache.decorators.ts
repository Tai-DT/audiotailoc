import { CacheOptions } from './cache.service';

// Cache decorators for easy method caching

/**
 * Cache the result of a method
 * @param ttl - Time to live in seconds (default: 3600)
 * @param keyPrefix - Prefix for cache keys
 * @param tags - Cache tags for invalidation
 */
export function Cache(ttl?: number, keyPrefix?: string, tags?: string[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cacheOptions: CacheOptions = { ttl, keyPrefix, tags };

    descriptor.value = async function (...args: any[]) {
      const cacheService = (this as any).cacheService;
      if (!cacheService) {
        return originalMethod.apply(this, args);
      }

      // Generate cache key from method name and arguments
      const methodName = propertyKey;
      const keyData = {
        method: methodName,
        args: args,
        class: target.constructor.name,
      };

      const cacheKey = cacheService.generateKeyFromObject(keyData, keyPrefix);

      // Try to get from cache first
      const cachedResult = await cacheService.get(cacheKey, { prefix: keyPrefix });
      if (cachedResult !== null) {
        return cachedResult;
      }

      // Execute method and cache result
      const result = await originalMethod.apply(this, args);

      // Cache the result
      await cacheService.set(cacheKey, result, cacheOptions);

      return result;
    };

    return descriptor;
  };
}

/**
 * Cache with custom key generator
 * @param keyGenerator - Function to generate cache key from arguments
 * @param options - Cache options
 */
export function CacheWithKey(
  keyGenerator: (...args: any[]) => string,
  options?: CacheOptions
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService = (this as any).cacheService;
      if (!cacheService) {
        return originalMethod.apply(this, args);
      }

      // Generate custom cache key
      const cacheKey = keyGenerator(...args);

      // Try to get from cache first
      const cachedResult = await cacheService.get(cacheKey, { prefix: options?.keyPrefix });
      if (cachedResult !== null) {
        return cachedResult;
      }

      // Execute method and cache result
      const result = await originalMethod.apply(this, args);

      // Cache the result
      await cacheService.set(cacheKey, result, options);

      return result;
    };

    return descriptor;
  };
}

/**
 * Cache with TTL based on result
 * @param ttlExtractor - Function to extract TTL from result
 * @param options - Cache options
 */
export function CacheWithDynamicTTL(
  ttlExtractor: (result: any) => number,
  options?: Omit<CacheOptions, 'ttl'>
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService = (this as any).cacheService;
      if (!cacheService) {
        return originalMethod.apply(this, args);
      }

      // Generate cache key
      const methodName = propertyKey;
      const keyData = {
        method: methodName,
        args: args,
        class: target.constructor.name,
      };

      const cacheKey = cacheService.generateKeyFromObject(keyData, options?.keyPrefix);

      // Try to get from cache first
      const cachedResult = await cacheService.get(cacheKey, { prefix: options?.keyPrefix });
      if (cachedResult !== null) {
        return cachedResult;
      }

      // Execute method
      const result = await originalMethod.apply(this, args);

      // Extract TTL from result and cache
      const dynamicTtl = ttlExtractor(result);
      const cacheOptions: CacheOptions = {
        ...options,
        ttl: dynamicTtl,
      };

      await cacheService.set(cacheKey, result, cacheOptions);

      return result;
    };

    return descriptor;
  };
}

/**
 * Invalidate cache after method execution
 * @param keyGenerator - Function to generate cache key to invalidate
 * @param prefix - Cache key prefix
 */
export function InvalidateCache(
  keyGenerator: (...args: any[]) => string,
  prefix?: string
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService = (this as any).cacheService;

      // Execute method first
      const result = await originalMethod.apply(this, args);

      // Invalidate cache after successful execution
      if (cacheService) {
        try {
          const cacheKey = keyGenerator(...args);
          await cacheService.del(cacheKey, { prefix });
        } catch (error) {
          // Log but don't fail the operation
          console.error('Cache invalidation error:', error);
        }
      }

      return result;
    };

    return descriptor;
  };
}

/**
 * Invalidate cache by tags after method execution
 * @param tagGenerator - Function to generate tags to invalidate
 */
export function InvalidateCacheByTags(tagGenerator: (...args: any[]) => string[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService = (this as any).cacheService;

      // Execute method first
      const result = await originalMethod.apply(this, args);

      // Invalidate cache by tags after successful execution
      if (cacheService) {
        try {
          const tags = tagGenerator(...args);
          await cacheService.invalidateByTags(tags);
        } catch (error) {
          // Log but don't fail the operation
          console.error('Cache invalidation by tags error:', error);
        }
      }

      return result;
    };

    return descriptor;
  };
}

/**
 * Cache with conditional logic
 * @param condition - Function that determines if result should be cached
 * @param options - Cache options
 */
export function ConditionalCache(
  condition: (result: any) => boolean,
  options?: CacheOptions
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService = (this as any).cacheService;
      if (!cacheService) {
        return originalMethod.apply(this, args);
      }

      // Generate cache key
      const methodName = propertyKey;
      const keyData = {
        method: methodName,
        args: args,
        class: target.constructor.name,
      };

      const cacheKey = cacheService.generateKeyFromObject(keyData, options?.keyPrefix);

      // Try to get from cache first
      const cachedResult = await cacheService.get(cacheKey, { prefix: options?.keyPrefix });
      if (cachedResult !== null) {
        return cachedResult;
      }

      // Execute method
      const result = await originalMethod.apply(this, args);

      // Cache only if condition is met
      if (condition(result)) {
        await cacheService.set(cacheKey, result, options);
      }

      return result;
    };

    return descriptor;
  };
}

/**
 * Cache with fallback
 * @param fallback - Fallback value or function if cache miss and method fails
 * @param options - Cache options
 */
export function CacheWithFallback(
  fallback: any | ((...args: any[]) => any),
  options?: CacheOptions
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService = (this as any).cacheService;
      if (!cacheService) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          return typeof fallback === 'function' ? fallback(...args) : fallback;
        }
      }

      // Generate cache key
      const methodName = propertyKey;
      const keyData = {
        method: methodName,
        args: args,
        class: target.constructor.name,
      };

      const cacheKey = cacheService.generateKeyFromObject(keyData, options?.keyPrefix);

      // Try to get from cache first
      const cachedResult = await cacheService.get(cacheKey, { prefix: options?.keyPrefix });
      if (cachedResult !== null) {
        return cachedResult;
      }

      try {
        // Execute method
        const result = await originalMethod.apply(this, args);

        // Cache the result
        await cacheService.set(cacheKey, result, options);

        return result;
      } catch (error) {
        // Use fallback
        const fallbackResult = typeof fallback === 'function' ? fallback(...args) : fallback;

        // Cache the fallback result for a shorter time
        const fallbackOptions: CacheOptions = {
          ...options,
          ttl: Math.min(options?.ttl || 300, 300), // Max 5 minutes for fallbacks
        };

        await cacheService.set(cacheKey, fallbackResult, fallbackOptions);

        return fallbackResult;
      }
    };

    return descriptor;
  };
}

// Utility functions for common cache key patterns

export function createProductCacheKey(productId: string): string {
  return `product:${productId}`;
}

export function createUserCacheKey(userId: string): string {
  return `user:${userId}`;
}

export function createCategoryCacheKey(categoryId: string): string {
  return `category:${categoryId}`;
}

export function createSearchCacheKey(query: string, filters?: any): string {
  const keyData = { query, filters };
  return `search:${JSON.stringify(keyData)}`;
}

export function createOrderCacheKey(orderId: string): string {
  return `order:${orderId}`;
}

export function createServiceCacheKey(serviceId: string): string {
  return `service:${serviceId}`;
}

// Common tag patterns for cache invalidation

export function productTags(productId?: string): string[] {
  const tags = ['products'];
  if (productId) {
    tags.push(`product:${productId}`);
  }
  return tags;
}

export function userTags(userId?: string): string[] {
  const tags = ['users'];
  if (userId) {
    tags.push(`user:${userId}`);
  }
  return tags;
}

export function categoryTags(categoryId?: string): string[] {
  const tags = ['categories'];
  if (categoryId) {
    tags.push(`category:${categoryId}`);
  }
  return tags;
}

export function orderTags(orderId?: string): string[] {
  const tags = ['orders'];
  if (orderId) {
    tags.push(`order:${orderId}`);
  }
  return tags;
}

export function serviceTags(serviceId?: string): string[] {
  const tags = ['services'];
  if (serviceId) {
    tags.push(`service:${serviceId}`);
  }
  return tags;
}
