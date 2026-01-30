import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomUUID } from 'crypto';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { page: number; pageSize: number; parentId?: string; isActive?: boolean }) {
    const skip = (params.page - 1) * params.pageSize;

    const where: any = {};
    if (params.parentId) where.parentId = params.parentId;
    if (params.isActive !== undefined) where.isActive = params.isActive;

    const [categories, total] = await Promise.all([
      this.prisma.categories.findMany({
        where,
        skip,
        take: params.pageSize,
        include: {
          products: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.categories.count({ where }),
    ]);

    return {
      data: categories,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize),
    };
  }

  async findById(id: string) {
    const category = await this.prisma.categories.findUnique({
      where: { id },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        other_categories: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findByParentId(parentId: string) {
    return this.prisma.categories.findMany({
      where: { parentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(createCategoryDto: CreateCategoryDto) {
    if (!createCategoryDto.name || !createCategoryDto.slug) {
      throw new BadRequestException('name and slug are required');
    }

    // Check if slug already exists
    const existing = await this.prisma.categories.findUnique({
      where: { slug: createCategoryDto.slug },
    });

    if (existing) {
      throw new BadRequestException('Category slug already exists');
    }

    const category = await this.prisma.categories.create({
      data: {
        id: randomUUID(),
        name: createCategoryDto.name,
        slug: createCategoryDto.slug,
        description: createCategoryDto.description,
        imageUrl: createCategoryDto.imageUrl,
        parentId: createCategoryDto.parentId,
        metaTitle: createCategoryDto.metaTitle,
        metaDescription: createCategoryDto.metaDescription,
        metaKeywords: createCategoryDto.metaKeywords,
        canonicalUrl: createCategoryDto.canonicalUrl,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Category created: ${category.id}`);
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findById(id);

    // Check if new slug already exists
    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existing = await this.prisma.categories.findUnique({
        where: { slug: updateCategoryDto.slug },
      });

      if (existing) {
        throw new BadRequestException('Category slug already exists');
      }
    }

    // Check for circular dependency if parentId is being updated
    if (updateCategoryDto.parentId && updateCategoryDto.parentId !== category.parentId) {
      await this.validateParentCategory(id, updateCategoryDto.parentId);
    }

    const updated = await this.prisma.categories.update({
      where: { id },
      data: {
        name: updateCategoryDto.name ?? category.name,
        slug: updateCategoryDto.slug ?? category.slug,
        description: updateCategoryDto.description ?? category.description,
        imageUrl: updateCategoryDto.imageUrl ?? category.imageUrl,
        parentId: updateCategoryDto.parentId ?? category.parentId,
        metaTitle: updateCategoryDto.metaTitle ?? category.metaTitle,
        metaDescription: updateCategoryDto.metaDescription ?? category.metaDescription,
        metaKeywords: updateCategoryDto.metaKeywords ?? category.metaKeywords,
        canonicalUrl: updateCategoryDto.canonicalUrl ?? category.canonicalUrl,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Category updated: ${id}`);
    return updated;
  }

  private async validateParentCategory(categoryId: string, parentId: string) {
    if (categoryId === parentId) {
      throw new BadRequestException('Category cannot be its own parent');
    }

    let currentParentId: string | null = parentId;
    // Limit depth to prevent infinite loops in case of existing corruption
    let depth = 0;
    const MAX_DEPTH = 100;

    while (currentParentId && depth < MAX_DEPTH) {
      const parent = await this.prisma.categories.findUnique({
        where: { id: currentParentId },
        select: { id: true, parentId: true },
      });

      if (!parent) break;

      if (parent.id === categoryId) {
        throw new BadRequestException(
          'Circular dependency detected: Category cannot be a child of its own descendant',
        );
      }

      currentParentId = parent.parentId;
      depth++;
    }
  }

  async updateStatus(id: string, isActive: boolean) {
    const _category = await this.findById(id);

    const updated = await this.prisma.categories.update({
      where: { id },
      data: {
        isActive,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Category status updated: ${id} -> ${isActive}`);
    return updated;
  }

  async delete(id: string) {
    const _category = await this.findById(id);

    // Check if category has products
    const productCount = await this.prisma.products.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      throw new BadRequestException(
        `Cannot delete category with ${productCount} products. Please reassign products first.`,
      );
    }

    await this.prisma.categories.delete({
      where: { id },
    });

    this.logger.log(`Category deleted: ${id}`);
    return { message: 'Category deleted successfully' };
  }
}
