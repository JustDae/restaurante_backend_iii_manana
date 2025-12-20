import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetodoPago } from './entities/metodo-pago.entity';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';

@Injectable()
export class MetodoPagoService {
  constructor(
    @InjectRepository(MetodoPago)
    private readonly metodoRepo: Repository<MetodoPago>,
  ) {}

  async create(dto: CreateMetodoPagoDto) {
    const existe = await this.metodoRepo.findOneBy({ nombre: dto.nombre });
    if (existe) throw new BadRequestException('Este método de pago ya existe');

    const metodo = this.metodoRepo.create(dto);
    return await this.metodoRepo.save(metodo);
  }

  async findAll() {
    return await this.metodoRepo.find();
  }

  async findOne(id: number) {
    const metodo = await this.metodoRepo.findOneBy({ id });
    if (!metodo) throw new NotFoundException('Método de pago no encontrado');
    return metodo;
  }

  async update(id: number, dto: UpdateMetodoPagoDto) {
    const metodo = await this.findOne(id);
    const actualizado = Object.assign(metodo, dto);
    return await this.metodoRepo.save(actualizado);
  }

  async remove(id: number) {
    const metodo = await this.findOne(id);
    return await this.metodoRepo.remove(metodo);
  }
}
