import { Injectable, Logger } from '@nestjs/common';
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
  private readonly defaultSiteUrl = 'https://audiotailoc.com';

  constructor(private readonly prisma: PrismaService) {}

  // Generate SEO data for product page
  async getProductSeo(productId: string, lang: 'vi' | 'en' = 'vi'): Promise<PageSeoData> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { category: true, tags: true }
    });

    if (!product) {
      return this.getDefaultSeo('product', lang);
    }

    const title = lang === 'en' 
      ? (product.metaTitleEn || product.nameEn || product.name)
      : (product.metaTitle || product.name);

    const description = lang === 'en'
      ? (product.metaDescriptionEn || product.descriptionEn || product.description)
      : (product.metaDescription || product.description);

    const keywords = lang === 'en'
      ? (product.metaKeywordsEn || product.metaKeywords)
      : product.metaKeywords;

    const ogTitle = lang === 'en'
      ? (product.ogTitleEn || product.ogTitle || title)
      : (product.ogTitle || title);

    const ogDescription = lang === 'en'
      ? (product.ogDescriptionEn || product.ogDescription || description)
      : (product.ogDescription || description);

    const canonicalUrl = product.canonicalUrl || `${this.defaultSiteUrl}/products/${product.slug}`;

    const structuredData = this.generateProductStructuredData(product, lang);

    return {
      type: 'product',
      entityId: product.id,
      entitySlug: product.slug,
      title: title || `${product.name} - ${this.defaultSiteName}`,
      description: description || `Mua ${product.name} chất lượng cao tại Audio Tài Lộc`,
      keywords: keywords || `${product.name}, audio, âm thanh, ${product.category?.name || ''}`,
      canonicalUrl,
      ogTitle: ogTitle || title,
      ogDescription: ogDescription || description || '',
      ogImage: product.ogImage || product.imageUrl || `${this.defaultSiteUrl}/images/default-product.jpg`,
      ogType: 'product',
      twitterCard: 'summary_large_image',
      twitterTitle: ogTitle,
      twitterDescription: ogDescription || description || '',
      twitterImage: product.ogImage || product.imageUrl || `${this.defaultSiteUrl}/images/default-product.jpg`,
      structuredData
    };
  }

  // Generate SEO data for category page
  async getCategorySeo(categoryId: string, lang: 'vi' | 'en' = 'vi'): Promise<PageSeoData> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: { products: true }
    });

    if (!category) {
      return this.getDefaultSeo('category', lang);
    }

    const title = lang === 'en'
      ? (category.metaTitleEn || category.nameEn || category.name)
      : (category.metaTitle || category.name);

    const description = lang === 'en'
      ? (category.metaDescriptionEn || category.descriptionEn || category.description)
      : (category.metaDescription || category.description);

    const keywords = lang === 'en'
      ? (category.metaKeywordsEn || category.metaKeywords)
      : category.metaKeywords;

    const canonicalUrl = category.canonicalUrl || `${this.defaultSiteUrl}/categories/${category.slug}`;

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
      ogImage: category.imageUrl || `${this.defaultSiteUrl}/images/default-category.jpg`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description || '',
      twitterImage: category.imageUrl || `${this.defaultSiteUrl}/images/default-category.jpg`
    };
  }

  // Generate SEO data for page
  async getPageSeo(slug: string, lang: 'vi' | 'en' = 'vi'): Promise<PageSeoData> {
    const page = await this.prisma.page.findUnique({
      where: { slug }
    });

    if (!page) {
      return this.getDefaultSeo('page', lang);
    }

    const title = lang === 'en'
      ? (page.metaTitleEn || page.titleEn || page.title)
      : (page.metaTitle || page.title);

    const description = lang === 'en'
      ? (page.metaDescriptionEn || page.contentEn || page.content)
      : (page.metaDescription || page.content);

    const keywords = lang === 'en'
      ? (page.metaKeywordsEn || page.metaKeywords)
      : page.metaKeywords;

    const ogTitle = lang === 'en'
      ? (page.ogTitleEn || page.ogTitle || title)
      : (page.ogTitle || title);

    const ogDescription = lang === 'en'
      ? (page.ogDescriptionEn || page.ogDescription || description)
      : (page.ogDescription || description);

    const canonicalUrl = page.canonicalUrl || `${this.defaultSiteUrl}/pages/${slug}`;

    return {
      type: 'page',
      entitySlug: slug,
      title: title || `${page.title} - ${this.defaultSiteName}`,
      description: description || `Trang ${page.title} của Audio Tài Lộc`,
      keywords: keywords || `${page.title}, audio, âm thanh`,
      canonicalUrl,
      ogTitle: ogTitle || title,
      ogDescription: ogDescription || description || '',
      ogImage: page.ogImage || `${this.defaultSiteUrl}/images/default-page.jpg`,
      ogType: 'article',
      twitterCard: 'summary_large_image',
      twitterTitle: ogTitle,
      twitterDescription: ogDescription || description || '',
      twitterImage: page.ogImage || `${this.defaultSiteUrl}/images/default-page.jpg`
    };
  }

  // Generate SEO data for project
  async getProjectSeo(slug: string, lang: 'vi' | 'en' = 'vi'): Promise<PageSeoData> {
    const project = await this.prisma.project.findUnique({
      where: { slug }
    });

    if (!project) {
      return this.getDefaultSeo('project', lang);
    }

    const title = lang === 'en'
      ? (project.metaTitleEn || project.nameEn || project.name)
      : (project.metaTitle || project.name);

    const description = lang === 'en'
      ? (project.metaDescriptionEn || project.descriptionEn || project.description)
      : (project.metaDescription || project.description);

    const keywords = lang === 'en'
      ? (project.metaKeywordsEn || project.metaKeywords)
      : project.metaKeywords;

    const ogTitle = lang === 'en'
      ? (project.ogTitleEn || project.ogTitle || title)
      : (project.ogTitle || title);

    const ogDescription = lang === 'en'
      ? (project.ogDescriptionEn || project.ogDescription || description)
      : (project.ogDescription || description);

    const canonicalUrl = project.canonicalUrl || `${this.defaultSiteUrl}/projects/${slug}`;

    return {
      type: 'project',
      entitySlug: slug,
      title: title || `${project.name} - ${this.defaultSiteName}`,
      description: description || `Dự án ${project.name} của Audio Tài Lộc`,
      keywords: keywords || `${project.name}, dự án, audio, âm thanh`,
      canonicalUrl,
      ogTitle: ogTitle || title,
      ogDescription: ogDescription || description || '',
      ogImage: project.ogImage || project.imageUrl || `${this.defaultSiteUrl}/images/default-project.jpg`,
      ogType: 'article',
      twitterCard: 'summary_large_image',
      twitterTitle: ogTitle,
      twitterDescription: ogDescription || description || '',
      twitterImage: project.ogImage || project.imageUrl || `${this.defaultSiteUrl}/images/default-project.jpg`
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
      canonicalUrl: this.defaultSiteUrl,
      ogTitle: title,
      ogDescription: description,
      ogImage: `${this.defaultSiteUrl}/images/og-home.jpg`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: `${this.defaultSiteUrl}/images/og-home.jpg`
    };
  }

  // Generate sitemap XML
  async generateSitemap(): Promise<string> {
    const [products, categories, pages, projects] = await Promise.all([
      this.prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
      this.prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
      this.prisma.page.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      this.prisma.project.findMany({ select: { slug: true, updatedAt: true } })
    ]);

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Home page
    sitemap += `  <url>\n    <loc>${this.defaultSiteUrl}</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // Products
    products.forEach(product => {
      sitemap += `  <url>\n    <loc>${this.defaultSiteUrl}/products/${product.slug}</loc>\n    <lastmod>${product.updatedAt.toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    // Categories
    categories.forEach(category => {
      sitemap += `  <url>\n    <loc>${this.defaultSiteUrl}/categories/${category.slug}</loc>\n    <lastmod>${category.updatedAt.toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    // Pages
    pages.forEach(page => {
      sitemap += `  <url>\n    <loc>${this.defaultSiteUrl}/pages/${page.slug}</loc>\n    <lastmod>${page.updatedAt.toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    });

    // Projects
    projects.forEach(project => {
      sitemap += `  <url>\n    <loc>${this.defaultSiteUrl}/projects/${project.slug}</loc>\n    <lastmod>${project.updatedAt.toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    });

    sitemap += '</urlset>';

    return sitemap;
  }

  // Generate robots.txt
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

Sitemap: ${this.defaultSiteUrl}/sitemap.xml

Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/`;
  }

  // Generate structured data for products
  private generateProductStructuredData(product: any, lang: 'vi' | 'en'): any {
    const name = lang === 'en' ? (product.nameEn || product.name) : product.name;
    const description = lang === 'en' ? (product.descriptionEn || product.description) : product.description;

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
        url: `${this.defaultSiteUrl}/products/${product.slug}`
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
      canonicalUrl: this.defaultSiteUrl,
      ogTitle: title,
      ogDescription: title,
      ogImage: `${this.defaultSiteUrl}/images/default-og.jpg`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: title,
      twitterImage: `${this.defaultSiteUrl}/images/default-og.jpg`
    };
  }
}
