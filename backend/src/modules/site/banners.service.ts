import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBannerDto } from './dto/banner-create.dto';
import { UpdateBannerDto } from './dto/banner-update.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page?: string;
    isActive?: boolean;
    search?: string;
    skip?: number;
    take?: number;
    orderBy?: Prisma.bannersOrderByWithRelationInput;
  }) {
    const { page, isActive, search, skip = 0, take = 20, orderBy = { position: 'asc' } } = params;

    const where: Prisma.bannersWhereInput = {
      isDeleted: false,
      ...(page && { page }),
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { subtitle: { contains: search } },
          { description: { contains: search } },
        ],
      }),
    };

    const [banners, total] = await Promise.all([
      this.prisma.banners.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.prisma.banners.count({ where }),
    ]);

    return {
      items: banners,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async findById(id: string) {
    const banner = await this.prisma.banners.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    return banner;
  }

  async create(data: CreateBannerDto) {
    return this.prisma.banners.create({
      data: {
        id: randomUUID(),
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async update(id: string, data: UpdateBannerDto) {
    return this.prisma.banners.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string) {
    return this.prisma.banners.update({
      where: { id },
      data: {
        isDeleted: true,
        isActive: false,
      },
    });
  }

  async reorder(idsInOrder: string[]) {
    const updates = idsInOrder.map((id, index) =>
      this.prisma.banners.update({
        where: { id },
        data: { position: index },
      }),
    );

    return this.prisma.$transaction(updates);
  }

  async getActiveBanners(page?: string) {
    const now = new Date();

    return this.prisma.banners.findMany({
      where: {
        isDeleted: false,
        isActive: true,
        ...(page && { page }),
        OR: [
          { startAt: null, endAt: null },
          { startAt: { lte: now }, endAt: null },
          { startAt: null, endAt: { gte: now } },
          { startAt: { lte: now }, endAt: { gte: now } },
        ],
      },
      orderBy: { position: 'asc' },
    });
  }
}
