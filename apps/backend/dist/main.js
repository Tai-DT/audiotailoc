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
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    const logger = new common_1.Logger('Bootstrap');
    const config = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
    }));
    const corsOrigins = config.get('CORS_ORIGIN', 'http://localhost:3000,http://localhost:3001');
    app.enableCors({
        origin: corsOrigins.split(','),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });
    app.use((0, express_1.json)({ limit: '2mb' }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: '2mb' }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.use((req, res, next) => {
        const startTime = Date.now();
        const { method, url, ip } = req;
        const userAgent = req.headers['user-agent'] || '';
        logger.log(`Incoming Request: ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            logger.log(`Outgoing Response: ${method} ${url} - ${res.statusCode} - ${duration}ms`);
        });
        next();
    });
    app.setGlobalPrefix('api/v1');
    if (config.get('NODE_ENV') !== 'production') {
        const docConfig = new swagger_1.DocumentBuilder()
            .setTitle('Audio Tài Lộc API')
            .setDescription('API documentation for Audio Tài Lộc platform')
            .setVersion('1.0.0')
            .addBearerAuth()
            .addTag('Auth', 'Authentication endpoints')
            .addTag('Products', 'Product management endpoints')
            .addTag('Orders', 'Order management endpoints')
            .addTag('Health', 'Health check endpoints')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, docConfig);
        swagger_1.SwaggerModule.setup('docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
    }
    const port = Number(config.get('PORT') || 3010);
    await app.listen(port);
    logger.log(`🚀 Audio Tài Lộc API is running on: http://localhost:${port}`);
    logger.log(`📚 API Documentation: http://localhost:${port}/docs`);
    logger.log(`🏥 Health Check: http://localhost:${port}/api/v1/health`);
    logger.log(`🌍 Environment: ${config.get('NODE_ENV') || 'development'}`);
}
bootstrap().catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map