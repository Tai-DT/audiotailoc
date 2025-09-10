import { Injectable, NotFoundException } from '@nestjs/common';
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
    orderBy?: Prisma.BannerOrderByWithRelationInput;
  }) {
    const {
      page,
      isActive,
      search,
      skip = 0,
      take = 20,
      orderBy = { position: 'asc' },
    } = params;

    const where: Prisma.BannerWhereInput = {
      isDeleted: false,
      ...(page && { page }),
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { subtitle: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [banners, total] = await Promise.all([
      this.prisma.banner.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.prisma.banner.count({ where }),
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
    const banner = await this.prisma.banner.findFirst({
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
    return this.prisma.banner.create({
      data,
    });
  }

  async update(id: string, data: UpdateBannerDto) {
    const banner = await this.findById(id);
    
    return this.prisma.banner.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string) {
    const banner = await this.findById(id);
    
    return this.prisma.banner.update({
      where: { id },
      data: {
        isDeleted: true,
        isActive: false,
      },
    });
  }

  async reorder(idsInOrder: string[]) {
    const updates = idsInOrder.map((id, index) =>
      this.prisma.banner.update({
        where: { id },
        data: { position: index },
      })
    );

    return this.prisma.$transaction(updates);
  }

  async getActiveBanners(page?: string) {
    const now = new Date();
    
    return this.prisma.banner.findMany({
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
