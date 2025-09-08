import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServiceCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createServiceCategoryDto: CreateServiceCategoryDto) {
    const slug = await this.generateSlug(createServiceCategoryDto.name);
    
    return this.prisma.serviceCategory.create({
      data: {
        ...createServiceCategoryDto,
        slug,
      },
    });
  }

  async findAll() {
    return this.prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.serviceCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Service category with ID "${id}" not found`);
    }

    return category;
  }

  async update(id: string, updateServiceCategoryDto: UpdateServiceCategoryDto) {
    await this.findOne(id); // Check if category exists
    
    return this.prisma.serviceCategory.update({
      where: { id },
      data: updateServiceCategoryDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if category exists
    
    // Check if category is being used by any services
    const serviceCount = await this.prisma.service.count({
      where: { categoryId: id },
    });

    if (serviceCount > 0) {
      throw new Error('Cannot delete category that is being used by services');
    }

    return this.prisma.serviceCategory.delete({
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
      const existing = await this.prisma.serviceCategory.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existing) break;

      slug = `${baseSlug}-${counter++}`;
    }

    return slug;
  }
}
