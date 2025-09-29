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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const health_service_1 = require("./health.service");
const admin_or_key_guard_1 = require("../auth/admin-or-key.guard");
let HealthController = class HealthController {
    constructor(healthService) {
        this.healthService = healthService;
    }
    async basicHealth() {
        return this.healthService.checkBasicHealth();
    }
    async detailedHealth() {
        return this.healthService.checkDetailedHealth();
    }
    async databaseHealth() {
        return this.healthService.checkDatabaseHealth();
    }
    async performanceMetrics() {
        return this.healthService.getPerformanceMetrics();
    }
    async systemInfo() {
        return this.healthService.getSystemInfo();
    }
    async memoryUsage() {
        return this.healthService.getMemoryUsage();
    }
    async uptime() {
        return this.healthService.getUptime();
    }
    async version() {
        return this.healthService.getVersion();
    }
    async dependenciesHealth() {
        return this.healthService.checkDependenciesHealth();
    }
    async recentLogs(lines = '100') {
        return this.healthService.getRecentLogs(parseInt(lines));
    }
    async recentErrors(hours = '24') {
        return this.healthService.getRecentErrors(parseInt(hours));
    }
    async applicationMetrics() {
        return this.healthService.getApplicationMetrics();
    }
    async activeAlerts() {
        return this.healthService.getActiveAlerts();
    }
    async redisHealth() {
        return this.healthService.checkRedisHealth();
    }
    async upstashHealth() {
        return this.healthService.checkUpstashHealth();
    }
    async externalApisHealth() {
        return this.healthService.checkExternalApisHealth();
    }
    async storageHealth() {
        return this.healthService.checkStorageHealth();
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Basic health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'Service is unhealthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "basicHealth", null);
__decorate([
    (0, common_1.Get)('detailed'),
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Detailed health check (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Detailed health information' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "detailedHealth", null);
__decorate([
    (0, common_1.Get)('database'),
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Database health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Database health information' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "databaseHealth", null);
__decorate([
    (0, common_1.Get)('performance'),
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Performance metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Performance information' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "performanceMetrics", null);
__decorate([
    (0, common_1.Get)('system'),
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'System information' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System information' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "systemInfo", null);
__decorate([
    (0, common_1.Get)('memory'),
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Memory usage information' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Memory usage details' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "memoryUsage", null);
__decorate([
    (0, common_1.Get)('uptime'),
    (0, swagger_1.ApiOperation)({ summary: 'Application uptime' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Uptime information' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "uptime", null);
__decorate([
    (0, common_1.Get)('version'),
    (0, swagger_1.ApiOperation)({ summary: 'Application version' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Version information' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "version", null);
__decorate([
    (0, common_1.Get)('dependencies'),
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Dependencies health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dependencies status' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "dependenciesHealth", null);
__decorate([
    (0, common_1.Get)('logs'),
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Recent application logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recent logs' }),
    __param(0, (0, common_1.Query)('lines')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "recentLogs", null);
__decorate([
    (0, common_1.Get)('errors'),
    (0, swagger_1.ApiOperation)({ summary: 'Recent error logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recent errors' }),
    __param(0, (0, common_1.Query)('hours')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "recentErrors", null);
__decorate([
    (0, common_1.Get)('metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Application metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Application metrics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "applicationMetrics", null);
__decorate([
    (0, common_1.Get)('alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Active alerts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active alerts' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "activeAlerts", null);
__decorate([
    (0, common_1.Get)('redis'),
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Redis health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Redis health information' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "redisHealth", null);
__decorate([
    (0, common_1.Get)('upstash'),
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Upstash Redis health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Upstash Redis health information' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "upstashHealth", null);
__decorate([
    (0, common_1.Get)('external-apis'),
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'External APIs health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'External APIs health information' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "externalApisHealth", null);
__decorate([
    (0, common_1.Get)('storage'),
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Storage health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Storage health information' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "storageHealth", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [health_service_1.HealthService])
], HealthController);
//# sourceMappingURL=health.controller.js.map