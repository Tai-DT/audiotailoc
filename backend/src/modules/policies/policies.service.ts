import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PoliciesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.policies.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const policy = await this.prisma.policies.findUnique({ where: { slug } });
    if (!policy) {
      throw new NotFoundException(`Policy with slug "${slug}" not found`);
    }
    // Increment view count
    await this.prisma.policies.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });
    return policy;
  }

  async findOne(id: string) {
    const policy = await this.prisma.policies.findUnique({ where: { id } });
    if (!policy) {
      throw new NotFoundException(`Policy with id "${id}" not found`);
    }
    return policy;
  }

  async create(data: {
    slug: string;
    title: string;
    contentHtml: string;
    summary?: string;
    type: string;
    isPublished?: boolean;
  }) {
    return this.prisma.policies.create({
      data: {
        id: crypto.randomUUID(),
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async update(
    id: string,
    data: {
      slug?: string;
      title?: string;
      contentHtml?: string;
      summary?: string;
      type?: string;
      isPublished?: boolean;
    },
  ) {
    await this.findOne(id);
    return this.prisma.policies.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.policies.delete({ where: { id } });
  }
}
