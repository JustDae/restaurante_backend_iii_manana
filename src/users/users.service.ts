import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Rol } from '../rol/entities/rol.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        rol: { id: createUserDto.rolId } as Rol,
      });

      return await this.userRepository.save(user);
    } catch (err) {
      console.error('Error creating user:', err);
      return null;
    }
  }

  async findAll(
    queryDto: QueryDto,
    isActive?: boolean,
  ): Promise<Pagination<User> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;

      const query = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.rol', 'rol');

      if (isActive !== undefined) {
        query.andWhere('user.isActive = :isActive', { isActive });
      }

      if (search) {
        if (searchField) {
          switch (searchField) {
            case 'username':
              query.andWhere('user.username ILIKE :search', {
                search: `%${search}%`,
              });
              break;
            case 'email':
              query.andWhere('user.email ILIKE :search', {
                search: `%${search}%`,
              });
              break;
            case 'rol':
              query.andWhere('rol.nombre ILIKE :search', {
                search: `%${search}%`,
              });
              break;
            default:
              query.andWhere(
                '(user.username ILIKE :search OR user.email ILIKE :search)',
                { search: `%${search}%` },
              );
          }
        } else {
          query.andWhere(
            '(user.username ILIKE :search OR user.email ILIKE :search)',
            { search: `%${search}%` },
          );
        }
      }

      if (sort) {
        const sortField = sort === 'rol' ? 'rol.nombre' : `user.${sort}`;
        query.orderBy(sortField, order ?? 'ASC');
      }

      return await paginate<User>(query, { page, limit });
    } catch (err) {
      console.error('Error retrieving users:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<User | null> {
    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.rol', 'rol')
        .where('user.id = :id', { id })
        .getOne();
    } catch (err) {
      console.error('Error finding user:', err);
      return null;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.rol', 'rol')
        .addSelect('user.password')
        .where('user.username = :username', { username })
        .getOne();
    } catch (err) {
      console.error('Error finding user by username:', err);
      return null;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    try {
      const user = await this.findOne(id);
      if (!user) return null;

      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      if (updateUserDto.rolId) {
        user.rol = { id: updateUserDto.rolId } as Rol;
      }

      const { rolId, ...params } = updateUserDto;
      void rolId;

      Object.assign(user, params);

      return await this.userRepository.save(user);
    } catch (err) {
      console.error('Error updating user:', err);
      return null;
    }
  }

  async remove(id: string): Promise<User | null> {
    try {
      const user = await this.findOne(id);
      if (!user) return null;

      return await this.userRepository.remove(user);
    } catch (err) {
      console.error('Error deleting user:', err);
      return null;
    }
  }

  async updateProfile(id: string, filename: string): Promise<User | null> {
    try {
      const user = await this.findOne(id);
      if (!user) return null;

      user.profile = filename;
      return await this.userRepository.save(user);
    } catch (err) {
      console.error('Error updating user profile image:', err);
      return null;
    }
  }
}
