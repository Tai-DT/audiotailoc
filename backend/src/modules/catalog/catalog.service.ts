import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// import { Prisma } from '@prisma/client';
// import { SearchService } from '../search/search.service'; // Disabled due to module not enabled
import { CacheService } from '../cache/cache.service';

export type ProductDto = {
  id: string;
  slug?: string;
  name: string;
  description?: string | null;
  // Tests expect priceCents field
  priceCents: number;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService, /* private readonly search: SearchService, */ private readonly cache: CacheService) {}

  async listProducts(
    params: { page?: number; pageSize?: number; q?: string; minPrice?: number; maxPrice?: number; sortBy?: 'createdAt' | 'name' | 'priceCents' | 'price' | 'createdAt'; sortOrder?: 'asc' | 'desc'; featured?: boolean } = {},
  ): Promise<{ items: ProductDto[]; total: number; page: number; pageSize: number }> {
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));

    // Use a loose type to match tests that work with mocked Prisma shapes
    const where: any = {};
    if (params.q) {
      where.OR = [
        { name: { contains: params.q, mode: 'insensitive' } },
        { description: { contains: params.q, mode: 'insensitive' } },
      ];
    }
    // Tests expect priceCents filter values to be used directly
    if (typeof params.minPrice === 'number') where.priceCents = { ...(where.priceCents || {}), gte: params.minPrice };
    if (typeof params.maxPrice === 'number') where.priceCents = { ...(where.priceCents || {}), lte: params.maxPrice };
    if (typeof params.featured === 'boolean') where.featured = params.featured; // Used by unit tests

    const orderByField = (params.sortBy === 'price' ? 'priceCents' : params.sortBy) ?? 'createdAt';
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

  async getBySlug(slug: string): Promise<ProductDto> {
    const product = await (this.prisma as any).product.findUnique({ where: { slug } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(data: { slug: string; name: string; description?: string | null; priceCents: number; imageUrl?: string | null }): Promise<ProductDto> {
    // Validate price is positive
    if (data.priceCents <= 0) {
      throw new Error('Price must be greater than 0');
    }
    // Ensure slug uniqueness
    const existed = await (this.prisma as any).product.findUnique({ where: { slug: data.slug } });
    if (existed) {
      throw new Error('Product with this slug already exists');
    }
    
    const product = await (this.prisma as any).product.create({ data });
    // Fire-and-forget index (no await to avoid blocking request)
    // Optional search indexing (no-op)
    /* void this.search.indexDocuments([
      { id: product.id, slug: product.slug, name: product.name, description: product.description, priceCents: product.priceCents, imageUrl: product.imageUrl, categoryId: product.categoryId },
    ]); */
    await this.cache.deletePattern('products:list:*');
    return product;
  }

  async update(slug: string, data: Partial<{ name: string; description?: string | null; priceCents: number; imageUrl?: string | null }>): Promise<ProductDto> {
    const product = await (this.prisma as any).product.update({ where: { slug }, data });
    /* void this.search.indexDocuments([
      { id: product.id, slug: product.slug, name: product.name, description: product.description, priceCents: product.priceCents, imageUrl: product.imageUrl, categoryId: product.categoryId },
    ]); */
    await this.cache.deletePattern('products:list:*');
    return product;
  }

  async remove(slug: string): Promise<{ deleted: boolean }> {
    const product = await (this.prisma as any).product.delete({ where: { slug } });
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

  async removeMany(slugs: string[] | null): Promise<{ deleted: number }> {
    if (!slugs || slugs.length === 0) return { deleted: 0 };
    // The tests expect deleteMany by slug
    const res = await (this.prisma as any).product.deleteMany({ where: { slug: { in: slugs } } });
    await this.cache.deletePattern('products:list:*');
    return { deleted: res.count };
  }
}
