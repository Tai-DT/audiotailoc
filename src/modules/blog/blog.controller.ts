import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { randomUUID } from 'crypto';
import { BlogService } from './blog.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { CreateBlogArticleDto, UpdateBlogArticleDto } from './dto/create-blog-article.dto';
import { CreateBlogCategoryDto, UpdateBlogCategoryDto } from './dto/create-blog-category.dto';
import { CreateBlogCommentDto, UpdateBlogCommentDto } from './dto/create-blog-comment.dto';
import { PrismaService } from '../../prisma/prisma.service';

interface AuthenticatedRequest extends Request {
  user?: {
    sub?: string;
    id?: string;
    email?: string;
    role?: string;
  };
}

@Controller('blog')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly prisma: PrismaService
  ) {}

  // Articles
  @Get('articles')
  async getArticles(
    @Query('status') status?: string,
    @Query('categoryId') categoryId?: string,
    @Query('authorId') authorId?: string,
    @Query('search') search?: string,
    @Query('published') published?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    const publishedValue = published ? published === 'true' : undefined;
    return this.blogService.getArticles({
      status,
      categoryId,
      authorId,
      search,
      published: publishedValue,
      page,
      limit,
    });
  }

  @Get('articles/:id')
  async getArticleById(@Param('id') id: string) {
    return this.blogService.getArticleById(id);
  }

  @Get('articles/slug/:slug')
  async getArticleBySlug(@Param('slug') slug: string) {
    return this.blogService.getArticleBySlug(slug);
  }

  @UseGuards(AdminOrKeyGuard)
  @Post('articles')
  async createArticle(@Body() dto: CreateBlogArticleDto, @Req() req: AuthenticatedRequest) {
    // For API key authentication, use a system user or create a default author
    let userId = req.user?.sub || req.user?.id;

    // If no user ID from authentication, use a default system user ID
    if (!userId) {
      // Try to find or create a system user for API operations
      const systemUser = await this.prisma.users.findFirst({
        where: { email: 'system@audiotailoc.com' }
      });

      if (systemUser) {
        userId = systemUser.id;
      } else {
        // Create a system user if it doesn't exist
        const newSystemUser = await this.prisma.users.create({
          data: {
            id: randomUUID(),
            email: 'system@audiotailoc.com',
            name: 'System User',
            password: 'system-password', // This should be hashed in production
            role: 'ADMIN',
            updatedAt: new Date()
          }
        });
        userId = newSystemUser.id;
      }
    }

    return this.blogService.createArticle(dto, userId);
  }

  @UseGuards(AdminOrKeyGuard)
  @Put('articles/:id')
  async updateArticle(@Param('id') id: string, @Body() dto: UpdateBlogArticleDto) {
    return this.blogService.updateArticle(id, dto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Delete('articles/:id')
  async deleteArticle(@Param('id') id: string) {
    return this.blogService.deleteArticle(id);
  }

  // Categories
  @Get('categories')
  async getCategories(
    @Query('published') published?: string,
    @Query('parentId') parentId?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
  ) {
    const publishedValue = published ? published === 'true' : true;
    return this.blogService.getCategories({
      published: publishedValue,
      parentId,
      page,
      limit,
    });
  }

  @Get('categories/:id')
  async getCategoryById(@Param('id') id: string) {
    return this.blogService.getCategoryById(id);
  }

  @Get('categories/slug/:slug')
  async getCategoryBySlug(@Param('slug') slug: string) {
    return this.blogService.getCategoryBySlug(slug);
  }

  @UseGuards(AdminOrKeyGuard)
  @Post('categories')
  async createCategory(@Body() dto: CreateBlogCategoryDto) {
    return this.blogService.createCategory(dto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Put('categories/:id')
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateBlogCategoryDto) {
    return this.blogService.updateCategory(id, dto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.blogService.deleteCategory(id);
  }

  // Comments
  @Get('articles/:articleId/comments')
  async getComments(
    @Param('articleId') articleId: string,
    @Query('approved') approved?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    const approvedValue = approved ? approved === 'true' : undefined;
    return this.blogService.getComments(articleId, approvedValue, page, limit);
  }

  @Post('comments')
  async createComment(@Body() dto: CreateBlogCommentDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub || req.user?.id || 'anonymous';
    return this.blogService.createComment(dto, userId);
  }

  @UseGuards(AdminOrKeyGuard)
  @Put('comments/:id')
  async updateComment(@Param('id') id: string, @Body() dto: UpdateBlogCommentDto) {
    return this.blogService.updateComment(id, dto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Post('comments/:id/approve')
  async approveComment(@Param('id') id: string) {
    return this.blogService.approveComment(id);
  }

  @UseGuards(AdminOrKeyGuard)
  @Delete('comments/:id')
  async deleteComment(@Param('id') id: string) {
    return this.blogService.deleteComment(id);
  }

  // Analytics
  @UseGuards(AdminOrKeyGuard)
  @Get('analytics')
  async getAnalytics() {
    return this.blogService.getAnalytics();
  }
}
