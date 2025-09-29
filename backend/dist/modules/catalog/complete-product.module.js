"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteProductModule = void 0;
const common_1 = require("@nestjs/common");
const complete_product_controller_1 = require("./controllers/complete-product.controller");
const complete_product_service_1 = require("./services/complete-product.service");
let CompleteProductModule = class CompleteProductModule {
};
exports.CompleteProductModule = CompleteProductModule;
exports.CompleteProductModule = CompleteProductModule = __decorate([
    (0, common_1.Module)({
        controllers: [complete_product_controller_1.CompleteProductController],
        providers: [complete_product_service_1.CompleteProductService],
        exports: [complete_product_service_1.CompleteProductService],
    })
], CompleteProductModule);
//# sourceMappingURL=complete-product.module.js.map