import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../caching/cache.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InventoryService } from '../inventory/inventory.service';
import { ActivityLogService } from '../logging/activity-log.service';
import { randomUUID } from 'crypto';

export type ProductDto = {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  priceCents: number;
  originalPriceCents?: number | null;
  imageUrl?: string | null;
  images?: string[] | null;
  categoryId?: string | null;
  brand?: string | null;
  model?: string | null;
  sku?: string | null;
  specifications?: any | null;
  features?: string | null;
  warranty?: string | null;
  weight?: number | null;
  dimensions?: string | null;
  stockQuantity?: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number | null;
  tags?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;
  featured?: boolean;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class CatalogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventory: InventoryService,
    private readonly cache: CacheService,
    private readonly activityLog: ActivityLogService,
  ) { }

  private safeParseJSON(data: any, defaultValue: any = null) {
    if (!data) return defaultValue;
    if (typeof data !== 'string') return data;
    try {
      return JSON.parse(data);
    } catch (e) {
      return defaultValue;
    }
  }

  // --- CATEGORIES ---

  async listCategories() {
    return this.prisma.categories.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.prisma.categories.findUnique({ where: { slug } });
    if (!category) throw new NotFoundException('Danh mục không tồn tại');
    return category;
  }

  async createCategory(dto: any, userId?: string) {
    const category = await this.prisma.categories.create({
      data: {
        id: randomUUID(),
        ...dto,
        updatedAt: new Date(),
      },
    });

    if (userId) {
      await this.activityLog.logActivity({
        userId,
        action: 'CREATE',
        resource: 'category',
        resourceId: category.id,
        details: { name: category.name },
        category: 'catalog',
      });
    }

    return category;
  }

  async updateCategory(id: string, dto: any, userId?: string) {
    const category = await this.prisma.categories.update({
      where: { id },
      data: dto,
    });

    if (userId) {
      await this.activityLog.logActivity({
        userId,
        action: 'UPDATE',
        resource: 'category',
        resourceId: id,
        details: dto,
        category: 'catalog',
      });
    }

    return category;
  }

  async deleteCategory(id: string, userId?: string) {
    // Check if category has products
    const productCount = await this.prisma.products.count({
      where: { categoryId: id, isDeleted: false },
    });
    if (productCount > 0) {
      throw new BadRequestException('Không thể xóa danh mục đang có sản phẩm');
    }

    await this.prisma.categories.delete({ where: { id } });

    if (userId) {
      await this.activityLog.logActivity({
        userId,
        action: 'DELETE',
        resource: 'category',
        resourceId: id,
        category: 'catalog',
        severity: 'medium',
      });
    }

    return { success: true };
  }

  // --- PRODUCTS ---

  async listProducts(params: any) {
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));

    const where: any = { isDeleted: false };
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.brand) where.brand = params.brand;
    if (params.featured !== undefined) where.featured = params.featured;
    if (params.isActive !== undefined) where.isActive = params.isActive;
    if (params.q) {
      where.OR = [
        { name: { contains: params.q, mode: 'insensitive' } },
        { brand: { contains: params.q, mode: 'insensitive' } },
        { sku: { contains: params.q, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.products.count({ where }),
      this.prisma.products.findMany({
        where,
        orderBy: { [params.sortBy || 'createdAt']: params.sortOrder || 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const mappedItems = items.map(product => ({
      ...product,
      priceCents: Number(product.priceCents),
      originalPriceCents: product.originalPriceCents ? Number(product.originalPriceCents) : null,
      images: this.safeParseJSON(product.images, []),
      specifications: this.safeParseJSON(product.specifications, {}),
    }));

    return {
      items: mappedItems,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getProductsByCategory(slug: string, params: { page?: number; limit?: number }) {
    const category = await this.getCategoryBySlug(slug);
    return this.listProducts({ categoryId: category.id, ...params });
  }

  async getById(id: string): Promise<ProductDto> {
    const cacheKey = `product:${id}`;
    const cached = await this.cache.get<ProductDto>(cacheKey);
    if (cached) return cached;

    const product = await this.prisma.products.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

    const result = {
      ...product,
      priceCents: Number(product.priceCents),
      originalPriceCents: product.originalPriceCents ? Number(product.originalPriceCents) : null,
      images: this.safeParseJSON(product.images, []),
      specifications: this.safeParseJSON(product.specifications, {}),
    } as any;

    await this.cache.set(cacheKey, result, { ttl: 300, tags: ['products'] });
    return result;
  }

  async getBySlug(slug: string): Promise<ProductDto> {
    const cacheKey = `product:slug:${slug}`;
    const cached = await this.cache.get<ProductDto>(cacheKey);
    if (cached) return cached;

    const product = await this.prisma.products.findUnique({ where: { slug } });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

    const result = {
      ...product,
      priceCents: Number(product.priceCents),
      originalPriceCents: product.originalPriceCents ? Number(product.originalPriceCents) : null,
      images: this.safeParseJSON(product.images, []),
      specifications: this.safeParseJSON(product.specifications, {}),
    } as any;

    await this.cache.set(cacheKey, result, { ttl: 300, tags: ['products'] });
    return result;
  }

  async checkSkuExists(sku: string, excludeId?: string): Promise<boolean> {
    const where: any = { sku };
    if (excludeId) where.id = { not: excludeId };
    const count = await this.prisma.products.count({ where });
    return count > 0;
  }

  async generateUniqueSku(baseName?: string): Promise<string> {
    const base =
      baseName
        ?.toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 8) || 'PROD';
    let sku = base;
    let counter = 1;
    while (await this.checkSkuExists(sku)) {
      sku = `${base}-${counter.toString().padStart(3, '0')}`;
      counter++;
    }
    return sku;
  }

  async create(data: CreateProductDto, userId?: string): Promise<ProductDto> {
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
    const existed = await this.prisma.products.findUnique({ where: { slug } });
    if (existed) throw new BadRequestException('Slug đã tồn tại');

    if (data.sku) {
      const skuExisted = await this.checkSkuExists(data.sku);
      if (skuExisted) throw new BadRequestException(`SKU "${data.sku}" đã được sử dụng`);
    }

    const product = await this.prisma.products.create({
      data: {
        id: randomUUID(),
        slug,
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription || data.description?.substring(0, 200),
        priceCents: BigInt(data.priceCents),
        originalPriceCents: BigInt(data.originalPriceCents || data.priceCents),
        imageUrl: data.images?.[0] || null,
        images: data.images ? JSON.stringify(data.images) : null,
        categoryId: data.categoryId,
        brand: data.brand,
        model: data.model,
        sku: data.sku || (await this.generateUniqueSku(data.name)),
        specifications: data.specifications ? JSON.stringify(data.specifications) : null,
        metaTitle: data.metaTitle || data.name,
        metaDescription: data.metaDescription || data.shortDescription,
        featured: data.featured || false,
        isActive: data.isActive ?? true,
      } as any,
    });

    await this.inventory.create(product.id, { stock: data.stockQuantity || 0 });

    if (userId) {
      await this.activityLog.logActivity({
        userId,
        action: 'CREATE',
        resource: 'product',
        resourceId: product.id,
        details: { name: product.name, price: data.priceCents },
        category: 'catalog',
      });
    }

    await this.cache.invalidateByTags(['products']);
    return this.getById(product.id);
  }

  async update(id: string, data: UpdateProductDto, userId?: string): Promise<ProductDto> {
    const existing = await this.prisma.products.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Sản phẩm không tồn tại');

    // Check SKU uniqueness if SKU is being updated
    if (data.sku && data.sku !== existing.sku) {
      const skuExisted = await this.checkSkuExists(data.sku, id);
      if (skuExisted) throw new BadRequestException(`SKU "${data.sku}" đã được sử dụng`);
    }

    const updateData: any = { ...data };
    if (data.priceCents !== undefined) updateData.priceCents = BigInt(data.priceCents);
    if (data.originalPriceCents !== undefined && data.originalPriceCents !== null) {
      updateData.originalPriceCents = BigInt(data.originalPriceCents);
    }
    if (data.images) {
      updateData.imageUrl = data.images[0];
      updateData.images = JSON.stringify(data.images);
    }
    if (data.specifications) {
      updateData.specifications = JSON.stringify(data.specifications);
    }

    const product = await this.prisma.products.update({
      where: { id },
      data: updateData,
    });

    if (userId) {
      await this.activityLog.logActivity({
        userId,
        action: 'UPDATE',
        resource: 'product',
        resourceId: id,
        details: data,
        category: 'catalog',
      });
    }

    await this.cache.invalidateByTags(['products']);

    return this.getById(product.id);
  }

  async delete(id: string, userId?: string) {
    const product = await this.prisma.products.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

    await this.prisma.products.update({
      where: { id },
      data: { isDeleted: true, updatedAt: new Date() },
    });

    if (userId) {
      await this.activityLog.logActivity({
        userId,
        action: 'DELETE',
        resource: 'product',
        resourceId: id,
        category: 'catalog',
        severity: 'medium',
      });
    }

    await Promise.all([
      this.cache.del(`product:${id}`),
      this.cache.del(`product:slug:${product.slug}`),
      this.cache.del('products:list:*'),
    ]);

    return { success: true };
  }

  async removeMany(ids: string[], userId?: string) {
    await this.prisma.products.updateMany({
      where: { id: { in: ids } },
      data: { isDeleted: true, updatedAt: new Date() },
    });

    if (userId) {
      await this.activityLog.logActivity({
        userId,
        action: 'DELETE_MANY',
        resource: 'product',
        details: { ids },
        category: 'catalog',
        severity: 'high',
      });
    }

    await this.cache.del('products:list:*');
    return { success: true };
  }
}
