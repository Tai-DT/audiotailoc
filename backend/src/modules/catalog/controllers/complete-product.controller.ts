import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  ValidationPipe,
  UsePipes,
  Patch,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { JwtGuard } from '../../auth/jwt.guard';
import { AdminGuard } from '../../auth/admin.guard';
import { CompleteProductService } from '../services/complete-product.service';
import {
  CreateProductDto,
  UpdateProductDto,
  BulkUpdateProductsDto,
  ProductResponseDto,
  ProductListResponseDto,
  ProductAnalyticsDto,
  ProductListQueryDto,
  ProductSearchSuggestionDto,
  ProductSortBy,
  SortOrder
} from '../dto/complete-product.dto';

@ApiTags('Products')
@Controller('catalog/products')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class CompleteProductController {
  private readonly logger = new Logger(CompleteProductController.name);

  constructor(private readonly catalogService: CompleteProductService) {}

  @Post()
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Create a new product with full specifications, SEO, and inventory management',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Product with this slug already exists',
  })
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    return this.catalogService.createProduct(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get products list',
    description: 'Get paginated list of products with advanced filtering and sorting',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products retrieved successfully',
    type: ProductListResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (starts from 1)',
  })
  @ApiQuery({
  name: 'pageSize',
  required: false,
  type: Number,
  description: 'Items per page (1-100)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ProductSortBy,
    description: 'Sort field',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: SortOrder,
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: 'Search query',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Minimum price in cents',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Maximum price in cents',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: String,
    description: 'Filter by category ID',
  })
  @ApiQuery({
    name: 'brand',
    required: false,
    type: String,
    description: 'Filter by brand',
  })
  @ApiQuery({
    name: 'featured',
    required: false,
    type: Boolean,
    description: 'Filter by featured status',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filter by active status',
  })
  @ApiQuery({
    name: 'inStock',
    required: false,
    type: Boolean,
    description: 'Filter by stock availability',
  })
  @ApiQuery({
    name: 'tags',
    required: false,
    type: String,
    description: 'Filter by tags (comma-separated)',
  })
  async findAll(@Query() query: ProductListQueryDto): Promise<ProductListResponseDto> {
    return this.catalogService.findProducts(query);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search products',
    description: 'Advanced product search with fuzzy matching and relevance scoring',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Search results retrieved successfully',
    type: ProductListResponseDto,
  })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Search query (required)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum results (1-50)',
  })
  async search(@Query('q') query: string, @Query('limit') limit?: number): Promise<ProductListResponseDto> {
    this.logger.debug(`search called with q="${query}" limit=${limit}`);
    return this.catalogService.searchProducts(query, limit);
  }

  @Get('suggestions')
  @ApiOperation({
    summary: 'Get search suggestions',
    description: 'Get autocomplete suggestions for search queries',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Suggestions retrieved successfully',
    type: [ProductSearchSuggestionDto],
  })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Partial search query',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum suggestions (1-20)',
  })
  async getSuggestions(@Query('q') query: string, @Query('limit') limit?: number): Promise<ProductSearchSuggestionDto[]> {
    return this.catalogService.getSearchSuggestions(query, limit);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Get detailed product information by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.catalogService.findProductById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get product by slug',
    description: 'Get detailed product information by URL slug',
  })
  @ApiParam({
    name: 'slug',
    description: 'Product slug',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async findBySlug(@Param('slug') slug: string): Promise<ProductResponseDto> {
    return this.catalogService.findProductBySlug(slug);
  }

  @Put(':id')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update product',
    description: 'Update product information with partial data',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Product with this slug already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.catalogService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete product',
    description: 'Soft delete a product (mark as deleted)',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Product deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.catalogService.deleteProduct(id);
  }

  @Delete()
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Bulk delete products',
    description: 'Soft delete multiple products at once',
  })
  @ApiQuery({
    name: 'ids',
    required: true,
    type: [String],
    description: 'Array of product IDs to delete',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Products deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  async bulkDelete(@Query('ids') ids: string[]): Promise<void> {
    return this.catalogService.bulkDeleteProducts(ids);
  }

  @Patch('bulk')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Bulk update products',
    description: 'Update multiple products with the same changes',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  async bulkUpdate(@Body() bulkUpdateDto: BulkUpdateProductsDto): Promise<{ updated: number }> {
    return this.catalogService.bulkUpdateProducts(bulkUpdateDto);
  }

  @Post(':id/duplicate')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Duplicate product',
    description: 'Create a copy of an existing product',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID to duplicate',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product duplicated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async duplicate(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.catalogService.duplicateProduct(id);
  }

  @Post(':id/view')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Increment product view count',
    description: 'Increment the view count for a product (used for analytics)',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'View count incremented successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async incrementView(@Param('id') id: string): Promise<void> {
    return this.catalogService.incrementProductView(id);
  }

  @Get('analytics/overview')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get product analytics',
    description: 'Get comprehensive analytics for products',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analytics retrieved successfully',
    type: ProductAnalyticsDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  async getAnalytics(): Promise<ProductAnalyticsDto> {
    return this.catalogService.getProductAnalytics();
  }

  @Get('analytics/top-viewed')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get top viewed products',
    description: 'Get most viewed products for analytics',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of products to return (1-50)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Top viewed products retrieved successfully',
    type: [ProductResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  async getTopViewed(@Query('limit') limit?: number): Promise<ProductResponseDto[]> {
    return this.catalogService.getTopViewedProducts(limit);
  }

  @Get('analytics/recent')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get recently added products',
    description: 'Get recently added products for analytics',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of products to return (1-50)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Recent products retrieved successfully',
    type: [ProductResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  async getRecent(@Query('limit') limit?: number): Promise<ProductResponseDto[]> {
    return this.catalogService.getRecentProducts(limit);
  }

  @Get('export/csv')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Export products to CSV',
    description: 'Export products data to CSV format',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'CSV export generated successfully',
    content: {
      'text/csv': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  async exportCsv(): Promise<string> {
    return this.catalogService.exportProductsToCsv();
  }

  @Post('import/csv')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Import products from CSV',
    description: 'Import products data from CSV format',
  })
  @ApiBody({
    description: 'CSV data as string',
    schema: {
      type: 'object',
      properties: {
        csvData: {
          type: 'string',
          description: 'CSV content',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products imported successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid CSV format',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  async importCsv(@Body('csvData') csvData: string): Promise<{ imported: number; errors: string[] }> {
    return this.catalogService.importProductsFromCsv(csvData);
  }
}
