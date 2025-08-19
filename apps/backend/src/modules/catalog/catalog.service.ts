import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { SearchService } from '../search/search.service';

export type ProductDto = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  priceCents: number;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService, private readonly search: SearchService) {}

  async listProducts(
    params: { page?: number; pageSize?: number; q?: string; minPrice?: number; maxPrice?: number; sortBy?: 'createdAt' | 'name' | 'priceCents'; sortOrder?: 'asc' | 'desc' } = {},
  ): Promise<{ items: ProductDto[]; total: number; page: number; pageSize: number }> {
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));

    const where: Prisma.ProductWhereInput = {};
    if (params.q) {
      where.OR = [
        { name: { contains: params.q, mode: 'insensitive' } },
        { description: { contains: params.q, mode: 'insensitive' } },
      ];
    }
    if (typeof params.minPrice === 'number') where.priceCents = { ...(where.priceCents as Prisma.IntFilter | undefined), gte: params.minPrice };
    if (typeof params.maxPrice === 'number') where.priceCents = { ...(where.priceCents as Prisma.IntFilter | undefined), lte: params.maxPrice };

    const orderByField = params.sortBy ?? 'createdAt';
    const orderDirection = params.sortOrder ?? 'desc';

    const [total, items] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy: { [orderByField]: orderDirection },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    return { items, total, page, pageSize };
  }

  async getBySlug(slug: string): Promise<ProductDto> {
    const product = await this.prisma.product.findUnique({ where: { slug } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(data: { slug: string; name: string; description?: string | null; priceCents: number; imageUrl?: string | null }): Promise<ProductDto> {
    const product = await this.prisma.product.create({ data });
    // Fire-and-forget index (no await to avoid blocking request)
    void this.search.indexDocuments([
      { id: product.id, slug: product.slug, name: product.name, description: product.description, priceCents: product.priceCents, imageUrl: product.imageUrl },
    ]);
    return product;
  }

  async update(slug: string, data: Partial<{ slug: string; name: string; description?: string | null; priceCents: number; imageUrl?: string | null }>): Promise<ProductDto> {
    const product = await this.prisma.product.update({ where: { slug }, data });
    void this.search.indexDocuments([
      { id: product.id, slug: product.slug, name: product.name, description: product.description, priceCents: product.priceCents, imageUrl: product.imageUrl },
    ]);
    return product;
  }

  async remove(slug: string): Promise<{ deleted: boolean }> {
    const product = await this.prisma.product.delete({ where: { slug } });
    void this.search.deleteDocument(product.id);
    return { deleted: true };
  }

  async removeMany(slugs: string[]): Promise<{ deleted: number }> {
    if (!slugs || slugs.length === 0) return { deleted: 0 };
    const products = await this.prisma.product.findMany({ where: { slug: { in: slugs } }, select: { id: true } });
    const ids = products.map((p) => p.id);
    const res = await this.prisma.product.deleteMany({ where: { slug: { in: slugs } } });
    // Fire-and-forget search cleanup for each id
    ids.forEach((id) => void this.search.deleteDocument(id));
    return { deleted: res.count };
  }
}
