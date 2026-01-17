// 1. Mock de librerías externas ANTES de los imports
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SelectQueryBuilder } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Rol } from '../rol/entities/rol.entity';

describe('UsersService', () => {
  let service: UsersService;

  let repo: {
    create: jest.Mock;
    save: jest.Mock;
    remove: jest.Mock;
    createQueryBuilder: jest.Mock;
  };

  let qb: {
    leftJoinAndSelect: jest.Mock;
    addSelect: jest.Mock;
    where: jest.Mock;
    andWhere: jest.Mock;
    orderBy: jest.Mock;
    getOne: jest.Mock;
  };

  const mockRol: Rol = { id: 1, nombre: 'Admin', activo: true } as any;

  const mockUser: User = {
    id: 'uuid-1',
    username: 'testuser',
    email: 'test@test.com',
    password: 'hashedpassword',
    isActive: true,
    rol: mockRol,
    profile: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    qb = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };

    repo = {
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
    (paginate as jest.Mock).mockReset();
    (bcrypt.hash as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('debe hashear password y guardar el usuario con su rol', async () => {
      const createUserDto = {
        username: 'juan',
        email: 'juan@test.com',
        password: '123',
        rolId: 1,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-123');
      repo.create.mockReturnValue({ ...mockUser, password: 'hashed-123' });
      repo.save.mockResolvedValue({ ...mockUser, password: 'hashed-123' });

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
      expect(repo.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashed-123',
        rol: { id: 1 },
      });
      expect(repo.save).toHaveBeenCalled();
      expect(result?.password).toBe('hashed-123');
    });

    it('debe retornar null si ocurre un error', async () => {
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('hash error'));
      const result = await service.create({
        username: 'x',
        password: 'x',
      } as any);
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('debe aplicar filtros complejos (isActive, searchField=rol, sort) y paginar', async () => {
      const queryDto = {
        page: 1,
        limit: 10,
        search: 'Admin',
        searchField: 'rol',
        sort: 'rol',
        order: 'DESC' as any,
      };

      const paginatedResult: Pagination<User> = {
        items: [mockUser],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      (paginate as jest.Mock).mockResolvedValue(paginatedResult);

      const result = await service.findAll(queryDto, true);

      expect(repo.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('user.rol', 'rol');

      expect(qb.andWhere).toHaveBeenCalledWith('user.isActive = :isActive', {
        isActive: true,
      });

      expect(qb.andWhere).toHaveBeenCalledWith('rol.nombre ILIKE :search', {
        search: '%Admin%',
      });

      expect(qb.orderBy).toHaveBeenCalledWith('rol.nombre', 'DESC');

      expect(paginate).toHaveBeenCalledWith(qb, { page: 1, limit: 10 });
      expect(result).toEqual(paginatedResult);
    });

    it('debe usar búsqueda por defecto (username/email) si no hay searchField', async () => {
      const queryDto = { page: 1, limit: 10, search: 'juan' } as any;
      (paginate as jest.Mock).mockResolvedValue({ items: [], meta: {} });

      await service.findAll(queryDto);

      expect(qb.andWhere).toHaveBeenCalledWith(
        '(user.username ILIKE :search OR user.email ILIKE :search)',
        { search: '%juan%' },
      );
    });

    it('debe retornar null si paginate falla', async () => {
      (paginate as jest.Mock).mockRejectedValue(new Error('Paginate failed'));
      const result = await service.findAll({} as any);
      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('debe retornar un usuario usando QueryBuilder', async () => {
      qb.getOne.mockResolvedValue(mockUser);

      const result = await service.findOne('uuid-1');

      expect(repo.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(qb.where).toHaveBeenCalledWith('user.id = :id', { id: 'uuid-1' });
      expect(qb.getOne).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('debe retornar null si ocurre error', async () => {
      qb.getOne.mockRejectedValue(new Error('DB error'));
      const result = await service.findOne('uuid-1');
      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('debe incluir el password en la selección (addSelect)', async () => {
      qb.getOne.mockResolvedValue(mockUser);

      const result = await service.findByUsername('testuser');

      expect(qb.addSelect).toHaveBeenCalledWith('user.password');
      expect(qb.where).toHaveBeenCalledWith('user.username = :username', {
        username: 'testuser',
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('debe retornar null si el usuario no existe', async () => {
      qb.getOne.mockResolvedValue(null);

      const result = await service.update('uuid-99', {});
      expect(result).toBeNull();
    });

    it('debe actualizar password y rol si se envían', async () => {
      qb.getOne.mockResolvedValue({ ...mockUser });

      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hash');
      repo.save.mockResolvedValue({
        ...mockUser,
        password: 'new-hash',
        rol: { id: 2 },
      });

      const updateDto = { password: 'new', rolId: 2, username: 'changed' };

      const result = await service.update('uuid-1', updateDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('new', 10);
      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          password: 'new-hash',
          rol: { id: 2 },
          username: 'changed',
        }),
      );
      expect(result?.password).toBe('new-hash');
    });

    it('debe retornar null si save falla', async () => {
      qb.getOne.mockResolvedValue(mockUser);
      repo.save.mockRejectedValue(new Error('Save error'));

      const result = await service.update('uuid-1', {});
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('debe eliminar si el usuario existe', async () => {
      qb.getOne.mockResolvedValue(mockUser);
      repo.remove.mockResolvedValue(mockUser);

      const result = await service.remove('uuid-1');

      expect(repo.remove).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('debe retornar null si el usuario no existe', async () => {
      qb.getOne.mockResolvedValue(null);
      const result = await service.remove('uuid-non-existent');
      expect(result).toBeNull();
      expect(repo.remove).not.toHaveBeenCalled();
    });
  });

  describe('updateProfile', () => {
    it('debe actualizar solo el campo profile', async () => {
      qb.getOne.mockResolvedValue({ ...mockUser });
      repo.save.mockImplementation((user) => Promise.resolve(user));

      const result = await service.updateProfile('uuid-1', 'image.png');

      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'uuid-1',
          profile: 'image.png',
        }),
      );
      expect(result?.profile).toBe('image.png');
    });

    it('debe retornar null si falla', async () => {
      qb.getOne.mockRejectedValue(new Error('Fail'));
      const result = await service.updateProfile('uuid-1', 'img');
      expect(result).toBeNull();
    });
  });
});
