"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestingModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const test_database_service_1 = require("./test-database.service");
const test_helpers_service_1 = require("./test-helpers.service");
const mock_services_service_1 = require("./mock-services.service");
let TestingModule = class TestingModule {
};
exports.TestingModule = TestingModule;
exports.TestingModule = TestingModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            test_database_service_1.TestDatabaseService,
            test_helpers_service_1.TestHelpersService,
            mock_services_service_1.MockServicesService,
        ],
        exports: [
            test_database_service_1.TestDatabaseService,
            test_helpers_service_1.TestHelpersService,
            mock_services_service_1.MockServicesService,
        ],
    })
], TestingModule);
//# sourceMappingURL=testing.module.js.map