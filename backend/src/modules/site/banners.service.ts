import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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
    try {
      // Global ValidationPipe does not whitelist unknown props, so the request body
      // may include extra keys (e.g., `id`) that Prisma rejects. Build a safe
      // update object explicitly.
      const updateData: Prisma.bannersUpdateInput = {
        updatedAt: new Date(),
      };

      if (data.title !== undefined) updateData.title = data.title;
      if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
      if (data.mobileImageUrl !== undefined) updateData.mobileImageUrl = data.mobileImageUrl;
      if (data.linkUrl !== undefined) updateData.linkUrl = data.linkUrl;
      if (data.buttonLabel !== undefined) updateData.buttonLabel = data.buttonLabel;
      if (data.page !== undefined) updateData.page = data.page;
      if (data.locale !== undefined) updateData.locale = data.locale;
      if (data.position !== undefined) updateData.position = data.position;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;
      if (data.startAt !== undefined) updateData.startAt = data.startAt;
      if (data.endAt !== undefined) updateData.endAt = data.endAt;

      return await this.prisma.banners.update({
        where: { id },
        data: updateData,
      });
    } catch (error: any) {
      console.error('Update Banner Error:', error);
      // Check for Record Not Found (P2025)
      if (error?.code === 'P2025') {
        throw new NotFoundException('Banner not found');
      }

      // Prisma validation errors usually indicate a bad payload shape/type.
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException(error.message);
      }

      // Known Prisma request errors (constraints, etc.) should not crash the process.
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException('Update banner failed');
    }
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
