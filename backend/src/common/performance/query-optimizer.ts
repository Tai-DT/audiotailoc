import { Logger } from '@nestjs/common';
import { MetricsService } from '../monitoring/metrics.service';

/**
 * Query optimization utilities
 * Provides tools for optimizing Prisma/database queries
 */

/**
 * Query metrics tracking
 */
interface QueryMetrics {
  query: string;
  duration: number;
  timestamp: Date;
  model: string;
  operation: string;
  isSlow: boolean;
}

/**
 * Query optimizer utility class
 */
export class QueryOptimizer {
  private static readonly logger = new Logger(QueryOptimizer.name);
  private static queryMetrics: QueryMetrics[] = [];
  private static readonly MAX_METRICS = 1000;
  private static readonly SLOW_QUERY_THRESHOLD = 100; // ms

  /**
   * Record query execution
   */
  static recordQuery(
    model: string,
    operation: string,
    duration: number,
    metricsService?: MetricsService,
  ): void {
    const isSlow = duration > this.SLOW_QUERY_THRESHOLD;

    const metric: QueryMetrics = {
      query: `${model}.${operation}`,
      duration,
      timestamp: new Date(),
      model,
      operation,
      isSlow,
    };

    this.queryMetrics.push(metric);

    // Keep only recent metrics
    if (this.queryMetrics.length > this.MAX_METRICS) {
      this.queryMetrics.shift();
    }

    // Record metrics
    if (metricsService) {
      metricsService.recordDatabaseQuery(operation, model, duration, 'success');
    }

    // Log slow queries
    if (isSlow) {
      this.logger.warn(`Slow query detected: ${model}.${operation} took ${duration}ms`);
    }
  }

  /**
   * Get query statistics
   */
  static getQueryStats(): {
    totalQueries: number;
    slowQueries: number;
    averageDuration: number;
    slowQueryPercentage: number;
    queryBreakdown: Record<string, { count: number; avgDuration: number }>;
  } {
    if (this.queryMetrics.length === 0) {
      return {
        totalQueries: 0,
        slowQueries: 0,
        averageDuration: 0,
        slowQueryPercentage: 0,
        queryBreakdown: {},
      };
    }

    const slowQueries = this.queryMetrics.filter(m => m.isSlow).length;
    const avgDuration =
      this.queryMetrics.reduce((sum, m) => sum + m.duration, 0) / this.queryMetrics.length;

    const queryBreakdown: Record<string, { count: number; avgDuration: number }> = {};
    for (const metric of this.queryMetrics) {
      const key = metric.query;
      if (!queryBreakdown[key]) {
        queryBreakdown[key] = { count: 0, avgDuration: 0 };
      }
      queryBreakdown[key].count++;
      queryBreakdown[key].avgDuration += metric.duration;
    }

    // Calculate averages
    for (const key in queryBreakdown) {
      queryBreakdown[key].avgDuration /= queryBreakdown[key].count;
    }

    return {
      totalQueries: this.queryMetrics.length,
      slowQueries,
      averageDuration: avgDuration,
      slowQueryPercentage: (slowQueries / this.queryMetrics.length) * 100,
      queryBreakdown,
    };
  }

  /**
   * Optimize select query - add only needed fields
   */
  static optimizeSelect<_T>(
    baseSelect: Record<string, boolean | object>,
    includeRelations: boolean = false,
  ): Record<string, boolean | object> {
    const optimized: Record<string, boolean | object> = {};

    // Only include essential fields
    for (const [key, value] of Object.entries(baseSelect)) {
      if (typeof value === 'boolean' && value) {
        optimized[key] = true;
      } else if (typeof value === 'object' && includeRelations) {
        optimized[key] = value;
      }
    }

    return optimized;
  }

  /**
   * Create optimized pagination
   */
  static createPaginationQuery(
    page: number = 1,
    pageSize: number = 20,
  ): { skip: number; take: number } {
    const skip = Math.max(0, (page - 1) * pageSize);
    const take = Math.min(pageSize, 100); // Cap at 100

    return { skip, take };
  }

