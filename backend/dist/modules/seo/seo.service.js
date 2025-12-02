"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SeoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SeoService = SeoService_1 = class SeoService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SeoService_1.name);
        this.defaultSiteName = 'Audio Tài Lộc';
        this.defaultSiteUrl = 'https://audiotailoc.com';
    }
    async getProductSeo(productId, lang = 'vi') {
        const product = await this.prisma.products.findUnique({
            where: { id: productId },
            include: { categories: true }
        });
        if (!product) {
            return this.getDefaultSeo('product', lang);
        }
        const title = product.name;
        const description = product.description || '';
        const keywords = `${product.name}, audio, âm thanh, ${product.categoryId || ''}`;
        const ogTitle = title;
        const ogDescription = description;
        const canonicalUrl = `${this.defaultSiteUrl}/products/${product.slug}`;
        const structuredData = this.generateProductStructuredData(product, lang);
        return {
            type: 'product',
            entityId: product.id,
            entitySlug: product.slug,
            title: title || `${product.name} - ${this.defaultSiteName}`,
            description: description || `Mua ${product.name} chất lượng cao tại Audio Tài Lộc`,
            keywords: keywords || `${product.name}, audio, âm thanh, ${product.categoryId || ''}`,
            canonicalUrl,
            ogTitle: ogTitle || title,
            ogDescription: ogDescription || description || '',
            ogImage: product.imageUrl || `${this.defaultSiteUrl}/images/default-product.jpg`,
            ogType: 'product',
            twitterCard: 'summary_large_image',
            twitterTitle: ogTitle,
            twitterDescription: ogDescription || description || '',
            twitterImage: product.imageUrl || `${this.defaultSiteUrl}/images/default-product.jpg`,
            structuredData
        };
    }
    async getCategorySeo(categoryId, lang = 'vi') {
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
        const canonicalUrl = `${this.defaultSiteUrl}/categories/${category.slug}`;
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
            ogImage: `${this.defaultSiteUrl}/images/default-category.jpg`,
            ogType: 'website',
            twitterCard: 'summary_large_image',
            twitterTitle: title,
            twitterDescription: description || '',
            twitterImage: `${this.defaultSiteUrl}/images/default-category.jpg`
        };
    }
    async getPageSeo(slug, lang = 'vi') {
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
        const canonicalUrl = `${this.defaultSiteUrl}/pages/${slug}`;
        return {
            type: 'page',
            entitySlug: slug,
            title: title || `${page.title} - ${this.defaultSiteName}`,
            description: description || `Trang ${page.title} của Audio Tài Lộc`,
            keywords: keywords || `${page.title}, audio, âm thanh`,
            canonicalUrl,
            ogTitle: ogTitle || title,
            ogDescription: ogDescription || description || '',
            ogImage: `${this.defaultSiteUrl}/images/default-page.jpg`,
            ogType: 'article',
            twitterCard: 'summary_large_image',
            twitterTitle: ogTitle,
            twitterDescription: ogDescription || description || '',
            twitterImage: `${this.defaultSiteUrl}/images/default-page.jpg`
        };
    }
    async getProjectSeo(id, lang = 'vi') {
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
        const canonicalUrl = `${this.defaultSiteUrl}/projects/${project.id}`;
        return {
            type: 'project',
            entitySlug: project.id,
            title: title || `${project.name} - ${this.defaultSiteName}`,
            description: description || `Dự án ${project.name} của Audio Tài Lộc`,
            keywords: keywords || `${project.name}, dự án, audio, âm thanh`,
            canonicalUrl,
            ogTitle: ogTitle || title,
            ogDescription: ogDescription || description || '',
            ogImage: `${this.defaultSiteUrl}/images/default-project.jpg`,
            ogType: 'article',
            twitterCard: 'summary_large_image',
            twitterTitle: ogTitle,
            twitterDescription: ogDescription || description || '',
            twitterImage: `${this.defaultSiteUrl}/images/default-project.jpg`
        };
    }
    getHomeSeo(lang = 'vi') {
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
    async generateSitemap() {
        const [products, categories, pages, projects] = await Promise.all([
            this.prisma.products.findMany({ select: { slug: true, updatedAt: true } }),
            this.prisma.categories.findMany({ select: { slug: true, updatedAt: true } }),
            this.prisma.pages.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
            this.prisma.projects.findMany({ select: { id: true, updatedAt: true } })
        ]);
        let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
        sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        sitemap += `  <url>\n    <loc>${this.defaultSiteUrl}</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
        products.forEach(product => {
            sitemap += `  <url>\n    <loc>${this.defaultSiteUrl}/products/${product.slug}</loc>\n    <lastmod>${product.updatedAt.toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        });
        categories.forEach(category => {
            sitemap += `  <url>\n    <loc>${this.defaultSiteUrl}/categories/${category.slug}</loc>\n    <lastmod>${category.updatedAt.toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
        });
        pages.forEach(page => {
            sitemap += `  <url>\n    <loc>${this.defaultSiteUrl}/pages/${page.slug}</loc>\n    <lastmod>${page.updatedAt.toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
        });
        projects.forEach(project => {
            sitemap += `  <url>\n    <loc>${this.defaultSiteUrl}/projects/${project.id}</loc>\n    <lastmod>${project.updatedAt.toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
        });
        sitemap += '</urlset>';
        return sitemap;
    }
    generateRobotsTxt() {
        return `User-agent: *
Allow: /

Sitemap: ${this.defaultSiteUrl}/sitemap.xml

Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/`;
    }
    generateProductStructuredData(product, _lang) {
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
                url: `${this.defaultSiteUrl}/products/${product.slug}`
            },
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: 4.5,
                reviewCount: product.reviews?.length || 0
            }
        };
    }
    getDefaultSeo(type, lang) {
        const title = lang === 'en'
            ? `${this.defaultSiteName} - Professional Audio Equipment`
            : `${this.defaultSiteName} - Thiết bị âm thanh chuyên nghiệp`;
        return {
            type: type,
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
};
exports.SeoService = SeoService;
exports.SeoService = SeoService = SeoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeoService);
//# sourceMappingURL=seo.service.js.map