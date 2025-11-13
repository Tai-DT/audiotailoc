import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';

/**
 * Common Query Patterns and Best Practices
 * Provides optimized query patterns for frequently used database operations
 * Implements:
 * - Pagination helpers
 * - Query optimization patterns
 * - Efficient select strategies
 * - Index-friendly queries
 */

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  skip?: number;
  take?: number;
  orderBy?: Record<string, 'asc' | 'desc'>;
  cursor?: string;
  cursorDirection?: 'after' | 'before';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface QueryOptimizeOptions {
  select?: Record<string, any>;
  include?: Record<string, any>;
  timeout?: number;
  useCache?: boolean;
  cacheTTL?: number;
}

export class QueryPatterns {
  private readonly logger = new Logger(QueryPatterns.name);

  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Optimized pagination with cursor support
   */
  async paginate<T>(
    model: any,
    options: PaginationOptions & QueryOptimizeOptions,
    where?: any
  ): Promise<PaginatedResult<T>> {
    const pageSize = options.pageSize || options.take || 20;
    const page = options.page || 1;
    const skip = options.skip || (page - 1) * pageSize;

    const orderBy = options.orderBy || { createdAt: 'desc' };

    try {
      // Execute count and find in parallel for better performance
      const [total, data] = await Promise.all([
        model.count({ where }),
        model.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
          select: options.select,
          include: options.include,
        }),
      ]);

      const totalPages = Math.ceil(total / pageSize);

