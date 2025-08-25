import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { SearchService, SearchFilters } from './search.service';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly prisma: PrismaService
  ) {}

  // Advanced Product Search
  @Get('products')
  async searchProducts(
    @Query('q') query: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('inStock') inStock?: string,
    @Query('featured') featured?: string,
    @Query('tags') tags?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const filters: SearchFilters = {
      categoryId: category,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      inStock: inStock ? inStock === 'true' : undefined,
      featured: featured ? featured === 'true' : undefined,
      tags: tags ? tags.split(',') : undefined
    };

    const options = {
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
      limit: limit ? parseInt(limit) : 20,
      offset: page ? (parseInt(page) - 1) * (limit ? parseInt(limit) : 20) : 0
    };

    return this.searchService.searchProducts(query || '', { ...filters, ...options });
  }

  // Services Search
  @Get('services')
  async searchServices(
    @Query('q') query: string,
    @Query('category') category?: string,
    @Query('type') type?: string,
    @Query('isActive') isActive?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const pageSize = limit ? parseInt(limit) : 20;
    
    const where: any = {};
    
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' as const } },
        { description: { contains: query, mode: 'insensitive' as const } }
      ];
    }
    
    if (category) {
      where.category = category;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }
    
    const services = await this.prisma.service.findMany({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    });
    
    const total = await this.prisma.service.count({ where });
    
    return {
      services,
      pagination: {
        page: pageNum,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  // Global Search
  @Get('global')
  async globalSearch(
    @Query('q') query: string,
    @Query('limit') limit?: string
  ) {
    return this.searchService.globalSearch(
      query || '',
      limit ? parseInt(limit) : 10
    );
  }

  // Search Suggestions
  @Get('suggestions')
  async getSearchSuggestions(
    @Query('q') query: string,
    @Query('limit') limit?: string
  ) {
    return this.searchService.getSearchSuggestions(
      query || '',
      limit ? parseInt(limit) : 5
    );
  }

  // Popular Searches
  @Get('popular')
  async getPopularSearches(@Query('limit') limit?: string) {
    return this.searchService.getPopularSearches(
      limit ? parseInt(limit) : 10
    );
  }

  // Analytics: log user search interactions (fire-and-forget)
  @Post('analytics')
  async logSearchAnalytics(@Body() body: { query: string; filters?: Record<string, any>; resultCount?: number }) {
    await this.searchService.logSearchAnalytics(body?.query || '', body?.filters || {}, body?.resultCount ?? 0);
    return { ok: true };
  }

  // Search History (for logged-in users)
  @Get('history')
  async getUserSearchHistory(
    @Query('userId') userId: string,
    @Query('_limit') _limit?: string
  ) {
    return this.searchService.getUserSearchHistory(
      userId
    );
  }

  // Available Filters
  @Get('filters')
  async getAvailableFilters(@Query('q') query: string) {
    return this.searchService.getAvailableFilters(query || '');
  }

  // Admin: Reindex Meilisearch with current products
  @UseGuards(AdminOrKeyGuard)
  @Post('admin/reindex')
  async reindex(@Body('limit') limit?: number) {
    const products = await this.prisma.product.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        priceCents: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { name: true, slug: true } },
        // tags: { select: { name: true } } // Field not available in current schema
      },
      take: limit && limit > 0 ? limit : 1000
    });

    const docs = products.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description || '',
      priceCents: p.priceCents,
      imageUrl: p.imageUrl || '',
      category: p.category ? p.category.name : null,
      categorySlug: p.category ? p.category.slug : null,
      // tags: p.tags.map((t: any) => t.name),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    await this.searchService.indexDocuments(docs);
    return { ok: true, indexed: docs.length };
  }
}
