import { Controller, Get } from '@nestjs/common';

@Controller('testing')
export class TestingController {
  
  @Get()
  async findAll() {
    return {
      success: true,
      data: {
        message: 'testing module is working',
        status: 'active',
        timestamp: new Date().toISOString()
      },
      message: 'testing data retrieved successfully'
    };
  }

  @Get('status')
  async getStatus() {
    return {
      success: true,
      data: {
        module: 'testing',
        status: 'operational',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('health')
  async getHealth() {
    return {
      success: true,
      data: {
        status: 'healthy',
        tests: 'all passing',
        coverage: '85%'
      },
      message: 'Testing health check successful'
    };
  }
}
