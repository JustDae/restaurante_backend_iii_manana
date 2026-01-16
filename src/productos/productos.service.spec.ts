import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue({ items: [], meta: {} }),
}));

describe('ProductosService', () => {
  let service: ProductosService;
  let repo;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const mockRepo = {
    create: jest.fn((dto) => dto),
    save: jest.fn((data) => Promise.resolve({ id: 1, ...data })),
    remove: jest.fn((data) => Promise.resolve(data)),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: getRepositoryToken(Producto),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
    repo = module.get(getRepositoryToken(Producto));
    jest.clearAllMocks();
  });

  test('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    test('Happy Path: crea un producto con categoría y lo guarda', async () => {
      const dto = { nombre: 'Hamburguesa', categoryId: 1 } as any;
      const result = await service.create(dto);
      expect(result).toBeDefined();
      expect(mockRepo.save).toHaveBeenCalled();
    });

    test('Sad Path: retorna null si ocurre un error al guardar', async () => {
      mockRepo.save.mockRejectedValueOnce(new Error('Error DB'));
      const dto = { nombre: 'Error', categoryId: 1 } as any;
      const result = await service.create(dto);
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    test('Happy Path: obtiene lista paginada de productos', async () => {
      const result = await service.findAll({ page: 1, limit: 10 } as any);
      expect(result).toHaveProperty('items');
      expect(mockRepo.createQueryBuilder).toHaveBeenCalledWith('producto');
    });

    test('Sad Path: retorna null si falla el query builder', async () => {
      mockRepo.createQueryBuilder.mockImplementationOnce(() => {
        throw new Error('Fallo crítico');
      });
      const result = await service.findAll({} as any);
      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    test('Happy Path: encuentra un producto por su ID', async () => {
      const mockProd = { id: 1, nombre: 'Pizza' };
      mockQueryBuilder.getOne.mockResolvedValue(mockProd);
      const result = await service.findOne(1);
      expect(result).toEqual(mockProd);
    });

    test('Sad Path: retorna null si el producto no existe', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    test('Happy Path: actualiza un producto si existe', async () => {
      const mockProd = { id: 1, nombre: 'Pizza' };
      mockQueryBuilder.getOne.mockResolvedValue(mockProd);
      const dto = { nombre: 'Pizza Doble' } as any;
      const result = await service.update(1, dto);
      expect(result.nombre).toBe('Pizza Doble');
      expect(mockRepo.save).toHaveBeenCalled();
    });

    test('Sad Path: retorna null si intenta actualizar uno que no existe', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      const result = await service.update(999, {} as any);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    test('Happy Path: elimina un producto correctamente', async () => {
      const mockProd = { id: 1 };
      mockQueryBuilder.getOne.mockResolvedValue(mockProd);
      await service.remove(1);
      expect(mockRepo.remove).toHaveBeenCalledWith(mockProd);
    });

    test('Sad Path: retorna null si intenta eliminar uno inexistente', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      const result = await service.remove(999);
      expect(result).toBeNull();
    });
  });
});