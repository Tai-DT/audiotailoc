"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
    }));
    app.setGlobalPrefix('api/v1');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Audio Tài Lộc API')
        .setDescription('API documentation for Audio Tài Lộc application')
        .setVersion('1.0')
        .addTag('Audio Tài Lộc')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/v1/docs', app, document);
    await app.listen(3010);
    console.log('🚀 Audio Tài Lộc API is running on: http://localhost:3010');
    console.log('📚 API Documentation: http://localhost:3010/api/v1/docs');
}
bootstrap();
//# sourceMappingURL=main.js.map