import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from './entities/factura.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { Pedido } from '../pedido/entities/pedido.entity';

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,

    @InjectRepository(Pedido)
    private readonly pedidoRepo: Repository<Pedido>,
  ) {}

  async create(dto: CreateFacturaDto) {
    const pedido = await this.pedidoRepo.findOneBy({ id: dto.pedidoId });
    if (!pedido) {
      throw new NotFoundException(`El pedido #${dto.pedidoId} no existe.`);
    }

    const existe = await this.facturaRepo.findOneBy({
      pedido: { id: dto.pedidoId },
    });
    if (existe) throw new BadRequestException('Este pedido ya fue facturado.');

    const factura = this.facturaRepo.create({
      ...dto,
      pedido: pedido,
    });

    return await this.facturaRepo.save(factura);
  }

  async findAll() {
    return await this.facturaRepo.find({
      relations: ['pedido'],
    });
  }

  async findOne(id: number) {
    const factura = await this.facturaRepo.findOne({
      where: { id },
      relations: ['pedido'],
    });
    if (!factura) throw new NotFoundException('Factura no encontrada');
    return factura;
  }

  async update(id: number, dto: UpdateFacturaDto) {
    const factura = await this.findOne(id);
    const actualizada = Object.assign(factura, dto);
    return await this.facturaRepo.save(actualizada);
  }
}
