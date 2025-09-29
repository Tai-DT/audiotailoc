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
exports.ServiceTypesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const service_types_service_1 = require("./service-types.service");
const create_service_type_dto_1 = require("./dto/create-service-type.dto");
const update_service_type_dto_1 = require("./dto/update-service-type.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
const admin_or_key_guard_1 = require("../auth/admin-or-key.guard");
let ServiceTypesController = class ServiceTypesController {
    constructor(serviceTypesService) {
        this.serviceTypesService = serviceTypesService;
    }
    create(createServiceTypeDto) {
        console.log('[ServiceTypesController] Creating service type:', createServiceTypeDto);
        return this.serviceTypesService.create(createServiceTypeDto);
    }
    testCreate(createServiceTypeDto) {
        console.log('[ServiceTypesController] Test creating service type:', createServiceTypeDto);
        return this.serviceTypesService.create(createServiceTypeDto);
    }
    debug() {
        console.log('[ServiceTypesController] Debug endpoint called');
        return { message: 'Debug endpoint working', timestamp: new Date().toISOString() };
    }
    testEndpoint() {
        console.log('[ServiceTypesController] Test endpoint called');
        return { message: 'Test endpoint working', timestamp: new Date().toISOString() };
    }
    simpleTest() {
        console.log('[ServiceTypesController] Simple test called');
        return { status: 'ok', message: 'Simple test working' };
    }
    findAll() {
        console.log('[ServiceTypesController] GET /service-types called');
        console.log('[ServiceTypesController] About to call service.findAll()');
        return this.serviceTypesService.findAll();
    }
    findOne(id) {
        return this.serviceTypesService.findOne(id);
    }
    update(id, updateServiceTypeDto) {
        console.log(`[ServiceTypesController] PATCH /service-types/${id} - Data:`, updateServiceTypeDto);
        return this.serviceTypesService.update(id, updateServiceTypeDto);
    }
    remove(id) {
        console.log(`[ServiceTypesController] DELETE /service-types/${id}`);
        return this.serviceTypesService.remove(id);
    }
};
exports.ServiceTypesController = ServiceTypesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new service type' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The service type has been successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden. Admin access required.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_type_dto_1.CreateServiceTypeDto]),
    __metadata("design:returntype", void 0)
], ServiceTypesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('test'),
    (0, swagger_1.ApiOperation)({ summary: 'Test create service type without auth' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_type_dto_1.CreateServiceTypeDto]),
    __metadata("design:returntype", void 0)
], ServiceTypesController.prototype, "testCreate", null);
__decorate([
    (0, common_1.Get)('debug'),
    (0, swagger_1.ApiOperation)({ summary: 'Debug endpoint to test service' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServiceTypesController.prototype, "debug", null);
__decorate([
    (0, common_1.Get)('test-endpoint'),
    (0, swagger_1.ApiOperation)({ summary: 'Test endpoint' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServiceTypesController.prototype, "testEndpoint", null);
__decorate([
    (0, common_1.Get)('simple-test'),
    (0, swagger_1.ApiOperation)({ summary: 'Simple test endpoint' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServiceTypesController.prototype, "simpleTest", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active service types' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all active service types.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServiceTypesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a service type by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the service type.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Service type not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceTypesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a service type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The service type has been successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Service type or category not found.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden. Admin access required.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_service_type_dto_1.UpdateServiceTypeDto]),
    __metadata("design:returntype", void 0)
], ServiceTypesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a service type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The service type has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot delete type in use.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden. Admin access required.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Service type not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceTypesController.prototype, "remove", null);
exports.ServiceTypesController = ServiceTypesController = __decorate([
    (0, swagger_1.ApiTags)('Service Types'),
    (0, common_1.Controller)('service-types'),
    __metadata("design:paramtypes", [service_types_service_1.ServiceTypesService])
], ServiceTypesController);
//# sourceMappingURL=service-types.controller.js.map