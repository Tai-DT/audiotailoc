import { Controller, Get, Query, Post, Body, Param, UseGuards, Req, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SearchService, SearchFilters, SearchResponse } from './search.service';
import { AdminGuard } from '../auth/admin.guard';

/**
 * Search Controller
 * Handles search endpoints for products, services, blog, and knowledge base
 */
@ApiTags('Search')
@Controller('search')
export class SearchController {
  private readonly logger = new Logger(SearchController.name);

  constructor(private readonly searchService: SearchService) {}

  /**
   * Search across all content types
   * GET /api/v1/search
   */
  @Get()
  @ApiOperation({
    summary: 'Search across all content',
    description: 'Unified search across products, services, blog articles, and knowledge base',
  })
  @ApiQuery({ name: 'q', description: 'Search query', type: String, required: true })
  @ApiQuery({
    name: 'type',
    description: 'Content type filter',
    enum: ['product', 'service', 'blog', 'knowledge', 'all'],
    required: false,
  })
  @ApiQuery({ name: 'category', description: 'Category filter', type: String, required: false })
  @ApiQuery({ name: 'priceMin', description: 'Minimum price', type: Number, required: false })
  @ApiQuery({ name: 'priceMax', description: 'Maximum price', type: Number, required: false })
  @ApiQuery({ name: 'brand', description: 'Brand filter', type: String, required: false })
  @ApiQuery({
    name: 'serviceType',
    description: 'Service type filter',
    type: String,
    required: false,
  })
  @ApiQuery({ name: 'minRating', description: 'Minimum rating', type: Number, required: false })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort by',
    enum: ['relevance', 'price-asc', 'price-desc', 'newest', 'popular', 'rating'],
    required: false,
  })
  @ApiQuery({ name: 'page', description: 'Page number', type: Number, required: false, example: 1 })
  @ApiQuery({
    name: 'pageSize',
    description: 'Page size',
    type: Number,
    required: false,
    example: 20,
  })
  @ApiQuery({
    name: 'includeFacets',
    description: 'Include facets in response',
    type: Boolean,
    required: false,
  })
  @ApiResponse({ status: 200, description: 'Search results' })
  @ApiResponse({ status: 400, description: 'Invalid search query' })
  async search(
    @Query('q') query: string,
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('priceMin') priceMin?: string,
    @Query('priceMax') priceMax?: string,
    @Query('brand') brand?: string,
    @Query('serviceType') serviceType?: string,
    @Query('minRating') minRating?: string,
    @Query('sortBy') sortBy?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('includeFacets') includeFacets?: string,
    @Req() req?: any,
  ): Promise<SearchResponse> {
    try {
      const filters: SearchFilters = {
        type: (type as any) || 'all',
        category,
        brand,
        serviceType,
        priceMin: priceMin ? parseFloat(priceMin) : undefined,
        priceMax: priceMax ? parseFloat(priceMax) : undefined,
        minRating: minRating ? parseFloat(minRating) : undefined,
        sortBy: (sortBy as any) || 'relevance',
        page: page ? parseInt(page) : 1,
        pageSize: pageSize ? parseInt(pageSize) : 20,
        includeFacets: includeFacets === 'true',
      };

      const result = await this.searchService.search(query, filters);

      // Log search query (extract user ID if authenticated)
      const userId = req?.users?.sub || null;
      this.searchService
        .logSearchQuery(userId, query, result.total)
        .catch(error => this.logger.error('Failed to log search query:', error));

      return result;
    } catch (error) {
      this.logger.error(`Search failed for query "${query}":`, error);
      throw error;
    }
  }

  /**
   * Get popular searches
   * GET /api/v1/search/popular
   */
  @Get('popular')
  @ApiOperation({
    summary: 'Get popular search queries',
    description: 'Retrieve the most popular search queries',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of results',
    type: Number,
    required: false,
    example: 10,
  })
  @ApiResponse({ status: 200, description: 'Popular searches' })
  async getPopularSearches(@Query('limit') limit?: string) {
    try {
      const limitNum = limit ? Math.min(50, parseInt(limit)) : 10;
      const results = await this.searchService.getPopularSearches(limitNum);
      return { success: true, data: results };
    } catch (error) {
      this.logger.error('Error fetching popular searches:', error);
      throw error;
    }
  }

  /**
   * Get search suggestions
   * GET /api/v1/search/suggestions
   */
  @Get('suggestions')
  @ApiOperation({
    summary: 'Get search suggestions',
    description: 'Get autocomplete suggestions based on partial query',
  })
  @ApiQuery({ name: 'q', description: 'Partial query', type: String, required: true })
  @ApiQuery({
    name: 'limit',
    description: 'Number of suggestions',
    type: Number,
    required: false,
    example: 5,
  })
  @ApiResponse({ status: 200, description: 'Search suggestions' })
  async getSearchSuggestions(@Query('q') query: string, @Query('limit') limit?: string) {
    try {
      if (!query || query.trim().length === 0) {
        return { success: true, data: [] };
      }

      const limitNum = limit ? Math.min(20, parseInt(limit)) : 5;
      const suggestions = await this.searchService.getSearchSuggestions(query, limitNum);
      return { success: true, data: suggestions };
    } catch (error) {
      this.logger.error('Error fetching search suggestions:', error);
      throw error;
    }
  }

  /**
   * Advanced search (authenticated users only)
   * POST /api/v1/search/advanced
   */
  @Post('advanced')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Advanced search with complex filters',
    description: 'Perform advanced searches with complex filtering criteria',
  })
  @ApiResponse({ status: 200, description: 'Search results' })
  async advancedSearch(@Body() filters: SearchFilters) {
    try {
      if (!filters) {
        throw new Error('Filters are required');
      }

      // Use a default query or extract from filters
      const query = (filters as any).query || 'all';
      const result = await this.searchService.search(query, filters);
      return result;
    } catch (error) {
      this.logger.error('Advanced search failed:', error);
      throw error;
    }
  }

  /**
   * Search specific content type
   * GET /api/v1/search/:type
   */
  @Get(':type')
  @ApiOperation({
    summary: 'Search specific content type',
    description: 'Search for products, services, blog, or knowledge base entries',
  })
  @ApiQuery({ name: 'q', description: 'Search query', type: String, required: true })
  @ApiQuery({ name: 'page', description: 'Page number', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', description: 'Page size', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Search results' })
  async searchByType(
    @Param('type') type: string,
    @Query('q') query: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Req() req?: any,
  ): Promise<SearchResponse> {
    try {
      const validTypes = ['product', 'service', 'blog', 'knowledge'];
      if (!validTypes.includes(type)) {
        throw new Error(`Invalid content type: ${type}`);
      }

      const filters: SearchFilters = {
        type: type as any,
        page: page ? parseInt(page) : 1,
        pageSize: pageSize ? parseInt(pageSize) : 20,
      };

      const result = await this.searchService.search(query, filters);

      // Log search query
      const userId = req?.users?.sub || null;
      this.searchService
        .logSearchQuery(userId, query, result.total)
        .catch(error => this.logger.error('Failed to log search query:', error));

      return result;
    } catch (error) {
      this.logger.error(`Search failed for type "${type}":`, error);
      throw error;
    }
  }
}
