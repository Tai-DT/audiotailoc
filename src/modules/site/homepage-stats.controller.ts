import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SiteStatsService } from './homepage-stats.service';
import { CreateHomePageStatsDto, UpdateHomePageStatsDto } from './dto/homepage-stats-create.dto';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';

@Controller('homepage-stats')
export class HomePageStatsController {
  constructor(private readonly siteStatsService: SiteStatsService) {}

  @Get()
  findAll() {
    return this.siteStatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siteStatsService.findOne(id);
  }

  @Get('key/:key')
  findByKey(@Param('key') key: string) {
    return this.siteStatsService.findByKey(key);
  }

  @UseGuards(AdminOrKeyGuard)
  @Post()
  create(@Body() createHomePageStatsDto: CreateHomePageStatsDto) {
    return this.siteStatsService.create(createHomePageStatsDto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHomePageStatsDto: UpdateHomePageStatsDto) {
    return this.siteStatsService.update(id, updateHomePageStatsDto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Patch('key/:key')
  updateByKey(@Param('key') key: string, @Body() updateHomePageStatsDto: UpdateHomePageStatsDto) {
    return this.siteStatsService.updateByKey(key, updateHomePageStatsDto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.siteStatsService.remove(id);
  }
}
