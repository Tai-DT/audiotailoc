import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/settings-update.dto';

@ApiTags('Content - Settings')
@Controller('content/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all site settings (public)' })
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Get(':section')
  @ApiOperation({ summary: 'Get specific section of site settings' })
  async getSection(@Param('section') section: string) {
    return this.settingsService.getSection(section);
  }

  @Post()
  @ApiOperation({ summary: 'Update site settings' })
  async updateSettings(@Body() data: UpdateSettingsDto) {
    return this.settingsService.updateSettings(data);
  }

  @Post('test-email')
  @ApiOperation({ summary: 'Send a test email' })
  async sendTestEmail(@Body() body: { email: string; config?: any }) {
    return this.settingsService.sendTestEmail(body.email, body.config);
  }
}
