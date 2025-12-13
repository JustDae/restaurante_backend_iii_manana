import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDetallePedidoDto } from './dto/create-detalle_pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle_pedido.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { pedido } from 'src/detalle_pedido/entities/detalle_pedido.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DetallePedidoService {
  constructor(
    @InjectRepository(pedido)
    private detallePedidoRepository: Repository<pedido>,
  ) {}

  create(_createDetallePedidoDto: CreateDetallePedidoDto) {
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
