import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface SiteStat {
  id: string;
  key: string;
  value: string;
  label: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class SiteStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getHomepageStats(): Promise<SiteStat[]> {
    try {
      // Try to get stats from database first
      const dbStats = await this.prisma.site_stats.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      });

      if (dbStats.length > 0) {
        return dbStats.map(stat => ({
          id: stat.id,
          key: stat.key,
          value: stat.value,
          label: stat.label,
          description: stat.description || undefined,
          icon: stat.icon || undefined,
          isActive: stat.isActive,
          displayOrder: stat.displayOrder,
          createdAt: stat.createdAt.toISOString(),
          updatedAt: stat.updatedAt.toISOString(),
        }));
      }
    } catch (error) {
      console.warn('Failed to fetch site stats from database:', error);
    }

    // Fallback to default stats
    return this.getDefaultStats();
  }

  async getSiteStats() {
    const [totalProducts, totalOrders, totalUsers, totalServices, totalBookings, revenueAgg] =
      await Promise.all([
        this.prisma.products.count(),
        this.prisma.orders.count(),
        this.prisma.users.count(),
        this.prisma.services.count(),
        this.prisma.service_bookings.count(),
        this.prisma.orders.aggregate({
          _sum: { totalCents: true },
          where: {
            status: { in: ['COMPLETED', 'DELIVERED'] },
          },
        }),
      ]);

    const totalRevenue = (revenueAgg._sum.totalCents || 0) / 100;

    return {
      totalProducts,
      totalOrders,
      totalUsers,
      totalServices,
      totalBookings,
      totalRevenue,
    };
  }

  private getDefaultStats(): SiteStat[] {
    return [
      {
        id: '1',
        key: 'happy_customers',
        value: '500+',
        label: 'Khách hàng hài lòng',
        description: 'Số lượng khách hàng đã sử dụng dịch vụ',
        icon: 'users',
        isActive: true,
        displayOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        key: 'projects_completed',
        value: '300+',
        label: 'Dự án hoàn thành',
        description: 'Số lượng dự án âm thanh đã triển khai thành công',
        icon: 'briefcase',
        isActive: true,
        displayOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        key: 'years_experience',
        value: '5+',
        label: 'Năm kinh nghiệm',
        description: 'Kinh nghiệm trong lĩnh vực âm thanh chuyên nghiệp',
        icon: 'award',
        isActive: true,
        displayOrder: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        key: 'products_available',
        value: '1000+',
        label: 'Sản phẩm',
        description: 'Đa dạng sản phẩm âm thanh chất lượng cao',
        icon: 'package',
        isActive: true,
        displayOrder: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
}
