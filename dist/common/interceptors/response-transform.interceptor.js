"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseTransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let ResponseTransformInterceptor = class ResponseTransformInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const _response = context.switchToHttp().getResponse();
        return next.handle().pipe((0, operators_1.map)((data) => ({
            success: true,
            data: this.serializeBigInt(data),
            message: this.getSuccessMessage(request.method, request.url),
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
        })));
    }
    serializeBigInt(obj, visited = new WeakSet()) {
        if (obj === null || obj === undefined) {
            return obj;
        }
        if (obj instanceof Date) {
            return obj.toISOString();
        }
        if (typeof obj === 'bigint') {
            return Number(obj);
        }
        if (typeof obj !== 'object') {
            return obj;
        }
        if (visited.has(obj)) {
            return '[Circular Reference]';
        }
        visited.add(obj);
        if (Array.isArray(obj)) {
            const result = obj.map(item => this.serializeBigInt(item, visited));
            visited.delete(obj);
            return result;
        }
        if (typeof obj === 'object') {
            const result = {};
            for (const [key, value] of Object.entries(obj)) {
                result[key] = this.serializeBigInt(value, visited);
            }
            visited.delete(obj);
            return result;
        }
        visited.delete(obj);
        return obj;
    }
    getSuccessMessage(method, _url) {
        switch (method) {
            case 'GET':
                return 'Data retrieved successfully';
            case 'POST':
                return 'Resource created successfully';
            case 'PUT':
            case 'PATCH':
                return 'Resource updated successfully';
            case 'DELETE':
                return 'Resource deleted successfully';
            default:
                return 'Operation completed successfully';
        }
    }
};
exports.ResponseTransformInterceptor = ResponseTransformInterceptor;
exports.ResponseTransformInterceptor = ResponseTransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseTransformInterceptor);
//# sourceMappingURL=response-transform.interceptor.js.map