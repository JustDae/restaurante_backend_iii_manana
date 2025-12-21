import { Module } from '@nestjs/common';
import { DetallePedidoService } from './detalle_pedido.service';
import { DetallePedidoController } from './detalle_pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetallePedido } from 'src/detalle_pedido/entities/detalle_pedido.entity';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Producto } from 'src/productos/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetallePedido, Pedido, Producto])],
  controllers: [DetallePedidoController],
  providers: [DetallePedidoService],
})
export class DetallePedidoModule {}
