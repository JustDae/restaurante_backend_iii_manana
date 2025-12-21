import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Mesa } from './entities/mesa.entity';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class MesaService {
  constructor(
    @InjectRepository(Mesa)
    private readonly mesaRepo: Repository<Mesa>,
  ) {}

  async create(dto: CreateMesaDto): Promise<Mesa | null> {
    try {
      const mesa = this.mesaRepo.create(dto);
      return await this.mesaRepo.save(mesa);
    } catch (error) {
      console.error('Error creating mesa:', error);
      return null;
    }
  }

  async findAll(query: QueryDto): Promise<Pagination<Mesa> | null> {
    try {
      const qb = this.mesaRepo.createQueryBuilder('mesa');

      if (query.search) {
        qb.where('CAST(mesa.numero AS TEXT) LIKE :search', {
          search: `%${query.search}%`,
        });
      }

      qb.orderBy('mesa.numero', 'ASC');

      return paginate(qb, {
        page: query.page || 1,
        limit: query.limit || 10,
      });
    } catch (error) {
      console.error('Error finding mesas:', error);
      return null;
    }
  }

  async findOne(id: number): Promise<Mesa | null> {
    try {
      return await this.mesaRepo.findOne({ where: { id } });
    } catch (error) {
      console.error('Error finding mesa:', error);
      return null;
    }
  }

  async update(id: number, dto: UpdateMesaDto): Promise<Mesa | null> {
    try {
      const mesa = await this.findOne(id);
      if (!mesa) return null;

      Object.assign(mesa, dto);
      return await this.mesaRepo.save(mesa);
    } catch (error) {
      console.error('Error updating mesa:', error);
      return null;
    }
  }

  async remove(id: number): Promise<Mesa | null> {
    try {
      const mesa = await this.findOne(id);
      if (!mesa) return null;

      return await this.mesaRepo.remove(mesa);
    } catch (error) {
      console.error('Error deleting mesa:', error);
      return null;
    }
  }
}
