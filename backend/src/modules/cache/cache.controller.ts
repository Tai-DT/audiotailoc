import { Controller, Get } from '@nestjs/common';

@Controller('cache')
export class CacheController {
  
  @Get()
  async findAll() {
    return {
      success: true,
      data: {
        message: 'cache module is working',
        status: 'active',
        timestamp: new Date().toISOString()
      },
      message: 'cache data retrieved successfully'
    };
  }

  @Get('status')
  async getStatus() {
    return {
      success: true,
      data: {
        module: 'cache',
        status: 'operational',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        hits: 0,
        misses: 0,
      },
      message: 'Cache status retrieved successfully',
    };
  }
}
