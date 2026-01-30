import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  async getCategories(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
    @Query('parentId') parentId?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.categoriesService.findAll({
      page: Number(page),
      pageSize: Number(pageSize),
      parentId,
      isActive: isActive === 'true',
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  async getCategory(@Param('id') id: string) {
    return this.categoriesService.findById(id);
  }

  @Post()
  @UseGuards(AdminOrKeyGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new category' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({ summary: 'Update category' })
  async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Patch(':id/status/:status')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({ summary: 'Update category status' })
  async updateCategoryStatus(@Param('id') id: string, @Param('status') status: 'true' | 'false') {
    return this.categoriesService.updateStatus(id, status === 'true');
  }

  @Delete(':id')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({ summary: 'Delete category' })
  async deleteCategory(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }

  @Get('parent/:parentId')
  @ApiOperation({ summary: 'Get subcategories by parent ID' })
  async getSubcategories(@Param('parentId') parentId: string) {
    return this.categoriesService.findByParentId(parentId);
  }
}
