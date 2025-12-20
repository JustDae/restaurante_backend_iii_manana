import { Injectable, NotFoundException } from '@nestjs/common'; // Agregamos NotFoundException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Pedido } from './entities/pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Mesa } from 'src/mesa/entities/mesa.entity';
import { MetodoPago } from 'src/metodo-pago/entities/metodo-pago.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepo: Repository<Pedido>,

    @InjectRepository(Mesa)
    private readonly mesaRepo: Repository<Mesa>,

    @InjectRepository(MetodoPago)
    private readonly metodoRepo: Repository<MetodoPago>,
  ) {}

  async create(dto: CreatePedidoDto): Promise<Pedido | null> {
    try {
      const mesa = await this.mesaRepo.findOneBy({ id: dto.mesaId });
      if (!mesa)
        throw new NotFoundException(`La mesa #${dto.mesaId} no existe`);

      const metodoPago = await this.metodoRepo.findOneBy({
        id: dto.metodoPagoId,
      });
      if (!metodoPago)
        throw new NotFoundException(
          `El método de pago #${dto.metodoPagoId} no existe`,
        );

      const pedido = this.pedidoRepo.create({
        ...dto,
        mesa: mesa,
        metodoPago: metodoPago,
      });

      return await this.pedidoRepo.save(pedido);
    } catch (error) {
      console.error('Error creating pedido:', error);
      throw error;
    }
  }

  async findAll(query: QueryDto): Promise<Pagination<Pedido> | null> {
    try {
      const qb = this.pedidoRepo.createQueryBuilder('pedido');

      qb.leftJoinAndSelect('pedido.mesa', 'mesa');
      qb.leftJoinAndSelect('pedido.metodoPago', 'metodoPago');

      if (query.search) {
        qb.where('LOWER(pedido.nombre_cliente) LIKE :search', {
          search: `%${query.search.toLowerCase()}%`,
        }).orWhere('LOWER(pedido.correo) LIKE :search', {
          search: `%${query.search.toLowerCase()}%`,
        });
      }

      qb.orderBy('pedido.fecha_pedido', 'DESC');

      return paginate(qb, {
        page: query.page || 1,
        limit: query.limit || 10,
      });
    } catch (error) {
      console.error('Error finding pedidos:', error);
      return null;
    }
  }

  async findOne(id: string): Promise<Pedido | null> {
    try {
      return await this.pedidoRepo.findOne({
        where: { id },
        relations: ['mesa', 'metodoPago'],
      });
    } catch (error) {
      console.error('Error finding pedido:', error);
      return null;
    }
  }

  async update(id: string, dto: UpdatePedidoDto): Promise<Pedido | null> {
    try {
      const pedido = await this.findOne(id);
      if (!pedido) return null;

      Object.assign(pedido, dto);
      return await this.pedidoRepo.save(pedido);
    } catch (error) {
      console.error('Error updating pedido:', error);
      return null;
    }
  }

  async remove(id: string): Promise<Pedido | null> {
    try {
      const pedido = await this.findOne(id);
      if (!pedido) return null;

      return await this.pedidoRepo.remove(pedido);
    } catch (error) {
      console.error('Error deleting pedido:', error);
      return null;
    }
  }
}
