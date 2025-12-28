import { Injectable, Logger, Optional } from '@nestjs/common';
import { MetricsService } from '../monitoring/metrics.service';

/**
 * Cache strategies enum
 */
export enum CacheStrategy {
  LRU = 'LRU', // Least Recently Used
  LFU = 'LFU', // Least Frequently Used
  FIFO = 'FIFO', // First In First Out
  TTL = 'TTL', // Time To Live
}

/**
 * Cache entry interface
 */
interface CacheEntry<T> {
  value: T;
  timestamp: number;
  expiresAt: number;
  accessCount: number;
  lastAccessTime: number;
  size: number;
}

/**
 * Cache statistics
 */
export interface CacheStatistics {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  entries: number;
  averageEntrySize: number;
  memoryUsage: string;
}

/**
 * Advanced caching strategy service
 * Implements LRU, LFU, FIFO, and TTL strategies for optimal cache management
 * Production-ready with memory management and metrics integration
 */
@Injectable()
export class CacheStrategyService {
  private readonly logger = new Logger(CacheStrategyService.name);

  private cache = new Map<string, CacheEntry<any>>();
  private accessLog = new Map<string, number>(); // For LFU tracking
  private stats = {
    hits: 0,
    misses: 0,
  };

  private readonly maxSize: number; // Max cache size in bytes
  private currentSize: number = 0;
  private readonly strategy: CacheStrategy;
  private readonly defaultTTL: number; // Default TTL in milliseconds

  constructor(@Optional() private readonly metricsService?: MetricsService) {
    this.maxSize = this.parseSize(process.env.CACHE_MAX_SIZE || '100MB');
    this.strategy = (process.env.CACHE_STRATEGY as CacheStrategy) || CacheStrategy.LRU;
    this.defaultTTL = parseInt(process.env.CACHE_DEFAULT_TTL || '3600000', 10);

    this.logger.log(
      `Cache initialized with ${this.strategy} strategy, max size: ${this.formatBytes(this.maxSize)}, TTL: ${this.defaultTTL}ms`,
    );

    // Periodic cleanup
    setInterval(() => this.cleanup(), 60000); // Run every minute
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      this.recordMiss(key);
      return undefined;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.currentSize -= entry.size;
      this.recordMiss(key);
      return undefined;
    }

    // Update access metadata
    entry.accessCount++;
    entry.lastAccessTime = Date.now();
    this.accessLog.set(key, entry.accessCount);

    this.recordHit(key);
    return entry.value;
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const startTime = Date.now();

    // Remove old entry if exists
    if (this.cache.has(key)) {
      const oldEntry = this.cache.get(key)!;
      this.currentSize -= oldEntry.size;
    }

    // Calculate size
    const size = this.calculateSize(value);

    // Check if entry is too large for cache
    if (size > this.maxSize) {
      this.logger.warn(
        `Entry too large for cache: ${this.formatBytes(size)} > ${this.formatBytes(this.maxSize)}`,
      );
      return;
    }

    // Make room if needed
    if (this.currentSize + size > this.maxSize) {
      this.evict(size);
    }

    // Create new entry
    const now = Date.now();
    const entry: CacheEntry<T> = {
      value,
      timestamp: now,
      expiresAt: now + (ttl || this.defaultTTL),
      accessCount: 1,
      lastAccessTime: now,
      size,
    };

    this.cache.set(key, entry);
    this.accessLog.set(key, 1);
    this.currentSize += size;

    const duration = Date.now() - startTime;
    if (this.metricsService) {
      this.metricsService.recordCacheOperation('set', 'strategy', duration);
      this.metricsService.setCacheSize('strategy', this.currentSize);
    }

