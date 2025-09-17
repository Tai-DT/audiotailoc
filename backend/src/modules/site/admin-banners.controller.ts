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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/banner-create.dto';
import { UpdateBannerDto } from './dto/banner-update.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';

@ApiTags('Admin - Banners')
@ApiBearerAuth()
@UseGuards(JwtGuard, AdminOrKeyGuard)
@Controller('admin/banners')
export class AdminBannersController {
  constructor(private readonly bannersService: BannersService) {}

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
}
