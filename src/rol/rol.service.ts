import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Rol } from './entities/rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
  ) {}

  async create(dto: CreateRolDto): Promise<Rol | null> {
    try {
      const rol = this.rolRepo.create(dto);
      return await this.rolRepo.save(rol);
    } catch (error) {
      console.error('Error creating rol:', error);
      return null;
    }
  }

  async findAll(query: QueryDto): Promise<Pagination<Rol> | null> {
    try {
      const qb = this.rolRepo.createQueryBuilder('rol');

      if (query.search) {
        qb.andWhere('LOWER(rol.nombre) LIKE :search', {
          search: `%${query.search.toLowerCase()}%`,
        });
      }

      qb.orderBy('rol.id', 'ASC');

      return await paginate<Rol>(qb, {
        page: query.page || 1,
        limit: query.limit || 10,
        route: 'http://localhost:3000/rol',
      });
    } catch (error) {
      console.error('Error finding roles:', error);
      return null;
    }
  }

  async findOne(id: number): Promise<Rol | null> {
    try {
      return await this.rolRepo
        .createQueryBuilder('rol')
        .where('rol.id = :id', { id })
        .getOne();
    } catch (error) {
      console.error('Error finding rol:', error);
      return null;
    }
  }

  async update(id: number, dto: UpdateRolDto): Promise<Rol | null> {
    try {
      const rol = await this.findOne(id);
      if (!rol) return null;

      Object.assign(rol, dto);
      return await this.rolRepo.save(rol);
    } catch (error) {
      console.error('Error updating rol:', error);
      return null;
    }
  }

  async remove(id: number): Promise<Rol | null> {
    try {
      const rol = await this.findOne(id);
      if (!rol) return null;

      return await this.rolRepo.remove(rol);
    } catch (error) {
      console.error('Error deleting rol:', error);
      return null;
    }
  }
}
