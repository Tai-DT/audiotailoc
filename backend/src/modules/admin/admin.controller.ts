import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

class AdminDashboardDto {
  startDate?: string;
  endDate?: string;
}

class BulkActionDto {
  action!: 'delete' | 'activate' | 'deactivate' | 'export';
  ids!: string[];
  type!: 'users' | 'products' | 'orders';
}

@ApiTags('Admin Dashboard')
@Controller('admin')
// @UseGuards(AdminOrKeyGuard)
// @ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  @Get('test-simple')
  @ApiOperation({ summary: 'Simple test endpoint' })
  @ApiResponse({ status: 200, description: 'Test successful' })
  simpleTest() {
    return {
      success: true,
      message: 'Admin module is working!',
      timestamp: new Date().toISOString()
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard stats' })
  @ApiResponse({ status: 200, description: 'Dashboard stats retrieved' })
  async getDashboardStats() {
    try {
      const [totalUsers, totalProducts, totalOrders] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.product.count(),
        this.prisma.order.count(),
      ]);

      // Calculate revenue from orders
      const revenueResult = await this.prisma.order.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalCents: true }
      });
      const totalRevenue = revenueResult._sum.totalCents || 0;

      return {
        success: true,
        data: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue,
          overview: {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
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
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        message: 'Failed to fetch dashboard stats',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard overview' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved' })
  async getDashboard(@Query() query: AdminDashboardDto) {
    const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = query.endDate ? new Date(query.endDate) : new Date();

    // Get all stats in one go
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      newUsers,
      newOrders,
      pendingOrders
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalCents: true }
      }),
      this.prisma.user.count({
        where: { createdAt: { gte: startDate, lte: endDate } }
      }),
      this.prisma.order.count({
        where: { createdAt: { gte: startDate, lte: endDate } }
      }),
      this.prisma.order.count({
        where: { status: 'PENDING' }
      })
    ]);

    // Get recent activities
    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } }
      }
    });

    const recentUsers = await this.prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    return {
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue: totalRevenue._sum.totalCents || 0,
          newUsers,
          newOrders,
          pendingOrders,
          lowStockProducts: 0 // Inventory not implemented yet
        },
        recentActivities: {
          orders: recentOrders,
          users: recentUsers
        },
        period: {
          startDate,
          endDate
        }
      }
    };
  }

  @Get('stats/users')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({ status: 200, description: 'User statistics' })
  async getUserStats(@Query('days') days = '30') {
    const daysAgo = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
    
    const [
      totalUsers,
      activeUsers,
      newUsers,
      usersByRole
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: { updatedAt: { gte: daysAgo } }
      }),
      this.prisma.user.count({
        where: { createdAt: { gte: daysAgo } }
      }),
      this.prisma.user.groupBy({
        by: ['role'],
        _count: { role: true }
      })
    ]);

    return {
      success: true,
      data: {
        totalUsers,
        activeUsers,
        newUsers,
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item.role] = item._count.role;
          return acc;
        }, {} as Record<string, number>)
      }
    };
  }

  @Get('stats/orders')
  @ApiOperation({ summary: 'Get order statistics' })
  @ApiResponse({ status: 200, description: 'Order statistics' })
  async getOrderStats(@Query('days') days = '30') {
    const daysAgo = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
    
    const [
      totalOrders,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      totalRevenue,
      ordersByStatus
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({
        where: { status: 'COMPLETED' }
      }),
      this.prisma.order.count({
        where: { status: 'PENDING' }
      }),
      this.prisma.order.count({
        where: { status: 'CANCELED' }
      }),
      this.prisma.order.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalCents: true }
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        _count: { status: true }
      })
    ]);

    return {
      success: true,
      data: {
        totalOrders,
        completedOrders,
        pendingOrders,
        cancelledOrders,
        totalRevenue: totalRevenue._sum.totalCents || 0,
        ordersByStatus: ordersByStatus.reduce((acc, item) => {
          acc[item.status] = item._count.status;
          return acc;
        }, {} as Record<string, number>)
      }
    };
  }

  @Get('stats/products')
  @ApiOperation({ summary: 'Get product statistics' })
  @ApiResponse({ status: 200, description: 'Product statistics' })
  async getProductStats() {
    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      productsByCategory
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({
        where: { featured: true }
      }),
      // this.prisma.inventory.count({ // Inventory not implemented
      //   where: { stock: { lte: 10 } }
      // }),
      Promise.resolve(0), // Return 0 for now
      this.prisma.product.groupBy({
        by: ['categoryId'],
        _count: { categoryId: true }
      })
    ]);

    return {
      success: true,
      data: {
        totalProducts,
        activeProducts,
        lowStockProducts,
        productsByCategory: productsByCategory.reduce((acc: Record<string, number>, item: any) => {
          acc[item.categoryId || 'uncategorized'] = item._count.categoryId;
          return acc;
        }, {} as Record<string, number>)
      }
    };
  }

  @Post('bulk-action')
  @ApiOperation({ summary: 'Perform bulk actions' })
  @ApiResponse({ status: 200, description: 'Bulk action completed' })
  async performBulkAction(@Body() dto: BulkActionDto) {
    const { action, ids, type } = dto;
    
    let result;
    
    switch (type) {
      case 'users':
        switch (action) {
          case 'delete':
            result = await this.prisma.user.deleteMany({
              where: { id: { in: ids } }
            });
            break;
          case 'activate':
            result = await this.prisma.user.updateMany({
              where: { id: { in: ids } },
              data: { role: 'USER' }
            });
            break;
          case 'deactivate':
            result = await this.prisma.user.updateMany({
              where: { id: { in: ids } },
              data: { role: 'USER' }
            });
            break;
        }
        break;
        
      case 'products':
        switch (action) {
          case 'delete':
            result = await this.prisma.product.deleteMany({
              where: { id: { in: ids } }
            });
            break;
          case 'activate':
            result = await this.prisma.product.updateMany({
              where: { id: { in: ids } },
              data: { featured: true }
            });
            break;
          case 'deactivate':
            result = await this.prisma.product.updateMany({
              where: { id: { in: ids } },
              data: { featured: false }
            });
            break;
        }
        break;
        
      case 'orders':
        switch (action) {
          case 'delete':
            result = await this.prisma.order.deleteMany({
              where: { id: { in: ids } }
            });
            break;
          case 'activate':
            result = await this.prisma.order.updateMany({
              where: { id: { in: ids } },
              data: { status: 'COMPLETED' }
            });
            break;
          case 'deactivate':
            result = await this.prisma.order.updateMany({
              where: { id: { in: ids } },
              data: { status: 'CANCELED' }
            });
            break;
        }
        break;
    }
    
    return {
      success: true,
      data: {
        action,
        type,
        affectedCount: result?.count || 0,
        message: `Successfully ${action}ed ${result?.count || 0} ${type}`
      }
    };
  }

  @Get('system/status')
  @ApiOperation({ summary: 'Get system status' })
  @ApiResponse({ status: 200, description: 'System status' })
  async getSystemStatus() {
    const [
      databaseStatus,
      redisStatus,
      maintenanceMode
    ] = await Promise.all([
      this.prisma.$queryRaw`SELECT 1 as status`,
      Promise.resolve('OK'), // Placeholder for Redis check
      // this.prisma.systemConfig.findUnique({ // SystemConfig not implemented
      //   where: { key: 'maintenance_mode' }
      // }),
      Promise.resolve(null) // Return null for now
    ]);

    return {
      success: true,
      data: {
        database: databaseStatus ? 'Connected' : 'Disconnected',
        redis: redisStatus,
        maintenanceMode: false, // maintenanceMode?.value === 'true', // SystemConfig not implemented
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        environment: this.configService.get('NODE_ENV', 'development')
      }
    };
  }

  @Get('logs/activity')
  @ApiOperation({ summary: 'Get activity logs' })
  @ApiResponse({ status: 200, description: 'Activity logs' })
  async getActivityLogs(@Query('type') type?: string, @Query('limit') limit = '100') {
    // This would typically integrate with a logging service
    // For now, return a placeholder
    return {
      success: true,
      data: {
        logs: [],
        total: 0,
        type: type || 'all',
        limit: parseInt(limit)
      },
      message: 'Activity log retrieval not implemented yet'
    };
  }
}
