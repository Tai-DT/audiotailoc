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
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Catalog')
@ApiBearerAuth()
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('products')
  @ApiOperation({ summary: 'List all products' })
  list(@Query() query: any) {
    return this.catalog.listProducts(query);
  }

  @Get('products/:id')
  get(@Param('id') id: string) {
    return this.catalog.getById(id);
  }

  @Get('products/slug/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.catalog.getBySlug(slug);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProductDto, @Request() req: any) {
    return this.catalog.create(dto, req.user?.id);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto, @Request() req: any) {
    return this.catalog.update(id, dto, req.user?.id);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Delete('products/:id')
  deleteProduct(@Param('id') id: string, @Request() req: any) {
    return this.catalog.delete(id, req.user?.id);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post('products/delete-many')
  deleteMany(@Body('ids') ids: string[], @Request() req: any) {
    return this.catalog.removeMany(ids, req.user?.id);
  }

  // --- CATEGORIES ---

  @Get('categories')
  listCategories() {
    return this.catalog.listCategories();
  }

  @Get('categories/slug/:slug')
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

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto, @Request() req: any) {
    return this.catalog.createCategory(dto, req.user?.id);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto, @Request() req: any) {
    return this.catalog.updateCategory(id, dto, req.user?.id);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string, @Request() req: any) {
    return this.catalog.deleteCategory(id, req.user?.id);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Get('products/check-sku/:sku')
  checkSkuExists(@Param('sku') sku: string, @Query('excludeId') excludeId?: string) {
    return this.catalog.checkSkuExists(sku, excludeId);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Get('generate-sku')
  generateUniqueSku(@Query('baseName') baseName?: string) {
    return this.catalog.generateUniqueSku(baseName);
  }
}
