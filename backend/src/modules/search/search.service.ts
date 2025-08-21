import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  tags?: string[];
  sortBy?: 'price' | 'name' | 'createdAt' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface SearchSuggestion {
  type: 'product' | 'category' | 'tag';
  value: string;
  count: number;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Advanced Product Search
  async searchProducts(query: string, filters: SearchFilters = {}) {
    const {
      category,
      minPrice,
      maxPrice,
      inStock,
      featured,
      tags,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = 20,
      offset = 0
    } = filters;

    // Build where conditions
    const where: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' as const } },
        { description: { contains: query, mode: 'insensitive' as const } },
        { slug: { contains: query, mode: 'insensitive' as const } }
      ]
    };

    // Category filter
    if (category) {
      where.category = {
        OR: [
          { slug: { contains: category, mode: 'insensitive' as const } },
          { name: { contains: category, mode: 'insensitive' as const } }
        ]
      };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.priceCents = {};
      if (minPrice !== undefined) where.priceCents.gte = minPrice;
      if (maxPrice !== undefined) where.priceCents.lte = maxPrice;
    }

    // Stock filter
    if (inStock !== undefined) {
      where.inventory = { is: { stock: inStock ? { gt: 0 } : { lte: 0 } } } as any;
    }

    // Featured filter
    if (featured !== undefined) {
      where.featured = featured;
    }

    // Tags filter
    if (tags && tags.length > 0) {
      where.tags = { some: { name: { in: tags } } } as any;
    }

    // Build order by
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Execute search
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          inventory: true,
          tags: true,
          _count: {
            select: {
              reviews: true,
              views: true
            }
          }
        },
        orderBy,
        take: limit,
        skip: offset
      }),
      this.prisma.product.count({ where })
    ]);

    // Log search analytics
    this.logSearchAnalytics(query, filters, total);

    return {
      products,
      total,
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        applied: filters,
        available: await this.getAvailableFilters(query)
      }
    };
  }

  // Global Search across multiple entities
  async globalSearch(query: string, limit: number = 10) {
    const results = {
      products: [],
      categories: [],
      services: [],
      suggestions: []
    };

    // Search products
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' as const } },
          { description: { contains: query, mode: 'insensitive' as const } }
        ]
      },
      include: {
        category: true,
        inventory: true
      },
      take: Math.floor(limit / 2)
    });

    // Search categories
    const categories = await this.prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { slug: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: Math.floor(limit / 4)
    });

    // Search services
    const services = await this.prisma.service.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: Math.floor(limit / 4)
    });

    // Generate search suggestions
    const suggestions = await this.generateSearchSuggestions(query);

    return {
      products,
      categories,
      services,
      suggestions,
      total: products.length + categories.length + services.length
    };
  }

  // Search Suggestions
  async getSearchSuggestions(query: string, limit: number = 5) {
    const suggestions: SearchSuggestion[] = [];

    // Product name suggestions
    const productSuggestions = await this.prisma.product.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' }
      },
      select: {
        name: true,
        _count: { select: { views: true } }
      },
      take: limit,
      orderBy: { viewCount: 'desc' }
    });

    productSuggestions.forEach(product => {
      suggestions.push({
        type: 'product',
        value: product.name,
        count: product._count.views
      });
    });

    // Category suggestions
    const categorySuggestions = await this.prisma.category.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' }
      },
      select: {
        name: true,
        _count: { select: { products: true } }
      },
      take: limit,
      orderBy: { products: { _count: 'desc' } }
    });

    categorySuggestions.forEach(category => {
      suggestions.push({
        type: 'category',
        value: category.name,
        count: category._count.products
      });
    });

    // Tag suggestions
    const tagSuggestions = await this.prisma.productTag.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' }
      },
      select: {
        name: true,
        _count: { select: { products: true } }
      },
      take: limit,
      orderBy: { products: { _count: 'desc' } }
    });

    tagSuggestions.forEach(tag => {
      suggestions.push({
        type: 'tag',
        value: tag.name,
        count: tag._count.products
      });
    });

    return suggestions
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // Popular Searches
  async getPopularSearches(limit: number = 10) {
    // This would typically come from search analytics
    // For now, return popular product names
    const popularProducts = await this.prisma.product.findMany({
      where: {},
      select: { name: true },
      orderBy: { viewCount: 'desc' },
      take: limit
    });

    return popularProducts.map(p => p.name);
  }

  // Search Analytics
  async logSearchAnalytics(query: string, filters: SearchFilters, resultCount: number) {
    try {
      await this.prisma.searchLog.create({
        data: {
          query,
          filters: filters as any,
          resultCount,
          timestamp: new Date()
        }
      });
    } catch (error) {
      this.logger.error('Failed to log search analytics:', error);
    }
  }

  // Get available filters for current search
  async getAvailableFilters(query: string) {
    const baseWhere: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' as const } },
        { description: { contains: query, mode: 'insensitive' as const } }
      ]
    };

    const [categories, priceRange, tags] = await Promise.all([
      // Available categories
      this.prisma.category.findMany({
        where: {
          products: { some: baseWhere }
        },
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { products: true } }
        }
      }),

      // Price range
      this.prisma.product.aggregate({
        where: baseWhere,
        _min: { priceCents: true },
        _max: { priceCents: true }
      }),

      // Available tags
      this.prisma.productTag.findMany({
        where: {
          products: { some: baseWhere }
        },
        select: {
          id: true,
          name: true,
          _count: { select: { products: true } }
        }
      })
    ]);

    return {
      categories,
      priceRange: {
        min: (priceRange as any)._min?.priceCents ?? 0,
        max: (priceRange as any)._max?.priceCents ?? 0
      },
      tags
    };
  }

  // Generate search suggestions based on query
  private async generateSearchSuggestions(query: string): Promise<string[]> {
    const suggestions: string[] = [];

    // Add query variations
    if (query.length > 2) {
      suggestions.push(query);
      suggestions.push(query + ' giá rẻ');
      suggestions.push(query + ' chất lượng');
      suggestions.push(query + ' chính hãng');
    }

    // Add related terms based on query
    const relatedTerms = await this.getRelatedTerms(query);
    suggestions.push(...relatedTerms);

    return suggestions.slice(0, 5);
  }

  // Get related terms for a query
  private async getRelatedTerms(query: string): Promise<string[]> {
    // This would typically use a more sophisticated algorithm
    // For now, return some basic related terms
    const relatedTerms: { [key: string]: string[] } = {
      'loa': ['speaker', 'amplifier', 'sound system'],
      'microphone': ['mic', 'karaoke', 'recording'],
      'headphone': ['earphone', 'headset', 'audio'],
      'amplifier': ['amp', 'power', 'sound'],
      'mixer': ['dj', 'audio', 'recording']
    };

    const lowerQuery = query.toLowerCase();
    for (const [key, terms] of Object.entries(relatedTerms)) {
      if (lowerQuery.includes(key)) {
        return terms;
      }
    }

    return [];
  }

  // Search History for logged-in users
  async getUserSearchHistory(userId: string, limit: number = 10) {
    const history = await this.prisma.searchLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: limit,
      select: {
        query: true,
        timestamp: true
      }
    });

    return history;
  }

  // Save search to user history
  async saveUserSearch(userId: string, query: string, filters: SearchFilters) {
    try {
      await this.prisma.searchLog.create({
        data: {
          userId,
          query,
          filters: filters as any,
          resultCount: 0,
          timestamp: new Date()
        }
      });
    } catch (error) {
      this.logger.error('Failed to save user search:', error);
    }
  }

  // Compatibility wrappers for other modules/controllers
  async search(q: string, page = 1, pageSize = 20, filters: any = {}, _options?: any) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    return this.searchProducts(q || '', { ...filters, limit, offset });
  }

  async getSuggestions(q: string, limit?: number) {
    return this.getSearchSuggestions(q || '', limit ?? 5);
  }

  async getFacets() {
    return this.getAvailableFilters('');
  }

  // Optional stubs for indexing hooks referenced elsewhere
  async indexDocuments(_docs: any[]) { return; }
  async deleteDocument(_id: string) { return; }
}
