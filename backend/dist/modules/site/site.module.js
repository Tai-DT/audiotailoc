"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../prisma/prisma.module");
const banners_service_1 = require("./banners.service");
const banners_controller_1 = require("./banners.controller");
const admin_banners_controller_1 = require("./admin-banners.controller");
const settings_service_1 = require("./settings.service");
const settings_controller_1 = require("./settings.controller");
const admin_settings_controller_1 = require("./admin-settings.controller");
const simple_settings_controller_1 = require("./simple-settings.controller");
const site_stats_controller_1 = require("./site-stats.controller");
const site_stats_service_1 = require("./site-stats.service");
const testimonials_controller_1 = require("./testimonials.controller");
const testimonials_service_1 = require("./testimonials.service");
let SiteModule = class SiteModule {
};
exports.SiteModule = SiteModule;
exports.SiteModule = SiteModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [
            banners_controller_1.BannersController,
            admin_banners_controller_1.AdminBannersController,
            settings_controller_1.SettingsController,
            admin_settings_controller_1.AdminSettingsController,
            simple_settings_controller_1.SimpleSettingsController,
            site_stats_controller_1.SiteStatsController,
            testimonials_controller_1.TestimonialsController,
        ],
        providers: [banners_service_1.BannersService, settings_service_1.SettingsService, site_stats_service_1.SiteStatsService, testimonials_service_1.TestimonialsService],
        exports: [banners_service_1.BannersService, settings_service_1.SettingsService, site_stats_service_1.SiteStatsService, testimonials_service_1.TestimonialsService],
    })
], SiteModule);
//# sourceMappingURL=site.module.js.map