    this.logger.debug(`Cached ${key}: ${this.formatBytes(size)} (${duration}ms)`);
  }

  /**
   * Delete value from cache
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    this.currentSize -= entry.size;
    this.cache.delete(key);
    this.accessLog.delete(key);

    if (this.metricsService) {
      this.metricsService.recordCacheOperation('delete', 'strategy', 0);
      this.metricsService.setCacheSize('strategy', this.currentSize);
    }

    return true;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    this.accessLog.clear();
    this.currentSize = 0;
    this.logger.log(`Cleared ${size} entries from cache`);
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get cache statistics
   */
  getStatistics(): CacheStatistics {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate,
      size: this.currentSize,
      entries: this.cache.size,
      averageEntrySize: this.cache.size > 0 ? this.currentSize / this.cache.size : 0,
      memoryUsage: this.formatBytes(this.currentSize),
    };
  }

  /**
   * Get all keys in cache
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache entries matching pattern
   */
  getByPattern(pattern: string | RegExp): Map<string, any> {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    const result = new Map<string, any>();

    for (const [key, entry] of this.cache) {
      if (regex.test(key)) {
        result.set(key, entry.value);
      }
    }

    return result;
  }

  /**
   * Delete cache entries matching pattern
   */
  deleteByPattern(pattern: string | RegExp): number {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    let deleted = 0;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        if (this.delete(key)) {
          deleted++;
        }
      }
    }

    this.logger.log(`Deleted ${deleted} cache entries matching pattern: ${pattern}`);
    return deleted;
  }

  /**
   * Warm cache with provided data
   */
  warmCache<T>(entries: Array<{ key: string; value: T; ttl?: number }>): void {
    const startTime = Date.now();

    for (const entry of entries) {
      this.set(entry.key, entry.value, entry.ttl);
    }

    const duration = Date.now() - startTime;
    this.logger.log(`Warmed cache with ${entries.length} entries in ${duration}ms`);
  }

  /**
   * Evict entries based on configured strategy
   */
  private evict(requiredSize: number): void {
    let freedSize = 0;

    switch (this.strategy) {
      case CacheStrategy.LRU:
        freedSize = this.evictLRU(requiredSize);
        break;
      case CacheStrategy.LFU:
        freedSize = this.evictLFU(requiredSize);
        break;
      case CacheStrategy.FIFO:
        freedSize = this.evictFIFO(requiredSize);
        break;
      case CacheStrategy.TTL:
        freedSize = this.evictExpired();
        break;
      default:
        freedSize = this.evictLRU(requiredSize);
    }

    if (freedSize < requiredSize) {
      // If still not enough space, force clear oldest entries
      const remaining = requiredSize - freedSize;
      const sorted = Array.from(this.cache.entries()).sort(
        ([, a], [, b]) => a.timestamp - b.timestamp,
      );

      for (const [key, entry] of sorted) {
        if (remaining <= 0) break;
        this.delete(key);
        freedSize += entry.size;
      }
    }
  }

  /**
   * Evict Least Recently Used entries
   */
  private evictLRU(requiredSize: number): number {
    const sorted = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.lastAccessTime - b.lastAccessTime)
      .slice(0, Math.ceil(this.cache.size * 0.25)); // Evict top 25%

    let freedSize = 0;
    for (const [key] of sorted) {
      const entry = this.cache.get(key)!;
      freedSize += entry.size;
      this.delete(key);
      if (freedSize >= requiredSize) break;
    }

    this.logger.debug(`LRU eviction: freed ${this.formatBytes(freedSize)}`);
    return freedSize;
  }

  /**
   * Evict Least Frequently Used entries
   */
  private evictLFU(requiredSize: number): number {
    const sorted = Array.from(this.cache.entries())
      .sort(([a], [b]) => {
        const aCount = this.accessLog.get(a) || 0;
        const bCount = this.accessLog.get(b) || 0;
        return aCount - bCount;
      })
      .slice(0, Math.ceil(this.cache.size * 0.25)); // Evict top 25%

    let freedSize = 0;
    for (const [key] of sorted) {
      const entry = this.cache.get(key)!;
      freedSize += entry.size;
      this.delete(key);
      if (freedSize >= requiredSize) break;
    }

    this.logger.debug(`LFU eviction: freed ${this.formatBytes(freedSize)}`);
    return freedSize;
  }

  /**
   * Evict First In First Out entries
   */
  private evictFIFO(requiredSize: number): number {
    const sorted = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp)
      .slice(0, Math.ceil(this.cache.size * 0.25)); // Evict top 25%

    let freedSize = 0;
    for (const [key] of sorted) {
      const entry = this.cache.get(key)!;
      freedSize += entry.size;
      this.delete(key);
      if (freedSize >= requiredSize) break;
    }

    this.logger.debug(`FIFO eviction: freed ${this.formatBytes(freedSize)}`);
    return freedSize;
  }

  /**
   * Evict expired entries
   */
  private evictExpired(): number {
    const now = Date.now();
    let freedSize = 0;

    for (const [key, entry] of this.cache) {
      if (now > entry.expiresAt) {
        freedSize += entry.size;
        this.delete(key);
      }
    }

    this.logger.debug(`TTL eviction: freed ${this.formatBytes(freedSize)}`);
    return freedSize;
  }

  /**
   * Cleanup expired entries periodically
   */
  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache) {
      if (now > entry.expiresAt) {
        cleanedCount++;
        this.delete(key);
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug(`Cleaned up ${cleanedCount} expired entries`);
    }
  }

  /**
   * Record cache hit
   */
  private recordHit(key: string): void {
    this.stats.hits++;
    if (this.metricsService) {
      this.metricsService.recordCacheHit('strategy', this.extractKeyPattern(key));
    }
  }

  /**
   * Record cache miss
   */
  private recordMiss(key: string): void {
    this.stats.misses++;
    if (this.metricsService) {
      this.metricsService.recordCacheMiss('strategy', this.extractKeyPattern(key));
    }
  }

  /**
   * Extract key pattern for metrics
   */
  private extractKeyPattern(key: string): string {
    // Extract namespace/category from key
    const parts = key.split(':');
    return parts[0] || 'unknown';
  }

  /**
   * Calculate size of object
   */
  private calculateSize(value: any): number {
    if (typeof value === 'string') {
      return value.length * 2; // UTF-16
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return 8;
    }
    if (value === null || value === undefined) {
      return 0;
    }
    if (Array.isArray(value) || typeof value === 'object') {
      return JSON.stringify(value).length * 2;
    }
    return 0;
  }

  /**
   * Format bytes to readable format
   */
  private formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * Parse size string to bytes
   */
  private parseSize(sizeStr: string): number {
    const units: Record<string, number> = {
      B: 1,
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
    };

    const match = sizeStr.match(/^(\d+)\s*(B|KB|MB|GB)?$/i);
    if (!match) {
      return 100 * 1024 * 1024; // Default 100MB
    }

    const value = parseInt(match[1], 10);
    const unit = (match[2] || 'B').toUpperCase();

    return value * (units[unit] || 1);
  }
}
