import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards, Patch, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { IsOptional } from 'class-validator';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
// import { SearchService } from '../search/search.service'; // Disabled due to module not enabled



class DeleteManyDto {
  @IsOptional()
  ids?: string[];
}

@ApiTags('Products')
@ApiBearerAuth()
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalog: CatalogService /* , private readonly searchService: SearchService */) {}

  @Get('products')
  @UseGuards() // Temporarily remove authentication for testing
  list(@Query() query: any) {
    const { page, pageSize, q, minPrice, maxPrice, sortBy, sortOrder, featured, search } = query;
    return this.catalog.listProducts({
      page: parseInt(page) || 1,
      pageSize: parseInt(pageSize) || 20,
      q: search || q,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
      featured: featured === 'true' ? true : undefined
    });
  }

  // @Get('search/advanced')
  // async advancedSearch(@Query() query: AdvancedSearchDto) {
  //   // Disabled due to SearchService not available
  //   throw new Error('Advanced search not available - SearchService disabled');
  // }

  // @Get('search/suggestions')
  // async getSearchSuggestions(@Query('q') q: string, @Query('limit') limit?: number) {
  //   // Disabled due to SearchService not available
  //   throw new Error('Search suggestions not available - SearchService disabled');
  // }

  // @Get('search/popular')
  // async getPopularSearches(@Query('limit') limit?: number) {
  //   // Disabled due to SearchService not available
  //   throw new Error('Popular searches not available - SearchService disabled');
  // }

  // @Get('search/facets')
  // async getSearchFacets() {
  //   // Disabled due to SearchService not available
  //   throw new Error('Search facets not available - SearchService disabled');
  // }

  @Get('categories')
  listCategories() {
    return this.catalog.listCategories();
  }

  @Get('categories/:id')
  getCategory(@Param('id') id: string) {
    return this.catalog.getCategoryById(id);
  }

  @UseGuards(AdminOrKeyGuard)
  @Post('categories')
  @HttpCode(HttpStatus.CREATED)
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.catalog.createCategory(dto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.catalog.updateCategory(id, dto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.catalog.deleteCategory(id);
  }

  @Get('products/:id')
  @UseGuards() // Temporarily remove authentication for testing
  get(@Param('id') id: string) {
    return this.catalog.getById(id);
  }

  @Get('products/slug/:slug')
  @UseGuards() // Temporarily remove authentication for testing
  getBySlug(@Param('slug') slug: string) {
    return this.catalog.getBySlug(slug);
  }

  @Get('products/check-sku/:sku')
  @UseGuards(AdminOrKeyGuard)
  async checkSkuExists(
    @Param('sku') sku: string,
    @Query('excludeId') excludeId?: string,
  ) {
    return this.catalog.checkSkuExists(sku, excludeId);
  }

  @Get('generate-sku')
  @UseGuards(AdminOrKeyGuard)
  async generateUniqueSku(@Query('baseName') baseName?: string) {
    return this.catalog.generateUniqueSku(baseName);
  }

  // @Get('search')
  // search(@Query('q') q = '', @Query('page') page = '1', @Query('pageSize') pageSize = '20', @Query('categoryId') categoryId?: string, @Query('minPrice') minPrice?: string, @Query('maxPrice') maxPrice?: string) {
  //   // Disabled due to SearchService not available
  //   throw new Error('Search not available - SearchService disabled');
  // }

  @UseGuards(AdminOrKeyGuard)
  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProductDto) {
    return this.catalog.create(dto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Patch('products/:id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.catalog.update(id, dto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Delete('products/:id')
  remove(@Param('id') id: string) {
    return this.catalog.remove(id);
  }

  @UseGuards(AdminOrKeyGuard)
  @Delete('products')
  removeMany(@Body() body: DeleteManyDto) {
    return this.catalog.removeMany(body?.ids ?? []);
  }

  // Analytics endpoints (public access for frontend)
  @Get('products/analytics/top-viewed')
  @UseGuards() // Remove authentication for public access
  async getTopViewedProducts(@Query('limit') limit?: number) {
    const limitNum = Math.min(parseInt(limit?.toString() || '10'), 50); // Max 50
    return this.catalog.listProducts({
      page: 1,
      pageSize: limitNum,
      sortBy: 'viewCount',
      sortOrder: 'desc'
      // Removed featured filter to show all products sorted by view count
    });
  }

  @Get('products/analytics/recent')
  @UseGuards() // Remove authentication for public access
  async getRecentProducts(@Query('limit') limit?: number) {
    const limitNum = Math.min(parseInt(limit?.toString() || '10'), 50); // Max 50
    return this.catalog.listProducts({
      page: 1,
      pageSize: limitNum,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  }
}
