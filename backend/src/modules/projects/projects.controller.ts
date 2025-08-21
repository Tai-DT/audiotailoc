import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly prisma: PrismaService) {}

  // Public
  @Get()
  async list(@Query('featured') featured?: string) {
    return this.prisma.project.findMany({
      where: featured ? { featured: featured === 'true' } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.prisma.project.findUnique({ where: { slug } });
  }

  // Admin
  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() data: { slug: string; name: string; description?: string; images?: string[]; tags?: string[]; featured?: boolean }) {
    return this.prisma.project.create({ data });
  }

  @UseGuards(AdminGuard)
  @Put(':slug')
  async update(@Param('slug') slug: string, @Body() data: Partial<{ name: string; description?: string; images?: string[]; tags?: string[]; featured?: boolean }>) {
    return this.prisma.project.update({ where: { slug }, data });
  }

  @UseGuards(AdminGuard)
  @Delete(':slug')
  async remove(@Param('slug') slug: string) {
    return this.prisma.project.delete({ where: { slug } });
  }
}
