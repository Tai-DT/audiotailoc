import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import type { Prisma } from '@prisma/client';
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

    // Validate typeId exist if provided
    if (data.typeId) {
      const type = await this.prisma.service_types.findUnique({ where: { id: data.typeId } });
      if (!type) {
        throw new BadRequestException('Invalid type ID');
      }
    }

    // Handle price based on type
    type PriceData = Partial<{
      priceType: string;
      minPrice: number | null;
      maxPrice: number | null;
      basePriceCents: number;
      price: number;
    }>;

    const priceData: PriceData = {
      priceType: data.priceType || 'FIXED',
    };

    if (data.priceType === 'RANGE') {
      // For range, convert VND to cents
      priceData.minPrice = data.minPrice ? Math.round(data.minPrice * 100) : null;
      priceData.maxPrice = data.maxPrice ? Math.round(data.maxPrice * 100) : null;
      // Set basePriceCents to minPrice for compatibility
      priceData.basePriceCents = priceData.minPrice || 0;
      priceData.price = priceData.minPrice || 0;
    } else if (data.priceType === 'NEGOTIABLE' || data.priceType === 'CONTACT') {
      // For negotiable/contact, set prices to 0
      priceData.basePriceCents = 0;
      priceData.price = 0;
      priceData.minPrice = null;
      priceData.maxPrice = null;
    } else {
      // FIXED price (default)
      const basePriceCents = data.basePriceCents ?? (data.price ? Math.round(data.price * 100) : 0);
      priceData.basePriceCents = basePriceCents;
      priceData.price = basePriceCents;
      priceData.minPrice = null;
      priceData.maxPrice = null;
    }

    return this.prisma.services.create({
      data: {
        id: randomUUID(),
        name: data.name,
        slug,
        description: data.description,
        typeId: data.typeId,
        ...priceData,
        duration: data.estimatedDuration || 60,
        images: data.imageUrl,
        isActive: data.isActive ?? true,
        updatedAt: new Date(),
      },
      include: {
        service_items: true,
        service_types: true,
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
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));

    const where: Prisma.servicesWhereInput = {};
    if (params.typeId) where.typeId = params.typeId;
    if (params.isActive !== undefined) where.isActive = params.isActive;

    const [total, services] = await this.prisma.$transaction([
      this.prisma.services.count({ where }),
      this.prisma.services.findMany({
        where,
        include: {
          service_items: true,
          service_types: true,
          _count: {
            select: {
              service_bookings: true,
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
      price: Number(service.basePriceCents) / 100,
      minPriceDisplay: service.minPrice ? Number(service.minPrice) / 100 : null,
      maxPriceDisplay: service.maxPrice ? Number(service.maxPrice) / 100 : null,
      type: service.service_types,
    }));

    return { total, page, pageSize, services: mappedServices };
  }

  async getService(id: string) {
    const service = await this.prisma.services.findUnique({
      where: { id },
      include: {
        service_items: true,
        service_types: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Không tìm thấy dịch vụ');
    }

    return {
      ...service,
      price: Number(service.basePriceCents) / 100,
      minPriceDisplay: service.minPrice ? Number(service.minPrice) / 100 : null,
      maxPriceDisplay: service.maxPrice ? Number(service.maxPrice) / 100 : null,
      type: service.service_types,
    };
  }

  async getServiceBySlug(slug: string) {
    const service = await this.prisma.services.findUnique({
      where: { slug },
      include: {
        service_items: true,
        service_types: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Không tìm thấy dịch vụ');
    }

    return {
      ...service,
      price: Number(service.basePriceCents) / 100,
      type: service.service_types,
    };
  }

  async updateService(id: string, data: UpdateServiceDto) {
    // Check if service exists
    const existingService = await this.prisma.services.findUnique({
      where: { id },
    });
    if (!existingService) {
      throw new NotFoundException('Service not found');
    }

    // Validate typeId if provided
    if (data.typeId) {
      const type = await this.prisma.service_types.findUnique({ where: { id: data.typeId } });
      if (!type) {
        throw new BadRequestException('Invalid type ID');
      }
    }

    const updateData: Prisma.servicesUncheckedUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.typeId !== undefined) updateData.typeId = data.typeId;
    if (data.priceType !== undefined) updateData.priceType = data.priceType;

    // Handle price based on type
    if (data.priceType === 'RANGE') {
      if (data.minPrice !== undefined) {
        updateData.minPrice = Math.round(data.minPrice * 100);
        updateData.basePriceCents = updateData.minPrice;
        updateData.price = updateData.minPrice;
      }
      if (data.maxPrice !== undefined) {
        updateData.maxPrice = Math.round(data.maxPrice * 100);
      }
    } else if (data.priceType === 'NEGOTIABLE' || data.priceType === 'CONTACT') {
      updateData.basePriceCents = 0;
      updateData.price = 0;
      updateData.minPrice = null;
      updateData.maxPrice = null;
    } else if (data.priceType === 'FIXED' || data.priceType === undefined) {
      // Handle fixed price
      if (data.basePriceCents !== undefined) {
        updateData.basePriceCents = data.basePriceCents;
        updateData.price = data.basePriceCents;
        updateData.minPrice = null;
        updateData.maxPrice = null;
      } else if (data.price !== undefined) {
        const basePriceCents = Math.round(data.price * 100);
        updateData.basePriceCents = basePriceCents;
        updateData.price = basePriceCents;
        updateData.minPrice = null;
        updateData.maxPrice = null;
      }
    }

    if (data.estimatedDuration !== undefined) updateData.duration = data.estimatedDuration;
    if (data.imageUrl !== undefined) updateData.images = data.imageUrl;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const updated = await this.prisma.services.update({
      where: { id },
      data: updateData,
      include: {
        service_items: true,
        service_types: true,
      },
    });

    return {
      ...updated,
      price: Number(updated.basePriceCents) / 100,
      minPriceDisplay: updated.minPrice ? Number(updated.minPrice) / 100 : null,
      maxPriceDisplay: updated.maxPrice ? Number(updated.maxPrice) / 100 : null,
      type: updated.service_types,
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
    const bookingCount = await this.prisma.service_bookings.count({
      where: { serviceId: id },
    });

    if (bookingCount > 0) {
      throw new BadRequestException('Không thể xóa dịch vụ đã có booking');
    }

    return this.prisma.services.delete({
      where: { id },
    });
  }

  // Service Items Management
  async addServiceItem(
    serviceId: string,
    data: {
      name: string;
      priceCents: number;
    },
  ) {
    await this.getService(serviceId); // Ensure service exists

    return this.prisma.service_items.create({
      data: {
        id: randomUUID(),
        serviceId,
        name: data.name,
        price: data.priceCents,
        quantity: 1,
        updatedAt: new Date(),
      },
    });
  }

  async updateServiceItem(
    itemId: string,
    data: Partial<{
      name: string;
      priceCents: number;
    }>,
  ) {
    const item = await this.prisma.service_items.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Không tìm thấy mục dịch vụ');
    }

    const updateData: Prisma.service_itemsUncheckedUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.priceCents !== undefined) updateData.price = data.priceCents;

    return this.prisma.service_items.update({
      where: { id: itemId },
      data: updateData,
    });
  }

  async deleteServiceItem(itemId: string) {
    const item = await this.prisma.service_items.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Không tìm thấy mục dịch vụ');
    }

    // Check if item is used in any bookings
    const bookingItemCount = await this.prisma.service_booking_items.count({
      where: { serviceItemId: itemId },
    });

    if (bookingItemCount > 0) {
      throw new BadRequestException('Không thể xóa mục dịch vụ đã được sử dụng');
    }

    return this.prisma.service_items.delete({
      where: { id: itemId },
    });
  }

  async getServiceTypes() {
    const types = await this.prisma.service_types.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return types.map(type => ({
      value: type.id,
      label: type.name,
      id: type.id,
      name: type.name,
      slug: type.slug,
    }));
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
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
      this.prisma.services.count(),
      this.prisma.services.count({ where: { isActive: true } }),
      this.prisma.service_bookings.count(),
      this.prisma.service_bookings.count({ where: { status: ServiceBookingStatus.PENDING } }),
      this.prisma.service_bookings.count({ where: { status: ServiceBookingStatus.COMPLETED } }),
      this.prisma.service_booking_items.aggregate({
        where: {
          service_bookings: { status: ServiceBookingStatus.COMPLETED },
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
