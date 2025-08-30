import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SimpleAnalyticsService {
  private readonly logger = new Logger(SimpleAnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData() {
    try {
      // Get basic counts
      const [userCount, productCount, orderCount] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.product.count(),
        this.prisma.order.count(),
      ]);

      // Get recent orders
      const recentOrders = await this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          items: {
            include: {
              product: { select: { name: true } }
            }
          }
        }
      });

      // Calculate total revenue
      const totalRevenue = await this.prisma.order.aggregate({
        _sum: { totalCents: true },
        where: { status: { not: 'CANCELLED' } }
      });

      // Get top products
      const topProducts = await this.prisma.product.findMany({
        take: 5,
        orderBy: { viewCount: 'desc' },
        select: {
          id: true,
          name: true,
          priceCents: true,
          viewCount: true,
          _count: {
            select: { orderItems: true }
          }
        }
      });

      return {
        sales: {
          totalRevenue: (totalRevenue._sum.totalCents || 0) / 100,
          totalOrders: orderCount,
          averageOrderValue: orderCount > 0 ? (totalRevenue._sum.totalCents || 0) / orderCount / 100 : 0,
          conversionRate: 0.05 // Mock data
        },
        customers: {
          totalCustomers: userCount,
          newCustomers: Math.floor(userCount * 0.1), // Mock: 10% new
          returningCustomers: Math.floor(userCount * 0.9), // Mock: 90% returning
          customerRetention: 0.85 // Mock data
        },
        inventory: {
          totalProducts: productCount,
          lowStockProducts: 0, // Will implement when inventory module is fixed
          outOfStockProducts: 0,
          inventoryValue: 0
        },
        recentOrders: recentOrders.map(order => ({
          id: order.id,
          orderNo: order.orderNo,
          customerName: order.user?.name || 'Guest',
          totalCents: order.totalCents,
          status: order.status,
          createdAt: order.createdAt,
          itemCount: order.items.length
        })),
        topProducts: topProducts.map(product => ({
          id: product.id,
          name: product.name,
          priceCents: product.priceCents,
          viewCount: product.viewCount,
          orderCount: product._count.orderItems
        }))
      };
    } catch (error) {
      this.logger.error('Error getting dashboard data:', error);
      throw error;
    }
  }

  async getSalesMetrics() {
    // Simple sales metrics
    const totalRevenue = await this.prisma.order.aggregate({
      _sum: { totalCents: true },
      where: { status: { not: 'CANCELLED' } }
    });

    const orderCount = await this.prisma.order.count({
      where: { status: { not: 'CANCELLED' } }
    });

    return {
      totalRevenue: (totalRevenue._sum.totalCents || 0) / 100,
      totalOrders: orderCount,
      averageOrderValue: orderCount > 0 ? (totalRevenue._sum.totalCents || 0) / orderCount / 100 : 0
    };
  }
}