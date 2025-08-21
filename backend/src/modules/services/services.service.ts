import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ServiceCategory, ServiceType, ServiceBookingStatus } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  // Service Management
  async createService(data: {
    name: string;
    slug: string;
    description?: string;
    category: ServiceCategory;
    type: ServiceType;
    basePriceCents: number;
    estimatedDuration: number;
    requirements?: string;
    features?: string;
    imageUrl?: string;
  }) {
    return this.prisma.service.create({
      data,
      include: {
        items: true,
      },
    });
  }

  async getServices(params: {
    category?: ServiceCategory;
    type?: ServiceType;
    isActive?: boolean;
    page?: number;
    pageSize?: number;
  }) {
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
    
    const where: any = {};
    if (params.category) where.category = params.category;
    if (params.type) where.type = params.type;
    if (params.isActive !== undefined) where.isActive = params.isActive;

    const [total, services] = await this.prisma.$transaction([
      this.prisma.service.count({ where }),
      this.prisma.service.findMany({
        where,
        include: {
          items: true,
          _count: {
            select: {
              bookings: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return { total, page, pageSize, services };
  }

  async getService(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        items: true,
        bookings: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Không tìm thấy dịch vụ');
    }

    return service;
  }

  async getServiceBySlug(slug: string) {
    const service = await this.prisma.service.findUnique({
      where: { slug },
      include: {
        items: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Không tìm thấy dịch vụ');
    }

    return service;
  }

  async updateService(id: string, data: Partial<{
    name: string;
    description: string;
    basePriceCents: number;
    estimatedDuration: number;
    requirements: string;
    features: string;
    imageUrl: string;
    isActive: boolean;
  }>) {
    const service = await this.getService(id);
    
    return this.prisma.service.update({
      where: { id },
      data,
      include: {
        items: true,
      },
    });
  }

  async deleteService(id: string) {
    const service = await this.getService(id);
    
    // Check if service has any bookings
    const bookingCount = await this.prisma.serviceBooking.count({
      where: { serviceId: id },
    });

    if (bookingCount > 0) {
      throw new BadRequestException('Không thể xóa dịch vụ đã có booking');
    }

    return this.prisma.service.delete({
      where: { id },
    });
  }

  // Service Items Management
  async addServiceItem(serviceId: string, data: {
    name: string;
    description?: string;
    priceCents: number;
    isRequired: boolean;
  }) {
    await this.getService(serviceId); // Ensure service exists

    return this.prisma.serviceItem.create({
      data: {
        ...data,
        serviceId,
      },
    });
  }

  async updateServiceItem(itemId: string, data: Partial<{
    name: string;
    description: string;
    priceCents: number;
    isRequired: boolean;
  }>) {
    const item = await this.prisma.serviceItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Không tìm thấy mục dịch vụ');
    }

    return this.prisma.serviceItem.update({
      where: { id: itemId },
      data,
    });
  }

  async deleteServiceItem(itemId: string) {
    const item = await this.prisma.serviceItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Không tìm thấy mục dịch vụ');
    }

    // Check if item is used in any bookings
    const bookingItemCount = await this.prisma.serviceBookingItem.count({
      where: { itemId },
    });

    if (bookingItemCount > 0) {
      throw new BadRequestException('Không thể xóa mục dịch vụ đã được sử dụng');
    }

    return this.prisma.serviceItem.delete({
      where: { id: itemId },
    });
  }

  // Service Categories and Types
  getServiceCategories() {
    return Object.values(ServiceCategory).map(category => ({
      value: category,
      label: this.getCategoryLabel(category),
    }));
  }

  getServiceTypes() {
    return Object.values(ServiceType).map(type => ({
      value: type,
      label: this.getTypeLabel(type),
    }));
  }

  private getCategoryLabel(category: ServiceCategory): string {
    const labels = {
      INSTALLATION: 'Lắp đặt',
      MAINTENANCE: 'Bảo trì',
      REPAIR: 'Sửa chữa',
      LIQUIDATION: 'Thanh lý',
      RENTAL: 'Cho thuê',
      CONSULTATION: 'Tư vấn',
      DELIVERY: 'Giao hàng',
      OTHER: 'Khác',
    };
    return labels[category] || category;
  }

  private getTypeLabel(type: ServiceType): string {
    const labels = {
      AUDIO_EQUIPMENT: 'Thiết bị âm thanh',
      HOME_THEATER: 'Rạp hát tại nhà',
      PROFESSIONAL_SOUND: 'Âm thanh chuyên nghiệp',
      LIGHTING: 'Ánh sáng',
      CONSULTATION: 'Tư vấn',
      MAINTENANCE: 'Bảo trì',
      OTHER: 'Khác',
    };
    return labels[type] || type;
  }

  // Statistics
  async getServiceStats() {
    const [
      totalServices,
      activeServices,
      totalBookings,
      pendingBookings,
      completedBookings,
      revenue,
    ] = await Promise.all([
      this.prisma.service.count(),
      this.prisma.service.count({ where: { isActive: true } }),
      this.prisma.serviceBooking.count(),
      this.prisma.serviceBooking.count({ where: { status: ServiceBookingStatus.PENDING } }),
      this.prisma.serviceBooking.count({ where: { status: ServiceBookingStatus.COMPLETED } }),
      this.prisma.serviceBooking.aggregate({
        where: { status: ServiceBookingStatus.COMPLETED },
        _sum: { actualCosts: true },
      }),
    ]);

    return {
      totalServices,
      activeServices,
      totalBookings,
      pendingBookings,
      completedBookings,
      totalRevenue: revenue._sum.actualCosts || 0,
    };
  }
}
