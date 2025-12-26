import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';

@ApiTags('Content - Settings')
@Controller('content/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all site settings (public)' })
  async getSettings() {
    return this.settingsService.getPublicSettings();
  }

  @Get(':section')
  @ApiOperation({ summary: 'Get specific section of site settings' })
  async getSection(@Param('section') section: string) {
    return this.settingsService.getPublicSection(section);
  }
}
