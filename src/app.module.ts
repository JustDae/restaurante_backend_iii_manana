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
import { FacturaModule } from './factura/factura.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MesaModule } from './mesa/mesa.module';
import { MetodoPagoModule } from './metodo-pago/metodo-pago.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/restaurante_db'),
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
    FacturaModule,
    AuditLogsModule,
    MesaModule,
    MetodoPagoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
