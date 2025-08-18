import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './src/app.module';
import { apiLimiter, authLimiter } from './src/common/middleware/rate-limit.middleware';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import express = require('express');

let cachedServer: any;

async function createServer() {
  try {
    console.log('🚀 Starting Lambda server creation...');
    
    if (!cachedServer) {
      console.log('📦 Creating new NestJS application...');
      
      // Create Express app first
      const expressApp = express();
      
      // Create NestJS app with Express adapter
      console.log('🔧 Initializing NestJS with Express adapter...');
      const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
        logger: ['error', 'warn', 'log'],
      });

      console.log('🌐 Configuring CORS...');
      // Enable CORS for production
      app.enableCors({
        origin: [
          'http://localhost:3000',
          'https://omnix-ai.com',
          'https://www.omnix-ai.com',
          'https://app.omnix-ai.com',
          'https://dh5a0lb9qett.cloudfront.net', // CloudFront URL
          '*' // Allow all origins for now
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
      });

      console.log('⚡ Setting up rate limiting...');
      // Apply rate limiting
      try {
        app.use('/v1/', apiLimiter);
        app.use('/v1/auth/login', authLimiter);
        app.use('/v1/auth/refresh', authLimiter);
      } catch (rateLimitError) {
        console.warn('⚠️ Rate limiting setup failed:', rateLimitError);
        // Continue without rate limiting in Lambda
      }

      console.log('✅ Setting up validation pipes...');
      // Global validation pipe
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          disableErrorMessages: false,
        }),
      );

      console.log('🔢 Setting API prefix...');
      // API versioning - Skip global prefix since API Gateway handles /v1 routing
      // app.setGlobalPrefix('v1');

      console.log('📚 Setting up Swagger documentation...');
      // Swagger documentation - enable in Lambda for debugging
      const config = new DocumentBuilder()
        .setTitle('OMNIX AI Inventory Management API')
        .setDescription(
          'OMNIX AI is an advanced smart inventory management platform that helps store managers, purchasing teams, and analysts efficiently control inventory, prevent shortages/losses, and optimize procurement through AI-powered demand forecasting.',
        )
        .setVersion('1.0.0')
        .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }, 'ApiKeyAuth')
        .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          'BearerAuth',
        )
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api/docs', app, document);

      console.log('🔄 Initializing NestJS application...');
      await app.init();
      
      console.log('⚙️ Configuring serverless express...');
      cachedServer = serverlessExpress({ 
        app: expressApp,
        binaryMimeTypes: ['application/octet-stream', 'image/*'],
      });
      
      console.log('✅ Server creation completed successfully!');
    } else {
      console.log('♻️ Using cached server instance');
    }

    return cachedServer;
    
  } catch (error) {
    console.error('❌ CRITICAL ERROR during server creation:', error);
    console.error('📋 Error stack:', error.stack);
    console.error('📋 Error details:', JSON.stringify(error, null, 2));
    throw error;
  }
}

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  try {
    console.log('🎯 Lambda handler invoked');
    console.log('📥 Event path:', event.path);
    console.log('📥 Event method:', event.httpMethod);
    console.log('📥 Event headers:', JSON.stringify(event.headers, null, 2));
    
    // Set Lambda context options
    context.callbackWaitsForEmptyEventLoop = false;
    
    console.log('🏗️ Getting server instance...');
    const server = await createServer();
    
    console.log('📤 Forwarding request to NestJS...');
    const result = await server(event, context);
    
    console.log('✅ Request completed successfully');
    console.log('📤 Response status:', result.statusCode);
    
    return result;
    
  } catch (error) {
    console.error('❌ FATAL ERROR in Lambda handler:', error);
    console.error('📋 Error stack:', error.stack);
    console.error('📋 Error details:', JSON.stringify(error, null, 2));
    
    // Return a proper error response
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-API-Key',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: 'Lambda function failed to process request',
        details: error.message,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};