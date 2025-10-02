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

    // Validate typeId exist if provided
    if (data.typeId) {
      const type = await this.prisma.serviceType.findUnique({ where: { id: data.typeId } });
      if (!type) {
        throw new BadRequestException('Invalid type ID');
      }
    }

    // Handle price based on type
    let priceData: any = {
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

    return this.prisma.service.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        typeId: data.typeId,
        ...priceData,
        duration: data.estimatedDuration || 60,
        images: data.imageUrl,
        isActive: data.isActive ?? true,
      },
      include: {
        items: true,
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
    if (params.typeId) where.typeId = params.typeId;
    if (params.isActive !== undefined) where.isActive = params.isActive;

    const [total, services] = await this.prisma.$transaction([
      this.prisma.service.count({ where }),
      this.prisma.service.findMany({
        where,
        include: {
          items: true,
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
      price: Number(service.basePriceCents) / 100,
      minPriceDisplay: service.minPrice ? Number(service.minPrice) / 100 : null,
      maxPriceDisplay: service.maxPrice ? Number(service.maxPrice) / 100 : null,
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
      price: Number(service.basePriceCents) / 100,
      minPriceDisplay: service.minPrice ? Number(service.minPrice) / 100 : null,
      maxPriceDisplay: service.maxPrice ? Number(service.maxPrice) / 100 : null,
      type: service.serviceType,
    };
  }

  async getServiceBySlug(slug: string) {
    const service = await this.prisma.service.findUnique({
      where: { slug },
      include: {
        items: true,
        serviceType: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Không tìm thấy dịch vụ');
    }

    return {
      ...service,
      price: Number(service.basePriceCents) / 100,
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

    // Validate typeId if provided
    if (data.typeId) {
      const type = await this.prisma.serviceType.findUnique({ where: { id: data.typeId } });
      if (!type) {
        throw new BadRequestException('Invalid type ID');
      }
    }

    const updateData: any = {};
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

    const updated = await this.prisma.service.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        serviceType: true,
      },
    });

    return {
      ...updated,
      price: updated.basePriceCents / 100,
      minPriceDisplay: updated.minPrice ? updated.minPrice / 100 : null,
      maxPriceDisplay: updated.maxPrice ? updated.maxPrice / 100 : null,
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
        updatedAt: new Date(),
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

  async getServiceTypes() {
    const types = await this.prisma.serviceType.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return types.map(type => ({
      id: type.id,
      name: type.name,
      slug: type.slug,
      description: type.description,
      icon: type.icon,
      color: type.color,
      isActive: type.isActive,
      sortOrder: type.sortOrder,
      createdAt: type.createdAt.toISOString(),
      updatedAt: type.updatedAt.toISOString(),
    }));
  }

  async getServiceType(id: string) {
    const type = await this.prisma.serviceType.findUnique({
      where: { id },
    });

    if (!type) {
      throw new NotFoundException('Không tìm thấy loại dịch vụ');
    }

    return type;
  }

  private async generateSlug(name: string): Promise<string> {
    let baseSlug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/--+/g, '-')      // Replace multiple hyphens with single hyphen
      .trim();

    // Check if slug already exists
    const existing = await this.prisma.serviceType.findFirst({
      where: { slug: baseSlug }
    });

    if (!existing) {
      return baseSlug;
    }

    // If slug exists, add suffix
    let counter = 1;
    let uniqueSlug = `${baseSlug}-${counter}`;

    while (await this.prisma.serviceType.findFirst({ where: { slug: uniqueSlug } })) {
      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    }

    return uniqueSlug;
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
  // Service Types Management
  async createServiceType(data: { name: string; slug?: string; description?: string; isActive?: boolean }) {
    const slug = data.slug || await this.generateSlug(data.name);

    return this.prisma.serviceType.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        isActive: data.isActive ?? true,
        sortOrder: await this.getNextSortOrder(),
      },
    });
  }

  async updateServiceType(id: string, data: { name?: string; slug?: string; description?: string; isActive?: boolean; sortOrder?: number }) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    return this.prisma.serviceType.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteServiceType(id: string) {
    // Check if type is being used by any services
    const servicesCount = await this.prisma.service.count({
      where: { typeId: id },
    });

    if (servicesCount > 0) {
      throw new BadRequestException('Không thể xóa loại dịch vụ đang được sử dụng');
    }

    return this.prisma.serviceType.delete({
      where: { id },
    });
  }

  private async getNextSortOrder(): Promise<number> {
    const maxSortOrder = await this.prisma.serviceType.aggregate({
      _max: { sortOrder: true },
    });
    return (maxSortOrder._max.sortOrder || 0) + 1;
  }
}
