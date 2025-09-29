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
exports.HomePageStatsController = void 0;
const common_1 = require("@nestjs/common");
const homepage_stats_service_1 = require("./homepage-stats.service");
const homepage_stats_create_dto_1 = require("./dto/homepage-stats-create.dto");
const admin_or_key_guard_1 = require("../auth/admin-or-key.guard");
let HomePageStatsController = class HomePageStatsController {
    constructor(siteStatsService) {
        this.siteStatsService = siteStatsService;
    }
    findAll() {
        return this.siteStatsService.findAll();
    }
    findOne(id) {
        return this.siteStatsService.findOne(id);
    }
    findByKey(key) {
        return this.siteStatsService.findByKey(key);
    }
    create(createHomePageStatsDto) {
        return this.siteStatsService.create(createHomePageStatsDto);
    }
    update(id, updateHomePageStatsDto) {
        return this.siteStatsService.update(id, updateHomePageStatsDto);
    }
    updateByKey(key, updateHomePageStatsDto) {
        return this.siteStatsService.updateByKey(key, updateHomePageStatsDto);
    }
    remove(id) {
        return this.siteStatsService.remove(id);
    }
};
exports.HomePageStatsController = HomePageStatsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HomePageStatsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HomePageStatsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('key/:key'),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HomePageStatsController.prototype, "findByKey", null);
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [homepage_stats_create_dto_1.CreateHomePageStatsDto]),
    __metadata("design:returntype", void 0)
], HomePageStatsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, homepage_stats_create_dto_1.UpdateHomePageStatsDto]),
    __metadata("design:returntype", void 0)
], HomePageStatsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Patch)('key/:key'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, homepage_stats_create_dto_1.UpdateHomePageStatsDto]),
    __metadata("design:returntype", void 0)
], HomePageStatsController.prototype, "updateByKey", null);
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HomePageStatsController.prototype, "remove", null);
exports.HomePageStatsController = HomePageStatsController = __decorate([
    (0, common_1.Controller)('homepage-stats'),
    __metadata("design:paramtypes", [homepage_stats_service_1.SiteStatsService])
], HomePageStatsController);
//# sourceMappingURL=homepage-stats.controller.js.map