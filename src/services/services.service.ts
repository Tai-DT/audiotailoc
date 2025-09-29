import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateServiceTypeDto,
  UpdateServiceTypeDto,
  CreateServiceDto,
  UpdateServiceDto
} from './dto/service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  // Service Types Management
  async findAllServiceTypes() {
    return this.prisma.service_types.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        services: {
          select: { id: true, name: true, isActive: true }
        }
      }
    });
  }

  async findServiceTypeById(id: string) {
    const serviceType = await this.prisma.service_types.findUnique({
      where: { id },
      include: {
        services: {
          select: { id: true, name: true, isActive: true }
        }
      }
    });

    if (!serviceType) {
      throw new NotFoundException('Service type not found');
    }

    return serviceType;
  }

  async createServiceType(dto: CreateServiceTypeDto) {
    // Generate slug
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Check if slug exists
    const existingType = await this.prisma.service_types.findUnique({
      where: { slug }
    });

    if (existingType) {
      throw new ConflictException('Service type with this slug already exists');
    }

    return this.prisma.service_types.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        icon: dto.icon,
        color: dto.color,
        isActive: dto.isActive ?? true,
        sortOrder: dto.sortOrder ?? 0
      }
    });
  }

  async updateServiceType(id: string, dto: UpdateServiceTypeDto) {
    const serviceType = await this.findServiceTypeById(id);

    // Generate new slug if name changed
    let slug = serviceType.slug;
    if (dto.name && dto.name !== serviceType.name) {
      slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      // Check if new slug exists
      const existingType = await this.prisma.service_types.findFirst({
        where: { slug, id: { not: id } }
      });

      if (existingType) {
        throw new ConflictException('Service type with this slug already exists');
      }
    }

    return this.prisma.service_types.update({
      where: { id },
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        icon: dto.icon,
        color: dto.color,
        isActive: dto.isActive,
        sortOrder: dto.sortOrder
      }
    });
  }

  async deleteServiceType(id: string) {
    const serviceType = await this.findServiceTypeById(id);

    // Check if service type has services
    if (serviceType.services.length > 0) {
      throw new BadRequestException('Cannot delete service type that has services');
    }

    return this.prisma.service_types.delete({
      where: { id }
    });
  }

  // Services Management
  async findAllServices() {
    return this.prisma.services.findMany({
      where: { isActive: true },
      include: {
        service_types: {
          select: { id: true, name: true, slug: true, icon: true, color: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findServiceById(id: string) {
    const service = await this.prisma.services.findUnique({
      where: { id },
      include: {
        service_types: {
          select: { id: true, name: true, slug: true, icon: true, color: true }
        },
        service_bookings: {
          select: { id: true, status: true, scheduledAt: true }
        },
        service_items: {
          select: { id: true, name: true, price: true, quantity: true }
        }
      }
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async createService(dto: CreateServiceDto) {
    // Generate slug
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Check if slug exists
    const existingService = await this.prisma.services.findUnique({
      where: { slug }
    });

    if (existingService) {
      throw new ConflictException('Service with this slug already exists');
    }

    // Validate service type if provided
    if (dto.typeId) {
      const serviceType = await this.prisma.service_types.findUnique({
        where: { id: dto.typeId }
      });

      if (!serviceType) {
        throw new NotFoundException('Service type not found');
      }
    }

    return this.prisma.services.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        shortDescription: dto.shortDescription,
        basePriceCents: dto.basePriceCents || 0,
        price: dto.price || 0,
        duration: dto.duration,
        typeId: dto.typeId,
        images: dto.images,
        isActive: dto.isActive ?? true,
        isFeatured: dto.isFeatured ?? false,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        tags: dto.tags,
        features: dto.features,
        requirements: dto.requirements,
        metadata: dto.metadata
      },
      include: {
        service_types: {
          select: { id: true, name: true, slug: true, icon: true, color: true }
        }
      }
    });
  }

  async updateService(id: string, dto: UpdateServiceDto) {
    const service = await this.findServiceById(id);

    // Generate new slug if name changed
    let slug = service.slug;
    if (dto.name && dto.name !== service.name) {
      slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      // Check if new slug exists
      const existingService = await this.prisma.services.findFirst({
        where: { slug, id: { not: id } }
      });

      if (existingService) {
        throw new ConflictException('Service with this slug already exists');
      }
    }

    // Validate service type if provided
    if (dto.typeId) {
      const serviceType = await this.prisma.service_types.findUnique({
        where: { id: dto.typeId }
      });

      if (!serviceType) {
        throw new NotFoundException('Service type not found');
      }
    }

    return this.prisma.services.update({
      where: { id },
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        shortDescription: dto.shortDescription,
        basePriceCents: dto.basePriceCents,
        price: dto.price,
        duration: dto.duration,
        typeId: dto.typeId,
        images: dto.images,
        isActive: dto.isActive,
        isFeatured: dto.isFeatured,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        tags: dto.tags,
        features: dto.features,
        requirements: dto.requirements,
        metadata: dto.metadata
      },
      include: {
        service_types: {
          select: { id: true, name: true, slug: true, icon: true, color: true }
        }
      }
    });
  }

  async deleteService(id: string) {
    const service = await this.findServiceById(id);

    // Check if service has active bookings
    const activeBookings = service.service_bookings?.filter(booking =>
      ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(booking.status)
    );

    if (activeBookings && activeBookings.length > 0) {
      throw new BadRequestException('Cannot delete service that has active bookings');
    }

    return this.prisma.services.delete({
      where: { id }
    });
  }

  // Helper methods
  async incrementViewCount(id: string) {
    return this.prisma.services.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });
  }

  async getFeaturedServices() {
    return this.prisma.services.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        service_types: {
          select: { id: true, name: true, slug: true, icon: true, color: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 6
    });
  }

  async getServicesByType(typeId: string) {
    return this.prisma.services.findMany({
      where: { typeId, isActive: true },
      include: {
        service_types: {
          select: { id: true, name: true, slug: true, icon: true, color: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}