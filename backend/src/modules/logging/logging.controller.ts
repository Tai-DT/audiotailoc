import { Controller, Get } from '@nestjs/common';

@Controller('logging')
export class LoggingController {
  
  @Get()
  async findAll() {
    return {
      success: true,
      data: {
        message: 'logging module is working',
        status: 'active',
        timestamp: new Date().toISOString()
      },
      message: 'logging data retrieved successfully'
    };
  }

  @Get('status')
  async getStatus() {
    return {
      success: true,
      data: {
        module: 'logging',
        status: 'operational',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    };
  }
}
