import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from './entities/mesa.entity';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';

@Injectable()
export class MesaService {
  constructor(
    @InjectRepository(Mesa)
    private readonly mesaRepo: Repository<Mesa>,
  ) {}

  async create(dto: CreateMesaDto) {
    const existe = await this.mesaRepo.findOneBy({ numero: dto.numero });
    if (existe) {
      throw new BadRequestException(`La mesa ${dto.numero} ya existe.`);
    }

    const mesa = this.mesaRepo.create(dto);
    return await this.mesaRepo.save(mesa);
  }

  async findAll() {
    return await this.mesaRepo.find({
      order: { numero: 'ASC' },
    });
  }

  async findOne(id: number) {
    const mesa = await this.mesaRepo.findOneBy({ id });
    if (!mesa) throw new NotFoundException('Mesa no encontrada');
    return mesa;
  }

  async update(id: number, dto: UpdateMesaDto) {
    const mesa = await this.findOne(id);
    const actualizada = Object.assign(mesa, dto);
    return await this.mesaRepo.save(actualizada);
  }

  async remove(id: number) {
    const mesa = await this.findOne(id);
    return await this.mesaRepo.remove(mesa);
  }
}
