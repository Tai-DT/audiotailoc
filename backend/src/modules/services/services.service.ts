import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ServiceCategory, ServiceType, ServiceBookingStatus } from '../../common/enums';

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
    imageUrl?: string;
  }) {
    return this.prisma.service.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        category: data.category,
        type: data.type,
        basePriceCents: data.basePriceCents,
        price: data.basePriceCents,
        duration: data.estimatedDuration,
        images: data.imageUrl,
      },
      include: { items: true },
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
    imageUrl: string;
    isActive: boolean;
  }>) {
    const _service = await this.getService(id);

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.basePriceCents !== undefined) {
      updateData.basePriceCents = data.basePriceCents;
      updateData.price = data.basePriceCents;
    }
    if (data.estimatedDuration !== undefined) updateData.duration = data.estimatedDuration;
    if (data.imageUrl !== undefined) updateData.images = data.imageUrl;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return this.prisma.service.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });
  }

  async deleteService(id: string) {
    const _service = await this.getService(id);
    
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
    priceCents: number;
  }) {
    await this.getService(serviceId); // Ensure service exists

    return this.prisma.serviceItem.create({
      data: {
        serviceId,
        name: data.name,
        price: data.priceCents,
        quantity: 1,
      },
    });
  }

  async updateServiceItem(itemId: string, data: Partial<{
    name: string;
    priceCents: number;
  }>) {
    const item = await this.prisma.serviceItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Không tìm thấy mục dịch vụ');
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.priceCents !== undefined) updateData.price = data.priceCents;

    return this.prisma.serviceItem.update({
      where: { id: itemId },
      data: updateData,
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
      where: { serviceItemId: itemId },
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
      this.prisma.serviceBookingItem.aggregate({
        where: {
          booking: { status: ServiceBookingStatus.COMPLETED },
        },
        _sum: { price: true },
      }),
    ]);

    return {
      totalServices,
      activeServices,
      totalBookings,
      pendingBookings,
      completedBookings,
      totalRevenue: revenue._sum.price || 0,
    };
  }
}
