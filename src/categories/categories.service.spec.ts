import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './category.entity';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue({ items: [], meta: {} }),
}));

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repo;

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const mockRepo = {
    create: jest.fn((dto) => dto),
    save: jest.fn((data) => Promise.resolve({ id: '1', ...data })),
    remove: jest.fn((data) => Promise.resolve(data)),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repo = module.get(getRepositoryToken(Category));
    jest.clearAllMocks();
  });

  test('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    test('Happy Path: crea y retorna una categoría', async () => {
      const dto = { name: 'Bebidas' } as any;
      const result = await service.create(dto);
      expect(result).toBeDefined();
      expect(mockRepo.save).toHaveBeenCalled();
    });

    test('Sad Path: retorna null si falla al guardar', async () => {
      mockRepo.save.mockRejectedValueOnce(new Error('DB Error'));
      const dto = { name: 'Error' } as any;
      const result = await service.create(dto);
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    test('Happy Path: retorna categorías paginadas con búsqueda', async () => {
      const options = { page: 1, limit: 10, search: 'test' } as any;
      const result = await service.findAll(options);
      expect(result).toHaveProperty('items');
      expect(mockRepo.createQueryBuilder).toHaveBeenCalledWith('category');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    test('Sad Path: retorna null si la consulta falla', async () => {
      mockRepo.createQueryBuilder.mockImplementationOnce(() => {
        throw new Error('Query Error');
      });
      const result = await service.findAll({ page: 1 } as any);
      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    test('Happy Path: retorna una categoría por ID', async () => {
      const mockCategory = { id: '1', name: 'Bebidas' };
      mockQueryBuilder.getOne.mockResolvedValue(mockCategory);
      const result = await service.findOne('1');
      expect(result).toEqual(mockCategory);
    });

    test('Sad Path: retorna null si no encuentra la categoría', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      const result = await service.findOne('999');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    test('Happy Path: actualiza una categoría existente', async () => {
      const mockCategory = { id: '1', name: 'Bebidas' };
      mockQueryBuilder.getOne.mockResolvedValue(mockCategory);
      const dto = { name: 'Bebidas Frías' } as any;
      const result = await service.update('1', dto);
      expect(result.name).toBe('Bebidas Frías');
      expect(mockRepo.save).toHaveBeenCalled();
    });

    test('Sad Path: retorna null si la categoría a actualizar no existe', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      const result = await service.update('999', {} as any);
      expect(result).toBeNull();
      expect(mockRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    test('Happy Path: elimina la categoría si existe', async () => {
      const mockCategory = { id: '1' };
      mockQueryBuilder.getOne.mockResolvedValue(mockCategory);
      await service.remove('1');
      expect(mockRepo.remove).toHaveBeenCalledWith(mockCategory);
    });

    test('Sad Path: retorna null si la categoría a eliminar no existe', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      const result = await service.remove('999');
      expect(result).toBeNull();
      expect(mockRepo.remove).not.toHaveBeenCalled();
    });
  });
});