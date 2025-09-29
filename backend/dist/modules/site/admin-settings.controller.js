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
exports.AdminSettingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const settings_service_1 = require("./settings.service");
const settings_update_dto_1 = require("./dto/settings-update.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
const admin_or_key_guard_1 = require("../auth/admin-or-key.guard");
let AdminSettingsController = class AdminSettingsController {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async getSettings() {
        return this.settingsService.getSettings();
    }
    async updateSettings(data) {
        return this.settingsService.updateSettings(data);
    }
};
exports.AdminSettingsController = AdminSettingsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all site settings (admin)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Patch)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update site settings' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [settings_update_dto_1.UpdateSettingsDto]),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "updateSettings", null);
exports.AdminSettingsController = AdminSettingsController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Settings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Controller)('admin/settings'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], AdminSettingsController);
//# sourceMappingURL=admin-settings.controller.js.map