import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
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
        category: { id: categoryId },
      });

      return await this.productoRepo.save(producto);
    } catch (error) {
      console.error('Error creating producto:', error);
      return null;
    }
  }

  async findAll(
    query: QueryDto,
    estado?: boolean,
  ): Promise<Pagination<Producto> | null> {
    try {
      const qb = this.productoRepo.createQueryBuilder('producto');
      qb.leftJoinAndSelect('producto.category', 'cat');

      if (query.search) {
        qb.andWhere('LOWER(producto.nombre) LIKE :search', {
          search: `%${query.search.toLowerCase()}%`,
        });
      }

      if (estado !== undefined) {
        qb.andWhere('producto.estado = :estado', { estado });
      }

      qb.orderBy('producto.nombre', 'ASC');

      const options: IPaginationOptions = {
        page: query.page || 1,
        limit: query.limit || 10,
        route: 'http://localhost:3000/productos',
      };

      return paginate<Producto>(qb, options);
    } catch (error) {
      console.error('Error finding productos:', error);
      return null;
    }
  }

  async findOne(id: number): Promise<Producto | null> {
    try {
      return await this.productoRepo
        .createQueryBuilder('producto')
        .leftJoinAndSelect('producto.category', 'cat')
        .where('producto.id = :id', { id })
        .getOne();
    } catch (error) {
      console.error('Error finding producto:', error);
      return null;
    }
  }

  async update(id: number, dto: UpdateProductoDto): Promise<Producto | null> {
    try {
      const producto = await this.findOne(id);
      if (!producto) return null;

      Object.assign(producto, dto);

      if (dto.categoryId) {
        producto.category = { id: dto.categoryId } as any;
      }

      return await this.productoRepo.save(producto);
    } catch (error) {
      console.error('Error updating producto:', error);
      return null;
    }
  }

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

  async updateImage(id: number, filename: string): Promise<Producto | null> {
    try {
      const producto = await this.findOne(id);
      if (!producto) return null;

      (producto as any).imagen = filename;

      return await this.productoRepo.save(producto);
    } catch (error) {
      console.error('Error updating product image:', error);
      return null;
    }
  }
}