  /**
   * Optimize WHERE clause
   */
  static optimizeWhereClause(where: Record<string, any>): Record<string, any> {
    const optimized: Record<string, any> = {};

    for (const [key, value] of Object.entries(where)) {
      // Skip null or undefined values
      if (value === null || value === undefined) {
        continue;
      }

      // Optimize array queries
      if (Array.isArray(value)) {
        optimized[key] = {
          in: value,
        };
      } else {
        optimized[key] = value;
      }
    }

    return optimized;
  }

  /**
   * Add common fields selection
   */
  static getDefaultSelect<_T extends Record<string, any>>(
    excludeFields: string[] = ['password', 'refreshToken'],
  ): Record<string, boolean> {
    const defaultSelect: Record<string, boolean> = {};

    // This would be customized per model
    // Example for User model
    const commonFields = ['id', 'createdAt', 'updatedAt', 'email', 'name', 'phone', 'avatar'];

    for (const field of commonFields) {
      if (!excludeFields.includes(field)) {
        defaultSelect[field] = true;
      }
    }

    return defaultSelect;
  }

  /**
   * Batch queries to reduce N+1 problems
   */
  static async executeBatchQueries<T>(
    queries: Array<() => Promise<T>>,
    batchSize: number = 10,
  ): Promise<T[]> {
    const results: T[] = [];

    for (let i = 0; i < queries.length; i += batchSize) {
      const batch = queries.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(q => q()));
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Prefetch related data to avoid N+1 queries
   */
  static createPrefetchConfig(relations: string[], depth: number = 1): Record<string, any> {
    const config: Record<string, any> = {};

    for (const relation of relations) {
      if (depth > 0) {
        config[relation] = {
          select: this.getDefaultSelect(),
        };
      } else {
        config[relation] = true;
      }
    }

    return config;
  }

  /**
   * Get top slow queries
   */
  static getTopSlowQueries(limit: number = 10): QueryMetrics[] {
    return this.queryMetrics
      .filter(m => m.isSlow)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Clear query metrics
   */
  static clearMetrics(): void {
    this.queryMetrics = [];
    this.logger.debug('Query metrics cleared');
  }

  /**
   * Index recommendations based on query patterns
   */
  static getIndexRecommendations(): string[] {
    const recommendations: string[] = [];
    const queryStats = this.getQueryStats();

    // Analyze patterns and provide recommendations
    for (const [query, stats] of Object.entries(queryStats.queryBreakdown)) {
      if (stats.avgDuration > 500) {
        recommendations.push(
          `Consider adding index for frequently accessed field in ${query} (avg ${stats.avgDuration.toFixed(0)}ms)`,
        );
      }
    }

    return recommendations;
  }

  /**
   * Connection pool optimization tips
   */
  static getConnectionPoolRecommendations(): string[] {
    const recommendations: string[] = [];
    const memUsage = process.memoryUsage();
    const heapPercentage = (memUsage.heapUsed / memUsage.heapTotal) * 100;

    if (heapPercentage > 80) {
      recommendations.push('High memory usage detected - consider reducing connection pool size');
    }

    if (this.queryMetrics.length > 0) {
      const avgDuration = this.getQueryStats().averageDuration;
      if (avgDuration > 100) {
        recommendations.push('Queries are slow - consider increasing connection pool size');
      }
    }

    return recommendations;
  }

  /**
   * Generate query execution plan analysis
   */
  static analyzeQueryPatterns(): {
    mostUsedQueries: Array<{ query: string; count: number }>;
    slowestQueries: Array<{ query: string; duration: number }>;
    recommendations: string[];
  } {
    const queryStats = this.getQueryStats();
    const queryBreakdown = queryStats.queryBreakdown;

    const mostUsedQueries = Object.entries(queryBreakdown)
      .map(([query, stats]) => ({ query, count: stats.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const slowestQueries = this.getTopSlowQueries(10).map(m => ({
      query: m.query,
      duration: m.duration,
    }));

    const recommendations = [
      ...this.getIndexRecommendations(),
      ...this.getConnectionPoolRecommendations(),
    ];

    return {
      mostUsedQueries,
      slowestQueries,
      recommendations,
    };
  }

  /**
   * Export query metrics
   */
  static exportMetrics(): QueryMetrics[] {
    return [...this.queryMetrics];
  }

  /**
   * Generate performance report
   */
  static generatePerformanceReport(): string {
    const stats = this.getQueryStats();
    const analysis = this.analyzeQueryPatterns();

    const report = `
=== Database Query Performance Report ===

Statistics:
- Total Queries: ${stats.totalQueries}
- Slow Queries: ${stats.slowQueries} (${stats.slowQueryPercentage.toFixed(2)}%)
- Average Duration: ${stats.averageDuration.toFixed(2)}ms
- Slow Query Threshold: ${this.SLOW_QUERY_THRESHOLD}ms

Most Used Queries:
${analysis.mostUsedQueries.map(q => `  - ${q.query}: ${q.count} times`).join('\n')}

Slowest Queries:
${analysis.slowestQueries.map(q => `  - ${q.query}: ${q.duration.toFixed(2)}ms`).join('\n')}

Recommendations:
${analysis.recommendations.map(r => `  - ${r}`).join('\n')}

Generated at: ${new Date().toISOString()}
    `;

    return report;
  }
}

/**
 * Database optimization utilities
 */
export class DatabaseOptimizer {
  private static readonly logger = new Logger(DatabaseOptimizer.name);

  /**
   * Calculate optimal batch size
   */
  static calculateOptimalBatchSize(
    itemSize: number,
    maxMemory: number = 10 * 1024 * 1024, // 10MB default
  ): number {
    const batchSize = Math.floor(maxMemory / itemSize);
    return Math.max(1, Math.min(batchSize, 1000)); // Between 1 and 1000
  }

  /**
   * Check if N+1 query pattern likely
   */
  static detectNPlusOnePattern(queries: QueryMetrics[], threshold: number = 10): boolean {
    const queryMap = new Map<string, number>();

    for (const query of queries) {
      const count = (queryMap.get(query.query) || 0) + 1;
      queryMap.set(query.query, count);
    }

    // If same query executed many times, it's likely N+1
    return Array.from(queryMap.values()).some(count => count > threshold);
  }

  /**
   * Estimate query performance impact
   */
  static estimatePerformanceImpact(queries: QueryMetrics[]): {
    total: number;
    wasted: number;
    improvement: number;
  } {
    const slowQueries = queries.filter(q => q.isSlow);
    const total = queries.reduce((sum, q) => sum + q.duration, 0);
    const wasted = slowQueries.reduce((sum, q) => sum + q.duration, 0);
    const potential = wasted * 0.5; // Assume 50% improvement possible

    return {
      total,
      wasted,
      improvement: potential,
    };
  }

  /**
   * Get database health score
   */
  static getHealthScore(queries: QueryMetrics[]): number {
    if (queries.length === 0) return 100;

    const stats = QueryOptimizer.getQueryStats();
    let score = 100;

    // Deduct for slow queries
    score -= stats.slowQueryPercentage * 0.5;

    // Deduct for high average duration
    if (stats.averageDuration > 100) {
      score -= Math.min(20, (stats.averageDuration / 1000) * 10);
    }

    return Math.max(0, score);
  }
}

/**
 * Index optimization utilities
 */
export class IndexOptimizer {
  /**
   * Suggest indexes based on query patterns
   */
  static suggestIndexes(_queries: QueryMetrics[]): Array<{
    model: string;
    field: string;
    reason: string;
    estimatedImprovement: string;
  }> {
    const suggestions: Array<{
      model: string;
      field: string;
      reason: string;
      estimatedImprovement: string;
    }> = [];

    const stats = QueryOptimizer.getQueryStats();

    for (const [query, queryStats] of Object.entries(stats.queryBreakdown)) {
      if (queryStats.avgDuration > 200) {
        const [model, operation] = query.split('.');
        suggestions.push({
          model,
          field: `${operation}_index`,
          reason: `Query ${query} is slow (${queryStats.avgDuration.toFixed(0)}ms avg)`,
          estimatedImprovement: '20-40%',
        });
      }
    }

    return suggestions;
  }

  /**
   * Check for missing indexes
   */
  static checkMissingIndexes(model: string): string[] {
    const missingIndexes: string[] = [];

    // Common fields that should have indexes
    const commonIndexFields = ['id', 'createdAt', 'updatedAt', 'email', 'slug', 'status'];

    for (const field of commonIndexFields) {
      missingIndexes.push(`${model}.${field}`);
    }

    return missingIndexes;
  }
}
