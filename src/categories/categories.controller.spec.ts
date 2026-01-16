import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SuccessResponseDto } from '../common/dto/response.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
    jest.clearAllMocks();
  });

  test('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    test('Happy Path: crea una categoría y retorna SuccessResponseDto', async () => {
      const dto = { name: 'Bebidas' } as any;
      const resultDto = { id: 1, ...dto };
      mockCategoriesService.create.mockResolvedValue(resultDto);
      const result = await controller.create(dto);
      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(resultDto);
      expect(mockCategoriesService.create).toHaveBeenCalledWith(dto);
    });

    test('Sad Path: lanza InternalServerErrorException si falla la creación', async () => {
      mockCategoriesService.create.mockResolvedValue(null);
      await expect(controller.create({} as any)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    test('Happy Path: retorna lista paginada de categorías con parámetros por defecto', async () => {
      const query = { page: 1, limit: 10 } as any;
      const mockResult = { items: [], meta: {} };
      mockCategoriesService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(query);

      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(mockResult);
      expect(mockCategoriesService.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: undefined,
        searchField: 'name',
        sortBy: 'id',
        sortOrder: 'ASC',
        route: 'http://localhost:3000/categories',
      });
    });

    test('Sad Path: lanza InternalServerErrorException si servicio retorna null', async () => {
      const query = {} as any;
      mockCategoriesService.findAll.mockResolvedValue(null);
      await expect(controller.findAll(query)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    test('Happy Path: retorna una categoría por ID', async () => {
      const mockCategory = { id: '1', name: 'Postres' };
      mockCategoriesService.findOne.mockResolvedValue(mockCategory);
      const result = await controller.findOne('1');
      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(mockCategory);
    });

    test('Sad Path: lanza NotFoundException si no existe', async () => {
      mockCategoriesService.findOne.mockResolvedValue(null);
      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    test('Happy Path: actualiza y retorna la categoría', async () => {
      const dto = { name: 'Postres Gourmet' } as any;
      const mockCategory = { id: '1', ...dto };
      mockCategoriesService.update.mockResolvedValue(mockCategory);
      const result = await controller.update('1', dto);
      expect(result.data).toEqual(mockCategory);
      expect(mockCategoriesService.update).toHaveBeenCalledWith('1', dto);
    });

    test('Sad Path: lanza NotFoundException si no encuentra la categoría', async () => {
      mockCategoriesService.update.mockResolvedValue(null);
      await expect(controller.update('999', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    test('Happy Path: elimina y retorna la categoría eliminada', async () => {
      const mockCategory = { id: '1', name: 'Old' };
      mockCategoriesService.remove.mockResolvedValue(mockCategory);
      const result = await controller.remove('1');
      expect(result.data).toEqual(mockCategory);
      expect(mockCategoriesService.remove).toHaveBeenCalledWith('1');
    });

    test('Sad Path: lanza NotFoundException si no existe', async () => {
      mockCategoriesService.remove.mockResolvedValue(null);
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});