import { Controller, Get, Post, Body, UseGuards, Query, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { LoggingService } from '../monitoring/logging.service';
import { ActivityLogService } from '../../services/activity-log.service';

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
@UseGuards(AdminOrKeyGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly loggingService: LoggingService,
    private readonly activityLogService: ActivityLogService
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard overview' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved' })
  async getDashboard(@Query() query: AdminDashboardDto) {
    const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = query.endDate ? new Date(query.endDate) : new Date();

    // Get counts
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      newUsers,
      newOrders,
      pendingOrders,
      lowStockProducts
    ] = await Promise.all([
      this.prisma.users.count(),
      this.prisma.products.count(),
      this.prisma.orders.count(),
      this.prisma.orders.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalCents: true }
      }),
      this.prisma.users.count({
        where: { createdAt: { gte: startDate, lte: endDate } }
      }),
      this.prisma.orders.count({
        where: { createdAt: { gte: startDate, lte: endDate } }
      }),
      this.prisma.orders.count({
        where: { status: 'PENDING' }
      }),
      this.prisma.inventory.count({
        where: { stock: { lte: 10 } }
      })
    ]);

    // Get recent activities
    const recentOrders = await this.prisma.orders.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        users: { select: { name: true, email: true } }
      }
    });

    const recentUsers = await this.prisma.users.findMany({
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
          lowStockProducts
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
      this.prisma.users.count(),
      this.prisma.users.count({
        where: { updatedAt: { gte: daysAgo } }
      }),
      this.prisma.users.count({
        where: { createdAt: { gte: daysAgo } }
      }),
      this.prisma.users.groupBy({
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
    const _daysAgo = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
    
    const [
      totalOrders,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      totalRevenue,
      ordersByStatus
    ] = await Promise.all([
      this.prisma.orders.count(),
      this.prisma.orders.count({
        where: { status: 'COMPLETED' }
      }),
      this.prisma.orders.count({
        where: { status: 'PENDING' }
      }),
      this.prisma.orders.count({
        where: { status: 'CANCELED' }
      }),
      this.prisma.orders.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalCents: true }
      }),
      this.prisma.orders.groupBy({
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
      this.prisma.products.count(),
      this.prisma.products.count({
        where: { featured: true }
      }),
      this.prisma.inventory.count({
        where: { stock: { lte: 10 } }
      }),
      this.prisma.products.groupBy({
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
        productsByCategory: productsByCategory.reduce((acc, item) => {
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
            result = await this.prisma.users.deleteMany({
              where: { id: { in: ids } }
            });
            break;
          case 'activate':
            result = await this.prisma.users.updateMany({
              where: { id: { in: ids } },
              data: { role: 'USER' }
            });
            break;
          case 'deactivate':
            result = await this.prisma.users.updateMany({
              where: { id: { in: ids } },
              data: { role: 'USER' }
            });
            break;
        }
        break;
        
      case 'products':
        switch (action) {
          case 'delete':
            result = await this.prisma.products.deleteMany({
              where: { id: { in: ids } }
            });
            break;
          case 'activate':
            result = await this.prisma.products.updateMany({
              where: { id: { in: ids } },
              data: { featured: true }
            });
            break;
          case 'deactivate':
            result = await this.prisma.products.updateMany({
              where: { id: { in: ids } },
              data: { featured: false }
            });
            break;
        }
        break;
        
      case 'orders':
        switch (action) {
          case 'delete':
            result = await this.prisma.orders.deleteMany({
              where: { id: { in: ids } }
            });
            break;
          case 'activate':
            result = await this.prisma.orders.updateMany({
              where: { id: { in: ids } },
              data: { status: 'COMPLETED' }
            });
            break;
          case 'deactivate':
            result = await this.prisma.orders.updateMany({
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
      this.prisma.system_configs.findUnique({
        where: { key: 'maintenance_mode' }
      })
    ]);

    return {
      success: true,
      data: {
        database: databaseStatus ? 'Connected' : 'Disconnected',
        redis: redisStatus,
        maintenanceMode: maintenanceMode?.value === 'true',
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        environment: this.configService.get('NODE_ENV', 'development')
      }
    };
  }

  @Get('logs/activity')
  @ApiOperation({ summary: 'Get activity logs' })
  @ApiResponse({ status: 200, description: 'Activity logs retrieved successfully' })
  async getActivityLogs(
    @Query('type') type?: string,
    @Query('limit') limit = '100',
    @Query('offset') offset = '0',
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    try {
      const limitNum = Math.min(parseInt(limit), 1000); // Max 1000 records
      const offsetNum = parseInt(offset);

      // Use ActivityLogService to get logs
      const { logs, total } = await this.activityLogService.getActivityLogs({
        category: type && type !== 'all' ? type : undefined,
        userId,
        action,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        limit: limitNum,
        offset: offsetNum
      });

      // Log admin activity
      this.loggingService.logUserActivity(
        'admin_view_activity_logs',
        'Viewed activity logs',
        {
          resource: 'activity_logs',
          type: type || 'all',
          limit: limitNum,
          offset: offsetNum,
          filters: { userId, action, startDate, endDate }
        }
      );

      return {
        success: true,
        data: {
          logs,
          total,
          limit: limitNum,
          offset: offsetNum,
          type: type || 'all'
        }
      };
    } catch (error) {
      this.loggingService.error('Failed to retrieve activity logs', {
        error: error as Error,
        type,
        limit,
        offset,
        userId,
        action,
        startDate,
        endDate
      });

      return {
        success: false,
        error: {
          code: 'ACTIVITY_LOGS_RETRIEVAL_FAILED',
          message: 'Failed to retrieve activity logs',
          details: (error as Error).message
        }
      };
    }
  }

  @Delete('logs/activity/cleanup')
  @ApiOperation({ summary: 'Clean up old activity logs' })
  @ApiResponse({ status: 200, description: 'Old activity logs cleaned up successfully' })
  async cleanupActivityLogs(@Query('days') days = '90') {
    try {
      const daysNum = parseInt(days);
      if (daysNum < 7) {
        return {
          success: false,
          error: {
            code: 'INVALID_CLEANUP_DAYS',
            message: 'Cleanup days must be at least 7'
          }
        };
      }

      // Use ActivityLogService to cleanup old logs
      const deletedCount = await this.activityLogService.cleanupOldLogs(daysNum);

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysNum);

      // Log admin activity
      this.loggingService.logUserActivity(
        'admin_cleanup_activity_logs',
        'Cleaned up old activity logs',
        {
          resource: 'activity_logs',
          deletedCount,
          cutoffDate: cutoffDate.toISOString(),
          days: daysNum
        }
      );

      return {
        success: true,
        data: {
          deletedCount,
          cutoffDate: cutoffDate.toISOString(),
          days: daysNum
        },
        message: `Successfully deleted ${deletedCount} old activity logs`
      };
    } catch (error) {
      this.loggingService.error('Failed to cleanup activity logs', {
        error: error as Error,
        days
      });

      return {
        success: false,
        error: {
          code: 'ACTIVITY_LOGS_CLEANUP_FAILED',
          message: 'Failed to cleanup activity logs',
          details: (error as Error).message
        }
      };
    }
  }
}
