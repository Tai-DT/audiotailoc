import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards, Patch, Delete, UseInterceptors, CacheInterceptor } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListProductsDto } from './dto/list-products.dto';
import { AdvancedSearchDto, SearchSuggestionsDto, ProductRecommendationDto, ProductFilterOptionsDto } from './dto/search.dto';
import { ProductResponseDto, CategoryResponseDto, SearchResultDto, RecommendationResponseDto } from './dto/response.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { BulkIdsDto } from '../common/dto/base.dto';
import {
  ApiStandardList,
  ApiStandardGet,
  ApiStandardCreate,
  ApiStandardUpdate,
  ApiStandardDelete,
  ApiBulkOperation,
  ApiErrorResponses,
  ApiAuthRequired,
  ApiAdminRequired,
} from '../common/decorators/swagger.decorators';
import { ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalog: CatalogService /* , private readonly searchService: SearchService */) {}

  // Product listing with advanced filtering
  @Get('products')
  @UseInterceptors(CacheInterceptor)
  @ApiStandardList('products', ProductResponseDto, {
    includeSearch: true,
    includePagination: true,
  })
  async listProducts(@Query() query: ListProductsDto) {
    return this.catalog.listProducts(query);
  }

  // Get product by ID
  @Get('products/:id')
  @UseInterceptors(CacheInterceptor)
  @ApiStandardGet('product', ProductResponseDto)
  async getProduct(@Param('id') id: string) {
    return this.catalog.getById(id);
  }

  // Get product by slug
  @Get('products/slug/:slug')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get product by slug',
    description: 'Retrieve a product using its URL-friendly slug',
  })
  @ApiParam({
    name: 'slug',
    description: 'Product slug',
    example: 'premium-audio-cable-3m',
  })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiErrorResponses()
  async getProductBySlug(@Param('slug') slug: string) {
    return this.catalog.getBySlug(slug);
  }

  // Product recommendations
  @Get('products/:id/recommendations')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get product recommendations',
    description: 'Get personalized product recommendations based on the given product',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['similar', 'related', 'frequently-bought-together', 'alternative'],
    description: 'Type of recommendations',
    example: 'similar',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of recommendations',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Product recommendations retrieved successfully',
    type: RecommendationResponseDto,
  })
  @ApiErrorResponses()
  async getProductRecommendations(@Param('id') id: string, @Query() query: ProductRecommendationDto) {
    // For now, return similar products from same category
    return this.catalog.getRecommendations(id, query);
  }

  // Advanced search
  @Get('search/advanced')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Advanced product search',
    description: 'Search products with advanced filtering options including categories, brands, price ranges, and features',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
    type: SearchResultDto,
  })
  @ApiErrorResponses()
  async advancedSearch(@Query() query: AdvancedSearchDto) {
    // Mock implementation since SearchService is disabled
    return this.catalog.advancedSearch(query);
  }

  // Search suggestions
  @Get('search/suggestions')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get search suggestions',
    description: 'Get autocomplete suggestions for search queries',
  })
  @ApiQuery({
    name: 'q',
    description: 'Partial search query',
    example: 'head',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum suggestions to return',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Search suggestions retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            suggestions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  text: { type: 'string', example: 'headphones' },
                  type: { type: 'string', example: 'product' },
                  count: { type: 'number', example: 45 },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async getSearchSuggestions(@Query() query: SearchSuggestionsDto) {
    return this.catalog.getSearchSuggestions(query);
  }

  // Popular searches
  @Get('search/popular')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get popular searches',
    description: 'Get list of popular search terms',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of popular searches to return',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Popular searches retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              query: { type: 'string', example: 'bluetooth headphones' },
              count: { type: 'number', example: 1250 },
              trend: { type: 'string', enum: ['up', 'down', 'stable'], example: 'up' },
            },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async getPopularSearches(@Query('limit') limit?: number) {
    return this.catalog.getPopularSearches(limit);
  }

  // Filter options
  @Get('filters')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get filter options',
    description: 'Get available filter options for product search',
  })
  @ApiResponse({
    status: 200,
    description: 'Filter options retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            categories: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  count: { type: 'number' },
                },
              },
            },
            brands: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  count: { type: 'number' },
                },
              },
            },
            priceRanges: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  min: { type: 'number' },
                  max: { type: 'number' },
                  count: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async getFilterOptions(@Query() query: ProductFilterOptionsDto) {
    return this.catalog.getFilterOptions(query);
  }

  // Categories
  @Get('categories')
  @UseInterceptors(CacheInterceptor)
  @ApiStandardList('categories', CategoryResponseDto, {
    includePagination: false,
  })
  async listCategories() {
    return this.catalog.listCategories();
  }

  // Create product (Admin only)
  @Post('products')
  @UseGuards(JwtGuard, AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiStandardCreate('product', CreateProductDto, ProductResponseDto, {
    requireAdmin: true,
  })
  async createProduct(@Body() dto: CreateProductDto) {
    return this.catalog.create(dto);
  }

  // Update product (Admin only)
  @Patch('products/:id')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiStandardUpdate('product', UpdateProductDto, {
    requireAdmin: true,
  })
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.catalog.update(id, dto);
  }

  // Delete product (Admin only)
  @Delete('products/:id')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiStandardDelete('product', {
    requireAdmin: true,
  })
  async deleteProduct(@Param('id') id: string) {
    return this.catalog.remove(id);
  }

  // Bulk delete products (Admin only)
  @Delete('products')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBulkOperation('delete', 'products', {
    requireAdmin: true,
  })
  async bulkDeleteProducts(@Body() body: BulkIdsDto) {
    return this.catalog.removeMany(body.ids);
  }

  // Bulk update products (Admin only)
  @Patch('products')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiOperation({
    summary: 'Bulk update products',
    description: 'Update multiple products at once',
  })
  @ApiAuthRequired()
  @ApiResponse({
    status: 200,
    description: 'Bulk update completed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            updated: { type: 'number', example: 5 },
            failed: { type: 'number', example: 0 },
            errors: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async bulkUpdateProducts(@Body() body: { ids: string[]; updates: Partial<UpdateProductDto> }) {
    return this.catalog.bulkUpdate(body.ids, body.updates);
  }

  // Product analytics
  @Get('analytics/products/popular')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({
    summary: 'Get popular products analytics',
    description: 'Get analytics data for most popular products',
  })
  @ApiAuthRequired()
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['day', 'week', 'month', 'year'],
    description: 'Time period for analytics',
    example: 'month',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of products to return',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Popular products analytics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              product: { $ref: '#/components/schemas/ProductResponseDto' },
              views: { type: 'number', example: 1250 },
              sales: { type: 'number', example: 45 },
              revenue: { type: 'number', example: 6750000 },
              trend: { type: 'string', enum: ['up', 'down', 'stable'], example: 'up' },
            },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async getPopularProductsAnalytics(
    @Query('period') period: string = 'month',
    @Query('limit') limit: number = 20,
  ) {
    return this.catalog.getPopularProductsAnalytics({ period, limit });
  }
}
