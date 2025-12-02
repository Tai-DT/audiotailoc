import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';

@Injectable()
export class ServiceTypesService {
  constructor(private prisma: PrismaService) {}

  async create(createServiceTypeDto: CreateServiceTypeDto) {
    const slug = await this.generateSlug(createServiceTypeDto.name);

    return this.prisma.service_types.create({
      data: {
        id: randomUUID(),
        name: createServiceTypeDto.name,
        description: createServiceTypeDto.description,
        icon: createServiceTypeDto.icon,
        color: createServiceTypeDto.color,
        sortOrder: createServiceTypeDto.sortOrder || 0,
        slug,
        isActive: createServiceTypeDto.isActive ?? true,
        updatedAt: new Date(),
      },
    });
  }

  async findAll() {
    return this.prisma.service_types.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const serviceType = await this.prisma.service_types.findUnique({
      where: { id },
    });

    if (!serviceType) {
      throw new NotFoundException(`Service type with ID "${id}" not found`);
    }

    return serviceType;
  }

  async update(id: string, updateServiceTypeDto: UpdateServiceTypeDto) {
    await this.findOne(id); // Check if service type exists

    return this.prisma.service_types.update({
      where: { id },
      data: updateServiceTypeDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if service type exists

    // Check if type is being used by any services
    const serviceCount = await this.prisma.services.count({
      where: { typeId: id },
    });

    if (serviceCount > 0) {
      throw new Error('Cannot delete service type that is being used by services');
    }

    return this.prisma.service_types.delete({
      where: { id },
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
      const existing = await this.prisma.service_types.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existing) break;

      slug = `${baseSlug}-${counter++}`;
    }

    return slug;
  }
}