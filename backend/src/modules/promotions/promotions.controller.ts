import { Controller, Get } from '@nestjs/common';

@Controller('promotions')
export class PromotionsController {
  @Get()
  async getPromotions() {
    return {
      success: true,
      data: {
        promotions: [],
        total: 0,
        timestamp: new Date().toISOString(),
      },
      message: 'Promotions retrieved successfully',
    };
  }

  @Get('status')
  async getStatus() {
    return {
      success: true,
      data: {
        module: 'promotions',
        status: 'operational',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
    };
  }
}
