import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards, Patch, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { IsIn, IsInt, IsOptional, IsString, Min, MinLength, IsBoolean, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
// import { SearchService } from '../search/search.service'; // Disabled due to module not enabled

class ListQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number;

  @IsOptional()
  @IsIn(['createdAt', 'name', 'price'])
  sortBy?: 'createdAt' | 'name' | 'price';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsInt()
  minPrice?: number;

  @IsOptional()
  @IsInt()
  maxPrice?: number;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  featured?: boolean;
}

class _AdvancedSearchDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsInt()
  minPrice?: number;

  @IsOptional()
  @IsInt()
  maxPrice?: number;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : (value ? [value] : []))
  tags?: string[];

  @IsOptional()
  @IsIn(['relevance', 'price_asc', 'price_desc', 'name_asc', 'name_desc', 'created_desc'])
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'created_desc';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : (value ? [value] : []))
  facets?: string[];
}

class CreateProductDto {
  @MinLength(1)
  @IsString()
  slug!: string;

  @MinLength(1)
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsInt()
  @Min(0)
  priceCents!: number;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;
}

class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  priceCents?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;
}

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
  list(@Query() query: ListQueryDto) {
    const { page, pageSize, q, minPrice, maxPrice, sortBy, sortOrder, featured } = query;
    return this.catalog.listProducts({ page, pageSize, q, minPrice, maxPrice, sortBy, sortOrder, featured });
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
