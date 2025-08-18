"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const app_module_1 = require("./src/app.module");
const rate_limit_middleware_1 = require("./src/common/middleware/rate-limit.middleware");
const serverless_express_1 = require("@vendia/serverless-express");
const express = require("express");
let cachedServer;
async function createServer() {
    if (!cachedServer) {
        const expressApp = express();
        const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp));
        app.enableCors({
            origin: [
                'http://localhost:3000',
                'https://omnix-ai.com',
                'https://www.omnix-ai.com',
                'https://app.omnix-ai.com'
            ],
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
        if (process.env.NODE_ENV !== 'production') {
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
        }
        await app.init();
        cachedServer = (0, serverless_express_1.configure)({ app: expressApp });
    }
    return cachedServer;
}
const handler = async (event, context) => {
    const server = await createServer();
    return server(event, context);
};
exports.handler = handler;
//# sourceMappingURL=lambda.js.map