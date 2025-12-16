import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { DetallePedido } from './entities/detalle_pedido.entity';
import { CreateDetallePedidoDto } from './dto/create-detalle_pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle_pedido.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class DetallePedidoService {
  constructor(
    @InjectRepository(DetallePedido)
    private readonly detallePedidoRepo: Repository<DetallePedido>,
  ) {}

  async create(dto: CreateDetallePedidoDto): Promise<DetallePedido | null> {
    try {
      const detallePedido = this.detallePedidoRepo.create(dto);
      return await this.detallePedidoRepo.save(detallePedido);
    } catch (error) {
      console.error('Error creating detalle pedido:', error);
      return null;
    }
  }

  async findAll(query: QueryDto): Promise<Pagination<DetallePedido> | null> {
    try {
      const qb = this.detallePedidoRepo.createQueryBuilder('detalle_pedido');

      if (query.search) {
        qb.where('LOWER(detalle_pedido.nombre_cliente) LIKE :search', {
          search: `%${query.search.toLowerCase()}%`,
        });
      }

      qb.orderBy('detalle_pedido.fecha_pedido', 'DESC');

      return paginate(qb, {
        page: query.page || 1,
        limit: query.limit || 10,
      });
    } catch (error) {
      console.error('Error finding detalle pedidos:', error);
      return null;
    }
  }

  async findOne(id: string): Promise<DetallePedido | null> {
    try {
      return await this.detallePedidoRepo.findOne({
        where: { id },
      });
    } catch (error) {
      console.error('Error finding detalle pedido:', error);
      return null;
    }
  }

  async update(
    id: string,
    dto: UpdateDetallePedidoDto,
  ): Promise<DetallePedido | null> {
    try {
      const detallePedido = await this.findOne(id);
      if (!detallePedido) return null;

      Object.assign(detallePedido, dto);
      return await this.detallePedidoRepo.save(detallePedido);
    } catch (error) {
      console.error('Error updating detalle pedido:', error);
      return null;
    }
  }

  async remove(id: string): Promise<DetallePedido | null> {
    try {
      const detallePedido = await this.findOne(id);
      if (!detallePedido) return null;

      return await this.detallePedidoRepo.remove(detallePedido);
    } catch (error) {
      console.error('Error deleting detalle pedido:', error);
      return null;
    }
  }
}
