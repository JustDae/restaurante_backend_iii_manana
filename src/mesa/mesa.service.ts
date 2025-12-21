import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Mesa } from './entities/mesa.entity'; // Asegura la ruta
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';

interface MesaPaginationOptions extends IPaginationOptions {
  search?: string;
  searchField?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

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
    } catch (err) {
      console.error('Error creating mesa:', err);
      return null;
    }
  }

  async findAll(
    options: MesaPaginationOptions,
  ): Promise<Pagination<Mesa> | null> {
    try {
      const { search, searchField, sortBy, sortOrder } = options;
      const qb = this.mesaRepo.createQueryBuilder('mesa');

      const allowedSearchFields = ['numero', 'ubicacion'];
      const allowedSortFields = ['id', 'numero', 'capacidad'];

      if (search && searchField && allowedSearchFields.includes(searchField)) {
        qb.andWhere(`LOWER(mesa.${searchField}) LIKE :search`, {
          search: `%${search.toLowerCase()}%`,
        });
      } else if (search) {
        qb.andWhere('LOWER(mesa.numero) LIKE :search', {
          search: `%${search.toLowerCase()}%`,
        });
      }

      const orderField =
        sortBy && allowedSortFields.includes(sortBy) ? sortBy : 'id';
      const orderDirection: 'ASC' | 'DESC' =
        sortOrder === 'DESC' ? 'DESC' : 'ASC';

      qb.orderBy(`mesa.${orderField}`, orderDirection);

      return await paginate<Mesa>(qb, {
        page: options.page,
        limit: options.limit,
      });
    } catch (err) {
      console.error('Error finding mesas:', err);
      return null;
    }
  }

  async findOne(id: number): Promise<Mesa | null> {
    try {
      return await this.mesaRepo
        .createQueryBuilder('mesa')
        .where('mesa.id = :id', { id })
        .getOne();
    } catch (err) {
      console.error('Error finding mesa:', err);
      return null;
    }
  }

  async update(id: number, dto: UpdateMesaDto): Promise<Mesa | null> {
    try {
      const mesa = await this.findOne(id);
      if (!mesa) return null;

      Object.assign(mesa, dto);
      return await this.mesaRepo.save(mesa);
    } catch (err) {
      console.error('Error updating mesa:', err);
      return null;
    }
  }

  async remove(id: number): Promise<Mesa | null> {
    try {
      const mesa = await this.findOne(id);
      if (!mesa) return null;

      return await this.mesaRepo.remove(mesa);
    } catch (err) {
      console.error('Error deleting mesa:', err);
      return null;
    }
  }
}
