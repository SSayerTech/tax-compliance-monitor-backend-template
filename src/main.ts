// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Your Nuxt app URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });
  app.setGlobalPrefix('api'); // Add 'api' prefix to all routes
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3001); // Change port to 3001 since Nuxt uses 3000
}
bootstrap();
