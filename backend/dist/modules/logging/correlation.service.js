"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrelationService = void 0;
const common_1 = require("@nestjs/common");
const async_hooks_1 = require("async_hooks");
const uuid_1 = require("uuid");
let CorrelationService = class CorrelationService {
    static generateCorrelationId() {
        return `req_${Date.now()}_${(0, uuid_1.v4)().split('-')[0]}`;
    }
    static startContext(correlationId) {
        const context = {
            correlationId: correlationId || this.generateCorrelationId(),
            requestId: (0, uuid_1.v4)(),
            startTime: new Date(),
            metadata: new Map(),
        };
        this.requestStorage.set(context.correlationId, context);
        return context;
    }
    static runInContext(context, callback) {
        return this.storage.run(context, callback);
    }
    static getCurrentContext() {
        return this.storage.getStore();
    }
    static getCorrelationId() {
        const context = this.getCurrentContext();
        return context?.correlationId;
    }
    static getRequestId() {
        const context = this.getCurrentContext();
        return context?.requestId;
    }
    static setUserId(userId) {
        const context = this.getCurrentContext();
        if (context) {
            context.userId = userId;
        }
    }
    static setSessionId(sessionId) {
        const context = this.getCurrentContext();
        if (context) {
            context.sessionId = sessionId;
        }
    }
    static addMetadata(key, value) {
        const context = this.getCurrentContext();
        if (context) {
            context.metadata.set(key, value);
        }
    }
    static getMetadata(key) {
        const context = this.getCurrentContext();
        return context?.metadata.get(key);
    }
    static getAllMetadata() {
        const context = this.getCurrentContext();
        if (!context)
            return {};
        const metadata = {};
        context.metadata.forEach((value, key) => {
            metadata[key] = value;
        });
        return metadata;
    }
    static getContextById(correlationId) {
        return this.requestStorage.get(correlationId);
    }
    static endContext(correlationId) {
        this.requestStorage.delete(correlationId);
    }
    static getRequestDuration() {
        const context = this.getCurrentContext();
        if (!context)
            return 0;
        return Date.now() - context.startTime.getTime();
    }
    static createChildContext(parentCorrelationId) {
        const parentId = parentCorrelationId || this.getCorrelationId();
        const childContext = this.startContext();
        if (parentId) {
            childContext.metadata.set('parentCorrelationId', parentId);
        }
        return childContext;
    }
    static extractFromHeaders(headers) {
        return (headers['x-correlation-id'] ||
            headers['x-request-id'] ||
            headers['correlation-id'] ||
            headers['request-id']);
    }
    static addToHeaders(headers) {
        const context = this.getCurrentContext();
        if (context) {
            headers['x-correlation-id'] = context.correlationId;
            headers['x-request-id'] = context.requestId;
        }
    }
    static cleanup(maxAge = 3600000) {
        const now = Date.now();
        const toDelete = [];
        this.requestStorage.forEach((context, correlationId) => {
            if (now - context.startTime.getTime() > maxAge) {
                toDelete.push(correlationId);
            }
        });
        toDelete.forEach(id => {
            this.requestStorage.delete(id);
        });
        return toDelete.length;
    }
    static getStats() {
        return {
            activeContexts: this.requestStorage.size,
            totalContexts: this.requestStorage.size,
        };
    }
    static getAllContexts() {
        return new Map(this.requestStorage);
    }
};
exports.CorrelationService = CorrelationService;
CorrelationService.storage = new async_hooks_1.AsyncLocalStorage();
CorrelationService.requestStorage = new Map();
exports.CorrelationService = CorrelationService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST })
], CorrelationService);
//# sourceMappingURL=correlation.service.js.map