import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug }
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async create(data: any) {
    return this.prisma.project.create({
      data
    });
  }

  async update(id: string, data: any) {
    const project = await this.prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.project.update({
      where: { id },
      data
    });
  }

  async remove(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.prisma.project.delete({
      where: { id }
    });

    return { message: 'Project deleted successfully' };
  }
}

