import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';

/**
 * Search Service
 * Provides full-text search functionality with filtering, sorting, and facets
 * Supports products, services, blog articles, and knowledge base entries
 */

export interface SearchFacet {
  name: string;
  value: string;
  count: number;
}

export interface SearchFacets {
  categories?: SearchFacet[];
  types?: SearchFacet[];
  priceRanges?: SearchFacet[];
  brands?: SearchFacet[];
}

export interface SearchResult {
  id: string;
  type: 'product' | 'service' | 'blog' | 'knowledge';
  title: string;
  description?: string;
  slug: string;
  image?: string;
  price?: number;
  rating?: number;
  relevanceScore?: number;
  metadata?: Record<string, any>;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
  facets?: SearchFacets;
  executionTime: number;
}

export interface SearchFilters {
  type?: 'product' | 'service' | 'blog' | 'knowledge' | 'all';
  category?: string;
  priceMin?: number;
  priceMax?: number;
  brand?: string;
  serviceType?: string;
  minRating?: number;
  sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'popular' | 'rating';
  page?: number;
  pageSize?: number;
  includeFacets?: boolean;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly maxPageSize = 100;
  private readonly defaultPageSize = 20;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Main search function - unified search across all content types
   */
  async search(query: string, filters: SearchFilters = {}): Promise<SearchResponse> {
    const startTime = Date.now();

    try {
      // Validate inputs
      if (!query || query.trim().length === 0) {
        throw new BadRequestException('Search query cannot be empty');
      }

      const normalizedQuery = query.trim().toLowerCase();
      const page = Math.max(1, filters.page ?? 1);
      const pageSize = Math.min(
        this.maxPageSize,
        Math.max(1, filters.pageSize ?? this.defaultPageSize),
      );
      const skip = (page - 1) * pageSize;

      // Determine search types
      const searchTypes =
        filters.type === 'all' || !filters.type
          ? ['product', 'service', 'blog', 'knowledge']
          : [filters.type];

      // Execute parallel searches
      const [results, facets] = await Promise.all([
        this.executeParallelSearch(normalizedQuery, searchTypes, filters, skip, pageSize),
        filters.includeFacets
          ? this.generateFacets(normalizedQuery, searchTypes, filters)
          : undefined,
      ]);

      // Sort results by relevance
      const sortedResults = this.sortResults(results, filters.sortBy || 'relevance');

      const executionTime = Date.now() - startTime;

      return {
        query,
        results: sortedResults.slice(0, pageSize),
        total: results.length,
        page,
        pageSize,
        facets,
        executionTime,
      };
    } catch (error) {
      this.logger.error(`Search failed for query "${query}":`, error);
      throw error;
    }
  }

  /**
   * Execute searches across multiple content types in parallel
   */
  private async executeParallelSearch(
    query: string,
    searchTypes: string[],
    filters: SearchFilters,
    skip: number,
    pageSize: number,
  ): Promise<SearchResult[]> {
    const searchPromises: Promise<SearchResult[]>[] = [];

    if (searchTypes.includes('product')) {
      searchPromises.push(this.searchProducts(query, filters, skip, pageSize));
    }

    if (searchTypes.includes('service')) {
      searchPromises.push(this.searchServices(query, filters, skip, pageSize));
    }

    if (searchTypes.includes('blog')) {
      searchPromises.push(this.searchBlogArticles(query, filters, skip, pageSize));
    }

    if (searchTypes.includes('knowledge')) {
      searchPromises.push(this.searchKnowledgeBase(query, filters, skip, pageSize));
    }

    const results = await Promise.all(searchPromises);
    return results.flat();
  }

  /**
   * Search products
   */
  private async searchProducts(
    query: string,
    filters: SearchFilters,
    skip: number,
    pageSize: number,
  ): Promise<SearchResult[]> {
    try {
      const where: Prisma.productsWhereInput = {
        AND: [
          { isDeleted: false, isActive: true },
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { shortDescription: { contains: query, mode: 'insensitive' } },
              { tags: { contains: query, mode: 'insensitive' } },
              { brand: { contains: query, mode: 'insensitive' } },
              { sku: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      };

      if (filters.category) {
        where.categoryId = filters.category;
      }

      if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
        where.priceCents = {};
        if (filters.priceMin !== undefined) {
          (where.priceCents as any).gte = Math.round(filters.priceMin * 100);
        }
        if (filters.priceMax !== undefined) {
          (where.priceCents as any).lte = Math.round(filters.priceMax * 100);
        }
      }

      if (filters.brand) {
        where.brand = filters.brand;
      }

      const products = await this.prisma.products.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          shortDescription: true,
          imageUrl: true,
          priceCents: true,
          brand: true,
        },
        take: pageSize,
        skip,
      });

