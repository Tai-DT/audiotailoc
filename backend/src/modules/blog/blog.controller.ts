import { Controller, Get, Param } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('articles')
  findAllArticles() {
    return this.blogService.findAllArticles();
  }

  @Get('articles/:id')
  findOneArticle(@Param('id') id: string) {
    return this.blogService.findOneArticle(+id);
  }

  @Get('categories')
  findAllCategories() {
    return this.blogService.findAllCategories();
  }
}
