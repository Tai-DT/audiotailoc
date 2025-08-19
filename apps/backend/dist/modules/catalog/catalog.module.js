"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogModule = void 0;
const common_1 = require("@nestjs/common");
const catalog_service_1 = require("./catalog.service");
const catalog_controller_1 = require("./catalog.controller");
const search_module_1 = require("../search/search.module");
const auth_module_1 = require("../auth/auth.module");
const cache_service_1 = require("../common/cache.service");
let CatalogModule = class CatalogModule {
};
exports.CatalogModule = CatalogModule;
exports.CatalogModule = CatalogModule = __decorate([
    (0, common_1.Module)({
        controllers: [catalog_controller_1.CatalogController],
        providers: [cache_service_1.CacheService, catalog_service_1.CatalogService],
        imports: [search_module_1.SearchModule, auth_module_1.AuthModule],
    })
], CatalogModule);
//# sourceMappingURL=catalog.module.js.map