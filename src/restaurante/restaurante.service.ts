import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurante } from './restaurante.entity';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';

@Injectable()
export class RestauranteService {
  constructor(
    @InjectRepository(Restaurante)
    private readonly RestauranteRepository: Repository<Restaurante>,
  ) {}

  create(createRestauranteDto: CreateRestauranteDto) {
    const Restaurante = this.RestauranteRepository.create(createRestauranteDto);
    return this.RestauranteRepository.save(Restaurante);
  }

  findAll() {
    return this.RestauranteRepository.find();
  }

  findOne(id: string) {
    return this.RestauranteRepository.findOne({ where: { id } });
  }

  async update(id: string, updateRestauranteDto: UpdateRestauranteDto) {
    const Restaurante = await this.RestauranteRepository.findOne({ where: { id } });
    if (!Restaurante) return null;
    Object.assign(Restaurante, updateRestauranteDto);
    return this.RestauranteRepository.save(Restaurante);
  }

  async remove(id: string) {
    const Restaurante = await this.RestauranteRepository.findOne({ where: { id } });
    if (!Restaurante) return null;
    return this.RestauranteRepository.remove(Restaurante);
  }
}
