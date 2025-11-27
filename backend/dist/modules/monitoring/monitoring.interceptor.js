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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = exports.MonitoringInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const monitoring_service_1 = require("./monitoring.service");
let MonitoringInterceptor = class MonitoringInterceptor {
    constructor(monitoringService) {
        this.monitoringService = monitoringService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const start = Date.now();
        return next.handle().pipe((0, operators_1.tap)(() => {
            const duration = Date.now() - start;
            const method = request.method;
            const route = this.getRoutePattern(context);
            const statusCode = response.statusCode;
            this.monitoringService.recordRequest(method, route, statusCode, duration);
        }), (0, operators_1.catchError)(error => {
            const duration = Date.now() - start;
            const method = request.method;
            const route = this.getRoutePattern(context);
            this.monitoringService.recordError(error.name || 'UnknownError', route);
            this.monitoringService.recordRequest(method, route, 500, duration);
            return (0, rxjs_1.throwError)(() => error);
        }));
    }
    getRoutePattern(context) {
        const request = context.switchToHttp().getRequest();
        const handler = context.getHandler();
        const controller = context.getClass();
        const route = Reflect.getMetadata('path', controller);
        const methodPath = Reflect.getMetadata('path', handler);
        if (route && methodPath) {
            return `/${route}/${methodPath}`.replace(/\/+/g, '/');
        }
        return request.path || '/';
    }
};
exports.MonitoringInterceptor = MonitoringInterceptor;
exports.MonitoringInterceptor = MonitoringInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [monitoring_service_1.MonitoringService])
], MonitoringInterceptor);
let GlobalExceptionFilter = class GlobalExceptionFilter {
    constructor(monitoringService) {
        this.monitoringService = monitoringService;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.status || 500;
        const route = request.path || '/';
        this.monitoringService.recordError(exception.constructor.name || 'UnknownError', route);
        this.monitoringService.recordRequest(request.method, route, status, 0);
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.message || 'Internal server error',
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [monitoring_service_1.MonitoringService])
], GlobalExceptionFilter);
//# sourceMappingURL=monitoring.interceptor.js.map