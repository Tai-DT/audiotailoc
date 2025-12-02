import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SiteStatsService } from './site-stats.service';

@ApiTags('Site Stats')
@Controller()
export class SiteStatsController {
  constructor(private readonly siteStatsService: SiteStatsService) {}

  @Get('homepage-stats')
  @ApiOperation({ summary: 'Get homepage statistics' })
  @ApiResponse({
    status: 200,
    description: 'Homepage statistics retrieved successfully',
  })
  async getHomepageStats() {
    return this.siteStatsService.getHomepageStats();
  }
}