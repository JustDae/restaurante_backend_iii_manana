import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Pedido } from './entities/pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Mesa } from 'src/mesa/entities/mesa.entity';
import { MetodoPago } from 'src/metodo-pago/entities/metodo-pago.entity';
// Importa tu servicio de notificaciones
import { NotificacionesService } from 'src/notificaciones/notificaciones.service'; 
import { CreateContenidoDto } from 'src/notificaciones/dto/create-contenido.dto';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepo: Repository<Pedido>,

    @InjectRepository(Mesa)
    private readonly mesaRepo: Repository<Mesa>,

    @InjectRepository(MetodoPago)
    private readonly metodoRepo: Repository<MetodoPago>,

    // Inyectamos el servicio de notificaciones sin alterar los anteriores
    private readonly notificacionesService: NotificacionesService,
  ) {}

  async create(dto: CreatePedidoDto): Promise<Pedido | null> {
    try {
      const mesa = await this.mesaRepo
        .createQueryBuilder('m')
        .where('m.id = :id', { id: dto.mesaId })
        .getOne();

      if (!mesa)
        throw new NotFoundException(`La mesa #${dto.mesaId} no existe`);

      const metodoPago = await this.metodoRepo
        .createQueryBuilder('mp')
        .where('mp.id = :id', { id: dto.metodoPagoId })
        .getOne();

      if (!metodoPago)
        throw new NotFoundException(
          `El método de pago #${dto.metodoPagoId} no existe`,
        );

      const pedido = this.pedidoRepo.create({
        ...dto,
        mesa: mesa,
        metodoPago: metodoPago,
      });

      const pedidoGuardado = await this.pedidoRepo.save(pedido);

      this.notificacionesService.create({
        usuarioId: 'ID_DE_LA_COCINA',
        mensaje: `Nueva orden recibida para la mesa ${mesa.id}`,
        tipo: 'NUEVO_PEDIDO',
        contenido: new CreateContenidoDto
      }).catch(err => console.error('Error persistiendo notificación en Mongo:', err));

      return pedidoGuardado;
    } catch (error) {
      console.error('Error creating pedido:', error);
      if (error instanceof NotFoundException) throw error;
      return null;
    }
  }

  async findAll(query: QueryDto): Promise<Pagination<Pedido> | null> {
    try {
      const qb = this.pedidoRepo.createQueryBuilder('pedido');

      qb.leftJoinAndSelect('pedido.mesa', 'mesa');
      qb.leftJoinAndSelect('pedido.metodoPago', 'metodoPago');

      if (query.search) {
        qb.andWhere(
          '(LOWER(pedido.nombre_cliente) LIKE :search OR LOWER(pedido.correo) LIKE :search)',
          { search: `%${query.search.toLowerCase()}%` },
        );
      }

      qb.orderBy('pedido.fecha_pedido', 'DESC');

      return await paginate<Pedido>(qb, {
        page: query.page || 1,
        limit: query.limit || 10,
        route: 'http://localhost:3000/pedidos',
      });
    } catch (error) {
      console.error('Error finding pedidos:', error);
      return null;
    }
  }

  async findOne(id: string): Promise<Pedido | null> {
    try {
      return await this.pedidoRepo
        .createQueryBuilder('pedido')
        .leftJoinAndSelect('pedido.mesa', 'mesa')
        .leftJoinAndSelect('pedido.metodoPago', 'metodoPago')
        .where('pedido.id = :id', { id })
        .getOne();
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