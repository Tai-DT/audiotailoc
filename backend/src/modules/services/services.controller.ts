import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServiceCategory, ServiceType } from '@prisma/client';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('services')
// @UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async createService(@Body() createServiceDto: {
    name: string;
    slug: string;
    description?: string;
    category: ServiceCategory;
    type: ServiceType;
    basePriceCents: number;
    estimatedDuration: number;
    requirements?: string;
    features?: string;
    imageUrl?: string;
  }) {
    return this.servicesService.createService(createServiceDto);
  }

  @Get()
  async getServices(@Query() query: {
    category?: ServiceCategory;
    type?: ServiceType;
    isActive?: string;
    page?: string;
    pageSize?: string;
  }) {
    return this.servicesService.getServices({
      category: query.category,
      type: query.type,
      isActive: query.isActive === 'true',
      page: query.page ? parseInt(query.page) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize) : undefined,
    });
  }

  @Get('categories')
  getServiceCategories() {
    return this.servicesService.getServiceCategories();
  }

  @Get('types')
  getServiceTypes() {
    return this.servicesService.getServiceTypes();
  }

  @Get('stats')
  async getServiceStats() {
    return this.servicesService.getServiceStats();
  }

  @Get(':id')
  async getService(@Param('id') id: string) {
    return this.servicesService.getService(id);
  }

  @Get('slug/:slug')
  async getServiceBySlug(@Param('slug') slug: string) {
    return this.servicesService.getServiceBySlug(slug);
  }

  @Put(':id')
  async updateService(
    @Param('id') id: string,
    @Body() updateServiceDto: {
      name?: string;
      description?: string;
      basePriceCents?: number;
      estimatedDuration?: number;
      requirements?: string;
      features?: string;
      imageUrl?: string;
      isActive?: boolean;
    }
  ) {
    return this.servicesService.updateService(id, updateServiceDto);
  }

  @Delete(':id')
  async deleteService(@Param('id') id: string) {
    return this.servicesService.deleteService(id);
  }

  // Service Items
  @Post(':id/items')
  async addServiceItem(
    @Param('id') serviceId: string,
    @Body() createItemDto: {
      name: string;
      description?: string;
      priceCents: number;
      isRequired: boolean;
    }
  ) {
    return this.servicesService.addServiceItem(serviceId, createItemDto);
  }

  @Put('items/:itemId')
  async updateServiceItem(
    @Param('itemId') itemId: string,
    @Body() updateItemDto: {
      name?: string;
      description?: string;
      priceCents?: number;
      isRequired?: boolean;
    }
  ) {
    return this.servicesService.updateServiceItem(itemId, updateItemDto);
  }

  @Delete('items/:itemId')
  async deleteServiceItem(@Param('itemId') itemId: string) {
    return this.servicesService.deleteServiceItem(itemId);
  }
}
