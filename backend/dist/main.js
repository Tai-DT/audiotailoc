"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./modules/app.module");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_1 = require("express");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const response_transform_interceptor_1 = require("./common/interceptors/response-transform.interceptor");
if (process && process.stdout && typeof process.stdout.on === 'function') {
    process.stdout.on('error', (err) => {
        if (err && (err.code === 'EPIPE' || err.code === 'EIO')) {
            return;
        }
        console.error('Unhandled stdout error:', err);
    });
    process.stderr.on('error', (err) => {
        if (err && (err.code === 'EPIPE' || err.code === 'EIO')) {
            return;
        }
        console.error('Unhandled stderr error:', err);
    });
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    const logger = new common_1.Logger('Bootstrap');
    const config = app.get(config_1.ConfigService);
    const port = Number(process.env.PORT || config.get('PORT') || 3010);
    const requiredEnvVars = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
    const missingVars = requiredEnvVars.filter(varName => !config.get(varName));
    if (missingVars.length > 0) {
        logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
        process.exit(1);
    }
    app.use((0, compression_1.default)({
        level: 6,
        threshold: 1024,
        filter: (req, res) => {
            if (req && req.headers && req.headers['x-no-compression']) {
                return false;
            }
            return compression_1.default.filter(req, res);
        },
    }));
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        },
    }));
    const corsOrigins = config.get('CORS_ORIGIN', 'http://localhost:3000,http://localhost:3001,http://localhost:3002,https://*.vercel.app,http://127.0.0.1:52312,http://127.0.0.1:50464');
    const allowedOrigins = corsOrigins.split(',').map((origin) => origin.trim());
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                if (process.env.NODE_ENV === 'development') {
                    return callback(null, true);
                }
                return callback(null, false);
            }
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            if (allowedOrigins.some(allowedOrigin => {
                if (allowedOrigin.includes('*')) {
                    const pattern = '^' + allowedOrigin.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$';
                    return new RegExp(pattern).test(origin);
                }
                return false;
            })) {
                return callback(null, true);
            }
            logger.warn(`CORS blocked request from: ${origin}`);
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'X-Idempotency-Key',
            'X-Admin-Key',
            'Accept',
            'Origin',
            'X-Requested-With',
            'X-Auth-Token',
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Headers',
            'Access-Control-Request-Method',
            'Access-Control-Request-Headers',
        ],
        exposedHeaders: [
            'X-Total-Count',
            'X-Page-Count',
            'Content-Disposition',
            'Content-Length',
            'Content-Type',
        ],
        maxAge: 86400,
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    app.use((req, res, next) => {
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Idempotency-Key');
            res.header('Access-Control-Allow-Credentials', 'true');
            return res.status(204).end();
        }
        next();
    });
    app.use((0, express_1.json)({
        limit: '2mb',
        verify: (req, res, buf) => {
            if (buf.length > 2 * 1024 * 1024) {
                throw new Error('Request body too large');
            }
        },
    }));
    app.use((0, express_1.urlencoded)({
        extended: true,
        limit: '2mb',
        parameterLimit: 10000,
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: false,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
        exceptionFactory: errors => {
            const messages = errors.map(error => `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`);
            return new common_1.HttpException({
                statusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                message: 'Validation failed',
                errors: messages,
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(), new response_transform_interceptor_1.ResponseTransformInterceptor());
    const rateLimit = require('express-rate-limit');
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 1000,
        message: {
            success: false,
            message: 'Too many requests from this IP, please try again later.',
            timestamp: new Date().toISOString(),
        },
        standardHeaders: true,
        legacyHeaders: false,
        skip: (req) => {
            return req.url.includes('/health');
        },
    });
    app.use(limiter);
    app.setGlobalPrefix('api/v1');
    const enableDocs = (config.get('ENABLE_SWAGGER') ?? 'true') !== 'false';
    if (enableDocs) {
        const apiConfig = new swagger_1.DocumentBuilder()
            .setTitle('Audio Tài Lộc API v1')
            .setDescription('Complete API documentation for Audio Tài Lộc platform - Unified Version')
            .setVersion('1.0.0')
            .addBearerAuth()
            .addTag('Auth', 'Authentication endpoints')
            .addTag('Users', 'User management endpoints')
            .addTag('Catalog', 'Product catalog endpoints')
            .addTag('Cart', 'Shopping cart endpoints')
            .addTag('Orders', 'Order management endpoints')
            .addTag('Payments', 'Payment processing endpoints')
            .addTag('Services', 'Service management endpoints')
            .addTag('Bookings', 'Booking management endpoints')
            .addTag('Search', 'Search and discovery endpoints')
            .addTag('Files', 'File management endpoints')
            .addTag('Support', 'Customer support endpoints')
            .addTag('Health', 'Health check endpoints')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, apiConfig);
        swagger_1.SwaggerModule.setup('docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                displayRequestDuration: true,
                filter: true,
                showExtensions: true,
                showCommonExtensions: true,
                tagsSorter: 'alpha',
                operationsSorter: 'alpha',
            },
            customSiteTitle: 'Audio Tài Lộc API v1 - Complete Documentation',
            customCss: `
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info .title {
          color: #667eea;
          font-size: 2.5em;
        }
        .swagger-ui .scheme-container {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
        }
        .swagger-ui .opblock.opblock-post {
          border-color: #49cc90;
        }
        .swagger-ui .opblock.opblock-get {
          border-color: #61affe;
        }
        .swagger-ui .opblock.opblock-put {
          border-color: #fca130;
        }
        .swagger-ui .opblock.opblock-delete {
          border-color: #f93e3e;
        }
        .swagger-ui .opblock.opblock-patch {
          border-color: #50e3c2;
        }
      `,
        });
        swagger_1.SwaggerModule.setup('api/v1/docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                displayRequestDuration: true,
            },
        });
        logger.log(`📚 API v1 Documentation: http://localhost:${port}/docs`);
        logger.log(`🔧 API v1 Tooling: http://localhost:${port}/api/v1/docs`);
    }
    if ((config.get('NODE_ENV') || 'development') === 'production') {
        if (!config.get('JWT_ACCESS_SECRET') || !config.get('JWT_REFRESH_SECRET')) {
            throw new Error('Missing JWT secrets in production');
        }
    }
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 Audio Tài Lộc API v1 đang chạy tại: http://localhost:${port}`);
    logger.log(`📚 API v1 Documentation: http://localhost:${port}/docs`);
    logger.log(`🔧 API v1 Tooling: http://localhost:${port}/api/v1/docs`);
    logger.log(`🏥 Health Check: http://localhost:${port}/api/v1/health`);
    logger.log(`🌍 Environment: ${config.get('NODE_ENV') || 'development'}`);
    logger.log(`🎯 Current API Version: v1 (Unified Complete Edition)`);
}
bootstrap().catch(error => {
    console.error('Failed to start application:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map