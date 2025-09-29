import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BannersService } from './banners.service';

@ApiTags('Content - Banners')
@Controller('content/banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  @ApiOperation({ summary: 'Get banners (public)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page name (home, about, etc.)' })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  async findAll(
    @Query('page') page?: string,
    @Query('active') active?: string,
    @Query('search') search?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.bannersService.findAll({
      page,
      isActive: active === 'true' ? true : active === 'false' ? false : undefined,
      search,
      skip: skip ? parseInt(skip, 10) : 0,
      take: take ? parseInt(take, 10) : 20,
    });
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active banners only' })
  @ApiQuery({ name: 'page', required: false })
  async getActive(@Query('page') page?: string) {
    return this.bannersService.getActiveBanners(page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get banner by ID' })
  async findOne(@Param('id') id: string) {
    return this.bannersService.findById(id);
  }
}
