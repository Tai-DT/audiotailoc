import { Controller, Get, Put, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { SettingsService } from './settings.service';

@ApiTags('settings')
@Controller('settings')
@UseGuards(JwtGuard, AdminOrKeyGuard)
@ApiBearerAuth()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all settings' })
  async findAll() {
    return this.settingsService.findAll();
  }

  @Post('test-email')
  @ApiOperation({ summary: 'Send a test email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'test@example.com' },
        config: {
          type: 'object',
          properties: {
            host: { type: 'string' },
            port: { type: 'number' },
            user: { type: 'string' },
            pass: { type: 'string' },
            from: { type: 'string' },
          },
        },
      },
      required: ['email'],
    },
  })
  async sendTestEmail(@Body() body: { email: string; config?: any }) {
    return this.settingsService.sendTestEmail(body.email, body.config);
  }

  @Put()
  @ApiOperation({ summary: 'Update settings' })
  async update(@Body() settings: any) {
    return this.settingsService.update(settings);
  }
}
