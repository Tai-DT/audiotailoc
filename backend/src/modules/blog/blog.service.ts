import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

interface ArticleListParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  status?: string;
  published?: boolean;
  featured?: boolean;
  tag?: string;
}

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async findAllArticles(params: ArticleListParams = {}) {
    const {
      page = 1,
      limit = 10,
      categoryId,
      search,
      status = 'PUBLISHED',
      published = true,
      featured,
      tag,
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.blog_articlesWhereInput = {
      ...(status && { status }),
      ...(published && { publishedAt: { not: null } }),
      ...(categoryId && { categoryId }),
      ...(featured !== undefined && { featured }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          { excerpt: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          { content: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        ],
      }),
      ...(tag && { seoKeywords: { contains: tag, mode: 'insensitive' as Prisma.QueryMode } }),
    };

    const [articles, total] = await Promise.all([
      this.prisma.blog_articles.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
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
      }),
      this.prisma.blog_articles.count({ where }),
    ]);

    // Transform to match frontend types
    const data = articles.map(article => this.transformArticle(article));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneArticle(slugOrId: string) {
    // Try to find by slug first, then by ID
    let article = await this.prisma.blog_articles.findUnique({
      where: { slug: slugOrId },
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
      article = await this.prisma.blog_articles.findUnique({
        where: { id: slugOrId },
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
    }

    if (!article) {
      throw new NotFoundException(`Article with slug or id "${slugOrId}" not found`);
    }

    // Increment view count
    await this.prisma.blog_articles.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    });

    return this.transformArticle(article);
  }

  async findFeaturedArticles(limit: number = 5) {
    const articles = await this.prisma.blog_articles.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { not: null },
        featured: true,
      },
      take: limit,
      orderBy: { publishedAt: 'desc' },
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

    return articles.map(article => this.transformArticle(article));
  }

  async findRelatedArticles(slug: string, limit: number = 3) {
    const currentArticle = await this.prisma.blog_articles.findUnique({
      where: { slug },
      select: { id: true, categoryId: true, seoKeywords: true },
    });

    if (!currentArticle) {
      return [];
    }

    const articles = await this.prisma.blog_articles.findMany({
      where: {
        id: { not: currentArticle.id },
        status: 'PUBLISHED',
        publishedAt: { not: null },
        OR: [
          { categoryId: currentArticle.categoryId },
          // Match by keywords if available
          ...(currentArticle.seoKeywords
            ? [{ seoKeywords: { contains: currentArticle.seoKeywords.split(',')[0]?.trim() } }]
            : []),
        ],
      },
      take: limit,
      orderBy: { publishedAt: 'desc' },
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

    return articles.map(article => this.transformArticle(article));
  }

  async findAllCategories(params: { published?: boolean; limit?: number } = {}) {
    const { published = true, limit } = params;

    const where: Prisma.blog_categoriesWhereInput = {
      isActive: published ? true : undefined,
    };

    const categories = await this.prisma.blog_categories.findMany({
      where,
      take: limit,
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            blog_articles: {
              where: {
                status: 'PUBLISHED',
                publishedAt: { not: null },
              },
            },
          },
        },
      },
    });

    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.imageUrl,
      parentId: cat.parentId,
      isActive: cat.isActive,
      sortOrder: cat.sortOrder,
      createdAt: cat.createdAt.toISOString(),
      updatedAt: cat.updatedAt.toISOString(),
      _count: {
        articles: cat._count.blog_articles,
      },
    }));
  }

  async likeArticle(slugOrId: string) {
    let article = await this.prisma.blog_articles.findUnique({
      where: { slug: slugOrId },
    });

    if (!article) {
      article = await this.prisma.blog_articles.findUnique({
        where: { id: slugOrId },
      });
    }

    if (!article) {
      throw new NotFoundException(`Article not found`);
    }

    const updated = await this.prisma.blog_articles.update({
      where: { id: article.id },
      data: { likeCount: { increment: 1 } },
    });

    return { likeCount: updated.likeCount };
  }

  private transformArticle(article: any) {
    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      imageUrl: article.imageUrl,
      categoryId: article.categoryId,
      authorId: article.authorId,
      status: article.status,
      publishedAt: article.publishedAt?.toISOString() || null,
      viewCount: article.viewCount,
      likeCount: article.likeCount,
      commentCount: article.commentCount,
      seoTitle: article.seoTitle,
      seoDescription: article.seoDescription,
      seoKeywords: article.seoKeywords,
      tags: article.seoKeywords ? article.seoKeywords.split(',').map((t: string) => t.trim()) : [],
      featured: article.featured,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      category: article.blog_categories
        ? {
            id: article.blog_categories.id,
            name: article.blog_categories.name,
            slug: article.blog_categories.slug,
            description: article.blog_categories.description,
            imageUrl: article.blog_categories.imageUrl,
            isActive: article.blog_categories.isActive,
          }
        : null,
      author: article.users
        ? {
            id: article.users.id,
            name: article.users.name || 'Admin',
            email: article.users.email,
          }
        : { id: article.authorId, name: 'Admin', email: '' },
    };
  }
}
