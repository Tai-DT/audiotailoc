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
export declare class SeoService {
    private readonly prisma;
    private readonly logger;
    private readonly defaultSiteName;
    private readonly defaultSiteUrl;
    constructor(prisma: PrismaService);
    getProductSeo(productId: string, lang?: 'vi' | 'en'): Promise<PageSeoData>;
    getCategorySeo(categoryId: string, lang?: 'vi' | 'en'): Promise<PageSeoData>;
    getPageSeo(slug: string, lang?: 'vi' | 'en'): Promise<PageSeoData>;
    getProjectSeo(id: string, lang?: 'vi' | 'en'): Promise<PageSeoData>;
    getHomeSeo(lang?: 'vi' | 'en'): PageSeoData;
    generateSitemap(): Promise<string>;
    generateRobotsTxt(): string;
    private generateProductStructuredData;
    private getDefaultSeo;
}
