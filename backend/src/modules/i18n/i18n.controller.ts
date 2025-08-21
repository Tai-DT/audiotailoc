import { Controller, Get, Query, Param } from '@nestjs/common';
import { I18nService } from './i18n.service';

@Controller('i18n')
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  @Get('languages')
  getSupportedLanguages() {
    return {
      languages: this.i18nService.getSupportedLocales(),
      default: this.i18nService.getDefaultLocale()
    };
  }

  @Get('translations/common')
  getCommonTranslations(@Query('lang') lang: string = 'vi') {
    const locale = this.i18nService.detectLocale(lang);
    return this.i18nService.getTranslations(locale, 'common');
  }

  @Get('translations/products')
  getProductTranslations(@Query('lang') lang: string = 'vi') {
    const locale = this.i18nService.detectLocale(lang);
    return this.i18nService.getTranslations(locale, 'product');
  }

  @Get('products/:id')
  async getLocalizedProduct(
    @Param('id') id: string,
    @Query('lang') lang: string = 'vi'
  ) {
    const locale = this.i18nService.detectLocale(lang);
    return this.i18nService.getLocalizedProduct(id, locale);
  }

  @Get('categories/:id')
  async getLocalizedCategory(
    @Param('id') id: string,
    @Query('lang') lang: string = 'vi'
  ) {
    const locale = this.i18nService.detectLocale(lang);
    return this.i18nService.getLocalizedProduct(id, locale);
  }

  @Get('pages/:slug')
  async getLocalizedPage(
    @Param('slug') slug: string,
    @Query('lang') lang: string = 'vi'
  ) {
    const locale = this.i18nService.detectLocale(lang);
    return this.i18nService.getLocalizedPage(slug, locale);
  }

  @Get('projects/:slug')
  async getLocalizedProject(
    @Param('slug') slug: string,
    @Query('lang') lang: string = 'vi'
  ) {
    const locale = this.i18nService.detectLocale(lang);
    return this.i18nService.getLocalizedProduct(slug, locale);
  }
}

