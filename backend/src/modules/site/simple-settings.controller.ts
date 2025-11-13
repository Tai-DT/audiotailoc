import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

@Controller('simple-settings')
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
