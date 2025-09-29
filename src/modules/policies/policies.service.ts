import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { slugify } from '../../common/utils/slug.utils';

export interface Policy {
  id: string;
  slug: string;
  title: string;
  contentHtml: string;
  summary?: string | null;
  type: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: Date; // Changed from string to Date to match Prisma
  updatedAt: Date; // Changed from string to Date to match Prisma
}

@Injectable()
export class PoliciesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Policy[]> {
    return this.prisma.policies.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByType(type: string): Promise<Policy | null> {
    return this.prisma.policies.findFirst({
      where: { type },
    });
  }

  async findBySlug(slug: string): Promise<Policy | null> {
    return this.prisma.policies.findUnique({
      where: { slug },
    });
  }

  async create(data: {
    title: string;
    contentHtml: string;
    summary?: string;
    type: string; // Changed from union type to string
    isPublished?: boolean;
  }): Promise<Policy> {
    // Auto-generate slug from title if not provided
    const slug = slugify(data.title);

    return this.prisma.policies.create({
      data: {
        id: crypto.randomUUID(),
        ...data,
        slug,
        isPublished: data.isPublished ?? true,
        updatedAt: new Date(),
      },
    });
  }

  async update(slug: string, data: {
    title?: string;
    contentHtml?: string;
    summary?: string;
    isPublished?: boolean;
  }): Promise<Policy> {
    const existingPolicy = await this.prisma.policies.findUnique({
      where: { slug },
    });

    if (!existingPolicy) {
      throw new Error(`Policy with slug '${slug}' not found`);
    }

    return this.prisma.policies.update({
      where: { slug },
      data,
    });
  }

  async delete(slug: string): Promise<Policy> {
    const existingPolicy = await this.prisma.policies.findUnique({
      where: { slug },
    });

    if (!existingPolicy) {
      throw new Error(`Policy with slug '${slug}' not found`);
    }

    return this.prisma.policies.delete({
      where: { slug },
    });
  }

  async incrementViewCount(slug: string): Promise<void> {
    const existingPolicy = await this.prisma.policies.findUnique({
      where: { slug },
    });

    if (!existingPolicy) {
      throw new Error(`Policy with slug '${slug}' not found`);
    }

    await this.prisma.policies.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });
  }
}
