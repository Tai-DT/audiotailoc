import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards, Patch, Delete } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { IsIn, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { SearchService } from '../search/search.service';

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
  @IsIn(['createdAt', 'name', 'priceCents'])
  sortBy?: 'createdAt' | 'name' | 'priceCents';

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
  slug?: string;

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
  slugs?: string[];
}

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalog: CatalogService, private readonly searchService: SearchService) {}

  @Get('products')
  list(@Query() query: ListQueryDto) {
    const { page, pageSize, q, minPrice, maxPrice, sortBy, sortOrder } = query;
    return this.catalog.listProducts({ page, pageSize, q, minPrice, maxPrice, sortBy, sortOrder });
  }

  @Get('categories')
  listCategories() {
    return this.catalog.listCategories();
  }

  @Get('products/:slug')
  get(@Param('slug') slug: string) {
    return this.catalog.getBySlug(slug);
  }

  @Get('search')
  search(@Query('q') q = '', @Query('page') page = '1', @Query('pageSize') pageSize = '20', @Query('categoryId') categoryId?: string, @Query('minPrice') minPrice?: string, @Query('maxPrice') maxPrice?: string) {
    const p = Math.max(1, parseInt(String(page), 10) || 1);
    const ps = Math.min(100, Math.max(1, parseInt(String(pageSize), 10) || 20));
    const min = typeof minPrice === 'string' ? Number(minPrice) : undefined;
    const max = typeof maxPrice === 'string' ? Number(maxPrice) : undefined;
    return this.searchService.search(q, p, ps, { categoryId: categoryId || undefined, minPrice: isNaN(min as any) ? undefined : min, maxPrice: isNaN(max as any) ? undefined : max });
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProductDto) {
    return this.catalog.create(dto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Patch('products/:slug')
  update(@Param('slug') slug: string, @Body() dto: UpdateProductDto) {
    return this.catalog.update(slug, dto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete('products/:slug')
  remove(@Param('slug') slug: string) {
    return this.catalog.remove(slug);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete('products')
  removeMany(@Body() body: DeleteManyDto) {
    return this.catalog.removeMany(body?.slugs ?? []);
  }
}
