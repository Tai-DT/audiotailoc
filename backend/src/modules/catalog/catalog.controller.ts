import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Patch,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Catalog')
@ApiBearerAuth()
@Controller('catalog/categories')
export class CatalogCategoriesController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  listCategories() {
    return this.catalog.listCategories();
  }

  @Get('slug/:slug')
  getCategoryBySlug(@Param('slug') slug: string) {
    return this.catalog.getCategoryBySlug(slug);
  }

  @Get(':slug')
  getCategory(@Param('slug') slug: string) {
    return this.catalog.getCategoryBySlug(slug);
  }

  @Get('slug/:slug/products')
  getProductsByCategory(
    @Param('slug') slug: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.catalog.getProductsByCategory(slug, { page, limit });
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post()
  createCategory(@Body() dto: CreateCategoryDto, @Request() req: any) {
    return this.catalog.createCategory(dto, req.user?.id);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Patch(':id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto, @Request() req: any) {
    return this.catalog.updateCategory(id, dto, req.user?.id);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Delete(':id')
  deleteCategory(@Param('id') id: string, @Request() req: any) {
    return this.catalog.deleteCategory(id, req.user?.id);
  }
}
