// 1. Mock de librerías externas
jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { RolService } from './rol.service';
import { Rol } from './entities/rol.entity';

describe('RolService', () => {
  let service: RolService;

  let repo: {
    create: jest.Mock;
    save: jest.Mock;
    remove: jest.Mock;
    createQueryBuilder: jest.Mock;
  };

  // Mock del QueryBuilder para TypeORM
  let qb: {
    where: jest.Mock;
    andWhere: jest.Mock;
    orderBy: jest.Mock;
    getOne: jest.Mock;
  };

  const mockRol = {
    id: 1,
    nombre: 'ADMIN',
    descripcion: 'Administrador del sistema',
    activo: true,
  };

  beforeEach(async () => {
    // Silenciar errores de consola durante los tests
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    qb = {
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
        RolService,
        {
          provide: getRepositoryToken(Rol),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<RolService>(RolService);
    jest.clearAllMocks();
    (paginate as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('debe crear y guardar un rol', async () => {
      const dto = { nombre: 'MESERO', descripcion: 'Atiende mesas' };

      repo.create.mockReturnValue(dto);
      repo.save.mockResolvedValue({ id: 2, ...dto, activo: true });

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({ nombre: 'MESERO' }));
    });

    it('debe retornar null si falla al crear', async () => {
      repo.save.mockRejectedValue(new Error('DB Error'));
      const result = await service.create({ nombre: 'X' } as any);
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('debe listar roles con paginación y orden', async () => {
      const query = { page: 1, limit: 10 };
      const paginatedResult = { items: [mockRol], meta: {} };

      (paginate as jest.Mock).mockResolvedValue(paginatedResult);

      const result = await service.findAll(query as any);

      expect(repo.createQueryBuilder).toHaveBeenCalledWith('rol');
      expect(qb.orderBy).toHaveBeenCalledWith('rol.id', 'ASC');
      expect(paginate).toHaveBeenCalledWith(
        qb,
        expect.objectContaining({ page: 1, limit: 10 }),
      );
      expect(result).toEqual(paginatedResult);
    });

    it('debe aplicar filtro de búsqueda (LOWER LIKE)', async () => {
      const query = { page: 1, limit: 10, search: 'Admin' };
      (paginate as jest.Mock).mockResolvedValue({ items: [], meta: {} });

      await service.findAll(query as any);

      expect(qb.andWhere).toHaveBeenCalledWith(
        'LOWER(rol.nombre) LIKE :search',
        { search: '%admin%' }, // Verifica que lo pasó a minúsculas
      );
    });

    it('debe retornar null si ocurre un error', async () => {
      (paginate as jest.Mock).mockRejectedValue(new Error('Pagination Error'));
      const result = await service.findAll({} as any);
      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('debe retornar un rol por ID', async () => {
      qb.getOne.mockResolvedValue(mockRol);

      const result = await service.findOne(1);

      expect(repo.createQueryBuilder).toHaveBeenCalledWith('rol');
      expect(qb.where).toHaveBeenCalledWith('rol.id = :id', { id: 1 });
      expect(result).toEqual(mockRol);
    });

    it('debe retornar null si hay error en DB', async () => {
      qb.getOne.mockRejectedValue(new Error('DB Error'));
      const result = await service.findOne(1);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('debe actualizar el rol si existe', async () => {
      // 1. Mockear que findOne encuentra el rol (usando qb.getOne)
      qb.getOne.mockResolvedValue({ ...mockRol });

      // 2. Mockear el save
      repo.save.mockResolvedValue({ ...mockRol, nombre: 'SUPER_ADMIN' });

      const result = await service.update(1, { nombre: 'SUPER_ADMIN' });

      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          nombre: 'SUPER_ADMIN',
        }),
      );
      expect(result?.nombre).toBe('SUPER_ADMIN');
    });

    it('debe retornar null si el rol no existe', async () => {
      qb.getOne.mockResolvedValue(null);
      const result = await service.update(99, {});
      expect(result).toBeNull();
    });

    it('debe retornar null si save falla', async () => {
      qb.getOne.mockResolvedValue(mockRol);
      repo.save.mockRejectedValue(new Error('Save Error'));

      const result = await service.update(1, { nombre: 'X' });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('debe eliminar el rol si existe', async () => {
      qb.getOne.mockResolvedValue(mockRol);
      repo.remove.mockResolvedValue(mockRol);

      const result = await service.remove(1);

      expect(repo.remove).toHaveBeenCalledWith(mockRol);
      expect(result).toEqual(mockRol);
    });

    it('debe retornar null si no existe', async () => {
      qb.getOne.mockResolvedValue(null);
      const result = await service.remove(99);
      expect(result).toBeNull();
    });
  });
});
