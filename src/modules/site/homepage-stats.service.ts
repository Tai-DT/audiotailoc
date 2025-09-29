import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHomePageStatsDto, UpdateHomePageStatsDto } from './dto/homepage-stats-create.dto';

@Injectable()
export class SiteStatsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.site_stats.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.site_stats.findUnique({
      where: { id },
    });
  }

  async findByKey(key: string) {
    return this.prisma.site_stats.findUnique({
      where: { key },
    });
  }

  async create(data: CreateHomePageStatsDto) {
    return this.prisma.site_stats.create({
      data: {
        ...data,
        id: crypto.randomUUID(),
        updatedAt: new Date(),
      },
    });
  }

  async update(id: string, data: UpdateHomePageStatsDto) {
    return this.prisma.site_stats.update({
      where: { id },
      data,
    });
  }

  async updateByKey(key: string, data: UpdateHomePageStatsDto) {
    return this.prisma.site_stats.update({
      where: { key },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.site_stats.delete({
      where: { id },
    });
  }
}
