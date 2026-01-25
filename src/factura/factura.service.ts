import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Factura } from './entities/factura.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { Pedido } from '../pedido/entities/pedido.entity';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,

    @InjectRepository(Pedido)
    private readonly pedidoRepo: Repository<Pedido>,
  ) {}

  async create(dto: CreateFacturaDto): Promise<Factura | null> {
    try {
      const pedido = await this.pedidoRepo.findOneBy({ id: dto.pedidoId });
      if (!pedido) {
        throw new NotFoundException(`El pedido #${dto.pedidoId} no existe.`);
      }

      const existe = await this.facturaRepo.findOneBy({
        pedido: { id: dto.pedidoId },
      });
      if (existe)
        throw new BadRequestException('Este pedido ya fue facturado.');

      const totalA_Facturar = Number(pedido.total);

      if (totalA_Facturar <= 0) {
        throw new BadRequestException(
          'No se puede generar factura de un pedido con total 0.',
        );
      }

      const factura = this.facturaRepo.create({
        razonSocial: dto.razonSocial,
        ruc_cedula: dto.ruc_cedula,
        total: totalA_Facturar,
        pedido: pedido,
      });

      const facturaGuardada = await this.facturaRepo.save(factura);

      pedido.estado = 'PAGADO';
      await this.pedidoRepo.save(pedido);

      return facturaGuardada;
    } catch (error) {
      console.error('Error creating factura:', error);
      throw error;
    }
  }

  async findAll(query: QueryDto): Promise<Pagination<Factura> | null> {
    try {
      const qb = this.facturaRepo.createQueryBuilder('factura');

      qb.leftJoinAndSelect('factura.pedido', 'pedido');

      if (query.search) {
        qb.where('LOWER(factura.razonSocial) LIKE :search', {
          search: `%${query.search.toLowerCase()}%`,
        }).orWhere('LOWER(factura.ruc_cedula) LIKE :search', {
          search: `%${query.search.toLowerCase()}%`,
        });
      }

      qb.orderBy('factura.id', 'DESC');

      return await paginate(qb, {
        page: query.page || 1,
        limit: query.limit || 10,
      });
    } catch (error) {
      console.error('Error finding facturas:', error);
      return null;
    }
  }

  async findOne(id: number): Promise<Factura | null> {
    try {
      const factura = await this.facturaRepo.findOne({
        where: { id },
        relations: ['pedido'],
      });
      if (!factura) throw new NotFoundException('Factura no encontrada');
      return factura;
    } catch (error) {
      console.error('Error finding factura:', error);
      return null;
    }
  }

  async update(id: number, dto: UpdateFacturaDto): Promise<Factura | null> {
    try {
      const factura = await this.findOne(id);
      if (!factura) return null;

      Object.assign(factura, dto);
      return await this.facturaRepo.save(factura);
    } catch (error) {
      console.error('Error updating factura:', error);
      return null;
    }
  }

  async remove(id: number): Promise<Factura | null> {
    try {
      const factura = await this.findOne(id);
      if (!factura) return null;

      return await this.facturaRepo.remove(factura);
    } catch (error) {
      console.error('Error deleting factura:', error);
      return null;
    }
  }
}
