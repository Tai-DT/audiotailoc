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
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_1 = require("express");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const response_transform_interceptor_1 = require("./common/interceptors/response-transform.interceptor");
const bigint_serialize_interceptor_1 = require("./common/interceptors/bigint-serialize.interceptor");
const csrf_middleware_1 = require("./common/security/csrf.middleware");
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
process.on('warning', (warning) => {
    if (warning.name === 'DeprecationWarning' && warning.code === 'DEP0190') {
        return;
    }
});
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    const logger = new common_1.Logger('Bootstrap');
    const config = app.get(config_1.ConfigService);
    const trustProxyCount = config.get('TRUST_PROXY_COUNT') ?? (process.env.NODE_ENV === 'production' ? 1 : false);
    app.getHttpAdapter().getInstance().set('trust proxy', trustProxyCount);
    const port = Number(process.env.PORT || config.get('PORT') || 3010);
    const databaseUrl = config.get('DATABASE_URL');
    const directDatabaseUrl = config.get('DIRECT_DATABASE_URL');
    if (!directDatabaseUrl && databaseUrl) {
        process.env.DIRECT_DATABASE_URL = databaseUrl;
    }
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
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        frameguard: { action: 'deny' },
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        xssFilter: true,
    }));
    const corsOrigins = config.get('CORS_ORIGIN') ||
        config.get('CORS_ORIGINS') ||
        'http://localhost:3000,http://localhost:3001,http://localhost:3002,https://*.vercel.app';
    const allowedOrigins = corsOrigins.split(',').map((origin) => origin.trim());
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                if (process.env.NODE_ENV === 'development') {
                    return callback(null, true);
                }
                logger.warn('CORS: Request without Origin header in production - consider stricter validation');
                return callback(null, true);
            }
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            }
            else if (allowedOrigins.some(allowedOrigin => {
                if (allowedOrigin.includes('*')) {
                    const pattern = allowedOrigin.replace('*', '.*');
                    const regex = new RegExp(pattern);
                    return regex.test(origin);
                }
                return false;
            })) {
                callback(null, true);
            }
            else {
                logger.warn(`CORS blocked request from: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'X-Idempotency-Key',
            'X-Admin-Key',
        ],
        exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
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
        whitelist: true,
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
    app.useGlobalInterceptors(new bigint_serialize_interceptor_1.BigIntSerializeInterceptor(), new logging_interceptor_1.LoggingInterceptor(), new response_transform_interceptor_1.ResponseTransformInterceptor());
    const csrfMiddleware = new csrf_middleware_1.CsrfMiddleware(config);
    app.use((req, res, next) => {
        csrfMiddleware.use(req, res, next);
    });
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 300,
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
    app.setGlobalPrefix('api/v1', {
        exclude: ['health', ''],
    });
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
    logger.log(`🏥 Health Check: http://localhost:${port}/health`);
    logger.log(`🌍 Environment: ${config.get('NODE_ENV') || 'development'}`);
    logger.log(`🎯 Current API Version: v1 (Unified Complete Edition)`);
}
bootstrap().catch(error => {
    console.error('Failed to start application:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map