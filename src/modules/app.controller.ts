import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  root() {
    return { name: 'audiotailoc-backend', version: '0.1.0' };
  }

  @Get('analytics/dashboard')
  getDashboardAnalytics() {
    return {
      success: true,
      data: {
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        revenueGrowth: 0,
        ordersGrowth: 0,
        usersGrowth: 0,
        productsGrowth: 0,
        recentOrders: [],
        topProducts: [],
        salesChart: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [0, 0, 0, 0, 0, 0]
        },
        userChart: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [0, 0, 0, 0, 0, 0]
        }
      },
      message: 'Analytics data retrieved successfully'
    };
  }

  @Get('analytics/revenue')
  getRevenueAnalytics() {
    return {
      success: true,
      data: {
        totalRevenue: 0,
        revenueGrowth: 0,
        monthlyRevenue: [],
        dailyRevenue: []
      },
      message: 'Revenue analytics retrieved successfully'
    };
  }

  @Get('analytics/orders')
  getOrderAnalytics() {
    return {
      success: true,
      data: {
        totalOrders: 0,
        ordersGrowth: 0,
        ordersByStatus: {},
        monthlyOrders: [],
        dailyOrders: []
      },
      message: 'Order analytics retrieved successfully'
    };
  }

  @Get('analytics/users')
  getUserAnalytics() {
    return {
      success: true,
      data: {
        totalUsers: 0,
        usersGrowth: 0,
        activeUsers: 0,
        newUsers: 0,
        monthlyUsers: [],
        dailyUsers: []
      },
      message: 'User analytics retrieved successfully'
    };
  }

  @Get('analytics/products')
  getProductAnalytics() {
    return {
      success: true,
      data: {
        totalProducts: 0,
        productsGrowth: 0,
        topProducts: [],
        categoryDistribution: {},
        monthlyProducts: [],
        dailyProducts: []
      },
      message: 'Product analytics retrieved successfully'
    };
  }
}


