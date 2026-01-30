import { Prisma } from '@prisma/client';

export class QueryOptimizer {
  /**
   * Optimize pagination queries by using cursor-based pagination for large datasets
   */
  static optimizePagination<_T>(
    params: {
      page?: number;
      pageSize?: number;
      cursor?: string;
      orderBy?: any;
    },
    maxPageSize: number = 100,
  ): {
    skip?: number;
    take: number;
    cursor?: any;
    orderBy?: any;
  } {
    const pageSize = Math.min(params.pageSize || 20, maxPageSize);

    if (params.cursor) {
      // Use cursor-based pagination for better performance on large datasets
      return {
        take: pageSize,
        cursor: { id: params.cursor },
        skip: 1, // Skip the cursor
        orderBy: params.orderBy || { id: 'asc' },
      };
    } else {
      // Use offset-based pagination for smaller datasets
      const page = Math.max(1, params.page || 1);
      return {
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: params.orderBy || { createdAt: 'desc' },
      };
    }
  }

  /**
   * Optimize search queries by using full-text search when available
   */
  static optimizeSearch(
    searchTerm: string,
    fields: string[],
  ): Prisma.StringFilter | Prisma.StringFilter[] {
    if (!searchTerm || searchTerm.length < 2) {
      return {};
    }

    // For PostgreSQL, we can use full-text search
    if (process.env.DATABASE_URL?.includes('postgresql')) {
      return {
        search: searchTerm,
      } as any;
    }

    // Fallback to LIKE queries
    const searchConditions = fields.map(field => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive' as const,
      },
    }));

    return searchConditions.length === 1 ? searchConditions[0] : searchConditions;
  }

  /**
   * Optimize include/select statements to avoid N+1 queries
   */
  static optimizeIncludes<T>(baseInclude: T, requestedFields?: string[]): T {
    if (!requestedFields || requestedFields.length === 0) {
      return baseInclude;
    }

    // Filter includes based on requested fields
    const optimizedInclude = {} as T;

    for (const [key, value] of Object.entries(baseInclude as any)) {
      if (requestedFields.includes(key)) {
        (optimizedInclude as any)[key] = value;
      }
    }

    return optimizedInclude;
  }

  /**
   * Create efficient where clauses for filtering
   */
  static buildWhereClause(filters: Record<string, any>): any {
    const where: any = {};

    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null || value === '') {
        continue;
      }

      switch (key) {
        case 'search':
          if (typeof value === 'string' && value.length >= 2) {
            where.OR = [
              { name: { contains: value, mode: 'insensitive' } },
              { description: { contains: value, mode: 'insensitive' } },
            ];
          }
          break;

        case 'minPrice':
          where.priceCents = { ...where.priceCents, gte: value };
          break;

        case 'maxPrice':
          where.priceCents = { ...where.priceCents, lte: value };
          break;

        case 'categoryId':
          if (Array.isArray(value)) {
            where.categoryId = { in: value };
          } else {
            where.categoryId = value;
          }
          break;

        case 'tags':
          if (Array.isArray(value) && value.length > 0) {
            where.tags = {
              hasSome: value,
            };
          }
          break;

        case 'inStock':
          if (typeof value === 'boolean') {
            where.inStock = value;
          }
          break;

        case 'featured':
          if (typeof value === 'boolean') {
            where.featured = value;
          }
          break;

        case 'dateRange':
          if (value.from || value.to) {
            where.createdAt = {};
            if (value.from) where.createdAt.gte = new Date(value.from);
            if (value.to) where.createdAt.lte = new Date(value.to);
          }
          break;

        default:
          // Direct assignment for simple filters
          where[key] = value;
      }
    }

    return where;
  }

  /**
   * Optimize order by clauses
   */
  static optimizeOrderBy(
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    defaultSort: any = { createdAt: 'desc' },
  ): any {
    if (!sortBy) {
      return defaultSort;
    }

    const order = sortOrder || 'desc';

    // Map common sort fields to optimized versions
    const sortMapping: Record<string, any> = {
      name: { name: order },
      price: { priceCents: order },
      created: { createdAt: order },
      updated: { updatedAt: order },
      popularity: [{ featured: 'desc' }, { viewCount: 'desc' }, { createdAt: 'desc' }],
      relevance: [{ featured: 'desc' }, { _relevance: 'desc' }, { createdAt: 'desc' }],
    };

    return sortMapping[sortBy] || { [sortBy]: order };
  }

  /**
   * Create database indexes suggestions based on query patterns
   */
  static suggestIndexes(
    queryPatterns: Array<{
      table: string;
      whereFields: string[];
      orderByFields: string[];
      frequency: number;
    }>,
  ): Array<{
    table: string;
    fields: string[];
    type: 'btree' | 'gin' | 'gist';
    priority: 'high' | 'medium' | 'low';
  }> {
    const suggestions: Array<{
      table: string;
      fields: string[];
      type: 'btree' | 'gin' | 'gist';
      priority: 'high' | 'medium' | 'low';
    }> = [];

    // Group patterns by table
    const tablePatterns = queryPatterns.reduce(
      (acc, pattern) => {
        if (!acc[pattern.table]) {
          acc[pattern.table] = [];
        }
        acc[pattern.table].push(pattern);
        return acc;
      },
      {} as Record<string, typeof queryPatterns>,
    );

    for (const [table, patterns] of Object.entries(tablePatterns)) {
      // Analyze field usage frequency
      const fieldUsage: Record<string, number> = {};

      patterns.forEach(pattern => {
        [...pattern.whereFields, ...pattern.orderByFields].forEach(field => {
          fieldUsage[field] = (fieldUsage[field] || 0) + pattern.frequency;
        });
      });

      // Suggest indexes for frequently used fields
      for (const [field, frequency] of Object.entries(fieldUsage)) {
        if (frequency > 100) {
          // High frequency threshold
          suggestions.push({
            table,
            fields: [field],
            type: this.getIndexType(field),
            priority: frequency > 1000 ? 'high' : 'medium',
          });
        }
      }

      // Suggest composite indexes for common field combinations
      const commonCombinations = this.findCommonFieldCombinations(patterns);
      commonCombinations.forEach(combination => {
        suggestions.push({
          table,
          fields: combination.fields,
          type: 'btree',
          priority: combination.frequency > 500 ? 'high' : 'medium',
        });
      });
    }

    return suggestions;
  }

  private static getIndexType(field: string): 'btree' | 'gin' | 'gist' {
    // Suggest GIN indexes for array fields and full-text search
    if (field.includes('tags') || field.includes('search')) {
      return 'gin';
    }

    // Suggest GIST indexes for geometric data
    if (field.includes('location') || field.includes('geo')) {
      return 'gist';
    }

    // Default to B-tree for most cases
    return 'btree';
  }

  private static findCommonFieldCombinations(
    patterns: Array<{
      whereFields: string[];
      orderByFields: string[];
      frequency: number;
    }>,
  ): Array<{ fields: string[]; frequency: number }> {
    const combinations: Record<string, number> = {};

    patterns.forEach(pattern => {
      const allFields = [...pattern.whereFields, ...pattern.orderByFields];

      // Generate combinations of 2-3 fields
      for (let i = 0; i < allFields.length; i++) {
        for (let j = i + 1; j < allFields.length; j++) {
          const combo = [allFields[i], allFields[j]].sort().join(',');
          combinations[combo] = (combinations[combo] || 0) + pattern.frequency;

          // Three-field combinations
          for (let k = j + 1; k < allFields.length; k++) {
            const combo3 = [allFields[i], allFields[j], allFields[k]].sort().join(',');
            combinations[combo3] = (combinations[combo3] || 0) + pattern.frequency;
          }
        }
      }
    });

    return Object.entries(combinations)
      .filter(([, frequency]) => frequency > 50)
      .map(([fields, frequency]) => ({
        fields: fields.split(','),
        frequency,
      }))
      .sort((a, b) => b.frequency - a.frequency);
  }
}
