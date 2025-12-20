import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurante } from './restaurante.entity';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';

@Injectable()
export class RestauranteService {
  constructor(
    @InjectRepository(Restaurante)
    private readonly restauranteRepo: Repository<Restaurante>,
  ) {}

  async create(dto: CreateRestauranteDto) {
    const existe = await this.restauranteRepo.count();
    if (existe > 0) {
      throw new BadRequestException(
        'Ya existe un perfil de restaurante creado. Usa la opción de actualizar.',
      );
    }

    const restaurante = this.restauranteRepo.create(dto);
    return await this.restauranteRepo.save(restaurante);
  }

  async findAll() {
    return await this.restauranteRepo.find();
  }

  async findOne(id: number) {
    const restaurante = await this.restauranteRepo.findOneBy({ id });
    if (!restaurante) throw new NotFoundException('Restaurante no encontrado');
    return restaurante;
  }

  async update(id: number, dto: UpdateRestauranteDto) {
    const restaurante = await this.findOne(id);
    const actualizado = Object.assign(restaurante, dto);
    return await this.restauranteRepo.save(actualizado);
  }

  async remove(id: number) {
    const restaurante = await this.findOne(id);
    return await this.restauranteRepo.remove(restaurante);
  }
}
