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
exports.MonitoringMiddleware = void 0;
const common_1 = require("@nestjs/common");
const monitoring_service_1 = require("./monitoring.service");
let MonitoringMiddleware = class MonitoringMiddleware {
    constructor(monitoringService) {
        this.monitoringService = monitoringService;
    }
    use(req, res, next) {
        const start = Date.now();
        const method = req.method;
        const route = this.getRoute(req);
        const originalEnd = res.end;
        const self = this;
        res.end = function (chunk, encoding) {
            const duration = Date.now() - start;
            const statusCode = res.statusCode;
            self.monitoringService.recordRequest(method, route, statusCode, duration);
            if (typeof encoding === 'function') {
                return originalEnd.call(this, chunk, encoding);
            }
            else {
                return originalEnd.call(this, chunk, encoding);
            }
        };
        next();
    }
    getRoute(req) {
        const baseUrl = req.baseUrl || '';
        const path = req.path || req.url || '/';
        const cleanPath = path.split('?')[0];
        if (req.route) {
            return req.route.path || cleanPath;
        }
        return `${baseUrl}${cleanPath}`.replace(/\/$/, '') || '/';
    }
};
exports.MonitoringMiddleware = MonitoringMiddleware;
exports.MonitoringMiddleware = MonitoringMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [monitoring_service_1.MonitoringService])
], MonitoringMiddleware);
//# sourceMappingURL=monitoring.middleware.js.map