import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Configuración de validaciones globales con ValidationPipe
   * 
   * - `whitelist: true` -> Filtra propiedades no permitidas automáticamente.
   * - `forbidNonWhitelisted: true` -> Rechaza solicitudes con propiedades no permitidas.
   * - `transform: true` -> Convierte los datos de entrada al tipo esperado.
   * - `transformOptions.enableImplicitConversion: true` -> Habilita la conversión implícita de tipos.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableCors({
    origin: '*',
  });
  const port = process.env.PORT || 3004;
  await app.listen(port);
  console.log(`App running on port ${process.env.PORT}`);
}
bootstrap();
