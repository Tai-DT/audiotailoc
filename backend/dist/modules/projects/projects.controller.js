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
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const projects_service_1 = require("./projects.service");
const admin_or_key_guard_1 = require("../auth/admin-or-key.guard");
const jwt_guard_1 = require("../auth/jwt.guard");
const swagger_1 = require("@nestjs/swagger");
const create_project_dto_1 = require("./dto/create-project.dto");
const update_project_dto_1 = require("./dto/update-project.dto");
const query_projects_dto_1 = require("./dto/query-projects.dto");
let ProjectsController = class ProjectsController {
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    async list(query) {
        return this.projectsService.findAll(query);
    }
    async getFeatured() {
        return this.projectsService.findFeatured();
    }
    async getBySlug(slug) {
        return this.projectsService.findBySlug(slug);
    }
    async getById(id) {
        return this.projectsService.findById(id);
    }
    async create(data, req) {
        const userId = req?.user?.id || 'admin-id-placeholder';
        data.userId = userId;
        return this.projectsService.create(data);
    }
    async update(id, data) {
        return this.projectsService.update(id, data);
    }
    async remove(id, permanent) {
        const isPermanent = permanent === 'true';
        return this.projectsService.remove(id, isPermanent);
    }
    async toggleFeatured(id) {
        return this.projectsService.toggleFeatured(id);
    }
    async toggleActive(id) {
        return this.projectsService.toggleActive(id);
    }
    async updateOrder(id, displayOrder) {
        return this.projectsService.updateDisplayOrder(id, displayOrder);
    }
    async restore(id) {
        return this.projectsService.restore(id);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all projects' }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_projects_dto_1.QueryProjectsDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Get featured projects' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getFeatured", null);
__decorate([
    (0, common_1.Get)('by-slug/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get project by slug' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getBySlug", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get project by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new project' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_dto_1.CreateProjectDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update project' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_project_dto_1.UpdateProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete project' }),
    (0, swagger_1.ApiQuery)({ name: 'permanent', required: false, type: Boolean }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('permanent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Post)(':id/toggle-featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle project featured status' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "toggleFeatured", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Post)(':id/toggle-active'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle project active status' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Put)(':id/reorder'),
    (0, swagger_1.ApiOperation)({ summary: 'Update project display order' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('displayOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "updateOrder", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Post)(':id/restore'),
    (0, swagger_1.ApiOperation)({ summary: 'Restore soft-deleted project' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "restore", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, swagger_1.ApiTags)('projects'),
    (0, common_1.Controller)('projects'),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map