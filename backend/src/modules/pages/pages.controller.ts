import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('pages')
export class PagesController {
  constructor(private readonly prisma: PrismaService) {}

  // Public
  @Get()
  async list(@Query('published') published?: string) {
    return this.prisma.page.findMany({
      where: published ? { isPublished: published === 'true' } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.prisma.page.findUnique({ where: { slug } });
  }

  // Admin
  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() data: { slug: string; title: string; content: string; published?: boolean }) {
    const { published, ...rest } = data as any;
    return this.prisma.page.create({ data: { ...rest, isPublished: published ?? false } });
  }

  @UseGuards(AdminGuard)
  @Put(':slug')
  async update(@Param('slug') slug: string, @Body() data: Partial<{ title: string; content: string; published: boolean }>) {
    const { published, ...rest } = (data || {}) as any;
    return this.prisma.page.update({ where: { slug }, data: { ...rest, ...(published !== undefined ? { isPublished: published } : {}) } });
  }

  @UseGuards(AdminGuard)
  @Delete(':slug')
  async remove(@Param('slug') slug: string) {
    return this.prisma.page.delete({ where: { slug } });
  }
}
