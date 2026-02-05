import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSoftwareDto } from './dto/create-software.dto';
import { UpdateSoftwareDto } from './dto/update-software.dto';
import { randomUUID } from 'crypto';

const PURCHASED_STATUSES = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'COMPLETED'];

@Injectable()
export class SoftwareService {
  constructor(private readonly prisma: PrismaService) {}

  private get prismaClient() {
    return this.prisma as any;
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }

  async listPublic(params: {
    page?: number;
    limit?: number;
    category?: string;
    platform?: string;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 20));
    const where = {
      isActive: true,
      isDeleted: false,
      ...(params.category ? { category: params.category } : {}),
      ...(params.platform ? { platform: params.platform } : {}),
    } as const;

    const [items, total] = await Promise.all([
      this.prismaClient.software.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          category: true,
          platform: true,
          version: true,
          priceCents: true,
          isPaidRequired: true,
          downloadUrl: true,
          websiteUrl: true,
          imageUrl: true,
          features: true,
          productId: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          product: {
            select: { id: true, slug: true, name: true, priceCents: true, imageUrl: true },
          },
        },
      }),
      this.prismaClient.software.count({ where }),
    ]);

    const sanitized = items.map(item => ({
      ...item,
      downloadUrl: item.isPaidRequired ? null : item.downloadUrl,
    }));

    return { items: sanitized, total, page, limit };
  }

  async listAdmin(params: { page?: number; limit?: number; includeDeleted?: boolean }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 50));
    const where = params.includeDeleted ? {} : { isDeleted: false };

    const [items, total] = await Promise.all([
      this.prismaClient.software.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          product: {
            select: { id: true, slug: true, name: true, priceCents: true, imageUrl: true },
          },
        },
      }),
      this.prismaClient.software.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async getBySlug(slug: string) {
    const software = await this.prismaClient.software.findFirst({
      where: { slug, isActive: true, isDeleted: false },
      include: {
        product: { select: { id: true, slug: true, name: true, priceCents: true, imageUrl: true } },
      },
    });
    if (!software) throw new NotFoundException('Software not found');
    return {
      ...software,
      downloadUrl: software.isPaidRequired ? null : software.downloadUrl,
    };
  }

  async getById(id: string) {
    const software = await this.prismaClient.software.findUnique({
      where: { id },
      include: {
        product: { select: { id: true, slug: true, name: true, priceCents: true, imageUrl: true } },
      },
    });
    if (!software || software.isDeleted) throw new NotFoundException('Software not found');
    return software;
  }

  async create(dto: CreateSoftwareDto) {
    const slug = dto.slug?.trim() || this.slugify(dto.name);
    const exists = await this.prismaClient.software.findUnique({ where: { slug } });
    if (exists) throw new BadRequestException('Slug already exists');

    return this.prismaClient.software.create({
      data: {
        id: randomUUID(),
        name: dto.name,
        slug,
        description: dto.description,
        category: dto.category,
        platform: dto.platform,
        version: dto.version,
        priceCents: BigInt(dto.priceCents || 0),
        isPaidRequired: dto.isPaidRequired ?? false,
        downloadUrl: dto.downloadUrl,
        websiteUrl: dto.websiteUrl,
        imageUrl: dto.imageUrl,
        features: dto.features,
        productId: dto.productId,
        isActive: dto.isActive ?? true,
        updatedAt: new Date(),
      },
    });
  }

  async update(id: string, dto: UpdateSoftwareDto) {
    const existing = await this.getById(id);
    const slug = dto.slug?.trim() || (dto.name ? this.slugify(dto.name) : existing.slug);

    if (slug !== existing.slug) {
      const slugExists = await this.prismaClient.software.findUnique({ where: { slug } });
      if (slugExists) throw new BadRequestException('Slug already exists');
    }

    return this.prismaClient.software.update({
      where: { id },
      data: {
        name: dto.name ?? existing.name,
        slug,
        description: dto.description ?? existing.description,
        category: dto.category ?? existing.category,
        platform: dto.platform ?? existing.platform,
        version: dto.version ?? existing.version,
        priceCents: dto.priceCents !== undefined ? BigInt(dto.priceCents) : existing.priceCents,
        isPaidRequired: dto.isPaidRequired ?? existing.isPaidRequired,
        downloadUrl: dto.downloadUrl ?? existing.downloadUrl,
        websiteUrl: dto.websiteUrl ?? existing.websiteUrl,
        imageUrl: dto.imageUrl ?? existing.imageUrl,
        features: dto.features ?? existing.features,
        productId: dto.productId ?? existing.productId,
        isActive: dto.isActive ?? existing.isActive,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    await this.getById(id);
    return this.prismaClient.software.update({
      where: { id },
      data: { isDeleted: true, isActive: false, updatedAt: new Date() },
    });
  }

  async getPublicDownload(id: string) {
    const software = await this.getById(id);
    if (!software.isActive || software.isDeleted) throw new NotFoundException('Software not found');
    if (software.isPaidRequired) throw new ForbiddenException('Download requires purchase');
    if (!software.downloadUrl) throw new NotFoundException('Download URL not available');

    await this.prismaClient.software.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });

    return { url: software.downloadUrl };
  }

  async getDownloadForUser(id: string, userId: string) {
    const software = await this.getById(id);
    if (!software.isActive || software.isDeleted) throw new NotFoundException('Software not found');
    if (!software.downloadUrl) throw new NotFoundException('Download URL not available');

    if (software.isPaidRequired) {
      if (!software.productId) {
        throw new BadRequestException('Paid software missing product linkage');
      }

      const order = await this.prismaClient.orders.findFirst({
        where: {
          userId,
          status: { in: PURCHASED_STATUSES },
          order_items: { some: { productId: software.productId } },
        },
        select: { id: true },
      });

      if (!order) {
        throw new ForbiddenException('You do not have access to this download');
      }
    }

    await this.prismaClient.software.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });

    return { url: software.downloadUrl };
  }

  async listMyDownloads(userId: string) {
    const [freeSoftware, purchasedSoftware] = await Promise.all([
      this.prismaClient.software.findMany({
        where: { isActive: true, isDeleted: false, isPaidRequired: false },
        orderBy: { updatedAt: 'desc' },
        include: {
          product: {
            select: { id: true, slug: true, name: true, priceCents: true, imageUrl: true },
          },
        },
      }),
      this.prismaClient.software.findMany({
        where: {
          isActive: true,
          isDeleted: false,
          isPaidRequired: true,
          productId: { not: null },
          product: {
            order_items: {
              some: {
                orders: {
                  userId,
                  status: { in: PURCHASED_STATUSES },
                },
              },
            },
          },
        },
        include: {
          product: {
            select: { id: true, slug: true, name: true, priceCents: true, imageUrl: true },
          },
        },
      }),
    ]);

    const map = new Map<string, any>();
    for (const item of [...freeSoftware, ...purchasedSoftware]) {
      map.set(item.id, item);
    }

    return Array.from(map.values());
  }
}
