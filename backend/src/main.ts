import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
import { ControllerLoggingInterceptor } from './common/interceptors/controller-logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');
  
  // Get configuration values
  const port = configService.get<number>('port')!;
  const frontendUrl = configService.get<string>('frontendUrl')!;
  
  // Set global API prefix
  app.setGlobalPrefix('api');
  
  // Enable global logging interceptors (order matters: first runs first)
  app.useGlobalInterceptors(
    new HttpLoggingInterceptor(),
    new ControllerLoggingInterceptor(),
  );
  
  // Enable validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  
  // Enable CORS for frontend
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });
  
  // Setup Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('ExplAIner API')
    .setDescription('API documentation for ExplAIner')
    .setVersion('0.0.1')
    .addServer(`http://localhost:${port}`, 'Local development server')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(port);
  logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.log('🚀 Backend server started successfully');
  logger.log(`📡 API: http://localhost:${port}/api`);
  logger.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
  logger.log(`🌐 CORS enabled for: ${frontendUrl}`);
  logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
bootstrap();