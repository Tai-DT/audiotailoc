import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async list(params: { page?: number; pageSize?: number; lowStockOnly?: boolean }) {
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
    // Prisma doesn't support field-to-field comparisons in filters. We'll fetch
    // with a coarse where and filter in memory when lowStockOnly is requested.
    const baseWhere: any = params.lowStockOnly ? { lowStockThreshold: { gt: 0 } } : {};
    const [totalAll, itemsPage] = await this.prisma.$transaction([
      this.prisma.inventory.findMany({ where: baseWhere, include: { product: true }, orderBy: { updatedAt: 'desc' } }),
      this.prisma.inventory.findMany({ where: baseWhere, include: { product: true }, orderBy: { updatedAt: 'desc' } }),
    ]);
    const all = totalAll;
    const filtered = params.lowStockOnly ? all.filter((i) => i.lowStockThreshold > 0 && i.stock <= i.lowStockThreshold) : all;
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    return { total, page, pageSize, items };
  }

  async adjust(productId: string, delta: { stockDelta?: number; reservedDelta?: number; lowStockThreshold?: number }) {
    const data: any = {};
    if (typeof delta.stockDelta === 'number') data.stock = { increment: delta.stockDelta };
    if (typeof delta.reservedDelta === 'number') data.reserved = { increment: delta.reservedDelta };
    if (typeof delta.lowStockThreshold === 'number') data.lowStockThreshold = delta.lowStockThreshold;
    const inv = await this.prisma.inventory.update({ where: { productId }, data });
    return inv;
  }
}

