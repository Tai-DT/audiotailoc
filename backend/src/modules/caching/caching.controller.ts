import { Controller, Get } from '@nestjs/common';

@Controller('caching')
export class CachingController {
  
  @Get()
  async findAll() {
    return {
      success: true,
      data: {
        message: 'caching module is working',
        status: 'active',
        timestamp: new Date().toISOString()
      },
      message: 'caching data retrieved successfully'
    };
  }

  @Get('status')
  async getStatus() {
    return {
      success: true,
      data: {
        module: 'caching',
        status: 'operational',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    };
  }
}
