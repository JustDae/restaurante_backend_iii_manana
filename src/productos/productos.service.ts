import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  async create(dto: CreateProductoDto): Promise<Producto | null> {
    try {
      const { categoryId, ...restoDto } = dto;

      const producto = this.productoRepo.create({
        ...restoDto,
        // Asegúrate que categoryId sea compatible con tu entidad Categoria
        category: { id: categoryId },
      });

      return await this.productoRepo.save(producto);
    } catch (error) {
      console.error('Error creating producto:', error);
      return null;
    }
  }

  async findAll(query: QueryDto): Promise<Pagination<Producto> | null> {
    try {
      const qb = this.productoRepo.createQueryBuilder('producto');

      if (query.search) {
        qb.where('LOWER(producto.nombre) LIKE :search', {
          search: `%${query.search.toLowerCase()}%`,
        });
      }

      qb.orderBy('producto.nombre', 'ASC');

      return paginate(qb, {
        page: query.page || 1,
        limit: query.limit || 10,
      });
    } catch (error) {
      console.error('Error finding productos:', error);
      return null;
    }
  }

  // ⚠️ CAMBIO 1: id ahora es number
  async findOne(id: number): Promise<Producto | null> {
    try {
      return await this.productoRepo.findOne({ where: { id } });
    } catch (error) {
      console.error('Error finding producto:', error);
      return null;
    }
  }

  // ⚠️ CAMBIO 2: id ahora es number
  async update(id: number, dto: UpdateProductoDto): Promise<Producto | null> {
    try {
      const producto = await this.findOne(id);
      if (!producto) return null;

      Object.assign(producto, dto);
      return await this.productoRepo.save(producto);
    } catch (error) {
      console.error('Error updating producto:', error);
      return null;
    }
  }

  // ⚠️ CAMBIO 3: id ahora es number
  async remove(id: number): Promise<Producto | null> {
    try {
      const producto = await this.findOne(id);
      if (!producto) return null;

      return await this.productoRepo.remove(producto);
    } catch (error) {
      console.error('Error deleting producto:', error);
      return null;
    }
  }
}
