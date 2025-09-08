import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import {
  CreateServiceCategoryDto,
  UpdateServiceCategoryDto,
  CreateServiceTypeDto,
  UpdateServiceTypeDto,
  CreateServiceDto,
  UpdateServiceDto
} from './dto/service.dto';

@ApiTags('Services Management')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // Service Categories
  @Get('categories')
  @ApiOperation({ summary: 'Get all service categories' })
  @ApiResponse({ status: 200, description: 'List of service categories' })
  async getCategories() {
    return this.servicesService.findAllCategories();
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get service category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Service category details' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategory(@Param('id') id: string) {
    return this.servicesService.findCategoryById(id);
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create new service category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Category slug already exists' })
  async createCategory(@Body() dto: CreateServiceCategoryDto) {
    return this.servicesService.createCategory(dto);
  }

  @Put('categories/:id')
  @ApiOperation({ summary: 'Update service category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateServiceCategoryDto) {
    return this.servicesService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete service category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete category with existing services or types' })
  async deleteCategory(@Param('id') id: string) {
    return this.servicesService.deleteCategory(id);
  }

  // Service Types
  @Get('types')
  @ApiOperation({ summary: 'Get all service types' })
  @ApiResponse({ status: 200, description: 'List of service types' })
  async getTypes() {
    return this.servicesService.findAllTypes();
  }

  @Get('types/:id')
  @ApiOperation({ summary: 'Get service type by ID' })
  @ApiParam({ name: 'id', description: 'Type ID' })
  @ApiResponse({ status: 200, description: 'Service type details' })
  @ApiResponse({ status: 404, description: 'Type not found' })
  async getType(@Param('id') id: string) {
    return this.servicesService.findTypeById(id);
  }

  @Post('types')
  @ApiOperation({ summary: 'Create new service type' })
  @ApiResponse({ status: 201, description: 'Type created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Type slug already exists' })
  async createType(@Body() dto: CreateServiceTypeDto) {
    return this.servicesService.createType(dto);
  }

  @Put('types/:id')
  @ApiOperation({ summary: 'Update service type' })
  @ApiParam({ name: 'id', description: 'Type ID' })
  @ApiResponse({ status: 200, description: 'Type updated successfully' })
  @ApiResponse({ status: 404, description: 'Type not found' })
  async updateType(@Param('id') id: string, @Body() dto: UpdateServiceTypeDto) {
    return this.servicesService.updateType(id, dto);
  }

  @Delete('types/:id')
  @ApiOperation({ summary: 'Delete service type' })
  @ApiParam({ name: 'id', description: 'Type ID' })
  @ApiResponse({ status: 200, description: 'Type deleted successfully' })
  @ApiResponse({ status: 404, description: 'Type not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete type with existing services' })
  async deleteType(@Param('id') id: string) {
    return this.servicesService.deleteType(id);
  }

  // Services
  @Get()
  @ApiOperation({ summary: 'Get all services' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID' })
  @ApiQuery({ name: 'typeId', required: false, description: 'Filter by type ID' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
  @ApiQuery({ name: 'isFeatured', required: false, description: 'Filter by featured status' })
  @ApiResponse({ status: 200, description: 'List of services' })
  async getServices(
    @Query('categoryId') categoryId?: string,
    @Query('typeId') typeId?: string,
    @Query('isActive') isActive?: string,
    @Query('isFeatured') isFeatured?: string
  ) {
    const where: any = {};

    if (categoryId) where.categoryId = categoryId;
    if (typeId) where.typeId = typeId;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';

    return this.servicesService.findAllServices(where);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiParam({ name: 'id', description: 'Service ID' })
  @ApiResponse({ status: 200, description: 'Service details' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async getService(@Param('id') id: string) {
    return this.servicesService.findServiceById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new service' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Service slug already exists' })
  async createService(@Body() dto: CreateServiceDto) {
    return this.servicesService.createService(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update service' })
  @ApiParam({ name: 'id', description: 'Service ID' })
  @ApiResponse({ status: 200, description: 'Service updated successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async updateService(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.updateService(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete service' })
  @ApiParam({ name: 'id', description: 'Service ID' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete service with active bookings' })
  async deleteService(@Param('id') id: string) {
    return this.servicesService.deleteService(id);
  }
}
