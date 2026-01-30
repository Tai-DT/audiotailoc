import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import {
  CreateServiceTypeDto,
  UpdateServiceTypeDto,
  CreateServiceDto,
  UpdateServiceDto,
} from './dto/service.dto';

@ApiTags('Services Management')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // Service Types (formerly Categories)
  @Get('types')
  @ApiOperation({ summary: 'Get all service types' })
  @ApiResponse({ status: 200, description: 'List of service types' })
  async getServiceTypes() {
    return this.servicesService.findAllServiceTypes();
  }

  @Get('types/:id')
  @ApiOperation({ summary: 'Get service type by ID' })
  @ApiParam({ name: 'id', description: 'Service Type ID' })
  @ApiResponse({ status: 200, description: 'Service type details' })
  @ApiResponse({ status: 404, description: 'Service type not found' })
  async getServiceType(@Param('id') id: string) {
    return this.servicesService.findServiceTypeById(id);
  }

  @Post('types')
  @ApiOperation({ summary: 'Create new service type' })
  @ApiResponse({ status: 201, description: 'Service type created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Service type slug already exists' })
  async createServiceType(@Body() dto: CreateServiceTypeDto) {
    return this.servicesService.createServiceType(dto);
  }

  @Put('types/:id')
  @ApiOperation({ summary: 'Update service type' })
  @ApiParam({ name: 'id', description: 'Service Type ID' })
  @ApiResponse({ status: 200, description: 'Service type updated successfully' })
  @ApiResponse({ status: 404, description: 'Service type not found' })
  @ApiResponse({ status: 409, description: 'Service type slug already exists' })
  async updateServiceType(@Param('id') id: string, @Body() dto: UpdateServiceTypeDto) {
    return this.servicesService.updateServiceType(id, dto);
  }

  @Delete('types/:id')
  @ApiOperation({ summary: 'Delete service type' })
  @ApiParam({ name: 'id', description: 'Service Type ID' })
  @ApiResponse({ status: 200, description: 'Service type deleted successfully' })
  @ApiResponse({ status: 404, description: 'Service type not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete service type with services' })
  async deleteServiceType(@Param('id') id: string) {
    return this.servicesService.deleteServiceType(id);
  }

  // Services
  @Get()
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({ status: 200, description: 'List of services' })
  async getServices() {
    return this.servicesService.findAllServices();
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured services' })
  @ApiResponse({ status: 200, description: 'List of featured services' })
  async getFeaturedServices() {
    return this.servicesService.getFeaturedServices();
  }

  @Get('by-type/:typeId')
  @ApiOperation({ summary: 'Get services by type' })
  @ApiParam({ name: 'typeId', description: 'Service Type ID' })
  @ApiResponse({ status: 200, description: 'List of services for the type' })
  async getServicesByType(@Param('typeId') typeId: string) {
    return this.servicesService.getServicesByType(typeId);
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
  @ApiResponse({ status: 409, description: 'Service slug already exists' })
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

  @Put(':id/view')
  @ApiOperation({ summary: 'Increment service view count' })
  @ApiParam({ name: 'id', description: 'Service ID' })
  @ApiResponse({ status: 200, description: 'View count incremented' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async incrementViewCount(@Param('id') id: string) {
    return this.servicesService.incrementViewCount(id);
  }
}
