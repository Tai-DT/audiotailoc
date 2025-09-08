import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly prisma: PrismaService) {}

  // Public
  @Get()
  async list() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.prisma.project.findUnique({ where: { id } });
  }

  // Admin
  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() data: { name: string; description?: string; userId: string; status?: string }) {
    const { name, description, userId, status } = data;
    return this.prisma.project.create({ data: { name, description, userId, status: status || 'DRAFT' } });
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<{ name: string; description?: string; status?: string }>) {
    return this.prisma.project.update({ where: { id }, data });
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.project.delete({ where: { id } });
  }
}
