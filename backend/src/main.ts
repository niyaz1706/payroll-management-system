import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('api/v1');

  // Unified Response & Error envelopes
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Input Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Payroll Management System API')
    .setDescription('API documentation for Payroll and Employee management')
    .setVersion('1.0')
    .addTag('employees')
    .addBearerAuth()
    .addTag('payroll')
    .build();

  const document = SwaggerModule.createDocument(app as any, config as any);
  SwaggerModule.setup('api/docs', app as any, document as any, {
    useGlobalPrefix: false,
  });

  app.enableShutdownHooks();

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`Application running: http://localhost:${port}/api/v1`);
  console.log(`Swagger Docs available: http://localhost:${port}/api/docs`);
}
bootstrap();