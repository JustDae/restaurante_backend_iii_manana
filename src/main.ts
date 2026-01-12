import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
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

  app.enableCors();

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
