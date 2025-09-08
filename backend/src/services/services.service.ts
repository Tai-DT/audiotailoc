import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateServiceCategoryDto,
  UpdateServiceCategoryDto,
  CreateServiceTypeDto,
  UpdateServiceTypeDto,
  CreateServiceDto,
  UpdateServiceDto
} from './dto/service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  // Service Categories
  async findAllCategories() {
    return this.prisma.serviceCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        services: {
          select: { id: true, name: true, isActive: true }
        },
        types: {
          select: { id: true, name: true, isActive: true }
        }
      }
    });
  }

  async findCategoryById(id: string) {
    const category = await this.prisma.serviceCategory.findUnique({
      where: { id },
      include: {
        services: {
          select: { id: true, name: true, isActive: true }
        },
        types: {
          select: { id: true, name: true, isActive: true }
        }
      }
    });

    if (!category) {
      throw new NotFoundException('Service category not found');
    }

    return category;
  }

  async createCategory(dto: CreateServiceCategoryDto) {
    // Generate slug
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Check if slug exists
    const existingCategory = await this.prisma.serviceCategory.findUnique({
      where: { slug }
    });

    if (existingCategory) {
      throw new ConflictException('Category with this slug already exists');
    }

    return this.prisma.serviceCategory.create({
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

  async updateCategory(id: string, dto: UpdateServiceCategoryDto) {
    const category = await this.findCategoryById(id);

    // Generate new slug if name changed
    let slug = category.slug;
    if (dto.name && dto.name !== category.name) {
      slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      const existingCategory = await this.prisma.serviceCategory.findFirst({
        where: { slug, id: { not: id } }
      });

      if (existingCategory) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

    return this.prisma.serviceCategory.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name, slug }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.icon !== undefined && { icon: dto.icon }),
        ...(dto.color !== undefined && { color: dto.color }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder })
      }
    });
  }

  async deleteCategory(id: string) {
    const category = await this.findCategoryById(id);

    // Check if category has related services or types
    if (category.services.length > 0 || category.types.length > 0) {
      throw new BadRequestException('Cannot delete category with existing services or types');
    }

    return this.prisma.serviceCategory.delete({
      where: { id }
    });
  }

  // Service Types
  async findAllTypes() {
    return this.prisma.serviceType.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        category: {
          select: { id: true, name: true, color: true }
        },
        services: {
          select: { id: true, name: true, isActive: true }
        }
      }
    });
  }

  async findTypeById(id: string) {
    const type = await this.prisma.serviceType.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, color: true }
        },
        services: {
          select: { id: true, name: true, isActive: true }
        }
      }
    });

    if (!type) {
      throw new NotFoundException('Service type not found');
    }

    return type;
  }

  async createType(dto: CreateServiceTypeDto) {
    // Check if category exists
    const category = await this.prisma.serviceCategory.findUnique({
      where: { id: dto.categoryId }
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    // Generate slug
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Check if slug exists
    const existingType = await this.prisma.serviceType.findUnique({
      where: { slug }
    });

    if (existingType) {
      throw new ConflictException('Type with this slug already exists');
    }

    return this.prisma.serviceType.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        categoryId: dto.categoryId,
        icon: dto.icon,
        color: dto.color,
        isActive: dto.isActive ?? true,
        sortOrder: dto.sortOrder ?? 0
      },
      include: {
        category: {
          select: { id: true, name: true, color: true }
        }
      }
    });
  }

  async updateType(id: string, dto: UpdateServiceTypeDto) {
    const type = await this.findTypeById(id);

    // Check category if provided
    if (dto.categoryId) {
      const category = await this.prisma.serviceCategory.findUnique({
        where: { id: dto.categoryId }
      });

      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    // Generate new slug if name changed
    let slug = type.slug;
    if (dto.name && dto.name !== type.name) {
      slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      const existingType = await this.prisma.serviceType.findFirst({
        where: { slug, id: { not: id } }
      });

      if (existingType) {
        throw new ConflictException('Type with this slug already exists');
      }
    }

    return this.prisma.serviceType.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name, slug }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.categoryId && { categoryId: dto.categoryId }),
        ...(dto.icon !== undefined && { icon: dto.icon }),
        ...(dto.color !== undefined && { color: dto.color }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder })
      },
      include: {
        category: {
          select: { id: true, name: true, color: true }
        }
      }
    });
  }

  async deleteType(id: string) {
    const type = await this.findTypeById(id);

    // Check if type has related services
    if (type.services.length > 0) {
      throw new BadRequestException('Cannot delete type with existing services');
    }

    return this.prisma.serviceType.delete({
      where: { id }
    });
  }

  // Services
  async findAllServices(where?: any) {
    return this.prisma.service.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        serviceCategory: {
          select: { id: true, name: true, color: true }
        },
        serviceType: {
          select: { id: true, name: true, color: true }
        },
        items: {
          select: { id: true, name: true }
        },
        bookings: {
          select: { id: true, status: true },
          where: { status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] } }
        }
      }
    });
  }

  async findServiceById(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        serviceCategory: {
          select: { id: true, name: true, color: true }
        },
        serviceType: {
          select: { id: true, name: true, color: true }
        },
        items: true,
        bookings: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async createService(dto: CreateServiceDto) {
    // Check category and type if provided
    if (dto.categoryId) {
      const category = await this.prisma.serviceCategory.findUnique({
        where: { id: dto.categoryId }
      });

      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    if (dto.typeId) {
      const type = await this.prisma.serviceType.findUnique({
        where: { id: dto.typeId }
      });

      if (!type) {
        throw new BadRequestException('Type not found');
      }
    }

    // Generate slug
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Check if slug exists
    const existingService = await this.prisma.service.findUnique({
      where: { slug }
    });

    if (existingService) {
      throw new ConflictException('Service with this slug already exists');
    }

    return this.prisma.service.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        shortDescription: dto.shortDescription,
        basePriceCents: dto.basePriceCents,
        price: dto.price,
        duration: dto.duration,
        categoryId: dto.categoryId,
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
        serviceCategory: {
          select: { id: true, name: true, color: true }
        },
        serviceType: {
          select: { id: true, name: true, color: true }
        }
      }
    });
  }

  async updateService(id: string, dto: UpdateServiceDto) {
    const service = await this.findServiceById(id);

    // Check category and type if provided
    if (dto.categoryId) {
      const category = await this.prisma.serviceCategory.findUnique({
        where: { id: dto.categoryId }
      });

      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    if (dto.typeId) {
      const type = await this.prisma.serviceType.findUnique({
        where: { id: dto.typeId }
      });

      if (!type) {
        throw new BadRequestException('Type not found');
      }
    }

    // Generate new slug if name changed
    let slug = service.slug;
    if (dto.name && dto.name !== service.name) {
      slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      const existingService = await this.prisma.service.findFirst({
        where: { slug, id: { not: id } }
      });

      if (existingService) {
        throw new ConflictException('Service with this slug already exists');
      }
    }

    return this.prisma.service.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name, slug }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.shortDescription !== undefined && { shortDescription: dto.shortDescription }),
        ...(dto.basePriceCents !== undefined && { basePriceCents: dto.basePriceCents }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.duration !== undefined && { duration: dto.duration }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.typeId !== undefined && { typeId: dto.typeId }),
        ...(dto.images !== undefined && { images: dto.images }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
        ...(dto.seoTitle !== undefined && { seoTitle: dto.seoTitle }),
        ...(dto.seoDescription !== undefined && { seoDescription: dto.seoDescription }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.features !== undefined && { features: dto.features }),
        ...(dto.requirements !== undefined && { requirements: dto.requirements }),
        ...(dto.metadata !== undefined && { metadata: dto.metadata })
      },
      include: {
        serviceCategory: {
          select: { id: true, name: true, color: true }
        },
        serviceType: {
          select: { id: true, name: true, color: true }
        }
      }
    });
  }

  async deleteService(id: string) {
    const service = await this.findServiceById(id);

    // Check if service has active bookings
    const activeBookings = service.bookings.filter(booking =>
      ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(booking.status)
    );

    if (activeBookings.length > 0) {
      throw new BadRequestException('Cannot delete service with active bookings');
    }

    return this.prisma.service.delete({
      where: { id }
    });
  }
}
