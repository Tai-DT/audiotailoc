import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ServiceTypesService } from './service-types.service';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';

@ApiTags('Service Types')
@Controller('service-types')
export class ServiceTypesController {
  constructor(private readonly serviceTypesService: ServiceTypesService) {
  }
  @Post()
  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new service type' })
  @ApiResponse({ status: 201, description: 'The service type has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin access required.' })
  create(@Body() createServiceTypeDto: CreateServiceTypeDto) {
    console.log('[ServiceTypesController] Creating service type:', createServiceTypeDto);
    return this.serviceTypesService.create(createServiceTypeDto);
  }

  @Post('test')
  @ApiOperation({ summary: 'Test create service type without auth' })
  testCreate(@Body() createServiceTypeDto: CreateServiceTypeDto) {
    console.log('[ServiceTypesController] Test creating service type:', createServiceTypeDto);
    return this.serviceTypesService.create(createServiceTypeDto);
  }

  @Get('debug')
  @ApiOperation({ summary: 'Debug endpoint to test service' })
  debug() {
    console.log('[ServiceTypesController] Debug endpoint called');
    return { message: 'Debug endpoint working', timestamp: new Date().toISOString() };
  }

  @Get('test-endpoint')
  @ApiOperation({ summary: 'Test endpoint' })
  testEndpoint() {
    console.log('[ServiceTypesController] Test endpoint called');
    return { message: 'Test endpoint working', timestamp: new Date().toISOString() };
  }

  @Get('simple-test')
  @ApiOperation({ summary: 'Simple test endpoint' })
  simpleTest() {
    console.log('[ServiceTypesController] Simple test called');
    return { status: 'ok', message: 'Simple test working' };
  }

  @Get()
  @ApiOperation({ summary: 'Get all active service types' })
  @ApiResponse({ status: 200, description: 'Return all active service types.' })
  findAll() {
    console.log('[ServiceTypesController] GET /service-types called');
    console.log('[ServiceTypesController] About to call service.findAll()');
    return this.serviceTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service type by ID' })
  @ApiResponse({ status: 200, description: 'Return the service type.' })
  @ApiResponse({ status: 404, description: 'Service type not found.' })
  findOne(@Param('id') id: string) {
    return this.serviceTypesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a service type' })
  @ApiResponse({ status: 200, description: 'The service type has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Service type or category not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin access required.' })
  update(
    @Param('id') id: string,
    @Body() updateServiceTypeDto: UpdateServiceTypeDto,
  ) {
    console.log(`[ServiceTypesController] PATCH /service-types/${id} - Data:`, updateServiceTypeDto);
    return this.serviceTypesService.update(id, updateServiceTypeDto);
  }

  @Delete(':id')
  @UseGuards(AdminOrKeyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a service type' })
  @ApiResponse({ status: 200, description: 'The service type has been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Cannot delete type in use.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin access required.' })
  @ApiResponse({ status: 404, description: 'Service type not found.' })
  remove(@Param('id') id: string) {
    console.log(`[ServiceTypesController] DELETE /service-types/${id}`);
    return this.serviceTypesService.remove(id);
  }
}
