import { Controller, Get } from '@nestjs/common';

@Controller('promotions')
export class PromotionsController {
  
  @Get()
  async findAll() {
    return {
      success: true,
      data: {
        message: 'promotions module is working',
        status: 'active',
        timestamp: new Date().toISOString()
      },
      message: 'promotions data retrieved successfully'
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
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get()
  async getPromotions() {
    return {
      success: true,
      data: {
        promotions: [],
        total: 0
      },
      message: 'Promotions retrieved successfully'
    };
  }

  @Get()
  async getPromotions() {
    return {
      success: true,
      data: {
        promotions: [],
        total: 0
      },
      message: 'Promotions retrieved successfully'
    };
  }
}
