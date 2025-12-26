import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  Patch,
  Delete,
  Query,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { IsOptional } from 'class-validator';
import { JwtGuard } from '../auth/jwt.guard';
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
  constructor(
    private readonly catalog: CatalogService /* , private readonly searchService: SearchService */,
  ) {}

  /*
  @Get('products')
  @UseGuards() // Temporarily remove authentication for testing
  list(@Query() query: any) {
    const { page, pageSize, q, minPrice, maxPrice, sortBy, sortOrder, featured, search, categoryId, isActive } = query;
    return this.catalog.listProducts({
      page: parseInt(page) || 1,
      pageSize: parseInt(pageSize) || 20,
      q: search || q,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
      featured: featured === 'true' ? true : undefined,
      categoryId: categoryId || undefined,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }
  */

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

  @Get('categories/slug/:slug')
  @ApiOperation({
    summary: 'Get category by slug',
    description: 'Get detailed category information by slug',
  })
  @ApiParam({
    name: 'slug',
    description: 'Category slug',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  getCategoryBySlug(@Param('slug') slug: string) {
    return this.catalog.getCategoryBySlug(slug);
  }

  @Get('categories/slug/:slug/products')
  @ApiOperation({
    summary: 'Get products by category slug',
    description: 'Get paginated products for a specific category',
  })
  @ApiParam({
    name: 'slug',
    description: 'Category slug',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  getProductsByCategory(
    @Param('slug') slug: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.catalog.getProductsByCategory(slug, { page, limit });
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post('categories')
  @HttpCode(HttpStatus.CREATED)
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.catalog.createCategory(dto);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.catalog.updateCategory(id, dto);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.catalog.deleteCategory(id);
  }

  /*
  @Get('products/search')
  @UseGuards()
  searchProducts(@Query('q') q: string, @Query('limit') limit?: number) {
    const limitNum = Math.min(parseInt(limit?.toString() || '20'), 50);
    return this.catalog.listProducts({
      page: 1,
      pageSize: limitNum,
      q: q || '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  }
  */

  /*
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
  */

  @Get('products/check-sku/:sku')
  @UseGuards(JwtGuard, AdminOrKeyGuard)
  async checkSkuExists(@Param('sku') sku: string, @Query('excludeId') excludeId?: string) {
    return this.catalog.checkSkuExists(sku, excludeId);
  }

  @Get('generate-sku')
  @UseGuards(JwtGuard, AdminOrKeyGuard)
  async generateUniqueSku(@Query('baseName') baseName?: string) {
    return this.catalog.generateUniqueSku(baseName);
  }

  // @Get('search')
  // search(@Query('q') q = '', @Query('page') page = '1', @Query('pageSize') pageSize = '20', @Query('categoryId') categoryId?: string, @Query('minPrice') minPrice?: string, @Query('maxPrice') maxPrice?: string) {
  //   // Disabled due to SearchService not available
  //   throw new Error('Search not available - SearchService disabled');
  // }

  /*
  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProductDto) {
    return this.catalog.create(dto);
  }
  */

  /*
  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Patch('products/:id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.catalog.update(id, dto);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Delete('products/:id')
  remove(@Param('id') id: string) {
    return this.catalog.remove(id);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Delete('products')
  removeMany(@Body() body: DeleteManyDto) {
    return this.catalog.removeMany(body?.ids ?? []);
  }
  */

  /*
  // Analytics endpoints (public access for frontend)
  @Get('products/analytics/top-viewed')
  @UseGuards() // Remove authentication for public access
  async getTopViewedProducts(@Query('limit') limit?: number) {
    try {
      const limitNum = Math.min(parseInt(limit?.toString() || '10'), 50); // Max 50
      return await this.catalog.listProducts({
        page: 1,
        pageSize: limitNum,
        sortBy: 'viewCount',
        sortOrder: 'desc'
        // Removed featured filter to show all products sorted by view count
      });
    } catch (error) {
      console.error('Error fetching top-viewed products:', error);
      // Return empty result instead of throwing 500
      return {
        items: [],
        total: 0,
        page: 1,
        pageSize: Math.min(parseInt(limit?.toString() || '10'), 50),
      };
    }
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
  */
}
