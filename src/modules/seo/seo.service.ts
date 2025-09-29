import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

export interface SeoData {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  structuredData?: any;
}

export interface PageSeoData extends SeoData {
  type: 'product' | 'category' | 'page' | 'project' | 'home';
  entityId?: string;
  entitySlug?: string;
}

@Injectable()
export class SeoService {
  private readonly logger = new Logger(SeoService.name);
  private readonly defaultSiteName = 'Audio Tài Lộc';
  private readonly siteUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const configuredSiteUrl = this.configService.get<string>('SITE_URL');
    this.siteUrl = configuredSiteUrl ? configuredSiteUrl.replace(/\/+$/, '') : 'https://audiotailoc.com';
  }

  // Generate SEO data for product page
  async getProductSeo(productId: string, lang: 'vi' | 'en' = 'vi'): Promise<PageSeoData> {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
      include: { categories: true }
    });

    if (!product) {
      return this.getDefaultSeo('product', lang);
    }

    const title = product.name;
    const description = product.description || '';
    const keywords = `${product.name}, audio, âm thanh, ${product.categories?.name || ''}`;
    const ogTitle = title;
    const ogDescription = description;
    const canonicalUrl = `${this.siteUrl}/products/${product.slug}`;

    const structuredData = this.generateProductStructuredData(product, lang);

    return {
      type: 'product',
      entityId: product.id,
      entitySlug: product.slug,
      title: title || `${product.name} - ${this.defaultSiteName}`,
      description: description || `Mua ${product.name} chất lượng cao tại Audio Tài Lộc`,
      keywords: keywords || `${product.name}, audio, âm thanh, ${product.categories?.name || ''}`,
      canonicalUrl,
      ogTitle: ogTitle || title,
      ogDescription: ogDescription || description || '',
      ogImage: product.imageUrl || `${this.siteUrl}/images/default-product.jpg`,
      ogType: 'product',
      twitterCard: 'summary_large_image',
      twitterTitle: ogTitle,
      twitterDescription: ogDescription || description || '',
      twitterImage: product.imageUrl || `${this.siteUrl}/images/default-product.jpg`,
      structuredData
    };
  }

  // Generate SEO data for category page
  async getCategorySeo(categoryId: string, lang: 'vi' | 'en' = 'vi'): Promise<PageSeoData> {
    const category = await this.prisma.categories.findUnique({
      where: { id: categoryId },
      include: { products: true }
    });

    if (!category) {
      return this.getDefaultSeo('category', lang);
    }

    const title = category.name;
    const description = `Khám phá các sản phẩm ${category.name} chất lượng cao`;
    const keywords = `${category.name}, audio, âm thanh, thiết bị âm thanh`;
    const canonicalUrl = `${this.siteUrl}/categories/${category.slug}`;

    return {
      type: 'category',
      entityId: category.id,
      entitySlug: category.slug,
      title: title || `${category.name} - ${this.defaultSiteName}`,
      description: description || `Khám phá các sản phẩm ${category.name} chất lượng cao`,
      keywords: keywords || `${category.name}, audio, âm thanh, thiết bị âm thanh`,
      canonicalUrl,
      ogTitle: title,
      ogDescription: description || '',
      ogImage: `${this.siteUrl}/images/default-category.jpg`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description || '',
      twitterImage: `${this.siteUrl}/images/default-category.jpg`
    };
  }

  // Generate SEO data for page
  async getPageSeo(slug: string, lang: 'vi' | 'en' = 'vi'): Promise<PageSeoData> {
    const page = await this.prisma.pages.findUnique({
      where: { slug }
    });

    if (!page) {
      return this.getDefaultSeo('page', lang);
    }

    const title = page.title;
    const description = page.content;
    const keywords = `${page.title}, audio, âm thanh`;
    const ogTitle = title;
    const ogDescription = description;
    const canonicalUrl = `${this.siteUrl}/pages/${slug}`;

    return {
      type: 'page',
      entitySlug: slug,
      title: title || `${page.title} - ${this.defaultSiteName}`,
      description: description || `Trang ${page.title} của Audio Tài Lộc`,
      keywords: keywords || `${page.title}, audio, âm thanh`,
      canonicalUrl,
      ogTitle: ogTitle || title,
      ogDescription: ogDescription || description || '',
      ogImage: `${this.siteUrl}/images/default-page.jpg`,
      ogType: 'article',
      twitterCard: 'summary_large_image',
      twitterTitle: ogTitle,
      twitterDescription: ogDescription || description || '',
      twitterImage: `${this.siteUrl}/images/default-page.jpg`
    };
  }

  // Generate SEO data for project
  async getProjectSeo(id: string, lang: 'vi' | 'en' = 'vi'): Promise<PageSeoData> {
    const project = await this.prisma.projects.findUnique({
      where: { id }
    });

    if (!project) {
      return this.getDefaultSeo('project', lang);
    }

    const title = project.name;
    const description = project.description || '';
    const keywords = `${project.name}, dự án, audio, âm thanh`;
    const ogTitle = title;
    const ogDescription = description;
    const canonicalUrl = `${this.siteUrl}/projects/${project.slug}`;

    return {
      type: 'project',
      entitySlug: project.slug,
      title: title || `${project.name} - ${this.defaultSiteName}`,
      description: description || `Dự án ${project.name} của Audio Tài Lộc`,
      keywords: keywords || `${project.name}, dự án, audio, âm thanh`,
      canonicalUrl,
      ogTitle: ogTitle || title,
      ogDescription: ogDescription || description || '',
      ogImage: `${this.siteUrl}/images/default-project.jpg`,
      ogType: 'article',
      twitterCard: 'summary_large_image',
      twitterTitle: ogTitle,
      twitterDescription: ogDescription || description || '',
      twitterImage: `${this.siteUrl}/images/default-project.jpg`
    };
  }

  // Generate SEO data for home page
  getHomeSeo(lang: 'vi' | 'en' = 'vi'): PageSeoData {
    const title = lang === 'en' 
      ? 'Audio Tài Lộc - Professional Audio Equipment'
      : 'Audio Tài Lộc - Thiết bị âm thanh chuyên nghiệp';

    const description = lang === 'en'
      ? 'Professional audio equipment, sound systems, and audio solutions. High-quality products for studios, events, and home audio.'
      : 'Thiết bị âm thanh chuyên nghiệp, hệ thống âm thanh và giải pháp audio. Sản phẩm chất lượng cao cho studio, sự kiện và âm thanh gia đình';

    return {
      type: 'home',
      title,
      description,
      keywords: lang === 'en' 
        ? 'audio equipment, sound systems, professional audio, studio equipment'
        : 'thiết bị âm thanh, hệ thống âm thanh, âm thanh chuyên nghiệp, thiết bị studio',
      canonicalUrl: this.siteUrl,
      ogTitle: title,
      ogDescription: description,
      ogImage: `${this.siteUrl}/images/og-home.jpg`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: `${this.siteUrl}/images/og-home.jpg`
    };
  }

  // Generate sitemap XML
  async generateSitemap(): Promise<string> {
    const [
      products,
      categories,
      pages,
      projects,
      services,
      blogArticles,
      blogCategories,
      softwareItems,
    ] = await Promise.all([
      this.prisma.products.findMany({ select: { slug: true, updatedAt: true } }),
      this.prisma.categories.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      this.prisma.pages.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      this.prisma.projects.findMany({ where: { isDeleted: false, isActive: true }, select: { slug: true, updatedAt: true } }),
      this.prisma.services.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      this.prisma.blog_articles.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true, publishedAt: true } }),
      this.prisma.blog_categories.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      this.prisma.software.findMany({ where: { isActive: true, isDeleted: false }, select: { slug: true, updatedAt: true } }),
    ]);

    const baseUrl = this.siteUrl;

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Home page
    sitemap += `  <url>\n    <loc>${baseUrl}</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // Products
    products.forEach(product => {
      sitemap += `  <url>\n    <loc>${baseUrl}/products/${product.slug}</loc>\n    <lastmod>${product.updatedAt.toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    // Categories
    categories.forEach(category => {
      sitemap += `  <url>\n    <loc>${baseUrl}/categories/${category.slug}</loc>\n    <lastmod>${category.updatedAt.toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    // Pages
    pages.forEach(page => {
      sitemap += `  <url>\n    <loc>${baseUrl}/pages/${page.slug}</loc>\n    <lastmod>${page.updatedAt.toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    });

    // Projects
    projects.forEach(project => {
      sitemap += `  <url>\n    <loc>${baseUrl}/projects/${project.slug}</loc>\n    <lastmod>${project.updatedAt.toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    });

    // Services
    services.forEach(service => {
      sitemap += `  <url>\n    <loc>${baseUrl}/services/${service.slug}</loc>\n    <lastmod>${service.updatedAt.toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.65</priority>\n  </url>\n`;
    });

    // Blog articles
    blogArticles.forEach(article => {
      const lastModified = (article.publishedAt ?? article.updatedAt).toISOString();
      sitemap += `  <url>\n    <loc>${baseUrl}/blog/${article.slug}</loc>\n    <lastmod>${lastModified}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    // Blog categories
    blogCategories.forEach(category => {
      sitemap += `  <url>\n    <loc>${baseUrl}/blog/category/${category.slug}</loc>\n    <lastmod>${category.updatedAt.toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
    });

    // Software downloads
    softwareItems.forEach(item => {
      sitemap += `  <url>\n    <loc>${baseUrl}/software/${item.slug}</loc>\n    <lastmod>${item.updatedAt.toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.55</priority>\n  </url>\n`;
    });

    sitemap += '</urlset>';

    return sitemap;
  }

  // Generate robots.txt
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

Sitemap: ${this.siteUrl}/seo/sitemap.xml

Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/`;
  }

  // Generate structured data for products
  private generateProductStructuredData(product: any, _lang: 'vi' | 'en'): any {
    const name = product.name;
    const description = product.description;

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: name,
      description: description,
      image: product.imageUrl || product.images?.[0],
      sku: product.id,
      brand: {
        '@type': 'Brand',
        name: this.defaultSiteName
      },
      offers: {
        '@type': 'Offer',
        price: product.priceCents / 100,
        priceCurrency: 'VND',
        availability: product.inventory?.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: `${this.siteUrl}/products/${product.slug}`
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 4.5,
        reviewCount: product.reviews?.length || 0
      }
    };
  }

  // Get default SEO data
  private getDefaultSeo(type: string, lang: 'vi' | 'en'): PageSeoData {
    const title = lang === 'en' 
      ? `${this.defaultSiteName} - Professional Audio Equipment`
      : `${this.defaultSiteName} - Thiết bị âm thanh chuyên nghiệp`;

    return {
      type: type as any,
      title,
      description: lang === 'en' 
        ? 'Professional audio equipment and sound systems'
        : 'Thiết bị âm thanh và hệ thống âm thanh chuyên nghiệp',
      keywords: lang === 'en' ? 'audio, equipment, sound' : 'âm thanh, thiết bị, âm thanh',
      canonicalUrl: this.siteUrl,
      ogTitle: title,
      ogDescription: title,
      ogImage: `${this.siteUrl}/images/default-og.jpg`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: title,
      twitterImage: `${this.siteUrl}/images/default-og.jpg`
    };
  }
}
