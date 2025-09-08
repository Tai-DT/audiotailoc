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
  async getTranslations(_locale: string, _context?: string): Promise<LocalizedContent> {
    // No translation table in schema; return empty map for now
    return {};
  }

  // Translate a specific key
  async translate(key: string, locale: string, params?: Record<string, any>): Promise<string> {
    // No translation table; simply return the key with params interpolated if provided
    let value = key;
    if (params) {
      Object.keys(params).forEach(param => {
        const regex = new RegExp(`{{${param}}}`, 'g');
        value = value.replace(regex, String(params[param]));
      });
    }
    return value;
  }

  // Get localized product data
  async getLocalizedProduct(productId: string, _locale: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
        },
      });

      if (!product) return null;

      return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
      };
    } catch (error) {
      this.logger.error(`Failed to get localized product ${productId}:`, error);
      return null;
    }
  }

  // Get localized page data
  async getLocalizedPage(slug: string, _locale: string) {
    try {
      const page = await this.prisma.page.findUnique({
        where: { slug },
        select: {
          id: true,
          slug: true,
          title: true,
          content: true,
        },
      });

      if (!page) return null;

      return {
        id: page.id,
        slug: page.slug,
        title: page.title,
        content: page.content,
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
  async setTranslation(_data: TranslationData): Promise<void> {
    // No-op: translation storage is not defined in schema
    this.logger.warn('setTranslation called but translation model is not defined in schema');
  }

  // Bulk update translations
  async setTranslations(_translations: TranslationData[]): Promise<void> {
    // No-op: translation storage is not defined in schema
    this.logger.warn('setTranslations called but translation model is not defined in schema');
  }

  // Delete translation
  async deleteTranslation(_key: string, _locale: string): Promise<void> {
    // No-op: translation storage is not defined in schema
    this.logger.warn('deleteTranslation called but translation model is not defined in schema');
  }

  // Get translation statistics
  async getTranslationStats(): Promise<{
    totalKeys: number;
    totalTranslations: number;
    coverage: Record<string, number>;
  }> {
    // No storage; return empty stats
    return {
      totalKeys: 0,
      totalTranslations: 0,
      coverage: {},
    };
  }
}
