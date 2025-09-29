import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogArticleDto, UpdateBlogArticleDto, BlogArticleStatus } from './dto/create-blog-article.dto';
import { CreateBlogCategoryDto, UpdateBlogCategoryDto } from './dto/create-blog-category.dto';
import { CreateBlogCommentDto, UpdateBlogCommentDto } from './dto/create-blog-comment.dto';

interface BlogArticleQuery {
  status?: string;
  categoryId?: string;
  authorId?: string;
  search?: string;
  published?: boolean;
  page?: number;
  limit?: number;
}

interface BlogCategoryQuery {
  published?: boolean;
  parentId?: string;
  page?: number;
  limit?: number;
}

interface _BlogAnalytics {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalCategories: number;
  totalComments: number;
  approvedComments: number;
  totalViews: number;
  totalLikes: number;
}

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  // Blog Articles
  async getArticles(query: BlogArticleQuery = {}) {
    const {
      status = 'all',
      categoryId,
      authorId,
      search,
      published,
      page = 1,
      limit = 20,
    } = query;

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Math.min(Number(limit) || 20, 100));
    const skip = (pageNumber - 1) * pageSize;

    const where: Prisma.blog_articlesWhereInput = {};

    if (status && status.toLowerCase() !== 'all') {
      const normalizedStatus = status.toUpperCase();
      if (!Object.values(BlogArticleStatus).includes(normalizedStatus as BlogArticleStatus)) {
        throw new BadRequestException('Invalid article status filter');
      }
      where.status = normalizedStatus;
    }

    if (published !== undefined) {
      where.status = published ? BlogArticleStatus.PUBLISHED : { not: BlogArticleStatus.PUBLISHED };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { content: { contains: term, mode: 'insensitive' } },
        { excerpt: { contains: term, mode: 'insensitive' } },
        { seoTitle: { contains: term, mode: 'insensitive' } },
        { seoDescription: { contains: term, mode: 'insensitive' } },
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
          blog_comments: {
            where: { isApproved: true },
            select: {
              id: true,
              content: true,
              authorName: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: [
          { publishedAt: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: pageSize,
      }),
      this.prisma.blog_articles.count({ where }),
    ]);

    return {
      data: articles,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getArticleById(id: string) {
    const article = await this.prisma.blog_articles.findUnique({
      where: { id },
      include: {
        blog_categories: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        blog_comments: {
          where: { isApproved: true },
          include: {
            users: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Increment view count
    await this.prisma.blog_articles.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return article;
  }

  async getArticleBySlug(slug: string) {
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
        blog_comments: {
          where: { isApproved: true },
          include: {
            users: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Increment view count
    await this.prisma.blog_articles.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });

    return article;
  }

  async createArticle(dto: CreateBlogArticleDto, authorId: string) {
    const category = await this.prisma.blog_categories.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check for duplicate slug
    const existingArticle = await this.prisma.blog_articles.findUnique({
      where: { slug: dto.slug },
    });

    if (existingArticle) {
      throw new BadRequestException('Article with this slug already exists');
    }

    const publishedAt = dto.status === BlogArticleStatus.PUBLISHED ? new Date() : null;

    return this.prisma.blog_articles.create({
      data: {
        id: randomUUID(),
        title: dto.title,
        slug: dto.slug,
        content: dto.content,
        excerpt: dto.excerpt,
        imageUrl: dto.imageUrl,
        status: dto.status,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        seoKeywords: dto.seoKeywords,
        blog_categories: {
          connect: { id: dto.categoryId }
        },
        users: {
          connect: { id: authorId }
        },
        publishedAt,
        updatedAt: new Date(),
      },
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

  async updateArticle(id: string, dto: UpdateBlogArticleDto) {
    const article = await this.prisma.blog_articles.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (dto.categoryId) {
      const category = await this.prisma.blog_categories.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    if (dto.slug) {
      const existingArticle = await this.prisma.blog_articles.findFirst({
        where: {
          slug: dto.slug,
          id: { not: id },
        },
      });

      if (existingArticle) {
        throw new BadRequestException('Article with this slug already exists');
      }
    }

    const publishedAt = dto.status === BlogArticleStatus.PUBLISHED && article.status !== BlogArticleStatus.PUBLISHED
      ? new Date()
      : article.publishedAt;

    return this.prisma.blog_articles.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.slug !== undefined && { slug: dto.slug }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.excerpt !== undefined && { excerpt: dto.excerpt }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.seoTitle !== undefined && { seoTitle: dto.seoTitle }),
        ...(dto.seoDescription !== undefined && { seoDescription: dto.seoDescription }),
        ...(dto.seoKeywords !== undefined && { seoKeywords: dto.seoKeywords }),
        ...(dto.categoryId !== undefined && {
          blog_categories: {
            connect: { id: dto.categoryId }
          }
        }),
        publishedAt,
      },
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

  async deleteArticle(id: string) {
    const article = await this.prisma.blog_articles.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return this.prisma.blog_articles.delete({
      where: { id },
    });
  }

  // Blog Categories
  async getCategories(query: BlogCategoryQuery = {}) {
    const {
      published = true,
      parentId,
      page = 1,
      limit = 50,
    } = query;

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Math.min(Number(limit) || 50, 100));
    const skip = (pageNumber - 1) * pageSize;

    const where: Prisma.blog_categoriesWhereInput = {
      isActive: published,
    };

    if (parentId !== undefined) {
      where.parentId = parentId || null;
    }

    const [categories, total] = await Promise.all([
      this.prisma.blog_categories.findMany({
        where,
        include: {
          _count: {
            select: {
              blog_articles: true,
              subcategories: true,
            },
          },
          parent: true,
          subcategories: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: [
          { sortOrder: 'asc' },
          { name: 'asc' },
        ],
        skip,
        take: pageSize,
      }),
      this.prisma.blog_categories.count({ where }),
    ]);

    return {
      data: categories,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getCategoryById(id: string) {
    const category = await this.prisma.blog_categories.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            blog_articles: true,
            subcategories: true,
          },
        },
        parent: true,
        subcategories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        blog_articles: {
          where: { status: BlogArticleStatus.PUBLISHED },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            imageUrl: true,
            publishedAt: true,
            viewCount: true,
          },
          orderBy: { publishedAt: 'desc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.prisma.blog_categories.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            blog_articles: true,
            subcategories: true,
          },
        },
        parent: true,
        subcategories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        blog_articles: {
          where: { status: BlogArticleStatus.PUBLISHED },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            imageUrl: true,
            publishedAt: true,
            viewCount: true,
          },
          orderBy: { publishedAt: 'desc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async createCategory(dto: CreateBlogCategoryDto) {
    if (dto.parentId) {
      const parent = await this.prisma.blog_categories.findUnique({
        where: { id: dto.parentId },
      });

      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    // Check for duplicate slug
    const existingCategory = await this.prisma.blog_categories.findUnique({
      where: { slug: dto.slug },
    });

    if (existingCategory) {
      throw new BadRequestException('Category with this slug already exists');
    }

    return this.prisma.blog_categories.create({
      data: dto as any,
      include: {
        _count: {
          select: {
            blog_articles: true,
            subcategories: true,
          },
        },
        parent: true,
      },
    });
  }

  async updateCategory(id: string, dto: UpdateBlogCategoryDto) {
    const category = await this.prisma.blog_categories.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (dto.parentId) {
      const parent = await this.prisma.blog_categories.findUnique({
        where: { id: dto.parentId },
      });

      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    if (dto.slug) {
      const existingCategory = await this.prisma.blog_categories.findFirst({
        where: {
          slug: dto.slug,
          id: { not: id },
        },
      });

      if (existingCategory) {
        throw new BadRequestException('Category with this slug already exists');
      }
    }

    return this.prisma.blog_categories.update({
      where: { id },
      data: dto,
      include: {
        _count: {
          select: {
            blog_articles: true,
            subcategories: true,
          },
        },
        parent: true,
      },
    });
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.blog_categories.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            blog_articles: true,
            subcategories: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category._count.blog_articles > 0) {
      throw new BadRequestException('Cannot delete category with articles');
    }

    if (category._count.subcategories > 0) {
      throw new BadRequestException('Cannot delete category with subcategories');
    }

    return this.prisma.blog_categories.delete({
      where: { id },
    });
  }

  // Blog Comments
  async getComments(articleId: string, approved?: boolean, page = 1, limit = 20) {
    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Math.min(Number(limit) || 20, 100));
    const skip = (pageNumber - 1) * pageSize;

    const where: Prisma.blog_commentsWhereInput = {
      articleId,
    };

    if (approved !== undefined) {
      where.isApproved = approved;
    }

    const [comments, total] = await Promise.all([
      this.prisma.blog_comments.findMany({
        where,
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.blog_comments.count({ where }),
    ]);

    return {
      data: comments,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async createComment(dto: CreateBlogCommentDto, authorId?: string) {
    const article = await this.prisma.blog_articles.findUnique({
      where: { id: dto.articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return this.prisma.blog_comments.create({
      data: {
        ...dto,
        authorId,
      } as any,
      include: {
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

  async updateComment(id: string, dto: UpdateBlogCommentDto) {
    const comment = await this.prisma.blog_comments.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return this.prisma.blog_comments.update({
      where: { id },
      data: dto,
      include: {
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

  async approveComment(id: string) {
    const comment = await this.prisma.blog_comments.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return this.prisma.blog_comments.update({
      where: { id },
      data: { isApproved: true },
      include: {
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

  async deleteComment(id: string) {
    const comment = await this.prisma.blog_comments.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return this.prisma.blog_comments.delete({
      where: { id },
    });
  }

  // Analytics
  async getAnalytics() {
    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      totalCategories,
      totalComments,
      approvedComments,
      totalViews,
      totalLikes,
    ] = await Promise.all([
      this.prisma.blog_articles.count(),
      this.prisma.blog_articles.count({ where: { status: BlogArticleStatus.PUBLISHED } }),
      this.prisma.blog_articles.count({ where: { status: BlogArticleStatus.DRAFT } }),
      this.prisma.blog_categories.count({ where: { isActive: true } }),
      this.prisma.blog_comments.count(),
      this.prisma.blog_comments.count({ where: { isApproved: true } }),
      this.prisma.blog_articles.aggregate({
        _sum: { viewCount: true },
      }),
      this.prisma.blog_articles.aggregate({
        _sum: { likeCount: true },
      }),
    ]);

    return {
      totalArticles,
      publishedArticles,
      draftArticles,
      totalCategories,
      totalComments,
      approvedComments,
      totalViews: totalViews._sum.viewCount || 0,
      totalLikes: totalLikes._sum.likeCount || 0,
    };
  }
}