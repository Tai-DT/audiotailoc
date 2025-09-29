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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeoController = void 0;
const common_1 = require("@nestjs/common");
const seo_service_1 = require("./seo.service");
let SeoController = class SeoController {
    constructor(seoService) {
        this.seoService = seoService;
    }
    async getSitemap(res) {
        const sitemap = await this.seoService.generateSitemap();
        res.set('Content-Type', 'application/xml');
        res.send(sitemap);
    }
    getRobotsTxt(res) {
        const robotsTxt = this.seoService.generateRobotsTxt();
        res.set('Content-Type', 'text/plain');
        res.send(robotsTxt);
    }
    async getProductSeo(id, lang = 'vi') {
        return this.seoService.getProductSeo(id, lang);
    }
    async getCategorySeo(id, lang = 'vi') {
        return this.seoService.getCategorySeo(id, lang);
    }
    async getPageSeo(slug, lang = 'vi') {
        return this.seoService.getPageSeo(slug, lang);
    }
    async getProjectSeo(id, lang = 'vi') {
        return this.seoService.getProjectSeo(id, lang);
    }
    getHomeSeo(lang = 'vi') {
        return this.seoService.getHomeSeo(lang);
    }
};
exports.SeoController = SeoController;
__decorate([
    (0, common_1.Get)('sitemap.xml'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "getSitemap", null);
__decorate([
    (0, common_1.Get)('robots.txt'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SeoController.prototype, "getRobotsTxt", null);
__decorate([
    (0, common_1.Get)('product/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('lang')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "getProductSeo", null);
__decorate([
    (0, common_1.Get)('category/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('lang')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "getCategorySeo", null);
__decorate([
    (0, common_1.Get)('page/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Query)('lang')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "getPageSeo", null);
__decorate([
    (0, common_1.Get)('project/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('lang')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "getProjectSeo", null);
__decorate([
    (0, common_1.Get)('home'),
    __param(0, (0, common_1.Query)('lang')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SeoController.prototype, "getHomeSeo", null);
exports.SeoController = SeoController = __decorate([
    (0, common_1.Controller)('seo'),
    __metadata("design:paramtypes", [seo_service_1.SeoService])
], SeoController);
//# sourceMappingURL=seo.controller.js.map