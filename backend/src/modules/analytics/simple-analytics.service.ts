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
        this.prisma.users.count(),
        this.prisma.products.count(),
        this.prisma.orders.count(),
      ]);

      // Get recent orders
      const recentOrders = await this.prisma.orders.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          users: { select: { name: true, email: true } },
          order_items: {
            include: {
              products: { select: { name: true } },
            },
          },
        },
      });

      // Calculate total revenue
      const totalRevenue = await this.prisma.orders.aggregate({
        _sum: { totalCents: true },
        where: { status: { not: 'CANCELLED' } },
      });

      // Get top products
      const topProducts = await this.prisma.products.findMany({
        take: 5,
        orderBy: { viewCount: 'desc' },
        select: {
          id: true,
          name: true,
          priceCents: true,
          viewCount: true,
          _count: {
            select: { order_items: true },
          },
        },
      });

      // Calculate conversion rate from actual data
      const productViews = await this.prisma.product_views.count();
      const conversionRate = productViews > 0 ? orderCount / productViews : 0;

      // Calculate new vs returning customers from actual data (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const newCustomers = await this.prisma.users.count({
        where: { role: 'USER', createdAt: { gte: thirtyDaysAgo } },
      });

      // Returning customers: users with more than 1 order
      const returningCustomers = await this.prisma.users.count({
        where: {
          role: 'USER',
          orders: { some: {} },
        },
      });

      // Customer retention: returning / total customers
      const customerRetention = userCount > 0 ? returningCustomers / userCount : 0;

      // Get inventory stats
      const [lowStockProducts, outOfStockProducts, inventoryValueData] = await Promise.all([
        this.prisma.inventory.count({ where: { stock: { gt: 0, lt: 10 } } }),
        this.prisma.inventory.count({ where: { stock: { lte: 0 } } }),
        this.prisma.inventory.findMany({
          include: { products: { select: { priceCents: true } } },
        }),
      ]);

      const inventoryValue =
        inventoryValueData.reduce(
          (sum, inv) => sum + Number(inv.products?.priceCents || 0) * inv.stock,
          0,
        ) / 100;

      return {
        sales: {
          totalRevenue: (totalRevenue._sum.totalCents || 0) / 100,
          totalOrders: orderCount,
          averageOrderValue:
            orderCount > 0 ? (totalRevenue._sum.totalCents || 0) / orderCount / 100 : 0,
          conversionRate: Math.round(conversionRate * 10000) / 100, // Percentage
        },
        customers: {
          totalCustomers: userCount,
          newCustomers,
          returningCustomers,
          customerRetention: Math.round(customerRetention * 100) / 100,
        },
        inventory: {
          totalProducts: productCount,
          lowStockProducts,
          outOfStockProducts,
          inventoryValue,
        },
        recentOrders: recentOrders.map(order => ({
          id: order.id,
          orderNo: order.orderNo,
          customerName: order.users?.name || 'Guest',
          totalCents: order.totalCents,
          status: order.status,
          createdAt: order.createdAt,
          itemCount: order.order_items.length,
        })),
        topProducts: topProducts.map(product => ({
          id: product.id,
          name: product.name,
          priceCents: product.priceCents,
          viewCount: product.viewCount,
          orderCount: product._count?.order_items || 0,
        })),
      };
    } catch (error) {
      this.logger.error('Error getting dashboard data:', error);
      throw error;
    }
  }

  async getSalesMetrics() {
    // Simple sales metrics
    const totalRevenue = await this.prisma.orders.aggregate({
      _sum: { totalCents: true },
      where: { status: { not: 'CANCELLED' } },
    });

    const orderCount = await this.prisma.orders.count({
      where: { status: { not: 'CANCELLED' } },
    });

    return {
      totalRevenue: (totalRevenue._sum.totalCents || 0) / 100,
      totalOrders: orderCount,
      averageOrderValue:
        orderCount > 0 ? (totalRevenue._sum.totalCents || 0) / orderCount / 100 : 0,
    };
  }
}
