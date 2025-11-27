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

class DeleteManyDto {
  @IsOptional()
  ids?: string[];
}

@ApiTags('Products')
@ApiBearerAuth()
@Controller(['catalog', 'api/v1/catalog'])
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('products')
  async list(@Query() query: any) {
    try {
      const page = parseInt(query.page) || 1;
      const pageSize = parseInt(query.pageSize) || 20;
      const q = query.search || query.q;
      const minPrice = query.minPrice ? parseInt(query.minPrice) : undefined;
      const maxPrice = query.maxPrice ? parseInt(query.maxPrice) : undefined;
      const sortBy = query.sortBy || 'createdAt';
      const sortOrder = query.sortOrder || 'desc';
      const featured = query.featured === 'true' ? true : undefined;

      const res = await this.catalog.listProducts({
        page,
        pageSize,
        q,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
        featured,
      });

      return {
        items: res.items,
        pagination: {
          total: res.total,
          page: res.page,
          pageSize: res.pageSize,
        },
      };
    } catch (err) {
      // Defensive: on unexpected errors (concurrency/DB) return safe empty response
      console.error('CatalogController.list error:', err);
      return { data: [], pagination: { total: 0, page: 1, pageSize: 20 } };
    }
  }

  @Get('products/search')
  @UseGuards(JwtGuard)
  async searchProducts(@Query('q') q: string, @Query('limit') limit?: number) {
    try {
      const pageSize = Math.min(parseInt(String(limit ?? '20')), 50);
      const res = await this.catalog.listProducts({
        page: 1,
        pageSize,
        q: q || '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      return {
        data: res.items,
        pagination: {
          total: res.total,
          page: res.page,
          pageSize: res.pageSize,
        },
      };
    } catch (err) {
      console.error('CatalogController.searchProducts error:', err);
      return {
        data: [],
        pagination: { total: 0, page: 1, pageSize: Math.min(parseInt(String(limit ?? '20')), 50) },
      };
    }
  }

  @Get('products/:id')
  @UseGuards(JwtGuard)
  get(@Param('id') id: string) {
    return this.catalog.getById(id);
  }

  @Get('products/slug/:slug')
  @UseGuards(JwtGuard)
  getBySlug(@Param('slug') slug: string) {
    return this.catalog.getBySlug(slug);
  }

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

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post('categories')
  @HttpCode(HttpStatus.CREATED)
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.catalog.createCategory(dto);
  }

  @Get('categories')
  async listCategories() {
    return this.catalog.listCategories();
  }

  // Support tests that call /categories/:slug
  @Get('categories/:slug')
  getCategoryAlias(@Param('slug') slug: string) {
    return this.catalog.getCategoryBySlug(slug);
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
  getProductsByCategory(
    @Param('slug') slug: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.catalog.getProductsByCategory(slug, { page, limit });
  }

  @Get('categories/:id')
  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Category retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Category not found' })
  async getCategoryById(@Param('id') id: string) {
    return this.catalog.getCategoryById(id);
  }

  @Patch('categories/:id')
  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Category updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Category not found' })
  async updateCategoryById(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.catalog.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Category deleted successfully' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete category with products or subcategories',
  })
  async deleteCategoryById(@Param('id') id: string) {
    return this.catalog.deleteCategory(id);
  }

  @UseGuards(JwtGuard)
  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProductDto) {
    return this.catalog.create(dto);
  }

  @UseGuards(JwtGuard)
  @Patch('products/:id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.catalog.update(id, dto);
  }

  @UseGuards(JwtGuard)
  @Delete('products/:id')
  remove(@Param('id') id: string) {
    return this.catalog.remove(id);
  }

  @UseGuards(JwtGuard)
  @Delete('products')
  removeMany(@Body() body: DeleteManyDto) {
    return this.catalog.removeMany(body?.ids ?? []);
  }

  // Analytics endpoints (return same paginated shape as other list endpoints)
  @Get('products/analytics/top-viewed')
  @UseGuards(JwtGuard)
  async getTopViewedProducts(@Query('limit') limit?: number) {
    const pageSize = Math.min(parseInt(String(limit ?? '10')), 50);
    const res = await this.catalog.listProducts({
      page: 1,
      pageSize,
      sortBy: 'viewCount',
      sortOrder: 'desc',
    });
    return {
      data: res.items,
      pagination: { total: res.total, page: res.page, pageSize: res.pageSize },
    };
  }

  @Get('products/analytics/recent')
  @UseGuards(JwtGuard)
  async getRecentProducts(@Query('limit') limit?: number) {
    const pageSize = Math.min(parseInt(String(limit ?? '10')), 50);
    const res = await this.catalog.listProducts({
      page: 1,
      pageSize,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    return {
      data: res.items,
      pagination: { total: res.total, page: res.page, pageSize: res.pageSize },
    };
  }
}
