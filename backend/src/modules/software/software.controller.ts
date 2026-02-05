import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SoftwareService } from './software.service';
import { CreateSoftwareDto } from './dto/create-software.dto';
import { UpdateSoftwareDto } from './dto/update-software.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';

@ApiTags('Software')
@ApiBearerAuth()
@Controller('software')
export class SoftwareController {
  constructor(private readonly software: SoftwareService) {}

  // Admin routes (must be before dynamic :id routes)
  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Get('admin/list')
  listAdmin(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.software.listAdmin({ page, limit });
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Get('admin/:id')
  getById(@Param('id') id: string) {
    return this.software.getById(id);
  }

  @UseGuards(JwtGuard)
  @Get('my-downloads')
  listMyDownloads(@Request() req: any) {
    return this.software.listMyDownloads(req.user?.id);
  }

  @Get()
  listPublic(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('platform') platform?: string,
  ) {
    return this.software.listPublic({ page, limit, category, platform });
  }

  @Get('slug/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.software.getBySlug(slug);
  }

  @Get(':id/public-download')
  getPublicDownload(@Param('id') id: string) {
    return this.software.getPublicDownload(id);
  }

  @UseGuards(JwtGuard)
  @Get(':id/download')
  getDownload(@Param('id') id: string, @Request() req: any) {
    return this.software.getDownloadForUser(id, req.user?.id);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post()
  create(@Body() dto: CreateSoftwareDto) {
    return this.software.create(dto);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSoftwareDto) {
    return this.software.update(id, dto);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.software.remove(id);
  }
}
