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
        ],
        providers: [banners_service_1.BannersService, settings_service_1.SettingsService],
        exports: [banners_service_1.BannersService, settings_service_1.SettingsService],
    })
], SiteModule);
//# sourceMappingURL=site.module.js.map