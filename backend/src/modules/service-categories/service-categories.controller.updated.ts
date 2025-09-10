import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Service Categories')
@Controller('service-categories')
export class ServiceCategoriesController {
  constructor() {}

  @Get()
  @ApiOperation({ summary: 'Get all service categories' })
  @ApiResponse({ status: 200, description: 'Service categories have been removed from the system.' })
  findAll() {
    // Service categories have been removed as requested
    return {
      message: 'Service categories have been removed from the system',
      data: []
    };
  }
}