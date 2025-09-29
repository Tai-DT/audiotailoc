import { Response } from 'express';
import { SeoService } from './seo.service';
export declare class SeoController {
    private readonly seoService;
    constructor(seoService: SeoService);
    getSitemap(res: Response): any;
    getRobotsTxt(res: Response): void;
    getProductSeo(id: string, lang?: string): unknown;
    getCategorySeo(id: string, lang?: string): unknown;
    getPageSeo(slug: string, lang?: string): unknown;
    getProjectSeo(id: string, lang?: string): unknown;
    getHomeSeo(lang?: string): import("./seo.service").PageSeoData;
}
