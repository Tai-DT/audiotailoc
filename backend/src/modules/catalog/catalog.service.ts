import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
// import { SearchService } from '../search/search.service'; // Disabled due to module not enabled
import { CacheService } from '../cache/cache.service';

export type ProductDto = {
  id: string;
  name: string;
  description?: string | null;
  price: number; // Using 'price' instead of 'priceCents' to match schema
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService, /* private readonly search: SearchService, */ private readonly cache: CacheService) {}

  async listProducts(
    params: { page?: number; pageSize?: number; q?: string; minPrice?: number; maxPrice?: number; sortBy?: 'createdAt' | 'name' | 'price'; sortOrder?: 'asc' | 'desc'; featured?: boolean } = {},
  ): Promise<{ items: ProductDto[]; total: number; page: number; pageSize: number }> {
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));

    const where: Prisma.ProductWhereInput = {};
    if (params.q) {
      where.OR = [
        { name: { contains: params.q } },
        { description: { contains: params.q } },
      ];
    }
    if (typeof params.minPrice === 'number') where.price = { ...(where.price as Prisma.IntFilter | undefined), gte: params.minPrice * 100 };
    if (typeof params.maxPrice === 'number') where.price = { ...(where.price as Prisma.IntFilter | undefined), lte: params.maxPrice * 100 };
    // if (typeof params.featured === 'boolean') where.featured = params.featured; // Field not in SQLite schema

    const orderByField = params.sortBy ?? 'createdAt';
    const orderDirection = params.sortOrder ?? 'desc';

    const cacheKey = `products:list:${JSON.stringify({ where, page, pageSize, orderByField, orderDirection })}`;
    const cached = await this.cache.get<{ items: ProductDto[]; total: number; page: number; pageSize: number }>(cacheKey);
    if (cached) return cached;

    const [total, items] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy: { [orderByField]: orderDirection },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    const result = { items, total, page, pageSize };
    await this.cache.set(cacheKey, result, { ttl: 60 });
    return result;
  }

  async getById(id: string): Promise<ProductDto> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(data: { name: string; description?: string | null; price: number; imageUrl?: string | null }): Promise<ProductDto> {
    // Validate price is positive
    if (data.price <= 0) {
      throw new Error('Price must be greater than 0');
    }
    
    const product = await this.prisma.product.create({ data });
    // Fire-and-forget index (no await to avoid blocking request)
    // Optional search indexing (no-op)
    /* void this.search.indexDocuments([
      { id: product.id, slug: product.slug, name: product.name, description: product.description, priceCents: product.priceCents, imageUrl: product.imageUrl, categoryId: product.categoryId },
    ]); */
    await this.cache.deletePattern('products:list:*');
    return product;
  }

  async update(id: string, data: Partial<{ name: string; description?: string | null; price: number; imageUrl?: string | null }>): Promise<ProductDto> {
    const product = await this.prisma.product.update({ where: { id }, data });
    /* void this.search.indexDocuments([
      { id: product.id, slug: product.slug, name: product.name, description: product.description, priceCents: product.priceCents, imageUrl: product.imageUrl, categoryId: product.categoryId },
    ]); */
    await this.cache.deletePattern('products:list:*');
    return product;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const product = await this.prisma.product.delete({ where: { id } });
    /* void this.search.deleteDocument(product.id); */
    await this.cache.deletePattern('products:list:*');
    return { deleted: true };
  }

  async listCategories(): Promise<{ id: string; slug: string; name: string; parentId: string | null }[]> {
    const key = 'categories:list';
    const cached = await this.cache.get<{ id: string; slug: string; name: string; parentId: string | null }[]>(key);
    if (cached) return cached;
    const items = await this.prisma.category.findMany({ orderBy: { name: 'asc' } });
    await this.cache.set(key, items, { ttl: 300 });
    return items;
  }

  async removeMany(ids: string[]): Promise<{ deleted: number }> {
    if (!ids || ids.length === 0) return { deleted: 0 };
    const res = await this.prisma.product.deleteMany({ where: { id: { in: ids } } });
    // Fire-and-forget search cleanup for each id
    // ids.forEach((id) => void this.search.deleteDocument(id));
    await this.cache.deletePattern('products:list:*');
    return { deleted: res.count };
  }
}
