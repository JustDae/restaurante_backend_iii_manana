import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SuccessResponseDto } from '../common/dto/response.dto';

describe('ProductosController', () => {
  let controller: ProductosController;
  let service: ProductosService;

  const mockProductosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    updateImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductosController],
      providers: [
        {
          provide: ProductosService,
          useValue: mockProductosService,
        },
      ],
    }).compile();

    controller = module.get<ProductosController>(ProductosController);
    service = module.get<ProductosService>(ProductosService);
    jest.clearAllMocks();
  });

  test('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    test('Happy Path: crea un producto y retorna SuccessResponseDto', async () => {
      const dto = { nombre: 'Hamburguesa', precio: 10 } as any;
      const resultDto = { id: 1, ...dto };
      mockProductosService.create.mockResolvedValue(resultDto);

      const result = await controller.create(dto);

      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(resultDto);
      expect(mockProductosService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    test('Happy Path: retorna lista paginada de productos', async () => {
      const query = { page: 1, limit: 10 } as any;
      const mockResult = { items: [], meta: {} };
      mockProductosService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(query, 'true');

      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(mockResult);
      expect(mockProductosService.findAll).toHaveBeenCalledWith(query, true);
    });

    test('Sad Path: lanza BadRequestException si estado es inválido', async () => {
      const query = {} as any;
      await expect(controller.findAll(query, 'invalid')).rejects.toThrow(BadRequestException);
    });

    test('Sad Path: lanza InternalServerErrorException si el servicio falla', async () => {
      const query = {} as any;
      mockProductosService.findAll.mockResolvedValue(null);
      await expect(controller.findAll(query, undefined)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    test('Happy Path: retorna un producto por ID', async () => {
      const mockProducto = { id: 1, nombre: 'Pizza' };
      mockProductosService.findOne.mockResolvedValue(mockProducto);

      const result = await controller.findOne('1');

      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(mockProducto);
    });

    test('Sad Path: lanza NotFoundException si no existe', async () => {
      mockProductosService.findOne.mockResolvedValue(null);
      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    test('Happy Path: actualiza y retorna el producto', async () => {
      const dto = { nombre: 'Pizza XL' } as any;
      const mockProducto = { id: 1, ...dto };
      mockProductosService.update.mockResolvedValue(mockProducto);

      const result = await controller.update('1', dto);

      expect(result.data).toEqual(mockProducto);
      expect(mockProductosService.update).toHaveBeenCalledWith(1, dto);
    });

    test('Sad Path: lanza NotFoundException si no encuentra el producto', async () => {
      mockProductosService.update.mockResolvedValue(null);
      await expect(controller.update('999', {
        categoryId: ''
      })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    test('Happy Path: elimina y retorna el producto eliminado', async () => {
      const mockProducto = { id: 1, nombre: 'Pizza' };
      mockProductosService.remove.mockResolvedValue(mockProducto);

      const result = await controller.remove('1');

      expect(result.data).toEqual(mockProducto);
      expect(mockProductosService.remove).toHaveBeenCalledWith(1);
    });

    test('Sad Path: lanza NotFoundException si no existe', async () => {
      mockProductosService.remove.mockResolvedValue(null);
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('uploadImage', () => {
    test('Happy Path: sube imagen y actualiza producto', async () => {
      const mockFile = { filename: 'foto.jpg' } as any;
      const mockProducto = { id: 1, imagen: 'foto.jpg' };
      mockProductosService.updateImage.mockResolvedValue(mockProducto);

      const result = await controller.uploadImage('1', mockFile);

      expect(result.data).toEqual(mockProducto);
      expect(mockProductosService.updateImage).toHaveBeenCalledWith(1, 'foto.jpg');
    });

    test('Sad Path: lanza BadRequestException si no hay archivo', async () => {
      return await expect(controller.uploadImage('1', null)).rejects.toThrow(BadRequestException);
    });

    test('Sad Path: lanza NotFoundException si el producto no existe', async () => {
      const mockFile = { filename: 'foto.jpg' } as any;
      mockProductosService.updateImage.mockResolvedValue(null);
      await expect(controller.uploadImage('999', mockFile)).rejects.toThrow(NotFoundException);
    });
  });
});