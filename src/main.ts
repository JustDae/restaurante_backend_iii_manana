import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <--- 1. IMPORTAR ESTO

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. ACTIVAR LAS VALIDACIONES GLOBALES
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina campos que no estén en el DTO (Seguridad)
      forbidNonWhitelisted: true, // Lanza error si envían campos extra
      transform: true, // <--- EL TRUCO: Convierte "1" a 1 automáticamente
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
