"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./modules/app.module");
const helmet_1 = __importDefault(require("helmet"));
const express_1 = require("express");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    const logger = new common_1.Logger('Bootstrap');
    app.use((0, helmet_1.default)());
    app.enableCors();
    app.use((0, express_1.json)({ limit: '2mb' }));
    app.use((0, express_1.urlencoded)({ extended: true }));
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    const config = app.get(config_1.ConfigService);
    if (config.get('NODE_ENV') !== 'production') {
        const docConfig = new swagger_1.DocumentBuilder()
            .setTitle('Audiotailoc API')
            .setVersion('0.1.0')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, docConfig);
        swagger_1.SwaggerModule.setup('docs', app, document);
    }
    const port = Number(config.get('PORT') || 3001);
    await app.listen(port);
    logger.log(`Backend listening on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map