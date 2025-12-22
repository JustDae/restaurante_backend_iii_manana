import { Injectable, NotFoundException } from '@nestjs/common'; // Agregamos NotFoundException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { DetallePedido } from './entities/detalle_pedido.entity';
import { CreateDetallePedidoDto } from './dto/create-detalle_pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle_pedido.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Producto } from 'src/productos/entities/producto.entity';

@Injectable()
export class DetallePedidoService {
  constructor(
    @InjectRepository(DetallePedido)
    private readonly detallePedidoRepo: Repository<DetallePedido>,

    @InjectRepository(Pedido)
    private readonly pedidoRepo: Repository<Pedido>,

    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  async create(dto: CreateDetallePedidoDto): Promise<DetallePedido | null> {
    try {
      const pedido = await this.pedidoRepo.findOneBy({ id: dto.pedidoId });
      if (!pedido) throw new NotFoundException(`El pedido no existe`);

      const producto = await this.productoRepo.findOneBy({
        id: dto.productoId,
      });
      if (!producto) throw new NotFoundException(`El producto no existe`);

      const precioCongelado = Number(producto.precio);
      const subtotal = precioCongelado * dto.cantidad;

      const detallePedido = this.detallePedidoRepo.create({
        cantidad: dto.cantidad,
        precio_unitario: precioCongelado,
        subtotal: subtotal,
        observaciones: dto.observaciones,
        pedido: pedido,
        producto: producto,
      });

      const resultado = await this.detallePedidoRepo.save(detallePedido);

      const totalActual = Number(pedido.total) || 0;
      pedido.total = totalActual + subtotal;
      await this.pedidoRepo.save(pedido);

      return resultado;
    } catch (error) {
      console.error('Error creating detalle pedido:', error);
      throw error;
    }
  }

  async findAll(query: QueryDto): Promise<Pagination<DetallePedido> | null> {
    try {
      const qb = this.detallePedidoRepo.createQueryBuilder('detalle_pedido');

      qb.leftJoinAndSelect('detalle_pedido.producto', 'producto');
      qb.leftJoinAndSelect('detalle_pedido.pedido', 'pedido');

      if (query.search) {
        qb.where('LOWER(pedido.nombre_cliente) LIKE :search', {
          search: `%${query.search.toLowerCase()}%`,
        });
      }

      qb.orderBy('detalle_pedido.id', 'DESC');

      return paginate(qb, {
        page: query.page || 1,
        limit: query.limit || 10,
      });
    } catch (error) {
      console.error('Error finding detalle pedidos:', error);
      return null;
    }
  }

  async findOne(id: number): Promise<DetallePedido | null> {
    try {
      return await this.detallePedidoRepo.findOne({
        where: { id },
        relations: ['producto', 'pedido'],
      });
    } catch (error) {
      console.error('Error finding detalle pedido:', error);
      return null;
    }
  }

  async update(
    id: number,
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

  async remove(id: number): Promise<DetallePedido | null> {
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
