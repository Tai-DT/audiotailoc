"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../prisma/prisma.module");
const mail_service_1 = require("./mail.service");
const notification_service_1 = require("./notification.service");
const notification_gateway_1 = require("./notification.gateway");
const notifications_controller_1 = require("./notifications.controller");
const telegram_controller_1 = require("./telegram.controller");
const telegram_service_1 = require("./telegram.service");
const messages_module_1 = require("../messages/messages.module");
const analytics_module_1 = require("../analytics/analytics.module");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, messages_module_1.MessagesModule, analytics_module_1.AnalyticsModule],
        controllers: [notifications_controller_1.NotificationsController, telegram_controller_1.TelegramController],
        providers: [mail_service_1.MailService, notification_service_1.NotificationService, notification_gateway_1.NotificationGateway, telegram_service_1.TelegramService],
        exports: [mail_service_1.MailService, notification_service_1.NotificationService, notification_gateway_1.NotificationGateway, telegram_service_1.TelegramService],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map