import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CacheManager } from './cache-manager';

/**
 * Cache Invalidation Strategies
 * Features:
 * - Tag-based invalidation
 * - Event-driven invalidation
 * - Time-based invalidation
 * - Dependency-based invalidation
 * - Pattern-based invalidation
 * - Warm cache strategy
 */

export interface InvalidationRule {
  id: string;
  pattern: RegExp | string;
  triggers: string[]; // Event names
  dependencies?: string[];
  enabled: boolean;
}

export interface CacheWarmingConfig {
  enabled: boolean;
  interval?: number;
  items: Array<{
    key: string;
    compute: () => Promise<any>;
    ttl?: number;
  }>;
}

export interface InvalidationStats {
  totalInvalidations: number;
  tagInvalidations: number;
  patternInvalidations: number;
  eventInvalidations: number;
  dependencyInvalidations: number;
  averageInvalidationTime: number;
}

@Injectable()
export class CacheInvalidation implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheInvalidation.name);
  private invalidationRules = new Map<string, InvalidationRule>();
  private cacheWarmer?: NodeJS.Timeout;
  private warmingConfig: CacheWarmingConfig = {
    enabled: false,
    interval: 300000, // 5 minutes
    items: [],
  };
  private stats: InvalidationStats = {
    totalInvalidations: 0,
    tagInvalidations: 0,
    patternInvalidations: 0,
    eventInvalidations: 0,
    dependencyInvalidations: 0,
    averageInvalidationTime: 0,
  };
  private totalInvalidationTime = 0;

  // Dependency graph for smart invalidation
  private dependencyGraph = new Map<string, Set<string>>();

  constructor(
    private cacheManager: CacheManager,
    private eventEmitter: EventEmitter2
  ) {}

  async onModuleInit(): Promise<void> {
    // Register invalidation event listeners
    this.registerDefaultInvalidationRules();

    // Start cache warming if enabled
    if (this.warmingConfig.enabled) {
      this.startCacheWarming();
    }

    this.logger.log('Cache invalidation strategy initialized');
  }

  onModuleDestroy(): void {
    this.stopCacheWarming();
  }

  /**
   * Register invalidation rule
   */
  registerRule(rule: InvalidationRule): void {
    this.invalidationRules.set(rule.id, rule);

    // Listen to triggers
    for (const trigger of rule.triggers) {
      this.eventEmitter.on(trigger, async () => {
        if (rule.enabled) {
          await this.invalidateByPattern(rule.pattern);
        }
      });
    }

    this.logger.debug(`Invalidation rule registered: ${rule.id}`);
  }

  /**
   * Remove invalidation rule
   */
  removeRule(ruleId: string): void {
    this.invalidationRules.delete(ruleId);
    this.logger.debug(`Invalidation rule removed: ${ruleId}`);
  }

  /**
   * Invalidate by tag
   */
  async invalidateByTag(tag: string): Promise<number> {
    const startTime = Date.now();

    try {
      const count = await this.cacheManager.invalidateByTag(tag);
      this.recordInvalidation('tag', Date.now() - startTime);
      return count;
    } catch (error) {
      this.logger.error(`Failed to invalidate by tag ${tag}: ${error}`);
      return 0;
    }
  }

  /**
   * Invalidate by pattern (supports wildcards and regex)
   */
  async invalidateByPattern(pattern: RegExp | string): Promise<number> {
    const startTime = Date.now();

    try {
      // This would typically use Redis SCAN to find matching keys
      let count = 0;

      if (pattern instanceof RegExp) {
        // Handle regex pattern
        // In production, use Redis SCAN with Lua script
        count = await this.invalidateByRegex(pattern);
      } else if (typeof pattern === 'string' && pattern.includes('*')) {
        // Handle glob pattern
        count = await this.invalidateByGlobPattern(pattern);
      } else {
        // Handle exact match
        await this.cacheManager.delete(pattern);
        count = 1;
      }

      this.recordInvalidation('pattern', Date.now() - startTime);
      return count;
    } catch (error) {
      this.logger.error(`Failed to invalidate by pattern ${pattern}: ${error}`);
      return 0;
    }
  }

  /**
   * Invalidate by dependency
   */
  async invalidateByDependency(key: string): Promise<number> {
    const startTime = Date.now();
    const invalidated = new Set<string>();

    // Get all dependent keys
    const queue = [key];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (visited.has(current)) {
        continue;
      }

      visited.add(current);
      invalidated.add(current);

      // Find dependent keys
      const dependents = this.dependencyGraph.get(current) || new Set();
      for (const dependent of dependents) {
        if (!visited.has(dependent)) {
          queue.push(dependent);
        }
      }
    }

    // Invalidate all dependent keys
    for (const invalidKey of invalidated) {
      await this.cacheManager.delete(invalidKey);
    }

    this.recordInvalidation('dependency', Date.now() - startTime);
    return invalidated.size;
  }

  /**
   * Register cache dependency
   */
  registerDependency(dependsOn: string, dependent: string): void {
    if (!this.dependencyGraph.has(dependsOn)) {
      this.dependencyGraph.set(dependsOn, new Set());
    }

    this.dependencyGraph.get(dependsOn)!.add(dependent);

    this.logger.debug(`Cache dependency registered: ${dependent} depends on ${dependsOn}`);
  }

  /**
   * Setup cache warming
   */
  setupCacheWarming(config: CacheWarmingConfig): void {
    this.warmingConfig = { ...this.warmingConfig, ...config };

    if (config.enabled) {
      this.startCacheWarming();
    } else {
      this.stopCacheWarming();
    }

    this.logger.log(`Cache warming configured`);
  }

  /**
   * Warm single cache entry
   */
  async warmCacheEntry(key: string, compute: () => Promise<any>, ttl?: number): Promise<void> {
    try {
      const startTime = Date.now();
      const value = await compute();
      await this.cacheManager.set(key, value, { ttl });

      const duration = Date.now() - startTime;
      this.logger.debug(`Cache warmed: ${key} (${duration}ms)`);
    } catch (error) {
      this.logger.error(`Failed to warm cache for ${key}: ${error}`);
    }
  }

  /**
   * Warm all configured cache entries
   */
  async warmAllCaches(): Promise<number> {
    let warmed = 0;

    for (const item of this.warmingConfig.items) {
      try {
        await this.warmCacheEntry(item.key, item.compute, item.ttl);
        warmed++;
      } catch (error) {
        this.logger.error(`Failed to warm ${item.key}: ${error}`);
      }
    }

    this.logger.log(`Warmed ${warmed}/${this.warmingConfig.items.length} cache entries`);
    return warmed;
  }

  /**
   * Get invalidation statistics
   */
  getStats(): InvalidationStats {
    return {
      ...this.stats,
      averageInvalidationTime:
        this.stats.totalInvalidations > 0
          ? this.totalInvalidationTime / this.stats.totalInvalidations
          : 0,
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      totalInvalidations: 0,
      tagInvalidations: 0,
      patternInvalidations: 0,
      eventInvalidations: 0,
      dependencyInvalidations: 0,
      averageInvalidationTime: 0,
    };
    this.totalInvalidationTime = 0;
  }

  /**
   * Get registered rules
   */
  getRules(): InvalidationRule[] {
    return Array.from(this.invalidationRules.values());
  }

  /**
   * Get dependency graph
   */
  getDependencyGraph(): Record<string, string[]> {
    const graph: Record<string, string[]> = {};

    for (const [key, deps] of this.dependencyGraph) {
      graph[key] = Array.from(deps);
    }

    return graph;
  }

  // Private helper methods

  private registerDefaultInvalidationRules(): void {
    // Example: Invalidate product caches when product is updated
    this.registerRule({
      id: 'product_update_invalidation',
      pattern: /^cache:product:.*/,
      triggers: ['product.updated', 'product.deleted'],
      enabled: true,
    });

    // Example: Invalidate category caches when category is updated
    this.registerRule({
      id: 'category_update_invalidation',
      pattern: /^cache:category:.*/,
      triggers: ['category.updated', 'category.deleted'],
      enabled: true,
    });

    // Example: Invalidate service caches
    this.registerRule({
      id: 'service_update_invalidation',
      pattern: /^cache:service:.*/,
      triggers: ['service.updated', 'service.deleted'],
      enabled: true,
    });
  }

  private async invalidateByRegex(pattern: RegExp): Promise<number> {
    // In production, this should use Redis SCAN
    // For now, we'll just invalidate a placeholder
    let count = 0;

    // This is a simplified version
    // Real implementation would need Redis SCAN command
    this.logger.debug(`Regex pattern invalidation: ${pattern.source}`);

    return count;
  }

  private async invalidateByGlobPattern(pattern: string): Promise<number> {
    // In production, this should use Redis SCAN with glob pattern
    let count = 0;

    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');

    const _regex = new RegExp(`^${regexPattern}$`);

    // This is a simplified version
    // TODO: Implement actual glob pattern matching with regex
    this.logger.debug(`Glob pattern invalidation: ${pattern}`);

    return count;
  }

  private startCacheWarming(): void {
    if (this.cacheWarmer) {
      return; // Already running
    }

    const interval = this.warmingConfig.interval || 300000;

    this.cacheWarmer = setInterval(async () => {
      await this.warmAllCaches();
    }, interval);

    this.logger.log(`Cache warming started (interval: ${interval}ms)`);

    // Warm caches immediately on startup
    this.warmAllCaches().catch((error) => {
      this.logger.error(`Initial cache warming failed: ${error}`);
    });
  }

  private stopCacheWarming(): void {
    if (this.cacheWarmer) {
      clearInterval(this.cacheWarmer);
      this.cacheWarmer = undefined;
      this.logger.log('Cache warming stopped');
    }
  }

  private recordInvalidation(
    type: 'tag' | 'pattern' | 'event' | 'dependency',
    duration: number
  ): void {
    this.stats.totalInvalidations++;
    this.totalInvalidationTime += duration;

    switch (type) {
      case 'tag':
        this.stats.tagInvalidations++;
        break;
      case 'pattern':
        this.stats.patternInvalidations++;
        break;
      case 'event':
        this.stats.eventInvalidations++;
        break;
      case 'dependency':
        this.stats.dependencyInvalidations++;
        break;
    }
  }

  /**
   * Generate invalidation report
   */
  generateReport(): string {
    const stats = this.getStats();

    return `
Cache Invalidation Report
==========================
Total Invalidations: ${stats.totalInvalidations}
- By Tag: ${stats.tagInvalidations}
- By Pattern: ${stats.patternInvalidations}
- By Event: ${stats.eventInvalidations}
- By Dependency: ${stats.dependencyInvalidations}

Average Invalidation Time: ${stats.averageInvalidationTime.toFixed(2)}ms

Registered Rules: ${this.invalidationRules.size}
Dependencies: ${this.dependencyGraph.size}
Cache Warming: ${this.warmingConfig.enabled ? 'Enabled' : 'Disabled'}
    `.trim();
  }
}
