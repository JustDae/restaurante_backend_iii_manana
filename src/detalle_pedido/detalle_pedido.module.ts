import { Module } from '@nestjs/common';
import { DetallePedidoService } from './detalle_pedido.service';
import { DetallePedidoController } from './detalle_pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pedido } from 'src/detalle_pedido/entities/detalle_pedido.entity';

@Module({
  imports: [TypeOrmModule.forFeature([pedido])],
  controllers: [DetallePedidoController],
  providers: [DetallePedidoService],
})
export class DetallePedidoModule {}
