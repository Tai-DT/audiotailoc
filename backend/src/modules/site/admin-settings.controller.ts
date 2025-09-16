import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/settings-update.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Admin - Settings')
@ApiBearerAuth()
@UseGuards(JwtGuard, AdminGuard)
@Controller('admin/settings')
export class AdminSettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all site settings (admin)' })
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Patch()
  @ApiOperation({ summary: 'Update site settings' })
  async updateSettings(@Body() data: UpdateSettingsDto) {
    return this.settingsService.updateSettings(data);
  }
}
