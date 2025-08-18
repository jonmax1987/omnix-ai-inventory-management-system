"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const rate_limit_middleware_1 = require("./common/middleware/rate-limit.middleware");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:3000', 'https://omnix-ai.com'],
        credentials: true,
    });
    app.use('/v1/', rate_limit_middleware_1.apiLimiter);
    app.use('/v1/auth/login', rate_limit_middleware_1.authLimiter);
    app.use('/v1/auth/refresh', rate_limit_middleware_1.authLimiter);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('v1');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('OMNIX AI Inventory Management API')
        .setDescription('OMNIX AI is an advanced smart inventory management platform that helps store managers, purchasing teams, and analysts efficiently control inventory, prevent shortages/losses, and optimize procurement through AI-powered demand forecasting.')
        .setVersion('1.0.0')
        .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }, 'ApiKeyAuth')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    }, 'BearerAuth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 OMNIX AI API running on http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map