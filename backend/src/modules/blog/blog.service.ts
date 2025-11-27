import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllArticles(params: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
    featured?: boolean;
  }) {
    const { page = 1, limit = 10, categoryId, search, featured } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'PUBLISHED',
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [articles, total] = await Promise.all([
      this.prisma.blog_articles.findMany({
        where,
        include: {
          blog_categories: true,
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.blog_articles.count({ where }),
    ]);

    return {
      data: articles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneArticle(slug: string) {
    const article = await this.prisma.blog_articles.findUnique({
      where: { slug },
      include: {
        blog_categories: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException(`Article with slug ${slug} not found`);
    }

    // Increment view count
    await this.prisma.blog_articles.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    });

    return article;
  }

  async findAllCategories() {
    return this.prisma.blog_categories.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { blog_articles: true },
        },
      },
    });
  }

  async getRelatedArticles(slug: string, limit: number = 3) {
    const article = await this.prisma.blog_articles.findUnique({
      where: { slug },
    });

    if (!article) {
      return [];
    }

    return this.prisma.blog_articles.findMany({
      where: {
        categoryId: article.categoryId,
        id: { not: article.id },
        status: 'PUBLISHED',
      },
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: {
        blog_categories: true,
        users: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
