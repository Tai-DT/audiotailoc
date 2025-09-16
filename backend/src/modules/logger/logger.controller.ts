import { Controller, Get } from '@nestjs/common';

@Controller('logger')
export class LoggerController {
  
  @Get()
  async findAll() {
    return {
      success: true,
      data: {
        message: 'logger module is working',
        status: 'active',
        timestamp: new Date().toISOString()
      },
      message: 'logger data retrieved successfully'
    };
  }

  @Get('status')
  async getStatus() {
    return {
      success: true,
      data: {
        module: 'logger',
        status: 'operational',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    };
  }
}
