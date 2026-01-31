import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'https://restaurante-app.nael.live',
      'https://api-restaurante.nael.live',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Restaurante API')
    .setDescription(
      'Sistema de gestión de pedidos y facturación para restaurantes',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  try {
    const dataSource = app.get(DataSource);
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.query(`
      INSERT INTO rol (id, nombre) VALUES (1, 'ADMIN') ON CONFLICT DO NOTHING;
      INSERT INTO rol (id, nombre) VALUES (2, 'MESERO') ON CONFLICT DO NOTHING;
      INSERT INTO rol (id, nombre) VALUES (3, 'COCINERO') ON CONFLICT DO NOTHING;
      INSERT INTO rol (id, nombre) VALUES (4, 'CLIENTE') ON CONFLICT DO NOTHING;
    `);

    await queryRunner.query(
      `SELECT setval(pg_get_serial_sequence('rol', 'id'), coalesce(max(id), 1)) FROM rol;`,
    );

    await queryRunner.release();
  } catch (error) {
    console.error('Error al crear roles iniciales:', error.message);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();