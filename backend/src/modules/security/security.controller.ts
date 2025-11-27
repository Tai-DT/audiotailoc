import { Controller, Get } from '@nestjs/common';

@Controller('security')
export class SecurityController {
  @Get()
  async findAll() {
    return {
      success: true,
      data: {
        message: 'security module is working',
        status: 'active',
        timestamp: new Date().toISOString(),
      },
      message: 'security data retrieved successfully',
    };
  }

  @Get('status')
  async getStatus() {
    return {
      success: true,
      data: {
        module: 'security',
        status: 'operational',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
    };
  }
}
