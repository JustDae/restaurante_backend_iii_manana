import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestauranteModule } from './restaurante/restaurante.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PedidoModule } from './pedido/pedido.module';
import { DetallePedidoModule } from './detalle_pedido/detalle_pedido.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductosModule } from './productos/productos.module';
import { CategoriesModule } from './categories/categories.module';
import { RolModule } from './rol/rol.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      //ssl: { rejectUnauthorized: false },
    }),
    RestauranteModule,
    PedidoModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    DetallePedidoModule,
    ProductosModule,
    RolModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
