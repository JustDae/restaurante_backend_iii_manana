import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

interface CategoryPaginationOptions extends IPaginationOptions {
  search?: string;
  searchField?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category | null> {
    try {
      const category = this.categoryRepo.create(dto);
      return await this.categoryRepo.save(category);
    } catch (err) {
      console.error('Error creating category:', err);
      return null;
    }
  }

  async findAll(
    options: CategoryPaginationOptions,
  ): Promise<Pagination<Category> | null> {
    try {
      const { search, searchField, sortBy, sortOrder } = options;
      const queryBuilder = this.categoryRepo.createQueryBuilder('category');

      const allowedSearchFields = ['name', 'nombre'];
      const allowedSortFields = ['id', 'name', 'nombre'];

      if (search && searchField && allowedSearchFields.includes(searchField)) {
        queryBuilder.andWhere(`LOWER(category.${searchField}) LIKE :search`, {
          search: `%${search.toLowerCase()}%`,
        });
      } else if (search) {
        queryBuilder.andWhere('LOWER(category.name) LIKE :search', {
          search: `%${search.toLowerCase()}%`,
        });
      }

      const orderField =
        sortBy && allowedSortFields.includes(sortBy) ? sortBy : 'id';
      const orderDirection: 'ASC' | 'DESC' =
        sortOrder === 'DESC' ? 'DESC' : 'ASC';

      queryBuilder.orderBy(`category.${orderField}`, orderDirection);

      return await paginate<Category>(queryBuilder, {
        page: options.page,
        limit: options.limit,
      });
    } catch (err) {
      console.error('Error finding categories:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Category | null> {
    try {
      return await this.categoryRepo
        .createQueryBuilder('category')
        .where('category.id = :id', { id })
        .getOne();
    } catch (err) {
      console.error('Error finding category:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category | null> {
    try {
      const category = await this.findOne(id);
      if (!category) return null;

      Object.assign(category, dto);
      return await this.categoryRepo.save(category);
    } catch (err) {
      console.error('Error updating category:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Category | null> {
    try {
      const category = await this.findOne(id);
      if (!category) return null;

      return await this.categoryRepo.remove(category);
    } catch (err) {
      console.error('Error deleting category:', err);
      return null;
    }
  }
}
