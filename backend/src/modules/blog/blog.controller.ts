import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('articles')
  findAllArticles(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('published') published?: string,
    @Query('featured') featured?: string,
    @Query('tag') tag?: string,
  ) {
    return this.blogService.findAllArticles({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      categoryId,
      search,
      status,
      published: published !== 'false',
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      tag,
    });
  }

  @Get('articles/featured')
  findFeaturedArticles(@Query('limit') limit?: string) {
    return this.blogService.findFeaturedArticles(limit ? parseInt(limit, 10) : 5);
  }

  @Get('articles/:slugOrId')
  findOneArticle(@Param('slugOrId') slugOrId: string) {
    return this.blogService.findOneArticle(slugOrId);
  }

  @Get('articles/:slug/related')
  findRelatedArticles(
    @Param('slug') slug: string,
    @Query('limit') limit?: string,
  ) {
    return this.blogService.findRelatedArticles(slug, limit ? parseInt(limit, 10) : 3);
  }

  @Post('articles/:slugOrId/like')
  likeArticle(@Param('slugOrId') slugOrId: string) {
    return this.blogService.likeArticle(slugOrId);
  }

  @Get('categories')
  findAllCategories(
    @Query('published') published?: string,
    @Query('limit') limit?: string,
  ) {
    return this.blogService.findAllCategories({
      published: published !== 'false',
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }
}
