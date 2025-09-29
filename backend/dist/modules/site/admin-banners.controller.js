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
exports.AdminBannersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const banners_service_1 = require("./banners.service");
const banner_create_dto_1 = require("./dto/banner-create.dto");
const banner_update_dto_1 = require("./dto/banner-update.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
const admin_or_key_guard_1 = require("../auth/admin-or-key.guard");
let AdminBannersController = class AdminBannersController {
    constructor(bannersService) {
        this.bannersService = bannersService;
    }
    async findAll(page, search, skip, take) {
        return this.bannersService.findAll({
            page,
            search,
            skip: skip ? parseInt(skip, 10) : 0,
            take: take ? parseInt(take, 10) : 20,
        });
    }
    async findOne(id) {
        return this.bannersService.findById(id);
    }
    async create(data) {
        return this.bannersService.create(data);
    }
    async update(id, data) {
        return this.bannersService.update(id, data);
    }
    async remove(id) {
        return this.bannersService.softDelete(id);
    }
    async reorder(data) {
        return this.bannersService.reorder(data.ids);
    }
};
exports.AdminBannersController = AdminBannersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all banners (admin)' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('skip')),
    __param(3, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get banner by ID (admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new banner' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [banner_create_dto_1.CreateBannerDto]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update banner' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, banner_update_dto_1.UpdateBannerDto]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete banner' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)('reorder'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder banners' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "reorder", null);
exports.AdminBannersController = AdminBannersController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Banners'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Controller)('admin/banners'),
    __metadata("design:paramtypes", [banners_service_1.BannersService])
], AdminBannersController);
//# sourceMappingURL=admin-banners.controller.js.map