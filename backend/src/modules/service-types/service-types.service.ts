import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServiceTypesService {
  constructor(private prisma: PrismaService) {}

  async create(createServiceTypeDto: CreateServiceTypeDto) {
    // Check if category exists
    const category = await this.prisma.serviceCategory.findUnique({
      where: { id: createServiceTypeDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID "${createServiceTypeDto.categoryId}" not found`,
      );
    }

    const slug = await this.generateSlug(createServiceTypeDto.name);
    
    return this.prisma.serviceType.create({
      data: {
        ...createServiceTypeDto,
        slug,
      },
      include: {
        category: true,
      },
    });
  }

  async findAll(categoryId?: string) {
    const where: Prisma.ServiceTypeWhereInput = { isActive: true };
    
    if (categoryId) {
      where.categoryId = categoryId;
    }

    return this.prisma.serviceType.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const serviceType = await this.prisma.serviceType.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!serviceType) {
      throw new NotFoundException(`Service type with ID "${id}" not found`);
    }

    return serviceType;
  }

  async update(id: string, updateServiceTypeDto: UpdateServiceTypeDto) {
    await this.findOne(id); // Check if service type exists
    
    if (updateServiceTypeDto.categoryId) {
      // Check if new category exists
      const category = await this.prisma.serviceCategory.findUnique({
        where: { id: updateServiceTypeDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID "${updateServiceTypeDto.categoryId}" not found`,
        );
      }
    }

    return this.prisma.serviceType.update({
      where: { id },
      data: updateServiceTypeDto,
      include: {
        category: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if service type exists
    
    // Check if type is being used by any services
    const serviceCount = await this.prisma.service.count({
      where: { typeId: id },
    });

    if (serviceCount > 0) {
      throw new Error('Cannot delete service type that is being used by services');
    }

    return this.prisma.serviceType.delete({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  private async generateSlug(name: string): Promise<string> {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/--+/g, '-') // Replace multiple - with single -
      .trim();

    let slug = baseSlug;
    let counter = 1;

    // Check if slug already exists
    while (true) {
      const existing = await this.prisma.serviceType.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existing) break;

      slug = `${baseSlug}-${counter++}`;
    }

    return slug;
  }
}
