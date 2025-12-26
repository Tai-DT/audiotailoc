import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

/**
 * Simple Settings Controller
 * 
 * ⚠️ NOTE: This is a placeholder controller for future implementation.
 * All endpoints are currently protected with AdminOrKeyGuard to prevent
 * unauthorized access even if implementation is added later.
 */
@Controller('simple-settings')
@UseGuards(AdminOrKeyGuard)
@ApiBearerAuth()
export class SimpleSettingsController {
  @Get()
  findAll() {
    return { message: 'Simple settings endpoint - to be implemented' };
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return { message: `Simple setting for key: ${key} - to be implemented` };
  }

  @Post()
  create(@Body() _createSimpleSettingDto: any) {
    return { message: 'Create simple setting - to be implemented' };
  }

  @Patch(':key')
  update(@Param('key') key: string, @Body() _updateSimpleSettingDto: any) {
    return { message: `Update simple setting for key: ${key} - to be implemented` };
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return { message: `Remove simple setting for key: ${key} - to be implemented` };
  }
}
