import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ServicesService } from './services.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
// import { CreateServiceItemDto } from './dto/create-service-item.dto';

@Controller('services')
// @UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async createService(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.createService(createServiceDto);
  }

  @Get()
  async getServices(@Query() query: {
    categoryId?: string;
    typeId?: string;
    isActive?: string;
    page?: string;
    pageSize?: string;
  }) {
    console.log('[DEBUG] ServicesController.getServices called with query:', query);
    const result = await this.servicesService.getServices({
      categoryId: query.categoryId,
      typeId: query.typeId,
      isActive: query.isActive !== undefined ? query.isActive === 'true' : undefined,
      page: query.page ? parseInt(query.page) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize) : undefined,
    });

    console.log('[DEBUG] ServicesController.getServices result:', result);

    return {
      items: result.services,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: Math.ceil(result.total / result.pageSize),
      hasNext: result.page < Math.ceil(result.total / result.pageSize),
      hasPrev: result.page > 1,
    };
  }

  // Service categories have been removed from the system

  @Get('types')
  getServiceTypes() {
    return this.servicesService.getServiceTypes();
  }

  @Get('types/:id')
  async getServiceType(@Param('id') id: string) {
    return this.servicesService.getServiceType(id);
  }

  @Post('types')
  async createServiceType(@Body() data: { name: string; slug?: string; description?: string; isActive?: boolean }) {
    return this.servicesService.createServiceType(data);
  }

  @Put('types/:id')
  async updateServiceType(
    @Param('id') id: string,
    @Body() data: { name?: string; slug?: string; description?: string; isActive?: boolean; sortOrder?: number }
  ) {
    return this.servicesService.updateServiceType(id, data);
  }

  @Delete('types/:id')
  async deleteServiceType(@Param('id') id: string) {
    return this.servicesService.deleteServiceType(id);
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
    @Body() updateServiceDto: UpdateServiceDto
  ) {
    return this.servicesService.updateService(id, updateServiceDto);
  }

  @Delete(':id')
  async deleteService(@Param('id') id: string) {
    return this.servicesService.deleteService(id);
  }

  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/services',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}$_$_${file.originalname}`);
        },
      }),
    }),
  )
  async uploadServiceImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.servicesService.updateServiceImage(id, file.path);
  }

  // Service Items
  @Post(':id/items')
  async addServiceItem(
    @Param('id') serviceId: string,
    @Body() createItemDto: {
      name: string;
      priceCents: number;
    }
  ) {
    return this.servicesService.addServiceItem(serviceId, {
      name: createItemDto.name,
      priceCents: createItemDto.priceCents,
    });
  }

  @Put('items/:itemId')
  async updateServiceItem(
    @Param('itemId') itemId: string,
    @Body() updateItemDto: {
      name?: string;
      priceCents?: number;
    }
  ) {
    return this.servicesService.updateServiceItem(itemId, {
      name: updateItemDto.name,
      priceCents: updateItemDto.priceCents,
    });
  }

  @Delete('items/:itemId')
  async deleteServiceItem(@Param('itemId') itemId: string) {
    return this.servicesService.deleteServiceItem(itemId);
  }
}
