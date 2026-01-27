import { Test, TestingModule } from '@nestjs/testing';
import { DetallePedidoController } from './detalle_pedido.controller';
import { DetallePedidoService } from './detalle_pedido.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SuccessResponseDto } from '../common/dto/response.dto';

describe('DetallePedidoController', () => {
  let controller: DetallePedidoController;
  let service: DetallePedidoService;

  const mockDetallePedidoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetallePedidoController],
      providers: [
        {
          provide: DetallePedidoService,
          useValue: mockDetallePedidoService,
        },
      ],
    }).compile();

    controller = module.get<DetallePedidoController>(DetallePedidoController);
    service = module.get<DetallePedidoService>(DetallePedidoService);
    jest.clearAllMocks();
  });

  test('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    test('Happy Path: crea un detalle y retorna SuccessResponseDto', async () => {
      const dto = { pedidoId: 1, productoId: 1, cantidad: 2 } as any;
      const resultDto = { id: 1, ...dto };
      mockDetallePedidoService.create.mockResolvedValue(resultDto);
      const result = await controller.create(dto);
      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(resultDto);
      expect(mockDetallePedidoService.create).toHaveBeenCalledWith(dto);
    });

    test('Sad Path: lanza InternalServerErrorException si falla la creación', async () => {
      mockDetallePedidoService.create.mockResolvedValue(null);
      await expect(controller.create({} as any)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    test('Happy Path: retorna lista paginada de detalles', async () => {
      const query = { page: 1, limit: 10 } as any;
      const mockResult = { items: [], meta: {} };
      mockDetallePedidoService.findAll.mockResolvedValue(mockResult);
      const result = await controller.findAll(query);
      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(mockResult);
    });

    test('Sad Path: lanza InternalServerErrorException si servicio retorna null', async () => {
      const query = {} as any;
      mockDetallePedidoService.findAll.mockResolvedValue(null);
      await expect(controller.findAll(query)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    test('Happy Path: retorna un detalle por ID', async () => {
      const mockDetalle = { id: 1, cantidad: 5 };
      mockDetallePedidoService.findOne.mockResolvedValue(mockDetalle);
      const result = await controller.findOne('1');
      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(mockDetalle);
    });

    test('Sad Path: lanza NotFoundException si no existe', async () => {
      mockDetallePedidoService.findOne.mockResolvedValue(null);
      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    test('Happy Path: actualiza y retorna el detalle', async () => {
      const dto = { cantidad: 10 } as any;
      const mockDetalle = { id: 1, ...dto };
      mockDetallePedidoService.update.mockResolvedValue(mockDetalle);
      const result = await controller.update('1', dto);
      expect(result.data).toEqual(mockDetalle);
      expect(mockDetallePedidoService.update).toHaveBeenCalledWith(1, dto);
    });

    test('Sad Path: lanza NotFoundException si no encuentra el detalle', async () => {
      mockDetallePedidoService.update.mockResolvedValue(null);
      await expect(controller.update('999', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    test('Happy Path: elimina y retorna el ID del detalle eliminado', async () => {
      const mockDetalle = { id: 1 };
      mockDetallePedidoService.remove.mockResolvedValue(mockDetalle);

      const result = await controller.remove('1');

      expect(result.data).toEqual('1');
      expect(mockDetallePedidoService.remove).toHaveBeenCalledWith(1);
    });

    test('Sad Path: lanza NotFoundException si no existe', async () => {
      mockDetallePedidoService.remove.mockResolvedValue(null);
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});