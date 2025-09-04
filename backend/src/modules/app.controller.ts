import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  root() {
    return { name: 'audiotailoc-backend', version: '0.1.0' };
  }

  @Get('/test')
  test() {
    return {
      success: true,
      message: 'Backend is working!',
      timestamp: new Date().toISOString()
    };
  }

  @Get('/admin/stats')
  async getAdminStats() {
    return {
      success: true,
      data: {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        overview: {
          totalUsers: 0,
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
          newUsers: 0,
          newOrders: 0,
          pendingOrders: 0,
          lowStockProducts: 0
        },
        recentActivities: {
          orders: [],
          users: []
        }
      }
    };
  }
}


