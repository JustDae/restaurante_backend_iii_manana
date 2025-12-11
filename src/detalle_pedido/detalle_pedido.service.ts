import { Injectable } from '@nestjs/common';
import { UpdateDetallePedidoDto } from './dto/update-detalle_pedido.dto';

@Injectable()
export class DetallePedidoService {
  create(_createDetallePedidoDto: UpdateDetallePedidoDto) {
    return 'This action adds a new detallePedido';
  }

  findAll() {
    return `This action returns all detallePedido`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detallePedido`;
  }

  update(id: number, _updateDetallePedidoDto: UpdateDetallePedidoDto) {
    return `This action updates a #${id} detallePedido`;
  }

  remove(id: number) {
    return `This action removes a #${id} detallePedido`;
  }
}
