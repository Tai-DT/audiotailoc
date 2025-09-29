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
exports.TechniciansController = void 0;
const common_1 = require("@nestjs/common");
const technicians_service_1 = require("./technicians.service");
let TechniciansController = class TechniciansController {
    constructor(techniciansService) {
        this.techniciansService = techniciansService;
    }
    async createTechnician(createTechnicianDto) {
        return this.techniciansService.createTechnician(createTechnicianDto);
    }
    async getTechnicians(query) {
        return this.techniciansService.getTechnicians({
            isActive: query.isActive === 'true',
            specialty: query.specialty,
            page: query.page ? parseInt(query.page) : undefined,
            pageSize: query.pageSize ? parseInt(query.pageSize) : undefined,
        });
    }
    async getAvailableTechnicians(query) {
        return this.techniciansService.getAvailableTechnicians({
            date: new Date(query.date),
            time: query.time,
            specialty: query.specialty,
            duration: query.duration ? parseInt(query.duration) : undefined,
        });
    }
    async getTechnicianStats() {
        return this.techniciansService.getTechnicianStats();
    }
    async getTechnician(id) {
        return this.techniciansService.getTechnician(id);
    }
    async getTechnicianWorkload(id, query) {
        return this.techniciansService.getTechnicianWorkload(id, {
            fromDate: query.fromDate ? new Date(query.fromDate) : undefined,
            toDate: query.toDate ? new Date(query.toDate) : undefined,
        });
    }
    async updateTechnician(id, updateTechnicianDto) {
        return this.techniciansService.updateTechnician(id, updateTechnicianDto);
    }
    async deleteTechnician(id) {
        return this.techniciansService.deleteTechnician(id);
    }
    async setTechnicianSchedule(id, scheduleDto) {
        return this.techniciansService.setTechnicianSchedule(id, scheduleDto.schedules.map(s => ({
            date: new Date(s.date),
            startTime: s.startTime,
            endTime: s.endTime,
            isAvailable: s.isAvailable,
        })));
    }
};
exports.TechniciansController = TechniciansController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TechniciansController.prototype, "createTechnician", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TechniciansController.prototype, "getTechnicians", null);
__decorate([
    (0, common_1.Get)('available'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TechniciansController.prototype, "getAvailableTechnicians", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TechniciansController.prototype, "getTechnicianStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TechniciansController.prototype, "getTechnician", null);
__decorate([
    (0, common_1.Get)(':id/workload'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TechniciansController.prototype, "getTechnicianWorkload", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TechniciansController.prototype, "updateTechnician", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TechniciansController.prototype, "deleteTechnician", null);
__decorate([
    (0, common_1.Put)(':id/schedule'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TechniciansController.prototype, "setTechnicianSchedule", null);
exports.TechniciansController = TechniciansController = __decorate([
    (0, common_1.Controller)('technicians'),
    __metadata("design:paramtypes", [technicians_service_1.TechniciansService])
], TechniciansController);
//# sourceMappingURL=technicians.controller.js.map