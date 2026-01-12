import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { AuditLogsModule } from 'src/audit-logs/audit-logs.module';
import { Mesa } from 'src/mesa/entities/mesa.entity';
import { MetodoPago } from 'src/metodo-pago/entities/metodo-pago.entity';
import { NotificacionesModule } from 'src/notificaciones/notificaciones.module';

@Module({
  imports: [
    AuditLogsModule,
    TypeOrmModule.forFeature([Pedido, Mesa, MetodoPago]),
    NotificacionesModule,
  ],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}
