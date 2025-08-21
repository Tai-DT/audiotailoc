import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

export interface LocaleConfig {
  code: string;
  name: string;
  flag: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface TranslationData {
  key: string;
  value: string;
  locale: string;
  context?: string;
}

export interface LocalizedContent {
  [key: string]: string;
}

@Injectable()
export class I18nService {
  private readonly logger = new Logger(I18nService.name);
  private readonly defaultLocale = 'vi';
  private readonly supportedLocales: LocaleConfig[] = [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', isDefault: true, isActive: true },
    { code: 'en', name: 'English', flag: '🇺🇸', isDefault: false, isActive: true },
    { code: 'zh', name: '中文', flag: '🇨🇳', isDefault: false, isActive: false },
  ];

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  // Get supported locales
  getSupportedLocales(): LocaleConfig[] {
    return this.supportedLocales.filter(locale => locale.isActive);
  }

  // Get default locale
  getDefaultLocale(): string {
    return this.defaultLocale;
  }

  // Detect locale from request headers
  detectLocale(acceptLanguage?: string): string {
    if (!acceptLanguage) return this.defaultLocale;

    const languages = acceptLanguage
      .split(',')
      .map(lang => lang.trim().split(';')[0])
      .map(lang => lang.split('-')[0]);

    for (const lang of languages) {
      const supported = this.supportedLocales.find(
        locale => locale.code === lang && locale.isActive
      );
      if (supported) return lang;
    }

    return this.defaultLocale;
  }

