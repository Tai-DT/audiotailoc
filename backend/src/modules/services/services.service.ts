import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ServiceBookingStatus } from '../../common/enums';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  // Service Management
  async createService(data: CreateServiceDto) {
    // Generate slug if not provided
    const slug = data.slug || this.generateSlug(data.name);
    
    // Validate categoryId and typeId exist
    const [category, type] = await Promise.all([
      data.categoryId ? this.prisma.serviceCategory.findUnique({ where: { id: data.categoryId } }) : null,
      data.typeId ? this.prisma.serviceType.findUnique({ where: { id: data.typeId } }) : null,
    ]);

    if (data.categoryId && !category) {
      throw new BadRequestException('Invalid category ID');
    }
    if (data.typeId && !type) {
      throw new BadRequestException('Invalid type ID');
    }

    // Calculate basePriceCents from price if needed
    const basePriceCents = data.basePriceCents ?? (data.price ? Math.round(data.price * 100) : 0);

    return this.prisma.service.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        categoryId: data.categoryId,
        typeId: data.typeId,
        basePriceCents,
        price: basePriceCents,
        duration: data.estimatedDuration || 60,
        images: data.imageUrl,
        isActive: data.isActive ?? true,
      },
      include: {
        items: true,
        serviceCategory: true,
        serviceType: true,
      },
    });
  }

  async getServices(params: {
    categoryId?: string;
    typeId?: string;
    isActive?: boolean;
    page?: number;
    pageSize?: number;
  }) {
    console.log('[DEBUG] ServicesService.getServices called with params:', params);
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));

    const where: any = {};
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.typeId) where.typeId = params.typeId;
    if (params.isActive !== undefined) where.isActive = params.isActive;

    const [total, services] = await this.prisma.$transaction([
      this.prisma.service.count({ where }),
      this.prisma.service.findMany({
        where,
        include: {
          items: true,
          serviceCategory: true,
          serviceType: true,
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

    // Map services to include computed price field
    const mappedServices = services.map(service => ({
      ...service,
      price: service.basePriceCents / 100,
      category: service.serviceCategory,
      type: service.serviceType,
    }));

    console.log('[DEBUG] ServicesService.getServices returning:', { total, page, pageSize, servicesCount: services.length });
    return { total, page, pageSize, services: mappedServices };
  }

  async getService(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        items: true,
        serviceCategory: true,
        serviceType: true,
        bookings: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Không tìm thấy dịch vụ');
    }

    return {
      ...service,
      price: service.basePriceCents / 100,
      category: service.serviceCategory,
      type: service.serviceType,
    };
  }

  async getServiceBySlug(slug: string) {
    const service = await this.prisma.service.findUnique({
      where: { slug },
      include: {
        items: true,
        serviceCategory: true,
        serviceType: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Không tìm thấy dịch vụ');
    }

    return {
      ...service,
      price: service.basePriceCents / 100,
      category: service.serviceCategory,
      type: service.serviceType,
    };
  }

  async updateService(id: string, data: UpdateServiceDto) {
    // Check if service exists
    const existingService = await this.prisma.service.findUnique({
      where: { id },
    });
    if (!existingService) {
      throw new NotFoundException('Service not found');
    }

    // Validate categoryId and typeId if provided
    if (data.categoryId || data.typeId) {
      const [category, type] = await Promise.all([
        data.categoryId ? this.prisma.serviceCategory.findUnique({ where: { id: data.categoryId } }) : null,
        data.typeId ? this.prisma.serviceType.findUnique({ where: { id: data.typeId } }) : null,
      ]);

      if (data.categoryId && !category) {
        throw new BadRequestException('Invalid category ID');
      }
      if (data.typeId && !type) {
        throw new BadRequestException('Invalid type ID');
      }
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.typeId !== undefined) updateData.typeId = data.typeId;
    
    // Handle price conversion
    if (data.basePriceCents !== undefined) {
      updateData.basePriceCents = data.basePriceCents;
      updateData.price = data.basePriceCents;
    } else if (data.price !== undefined) {
      const basePriceCents = Math.round(data.price * 100);
      updateData.basePriceCents = basePriceCents;
      updateData.price = basePriceCents;
    }
    
    if (data.estimatedDuration !== undefined) updateData.duration = data.estimatedDuration;
    if (data.imageUrl !== undefined) updateData.images = data.imageUrl;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const updated = await this.prisma.service.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        serviceCategory: true,
        serviceType: true,
      },
    });

    return {
      ...updated,
      price: updated.basePriceCents / 100,
      category: updated.serviceCategory,
      type: updated.serviceType,
    };
  }

  async updateServiceImage(id: string, imagePath: string) {
    // In a production environment, you would upload the file to a cloud storage
    // service (like S3, Cloudinary, etc.) and store the URL.
    // For this example, we'll just store the local file path.
    return this.updateService(id, { imageUrl: imagePath });
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
  async getServiceCategories() {
    const categories = await this.prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return categories.map(cat => ({
      value: cat.id,
      label: cat.name,
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
    }));
  }

  async getServiceTypes() {
    const types = await this.prisma.serviceType.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { category: true },
    });

    return types.map(type => ({
      value: type.id,
      label: type.name,
      id: type.id,
      name: type.name,
      slug: type.slug,
      categoryId: type.categoryId,
      category: type.category,
    }));
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/--+/g, '-')      // Replace multiple hyphens with single hyphen
      .trim();
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