      return products.map(product => ({
        id: product.id,
        type: 'product',
        title: product.name,
        description: product.shortDescription || product.description,
        slug: product.slug,
        image: product.imageUrl || undefined,
        price: Number(product.priceCents) / 100,
        relevanceScore: this.calculateRelevance(product.name, query),
        metadata: {
          brand: product.brand,
        },
      }));
    } catch (error) {
      this.logger.error('Error searching products:', error);
      return [];
    }
  }

  /**
   * Search services
   */
  private async searchServices(
    query: string,
    filters: SearchFilters,
    skip: number,
    pageSize: number,
  ): Promise<SearchResult[]> {
    try {
      const where: Prisma.servicesWhereInput = {
        AND: [
          { isActive: true },
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { service_types: { name: { contains: query, mode: 'insensitive' } } },
            ],
          },
        ],
      };

      if (filters.serviceType) {
        where.typeId = filters.serviceType;
      }

      if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
        where.basePriceCents = {};
        if (filters.priceMin !== undefined) {
          (where.basePriceCents as any).gte = Math.round(filters.priceMin * 100);
        }
        if (filters.priceMax !== undefined) {
          (where.basePriceCents as any).lte = Math.round(filters.priceMax * 100);
        }
      }

      const services = await this.prisma.services.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          images: true,
          basePriceCents: true,
          service_types: { select: { name: true } },
        },
        take: pageSize,
        skip,
      });

      return services.map(service => ({
        id: service.id,
        type: 'service',
        title: service.name,
        description: service.description,
        slug: service.slug,
        image: service.images || undefined,
        price: Number(service.basePriceCents) / 100,
        relevanceScore: this.calculateRelevance(service.name, query),
        metadata: {
          serviceType: service.service_types?.name,
        },
      }));
    } catch (error) {
      this.logger.error('Error searching services:', error);
      return [];
    }
  }

  /**
   * Search blog articles
   */
  private async searchBlogArticles(
    query: string,
    filters: SearchFilters,
    skip: number,
    pageSize: number,
  ): Promise<SearchResult[]> {
    try {
      const where: Prisma.blog_articlesWhereInput = {
        AND: [
          { status: 'PUBLISHED' },
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
              { excerpt: { contains: query, mode: 'insensitive' } },
              { seoKeywords: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      };

      const articles = await this.prisma.blog_articles.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          imageUrl: true,
          viewCount: true,
        },
        take: pageSize,
        skip,
      });

      return articles.map(article => ({
        id: article.id,
        type: 'blog',
        title: article.title,
        description: article.excerpt,
        slug: article.slug,
        image: article.imageUrl || undefined,
        relevanceScore: this.calculateRelevance(article.title, query),
        metadata: {
          viewCount: article.viewCount,
        },
      }));
    } catch (error) {
      this.logger.error('Error searching blog articles:', error);
      return [];
    }
  }

  /**
   * Search knowledge base entries
   */
  private async searchKnowledgeBase(
    query: string,
    filters: SearchFilters,
    skip: number,
    pageSize: number,
  ): Promise<SearchResult[]> {
    try {
      const where: Prisma.knowledge_base_entriesWhereInput = {
        AND: [
          { isActive: true },
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
              { tags: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      };

      const entries = await this.prisma.knowledge_base_entries.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          viewCount: true,
        },
        take: pageSize,
        skip,
      });

      return entries.map(entry => ({
        id: entry.id,
        type: 'knowledge',
        title: entry.title,
        description: entry.content ? entry.content.substring(0, 200) : undefined,
        slug: entry.slug,
        relevanceScore: this.calculateRelevance(entry.title, query),
        metadata: {
          viewCount: entry.viewCount,
        },
      }));
    } catch (error) {
      this.logger.error('Error searching knowledge base:', error);
      return [];
    }
  }

  /**
   * Generate search facets (filters)
   */
  private async generateFacets(
    query: string,
    searchTypes: string[],
    _filters: SearchFilters,
  ): Promise<SearchFacets> {
    const facets: SearchFacets = {};

    try {
      if (searchTypes.includes('product')) {
        // Category facets
        const categoryQuery = await this.prisma.products.findMany({
          where: {
            isDeleted: false,
            isActive: true,
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          select: { categoryId: true },
          distinct: ['categoryId'],
        });

        if (categoryQuery.length > 0) {
          const categories = await this.prisma.categories.findMany({
            where: {
              id: {
                in: categoryQuery.filter(p => p.categoryId).map(p => p.categoryId as string),
              },
            },
            select: { id: true, name: true },
          });

          facets.categories = categories.map(cat => ({
            name: cat.name,
            value: cat.id,
            count: 1, // Simplified for demo
          }));
        }

        // Brand facets
        const brandQuery = await this.prisma.products.findMany({
          where: {
            isDeleted: false,
            isActive: true,
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          select: { brand: true },
          distinct: ['brand'],
        });

        facets.brands = brandQuery
          .filter(p => p.brand)
          .map(p => ({
            name: p.brand!,
            value: p.brand!,
            count: 1,
          }));
      }

      if (searchTypes.includes('service')) {
        const typeQuery = await this.prisma.services.findMany({
          where: {
            isActive: true,
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          select: { typeId: true },
          distinct: ['typeId'],
        });

        if (typeQuery.length > 0) {
          const types = await this.prisma.service_types.findMany({
            where: {
              id: {
                in: typeQuery.filter(s => s.typeId).map(s => s.typeId as string),
              },
            },
            select: { id: true, name: true },
          });

          facets.types = types.map(type => ({
            name: type.name,
            value: type.id,
            count: 1,
          }));
        }
      }
    } catch (error) {
      this.logger.error('Error generating facets:', error);
    }

    return facets;
  }

  /**
   * Calculate relevance score for a result
   */
  private calculateRelevance(title: string, query: string): number {
    const titleLower = title.toLowerCase();
    const queryLower = query.toLowerCase();

    // Exact match = 100
    if (titleLower === queryLower) {
      return 100;
    }

    // Starts with query = 90
    if (titleLower.startsWith(queryLower)) {
      return 90;
    }

    // Contains query = 80
    if (titleLower.includes(queryLower)) {
      return 80;
    }

    // Partial word match
    const words = queryLower.split(' ');
    const matchingWords = words.filter(word => titleLower.includes(word)).length;
    return (matchingWords / words.length) * 70;
  }

  /**
   * Sort results by specified criteria
   */
  private sortResults(results: SearchResult[], sortBy: string): SearchResult[] {
    const sorted = [...results];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-desc':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'newest':
        return sorted; // Assuming default order is newest
      case 'popular':
        return sorted.sort((a, b) => {
          const aPopularity = (a.metadata?.viewCount || 0) + (a.metadata?.reviewCount || 0);
          const bPopularity = (b.metadata?.viewCount || 0) + (b.metadata?.reviewCount || 0);
          return bPopularity - aPopularity;
        });
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'relevance':
      default:
        return sorted.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    }
  }

  /**
   * Log search query for analytics
   */
  async logSearchQuery(userId: string | null, query: string, _resultsCount: number): Promise<void> {
    try {
      await this.prisma.search_queries.create({
        data: {
          id: randomUUID(),
          query: query.trim(),
          userId: userId,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      // Silent fail for logging
      this.logger.warn(`Failed to log search query: ${error}`);
    }
  }

  /**
   * Get popular search queries
   */
  async getPopularSearches(limit: number = 10): Promise<Array<{ query: string; count: number }>> {
    try {
      const popular = await this.prisma.search_queries.groupBy({
        by: ['query'],
        _count: {
          query: true,
        },
        orderBy: {
          _count: {
            query: 'desc',
          },
        },
        take: limit,
      });

      return popular.map(item => ({
        query: item.query,
        count: item._count.query,
      }));
    } catch (error) {
      this.logger.error('Error fetching popular searches:', error);
      return [];
    }
  }

  /**
   * Get search suggestions based on partial query
   */
  async getSearchSuggestions(_query: string, _limit: number = 5): Promise<string[]> {
    // Search suggestions disabled - model not available
    return [];
  }
}