  // Get translations for a specific locale
  async getTranslations(locale: string, context?: string): Promise<LocalizedContent> {
    try {
      const translations = await this.prisma.translation.findMany({
        where: {
          locale,
          ...(context && { context }),
        },
        select: {
          key: true,
          value: true,
        },
      });

      const result: LocalizedContent = {};
      translations.forEach((trans: any) => {
        result[trans.key] = trans.value;
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to get translations for locale ${locale}:`, error);
      return {};
    }
  }

  // Translate a specific key
  async translate(key: string, locale: string, params?: Record<string, any>): Promise<string> {
    try {
      const translation = await this.prisma.translation.findFirst({
        where: { key, locale },
      });

      if (!translation) {
        // Fallback to default locale
        if (locale !== this.defaultLocale) {
          return this.translate(key, this.defaultLocale, params);
        }
        return key; // Return key if no translation found
      }

      let value = translation.value;

      // Replace parameters
      if (params) {
        Object.keys(params).forEach(param => {
          const regex = new RegExp(`{{${param}}}`, 'g');
          value = value.replace(regex, String(params[param]));
        });
      }

      return value;
    } catch (error) {
      this.logger.error(`Translation failed for key ${key}:`, error);
      return key;
    }
  }

  // Get localized product data
  async getLocalizedProduct(productId: string, locale: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          slug: true,
          name: true,
          nameEn: true,
          description: true,
          descriptionEn: true,
          metaTitle: true,
          metaTitleEn: true,
          metaDescription: true,
          metaDescriptionEn: true,
          metaKeywords: true,
          metaKeywordsEn: true,
          ogTitle: true,
          ogTitleEn: true,
          ogDescription: true,
          ogDescriptionEn: true,
        },
      });

      if (!product) return null;

      if (locale === 'en') {
        return {
          id: product.id,
          slug: product.slug,
          name: product.nameEn || product.name,
          description: product.descriptionEn || product.description,
          metaTitle: product.metaTitleEn || product.metaTitle,
          metaDescription: product.metaDescriptionEn || product.metaDescription,
          metaKeywords: product.metaKeywordsEn || product.metaKeywords,
          ogTitle: product.ogTitleEn || product.ogTitle,
          ogDescription: product.ogDescriptionEn || product.ogDescription,
        };
      }

      return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        metaKeywords: product.metaKeywords,
        ogTitle: product.ogTitle,
        ogDescription: product.ogDescription,
      };
    } catch (error) {
      this.logger.error(`Failed to get localized product ${productId}:`, error);
      return null;
    }
  }

  // Get localized page data
  async getLocalizedPage(slug: string, locale: string) {
    try {
      const page = await this.prisma.page.findUnique({
        where: { slug },
        select: {
          id: true,
          slug: true,
          title: true,
          titleEn: true,
          content: true,
          contentEn: true,
          metaTitle: true,
          metaTitleEn: true,
          metaDescription: true,
          metaDescriptionEn: true,
          metaKeywords: true,
          metaKeywordsEn: true,
        },
      });

      if (!page) return null;

      if (locale === 'en') {
        return {
          id: page.id,
          slug: page.slug,
          title: page.titleEn || page.title,
          content: page.contentEn || page.content,
          metaTitle: page.metaTitleEn || page.metaTitle,
          metaDescription: page.metaDescriptionEn || page.metaDescription,
          metaKeywords: page.metaKeywordsEn || page.metaKeywords,
        };
      }

      return {
        id: page.id,
        slug: page.slug,
        title: page.title,
        content: page.content,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        metaKeywords: page.metaKeywords,
      };
    } catch (error) {
      this.logger.error(`Failed to get localized page ${slug}:`, error);
      return null;
    }
  }

  // Format currency based on locale
  formatCurrency(amount: number, locale: string): string {
    const currencies: Record<string, { currency: string; locale: string }> = {
      vi: { currency: 'VND', locale: 'vi-VN' },
      en: { currency: 'USD', locale: 'en-US' },
      zh: { currency: 'CNY', locale: 'zh-CN' },
    };

    const config = currencies[locale] || currencies.vi;
    
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
    }).format(amount);
  }

  // Format date based on locale
  formatDate(date: Date, locale: string, options?: Intl.DateTimeFormatOptions): string {
    const locales: Record<string, string> = {
      vi: 'vi-VN',
      en: 'en-US',
      zh: 'zh-CN',
    };

    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return new Intl.DateTimeFormat(
      locales[locale] || locales.vi,
      options || defaultOptions
    ).format(date);
  }

  // Format number based on locale
  formatNumber(number: number, locale: string, options?: Intl.NumberFormatOptions): string {
    const locales: Record<string, string> = {
      vi: 'vi-VN',
      en: 'en-US',
      zh: 'zh-CN',
    };

    return new Intl.NumberFormat(
      locales[locale] || locales.vi,
      options
    ).format(number);
  }

  // Add or update translation
  async setTranslation(data: TranslationData): Promise<void> {
    try {
      await this.prisma.translation.upsert({
        where: {
          key_locale: {
            key: data.key,
            locale: data.locale,
          },
        },
        update: {
          value: data.value,
          context: data.context,
        },
        create: {
          key: data.key,
          value: data.value,
          locale: data.locale,
          context: data.context,
        },
      });
    } catch (error) {
      this.logger.error('Failed to set translation:', error);
      throw error;
    }
  }

  // Bulk update translations
  async setTranslations(translations: TranslationData[]): Promise<void> {
    try {
      await this.prisma.$transaction(
        translations.map(trans =>
          this.prisma.translation.upsert({
            where: {
              key_locale: {
                key: trans.key,
                locale: trans.locale,
              },
            },
            update: {
              value: trans.value,
              context: trans.context,
            },
            create: {
              key: trans.key,
              value: trans.value,
              locale: trans.locale,
              context: trans.context,
            },
          })
        )
      );
    } catch (error) {
      this.logger.error('Failed to set translations:', error);
      throw error;
    }
  }

  // Delete translation
  async deleteTranslation(key: string, locale: string): Promise<void> {
    try {
      await this.prisma.translation.delete({
        where: {
          key_locale: {
            key,
            locale,
          },
        },
      });
    } catch (error) {
      this.logger.error('Failed to delete translation:', error);
      throw error;
    }
  }

  // Get translation statistics
  async getTranslationStats(): Promise<{
    totalKeys: number;
    totalTranslations: number;
    coverage: Record<string, number>;
  }> {
    try {
      const [totalKeys, translationsByLocale] = await Promise.all([
        this.prisma.translation.groupBy({
          by: ['key'],
          _count: true,
        }),
        this.prisma.translation.groupBy({
          by: ['locale'],
          _count: true,
        }),
      ]);

      const uniqueKeys = totalKeys.length;
      const totalTranslations = translationsByLocale.reduce((sum: number, item: any) => sum + item._count, 0);

      const coverage: Record<string, number> = {};
      translationsByLocale.forEach((item: any) => {
        coverage[item.locale] = uniqueKeys > 0 ? (item._count / uniqueKeys) * 100 : 0;
      });

      return {
        totalKeys: uniqueKeys,
        totalTranslations,
        coverage,
      };
    } catch (error) {
      this.logger.error('Failed to get translation stats:', error);
      return {
        totalKeys: 0,
        totalTranslations: 0,
        coverage: {},
      };
    }
  }
}

