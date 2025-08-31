import { Controller, Get } from '@nestjs/common';

@Controller('integrations')
export class IntegrationsController {
  
  @Get()
  async findAll() {
    return {
      success: true,
      data: {
        message: 'integrations module is working',
        status: 'active',
        timestamp: new Date().toISOString()
      },
      message: 'integrations data retrieved successfully'
    };
  }

  @Get('status')
  async getStatus() {
    return {
      success: true,
      data: {
        module: 'integrations',
        status: 'operational',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    };
  }
}
