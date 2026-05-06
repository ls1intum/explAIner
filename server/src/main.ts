import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
import { ControllerLoggingInterceptor } from './common/interceptors/controller-logging.interceptor';
import { cleanupOpenApiDoc, ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');
  
  // Get configuration values
  const port = configService.get<number>('port')!;
  const clientUrl = configService.get<string>('clientUrl')!;
  const nodeEnv = configService.get<string>('nodeEnv')!;
  const isProd = nodeEnv === 'production';
  
  // Set global API prefix
  app.setGlobalPrefix('api');
  
  // Enable global logging interceptors (order matters: first runs first)
  app.useGlobalInterceptors(
    new HttpLoggingInterceptor(),
    new ControllerLoggingInterceptor(),
  );
  
  // Enable Zod validation pipe for DTOs
  app.useGlobalPipes(new ZodValidationPipe());
  
  // Enable CORS for client and additional origins (e.g. iframe embedding)
  const allowedOrigins = configService.get<string>('allowedOrigins');
  const origins = [clientUrl, ...(allowedOrigins ? allowedOrigins.split(',').map(o => o.trim()) : [])];
  app.enableCors({
    origin: origins,
    credentials: true,
  });
  
  // Setup Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('ExplAIner API')
    .setDescription('API documentation for ExplAIner')
    .setVersion('0.0.1')
    .addServer(`http://localhost:${port}`, isProd ? 'Local production server' : 'Local development server')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // Clean up OpenAPI doc for proper nestjs-zod integration
  const cleanedDocument = cleanupOpenApiDoc(document);
  SwaggerModule.setup('api/docs', app, cleanedDocument);
  
  await app.listen(port);
  logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.log('🚀 Server started successfully');
  logger.log('');
  logger.log(`💚 Health check:               http://localhost:${port}/api/health`);
  logger.log(`📄 OpenAPI/Swagger docs:       http://localhost:${port}/api/docs`);
  logger.log(`🌐 Client URL (CORS enabled):  ${clientUrl}`);
  logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
bootstrap();
