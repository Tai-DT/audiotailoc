import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ListPromotionsDto } from './dto/list-promotions.dto';

type PromotionMetadata = {
  customerSegments?: string[];
  categories?: string[];
  products?: string[];
};

type PromotionResponse = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  type: string;
  value: number;
  minOrderAmount?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usageCount: number;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  categories: string[];
  products: string[];
  customerSegments: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
};

@Injectable()
export class PromotionService {
  constructor(private readonly prisma: PrismaService) {}

  async list(params: ListPromotionsDto) {
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
    const skip = (page - 1) * pageSize;
    const where = this.buildWhere(params);

    const [total, records] = await this.prisma.$transaction([
      this.prisma.promotions.count({ where }),
      this.prisma.promotions.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
    ]);

    const promotions = records.map((promo) => this.toResponse(promo));
    const stats = await this.buildStats();

    return {
      promotions,
      total,
      page,
      pageSize,
      stats,
    };
  }

  async getById(id: string): Promise<PromotionResponse> {
    const promotion = await this.prisma.promotions.findUnique({ where: { id } });
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }
    return this.toResponse(promotion);
  }

  async create(dto: CreatePromotionDto): Promise<PromotionResponse> {
    await this.ensureUniqueCode(dto.code);
    const data = this.toCreateData(dto);
    const created = await this.prisma.promotions.create({ data });
    return this.toResponse(created);
  }

  async update(id: string, dto: UpdatePromotionDto): Promise<PromotionResponse> {
    const existing = await this.prisma.promotions.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Promotion not found');
    }
    if (dto.code && dto.code !== existing.code) {
      await this.ensureUniqueCode(dto.code);
    }
    const data = this.toUpdateData(dto, existing);
    const updated = await this.prisma.promotions.update({ where: { id }, data });
    return this.toResponse(updated);
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const existing = await this.prisma.promotions.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Promotion not found');
    }
    await this.prisma.promotions.delete({ where: { id } });
    return { deleted: true };
  }

  async duplicate(id: string): Promise<PromotionResponse> {
    const existing = await this.prisma.promotions.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Promotion not found');
    }

    const timestamp = Date.now();
    const base = `${existing.code}-COPY-${timestamp}`;
    const newCode = await this.generateUniqueCode(base);

    const duplicated = await this.prisma.promotions.create({
      data: {
        id: crypto.randomUUID(),
        code: newCode,
        name: `${existing.name} (Copy)`,
        description: existing.description,
        type: existing.type,
        value: existing.value,
        isActive: existing.isActive,
        starts_at: existing.starts_at ?? new Date(),
        expiresAt: existing.expiresAt,
        min_order_amount: existing.min_order_amount,
        max_discount: existing.max_discount,
        usage_limit: existing.usage_limit,
        usage_count: 0,
        metadata: existing.metadata,
        created_by: existing.created_by,
        updatedAt: new Date(),
      },
    });

    return this.toResponse(duplicated);
  }

  async validate(code?: string): Promise<{ code: string; type: 'PERCENT' | 'FIXED'; value: number } | null> {
    if (!code) return null;
    const now = new Date();
    const promo = await this.prisma.promotions.findUnique({ where: { code } });
    if (!promo) return null;
    if (promo.starts_at && promo.starts_at > now) return null;
    if (promo.expiresAt && promo.expiresAt < now) return null;
    if (promo.isActive === false) return null;

    const normalizedType = this.normalizeTypeForCheckout(promo.type);
    if (!normalizedType) {
      return null;
    }

    return { code: promo.code, type: normalizedType, value: promo.value };
  }

  computeDiscount(promo: { type: 'PERCENT' | 'FIXED'; value: number } | null, subtotal: number): number {
    if (!promo) return 0;
    if (promo.type === 'FIXED') return Math.min(subtotal, promo.value);
    const pct = Math.max(0, Math.min(100, promo.value));
    return Math.floor((subtotal * pct) / 100);
  }

  private buildWhere(params: ListPromotionsDto): Prisma.promotionsWhereInput {
    const where: Prisma.promotionsWhereInput = {};
    const andConditions: Prisma.promotionsWhereInput[] = [];

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { code: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.type) {
      const dbType = this.mapTypeToDb(params.type);
      if (dbType) {
        where.type = dbType;
      }
    }

    if (params.status) {
      const now = new Date();
      switch (params.status) {
        case 'active':
          andConditions.push({ isActive: true });
          andConditions.push({ OR: [{ starts_at: null }, { starts_at: { lte: now } }] });
          andConditions.push({ OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] });
          break;
        case 'inactive':
          andConditions.push({ isActive: false });
          break;
        case 'expired':
          andConditions.push({ OR: [{ isActive: false }, { expiresAt: { lt: now } }] });
          break;
        case 'upcoming':
          andConditions.push({ isActive: true });
          andConditions.push({ starts_at: { gt: now } });
          break;
        default:
          break;
      }
    }

    if (andConditions.length) {
      where.AND = andConditions;
    }
    return where;
  }

  private async ensureUniqueCode(code: string) {
    const existing = await this.prisma.promotions.findUnique({ where: { code } });
    if (existing) {
      throw new BadRequestException('Promotion code already exists');
    }
  }

  private toCreateData(dto: CreatePromotionDto): Prisma.promotionsCreateInput {
    const metadata = this.buildMetadata(dto);
    return {
      id: crypto.randomUUID(),
      code: dto.code,
      name: dto.name,
      description: dto.description,
      type: this.mapTypeToDb(dto.type) ?? dto.type.toUpperCase(),
      value: Math.round(dto.value),
      isActive: dto.isActive ?? true,
      starts_at: dto.startDate ? new Date(dto.startDate) : null,
      expiresAt: dto.endDate ? new Date(dto.endDate) : null,
      min_order_amount: dto.minOrderAmount ? Math.round(dto.minOrderAmount) : null,
      max_discount: dto.maxDiscount ? Math.round(dto.maxDiscount) : null,
      usage_limit: dto.usageLimit ? Math.round(dto.usageLimit) : null,
      usage_count: 0,
      created_by: dto.createdBy ?? 'System',
      updatedAt: new Date(),
      metadata,
    };
  }

  private toUpdateData(dto: UpdatePromotionDto, existing: Prisma.promotionsGetPayload<{}>): Prisma.promotionsUpdateInput {
    const metadata = this.buildMetadata(dto, existing.metadata as PromotionMetadata | undefined);
    const update: Prisma.promotionsUpdateInput = {};

    if (dto.code !== undefined) update.code = dto.code;
    if (dto.name !== undefined) update.name = dto.name;
    if (dto.description !== undefined) update.description = dto.description;
    if (dto.type !== undefined) update.type = this.mapTypeToDb(dto.type) ?? dto.type.toUpperCase();
    if (dto.value !== undefined) update.value = Math.round(dto.value);
    if (dto.isActive !== undefined) update.isActive = dto.isActive;
    if (dto.startDate !== undefined) update.starts_at = dto.startDate ? new Date(dto.startDate) : null;
    if (dto.endDate !== undefined) update.expiresAt = dto.endDate ? new Date(dto.endDate) : null;
    if (dto.minOrderAmount !== undefined) update.min_order_amount = dto.minOrderAmount === null ? null : Math.round(dto.minOrderAmount);
    if (dto.maxDiscount !== undefined) update.max_discount = dto.maxDiscount === null ? null : Math.round(dto.maxDiscount);
    if (dto.usageLimit !== undefined) update.usage_limit = dto.usageLimit === null ? null : Math.round(dto.usageLimit);
    if (dto.usageCount !== undefined) update.usage_count = Math.max(0, Math.round(dto.usageCount));
    if (dto.createdBy !== undefined) update.created_by = dto.createdBy;
    if (metadata !== undefined) update.metadata = metadata;

    return update;
  }

  private buildMetadata(
    dto: Partial<CreatePromotionDto | UpdatePromotionDto>,
    fallback?: PromotionMetadata,
  ): PromotionMetadata | null {
    const metadata: PromotionMetadata = {
      customerSegments: dto.customerSegments ?? fallback?.customerSegments ?? [],
      categories: dto.categories ?? fallback?.categories ?? [],
      products: dto.products ?? fallback?.products ?? [],
    };

    if (
      (!metadata.customerSegments || metadata.customerSegments.length === 0) &&
      (!metadata.categories || metadata.categories.length === 0) &&
      (!metadata.products || metadata.products.length === 0)
    ) {
      return null;
    }

    return metadata;
  }

  private toResponse(promo: Prisma.promotionsGetPayload<{}>): PromotionResponse {
    const metadata = (promo.metadata as PromotionMetadata | null) || {};
    const start = promo.starts_at ?? promo.createdAt;
    const end = promo.expiresAt ?? null;

    return {
      id: promo.id,
      code: promo.code,
      name: promo.name,
      description: promo.description,
      type: this.mapTypeToResponse(promo.type),
      value: promo.value,
      minOrderAmount: promo.min_order_amount ?? null,
      maxDiscount: promo.max_discount ?? null,
      usageLimit: promo.usage_limit ?? null,
      usageCount: promo.usage_count ?? 0,
      isActive: promo.isActive,
      startDate: start ? start.toISOString() : null,
      endDate: end ? end.toISOString() : null,
      categories: metadata.categories ?? [],
      products: metadata.products ?? [],
      customerSegments: metadata.customerSegments ?? [],
      createdAt: promo.createdAt.toISOString(),
      updatedAt: promo.updatedAt.toISOString(),
      createdBy: promo.created_by ?? null,
    };
  }

  private async buildStats() {
    const promotions = await this.prisma.promotions.findMany();
    const now = new Date();

    const totalPromotions = promotions.length;
    const activePromotions = promotions.filter(
      (p) =>
        p.isActive &&
        (!p.starts_at || p.starts_at <= now) &&
        (!p.expiresAt || p.expiresAt >= now),
    ).length;
    const expiredPromotions = promotions.filter(
      (p) => p.expiresAt !== null && p.expiresAt < now,
    ).length;
    const totalUsage = promotions.reduce((sum, p) => sum + (p.usage_count ?? 0), 0);
    const totalSavings = promotions.reduce((sum, p) => {
      if (p.type === 'FIXED') {
        return sum + (p.usage_count ?? 0) * p.value;
      }
      return sum;
    }, 0);
    const maxPossibleUsage = promotions.reduce((sum, p) => sum + (p.usage_limit ?? 0), 0);
    const conversionRate = maxPossibleUsage > 0
      ? Math.min(100, Math.round((totalUsage / maxPossibleUsage) * 100))
      : 0;

    return {
      totalPromotions,
      activePromotions,
      expiredPromotions,
      totalSavings,
      totalUsage,
      conversionRate,
    };
  }

  private mapTypeToDb(type: string): string | null {
    if (!type) return null;
    const normalized = type.toUpperCase();
    switch (normalized) {
      case 'PERCENTAGE':
      case 'PERCENT':
      case 'PERCENTAGE_DISCOUNT':
      case 'PERCENTAGE_DISCOUNT'.toUpperCase():
        return 'PERCENTAGE';
      case 'FIXED_AMOUNT':
      case 'FIXED':
        return 'FIXED';
      case 'FREE_SHIPPING':
      case 'FREESHIP':
        return 'FREESHIP';
      case 'BUY_X_GET_Y':
      case 'BUYXGETY':
        return 'BUY_X_GET_Y';
      default:
        return normalized;
    }
  }

  private mapTypeToResponse(type: string): string {
    const normalized = type?.toUpperCase?.() ?? 'PERCENTAGE';
    switch (normalized) {
      case 'PERCENTAGE':
        return 'percentage';
      case 'FIXED':
        return 'fixed_amount';
      case 'FREESHIP':
      case 'FREE_SHIPPING':
        return 'free_shipping';
      case 'BUY_X_GET_Y':
      case 'BUYXGETY':
        return 'buy_x_get_y';
      default:
        return normalized.toLowerCase();
    }
  }

  private normalizeTypeForCheckout(type: string): 'PERCENT' | 'FIXED' | null {
    const normalized = type?.toUpperCase?.() ?? '';
    switch (normalized) {
      case 'PERCENTAGE':
      case 'PERCENT':
        return 'PERCENT';
      case 'FIXED':
      case 'FIXED_AMOUNT':
        return 'FIXED';
      default:
        return null;
    }
  }

  private async generateUniqueCode(base: string): Promise<string> {
    const sanitized = base.replace(/[^A-Z0-9_\-]/gi, '').toUpperCase() || `PROMO-${Date.now()}`;
    let candidate = sanitized;
    let suffix = 1;

    while (await this.prisma.promotions.findUnique({ where: { code: candidate } })) {
      candidate = `${sanitized}-${suffix++}`;
    }

    return candidate;
  }
}
