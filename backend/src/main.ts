import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  
  // Set global API prefix
  app.setGlobalPrefix('api');
  
  // Enable global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());
  
  // Enable validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  
  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:3000', // Your Next.js frontend
    credentials: true,
  });
  
  await app.listen(3001);
  logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.log('🚀 Backend server started successfully');
  logger.log('📡 API: http://localhost:3001/api');
  logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
bootstrap();