      return {
        data,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      this.logger.error(`Pagination failed: ${error}`);
      throw error;
    }
  }

  /**
   * Cursor-based pagination (ideal for large datasets)
   */
  async paginateWithCursor<T>(
    model: any,
    options: PaginationOptions & QueryOptimizeOptions,
    where?: any
  ): Promise<{
    data: T[];
    nextCursor?: string;
    previousCursor?: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const take = options.take || 20;
    const cursor = options.cursor;
    const cursorDirection = options.cursorDirection || 'after';

    try {
      // Fetch one extra item to determine if there are more pages
      const results = await model.findMany({
        where,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : 0,
        take: cursorDirection === 'after' ? take + 1 : -(take + 1),
        orderBy: options.orderBy || { id: 'asc' },
        select: options.select,
        include: options.include,
      });

      const hasNextPage =
        cursorDirection === 'after' ? results.length > take : results.length > take;
      const hasPreviousPage = !!cursor;

      // Remove the extra item used for checking if more pages exist
      const data =
        cursorDirection === 'after'
          ? results.slice(0, take)
          : results.slice(Math.max(0, results.length - take));

      const nextCursor = hasNextPage ? data[data.length - 1]?.id : undefined;
      const previousCursor = hasPreviousPage ? data[0]?.id : undefined;

      return {
        data,
        nextCursor,
        previousCursor,
        hasNextPage,
        hasPreviousPage,
      };
    } catch (error) {
      this.logger.error(`Cursor pagination failed: ${error}`);
      throw error;
    }
  }

  /**
   * Efficient bulk operations
   */
  async bulkCreate<T>(
    model: any,
    items: any[],
    batchSize: number = 100
  ): Promise<T[]> {
    const results: T[] = [];

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);

      try {
        const batchResults = await Promise.all(
          batch.map((item) => model.create({ data: item }))
        );
        results.push(...batchResults);
      } catch (error) {
        this.logger.error(`Bulk create failed at batch ${Math.floor(i / batchSize)}: ${error}`);
        throw error;
      }
    }

    return results;
  }

  /**
   * Efficient bulk update
   */
  async bulkUpdate<T>(
    model: any,
    updates: Array<{ where: any; data: any }>,
    batchSize: number = 50
  ): Promise<T[]> {
    const results: T[] = [];

    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);

      try {
        const batchResults = await Promise.all(
          batch.map((update) => model.update(update))
        );
        results.push(...batchResults);
      } catch (error) {
        this.logger.error(`Bulk update failed at batch ${Math.floor(i / batchSize)}: ${error}`);
        throw error;
      }
    }

    return results;
  }

  /**
   * Efficient bulk delete with soft delete support
   */
  async bulkDelete(
    model: any,
    where: any[],
    softDelete: boolean = false,
    batchSize: number = 100
  ): Promise<number> {
    let deletedCount = 0;

    for (let i = 0; i < where.length; i += batchSize) {
      const batch = where.slice(i, i + batchSize);

      try {
        const result = softDelete
          ? await model.updateMany({
              where: { OR: batch },
              data: { isDeleted: true, deletedAt: new Date() },
            })
          : await model.deleteMany({
              where: { OR: batch },
            });

        deletedCount += result.count;
      } catch (error) {
        this.logger.error(`Bulk delete failed at batch ${Math.floor(i / batchSize)}: ${error}`);
        throw error;
      }
    }

    return deletedCount;
  }

  /**
   * Aggregate queries with group by
   */
  async aggregate<T>(
    model: any,
    groupBy: string[],
    where?: any,
    select?: Record<string, any>
  ): Promise<T[]> {
    try {
      return await model.groupBy({
        by: groupBy,
        where,
        _count: true,
        _sum: select?._sum,
        _avg: select?._avg,
        _max: select?._max,
        _min: select?._min,
      });
    } catch (error) {
      this.logger.error(`Aggregation failed: ${error}`);
      throw error;
    }
  }

  /**
   * Upsert with efficient query
   */
  async upsert<T>(
    model: any,
    where: any,
    update: any,
    create: any
  ): Promise<T> {
    try {
      return await model.upsert({
        where,
        update,
        create,
      });
    } catch (error) {
      this.logger.error(`Upsert failed: ${error}`);
      throw error;
    }
  }

  /**
   * Select only required fields to reduce data transfer
   */
  getOptimizedSelect(fields: string[]): Record<string, boolean> {
    return fields.reduce(
      (acc, field) => {
        acc[field] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );
  }

  /**
   * Build efficient where clause with index optimization
   */
  buildOptimizedWhere(filters: Record<string, any>): Record<string, any> {
    const where: Record<string, any> = {};

    for (const [key, value] of Object.entries(filters)) {
      if (value === null || value === undefined) {
        continue;
      }

      // Use indexed fields for queries when possible
      if (key === 'isActive' || key === 'isDeleted' || key === 'featured') {
        where[key] = value;
      } else if (key === 'status' || key === 'type') {
        where[key] = value;
      } else if (Array.isArray(value)) {
        where[key] = { in: value };
      } else if (typeof value === 'string' && value.includes('%')) {
        where[key] = { contains: value.replace(/%/g, ''), mode: 'insensitive' };
      } else {
        where[key] = value;
      }
    }

    return where;
  }

  /**
   * Check query performance
   */
  async explainQuery(query: string): Promise<Record<string, any>> {
    try {
      const result = await this.prisma.$queryRawUnsafe(`EXPLAIN ANALYZE ${query}`);
      return result;
    } catch (error) {
      this.logger.warn(`Query explanation failed: ${error}`);
      return {};
    }
  }

  /**
   * Get N most recent items efficiently
   */
  async getRecent<T>(
    model: any,
    n: number = 10,
    where?: any,
    select?: Record<string, any>
  ): Promise<T[]> {
    return await model.findMany({
      where,
      take: n,
      orderBy: { createdAt: 'desc' },
      select,
    });
  }

  /**
   * Get N most popular items (by view count or similar)
   */
  async getPopular<T>(
    model: any,
    n: number = 10,
    field: string = 'viewCount',
    where?: any,
    select?: Record<string, any>
  ): Promise<T[]> {
    return await model.findMany({
      where,
      take: n,
      orderBy: { [field]: 'desc' },
      select,
    });
  }

  /**
   * Search with optimized text search
   */
  async search<T>(
    model: any,
    query: string,
    searchFields: string[],
    where?: any,
    limit: number = 20,
    select?: Record<string, any>
  ): Promise<T[]> {
    // Build OR conditions for search fields
    const searchConditions = searchFields.map((field) => ({
      [field]: {
        contains: query,
        mode: 'insensitive',
      },
    }));

    const finalWhere = where
      ? {
          AND: [
            where,
            {
              OR: searchConditions,
            },
          ],
        }
      : {
          OR: searchConditions,
        };

    return await model.findMany({
      where: finalWhere,
      take: limit,
      select,
    });
  }

  /**
   * Get distinct values
   */
  async distinct<T>(
    model: any,
    field: string,
    where?: any
  ): Promise<T[]> {
    try {
      return await model.findMany({
        where,
        distinct: [field],
        select: { [field]: true },
      });
    } catch (error) {
      this.logger.error(`Distinct query failed: ${error}`);
      throw error;
    }
  }
}

/**
 * Helper functions for common patterns
 */
export const queryHelpers = {
  /**
   * Build pagination skip and take
   */
  getPaginationParams(page: number = 1, pageSize: number = 20) {
    return {
      skip: (page - 1) * pageSize,
      take: pageSize,
    };
  },

  /**
   * Calculate total pages
   */
  calculateTotalPages(total: number, pageSize: number): number {
    return Math.ceil(total / pageSize);
  },

  /**
   * Build select clause for performance
   */
  buildSelect(...fields: string[]): Record<string, boolean> {
    return fields.reduce(
      (acc, field) => {
        acc[field] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );
  },

  /**
   * Build include with select for nested relations
   */
  buildIncludeWithSelect(
    relation: string,
    ...fields: string[]
  ): Record<string, any> {
    return {
      [relation]: {
        select: QueryPatterns.prototype.getOptimizedSelect(fields),
      },
    };
  },
};
