import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { SeoService } from './seo.service';

@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get('sitemap.xml')
  async getSitemap(@Res() res: Response) {
    const sitemap = await this.seoService.generateSitemap();
    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  }

  @Get('robots.txt')
  getRobotsTxt(@Res() res: Response) {
    const robotsTxt = this.seoService.generateRobotsTxt();
    res.set('Content-Type', 'text/plain');
    res.send(robotsTxt);
  }

  @Get('product/:id')
  async getProductSeo(@Param('id') id: string, @Query('lang') lang: string = 'vi') {
    return this.seoService.getProductSeo(id, lang as 'vi' | 'en');
  }

  @Get('category/:id')
  async getCategorySeo(@Param('id') id: string, @Query('lang') lang: string = 'vi') {
    return this.seoService.getCategorySeo(id, lang as 'vi' | 'en');
  }

  @Get('page/:slug')
  async getPageSeo(@Param('slug') slug: string, @Query('lang') lang: string = 'vi') {
    return this.seoService.getPageSeo(slug, lang as 'vi' | 'en');
  }

  @Get('project/:id')
  async getProjectSeo(@Param('id') id: string, @Query('lang') lang: string = 'vi') {
    return this.seoService.getProjectSeo(id, lang as 'vi' | 'en');
  }

  @Get('home')
  getHomeSeo(@Query('lang') lang: string = 'vi') {
    return this.seoService.getHomeSeo(lang as 'vi' | 'en');
  }
}
