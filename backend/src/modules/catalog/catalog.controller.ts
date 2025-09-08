import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards, Patch, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { IsOptional } from 'class-validator';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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
  list(@Query() query: any) {
    const { page, pageSize, q, minPrice, maxPrice, sortBy, sortOrder, featured, categoryId, search } = query;
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

  @Get('products/:id')
  get(@Param('id') id: string) {
    return this.catalog.getById(id);
  }

  @Get('products/slug/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.catalog.getBySlug(slug);
  }

  // @Get('search')
  // search(@Query('q') q = '', @Query('page') page = '1', @Query('pageSize') pageSize = '20', @Query('categoryId') categoryId?: string, @Query('minPrice') minPrice?: string, @Query('maxPrice') maxPrice?: string) {
  //   // Disabled due to SearchService not available
  //   throw new Error('Search not available - SearchService disabled');
  // }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProductDto) {
    return this.catalog.create(dto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Patch('products/:id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.catalog.update(id, dto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete('products/:id')
  remove(@Param('id') id: string) {
    return this.catalog.remove(id);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete('products')
  removeMany(@Body() body: DeleteManyDto) {
    return this.catalog.removeMany(body?.ids ?? []);
  }
}
