import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService, SearchFilters } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

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
      category,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      inStock: inStock ? inStock === 'true' : undefined,
      featured: featured ? featured === 'true' : undefined,
      tags: tags ? tags.split(',') : undefined,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
      limit: limit ? parseInt(limit) : 20,
      offset: page ? (parseInt(page) - 1) * (limit ? parseInt(limit) : 20) : 0
    };

    return this.searchService.searchProducts(query || '', filters);
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

  // Search History (for logged-in users)
  @Get('history')
  async getUserSearchHistory(
    @Query('userId') userId: string,
    @Query('limit') limit?: string
  ) {
    return this.searchService.getUserSearchHistory(
      userId,
      limit ? parseInt(limit) : 10
    );
  }

  // Available Filters
  @Get('filters')
  async getAvailableFilters(@Query('q') query: string) {
    return this.searchService.getAvailableFilters(query || '');
  }
}
