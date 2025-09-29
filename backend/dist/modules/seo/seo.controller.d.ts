import { Response } from 'express';
import { SeoService } from './seo.service';
export declare class SeoController {
    private readonly seoService;
    constructor(seoService: SeoService);
    getSitemap(res: Response): Promise<void>;
    getRobotsTxt(res: Response): void;
    getProductSeo(id: string, lang?: string): Promise<import("./seo.service").PageSeoData>;
    getCategorySeo(id: string, lang?: string): Promise<import("./seo.service").PageSeoData>;
    getPageSeo(slug: string, lang?: string): Promise<import("./seo.service").PageSeoData>;
    getProjectSeo(id: string, lang?: string): Promise<import("./seo.service").PageSeoData>;
    getHomeSeo(lang?: string): import("./seo.service").PageSeoData;
}
