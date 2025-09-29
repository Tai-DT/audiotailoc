import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/banner-create.dto';
import { UpdateBannerDto } from './dto/banner-update.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { FilesService } from '../files/files.service';

@ApiTags('Admin - Banners')
@ApiBearerAuth()
@UseGuards(JwtGuard, AdminOrKeyGuard)
@Controller('admin/banners')
export class AdminBannersController {
  constructor(
    private readonly bannersService: BannersService,
    private readonly filesService: FilesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all banners (admin)' })
  async findAll(
    @Query('page') page?: string,
    @Query('search') search?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.bannersService.findAll({
      page,
      search,
      skip: skip ? parseInt(skip, 10) : 0,
      take: take ? parseInt(take, 10) : 20,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get banner by ID (admin)' })
  async findOne(@Param('id') id: string) {
    return this.bannersService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new banner' })
  async create(@Body() data: CreateBannerDto) {
    return this.bannersService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update banner' })
  async update(@Param('id') id: string, @Body() data: UpdateBannerDto) {
    return this.bannersService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete banner' })
  async remove(@Param('id') id: string) {
    return this.bannersService.softDelete(id);
  }

  @Patch('reorder')
  @ApiOperation({ summary: 'Reorder banners' })
  async reorder(@Body() data: { ids: string[] }) {
    return this.bannersService.reorder(data.ids);
  }

  @Post('upload-image/:bannerId')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload banner image' })
  async uploadBannerImage(
    @Param('bannerId') bannerId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No image uploaded');
    }

    const options = {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      requireImage: true,
      maxWidth: 2048,
      maxHeight: 2048,
    };

    const metadata = {
      type: 'banner_image',
      bannerId,
      uploadedAt: new Date().toISOString(),
    };

    const result = await this.filesService.uploadFile(file, options, metadata);

    // Update banner with image URL
    await this.bannersService.update(bannerId, { imageUrl: result.url });

    return result;
  }

  @Post('upload-mobile-image/:bannerId')
  @UseInterceptors(FileInterceptor('mobileImage'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        mobileImage: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload banner mobile image' })
  async uploadBannerMobileImage(
    @Param('bannerId') bannerId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No mobile image uploaded');
    }

    const options = {
      maxSize: 3 * 1024 * 1024, // 3MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      requireImage: true,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    const metadata = {
      type: 'banner_mobile_image',
      bannerId,
      uploadedAt: new Date().toISOString(),
    };

    const result = await this.filesService.uploadFile(file, options, metadata);

    // Update banner with mobile image URL
    await this.bannersService.update(bannerId, { mobileImageUrl: result.url });

    return result;
  }
}
