"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModule = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const inventory_controller_1 = require("./inventory.controller");
const inventory_movement_service_1 = require("./inventory-movement.service");
const inventory_movement_controller_1 = require("./inventory-movement.controller");
const inventory_alert_service_1 = require("./inventory-alert.service");
const inventory_alert_controller_1 = require("./inventory-alert.controller");
const guards_module_1 = require("../auth/guards.module");
const users_module_1 = require("../users/users.module");
const notifications_module_1 = require("../notifications/notifications.module");
let InventoryModule = class InventoryModule {
};
exports.InventoryModule = InventoryModule;
exports.InventoryModule = InventoryModule = __decorate([
    (0, common_1.Module)({
        imports: [guards_module_1.GuardsModule, users_module_1.UsersModule, notifications_module_1.NotificationsModule],
        providers: [inventory_service_1.InventoryService, inventory_movement_service_1.InventoryMovementService, inventory_alert_service_1.InventoryAlertService],
        controllers: [inventory_controller_1.InventoryController, inventory_movement_controller_1.InventoryMovementController, inventory_alert_controller_1.InventoryAlertController],
        exports: [inventory_service_1.InventoryService, inventory_movement_service_1.InventoryMovementService, inventory_alert_service_1.InventoryAlertService],
    })
], InventoryModule);
//# sourceMappingURL=inventory.module.js.map