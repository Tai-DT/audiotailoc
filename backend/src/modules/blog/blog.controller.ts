import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('articles')
  findAllArticles(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('featured') featured?: boolean,
  ) {
    return this.blogService.findAllArticles({
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
      categoryId,
      search,
      featured: featured ? String(featured) === 'true' : undefined,
    });
  }

  @Get('articles/:slug')
  findOneArticle(@Param('slug') slug: string) {
    return this.blogService.findOneArticle(slug);
  }

  @Get('articles/:slug/related')
  getRelatedArticles(@Param('slug') slug: string, @Query('limit') limit?: number) {
    return this.blogService.getRelatedArticles(slug, limit ? +limit : 3);
  }

  @Get('categories')
  findAllCategories() {
    return this.blogService.findAllCategories();
  }
}
