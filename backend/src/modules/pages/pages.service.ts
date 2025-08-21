import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.page.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findBySlug(slug: string) {
    const page = await this.prisma.page.findUnique({
      where: { slug }
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async create(data: any) {
    return this.prisma.page.create({
      data
    });
  }

  async update(id: string, data: any) {
    const page = await this.prisma.page.findUnique({
      where: { id }
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return this.prisma.page.update({
      where: { id },
      data
    });
  }

  async remove(id: string) {
    const page = await this.prisma.page.findUnique({
      where: { id }
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    await this.prisma.page.delete({
      where: { id }
    });

    return { message: 'Page deleted successfully' };
  }
}

