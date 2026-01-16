import { Test, TestingModule } from '@nestjs/testing';
import { PedidoController } from './pedido.controller';
import { PedidoService } from './pedido.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SuccessResponseDto } from '../common/dto/response.dto';
import { getModelToken } from '@nestjs/mongoose';
import { AuditLog } from '../audit-logs/schemas/audit-log.schema';

describe('PedidoController', () => {
  let controller: PedidoController;
  let service: PedidoService;

  const mockPedidoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAuditLogModel = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidoController],
      providers: [
        {
          provide: PedidoService,
          useValue: mockPedidoService,
        },
        {
          provide: getModelToken(AuditLog.name),
          useValue: mockAuditLogModel,
        },
      ],
    }).compile();

    controller = module.get<PedidoController>(PedidoController);
    service = module.get<PedidoService>(PedidoService);
    jest.clearAllMocks();
  });

  test('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    test('Happy Path: crea un pedido y retorna SuccessResponseDto', async () => {
      const dto = { mesaId: 1 } as any;
      const resultDto = { id: 1, ...dto };
      mockPedidoService.create.mockResolvedValue(resultDto);
      const result = await controller.create(dto);
      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(resultDto);
      expect(mockPedidoService.create).toHaveBeenCalledWith(dto);
    });

    test('Sad Path: lanza InternalServerErrorException si falla la creación', async () => {
      mockPedidoService.create.mockResolvedValue(null);
      await expect(controller.create({} as any)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    test('Happy Path: retorna lista paginada de pedidos', async () => {
      const query = { page: 1, limit: 10 } as any;
      const mockResult = { items: [], meta: {} };
      mockPedidoService.findAll.mockResolvedValue(mockResult);
      const result = await controller.findAll(query);
      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(mockResult);
      expect(mockPedidoService.findAll).toHaveBeenCalledWith(query);
    });

    test('Sad Path: lanza InternalServerErrorException si servicio retorna null', async () => {
      const query = {} as any;
      mockPedidoService.findAll.mockResolvedValue(null);
      await expect(controller.findAll(query)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    test('Happy Path: retorna un pedido por ID', async () => {
      const mockPedido = { id: 'abc-123', total: 100 };
      mockPedidoService.findOne.mockResolvedValue(mockPedido);
      const result = await controller.findOne('abc-123');
      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(mockPedido);
    });

    test('Sad Path: lanza NotFoundException si no existe', async () => {
      mockPedidoService.findOne.mockResolvedValue(null);
      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    test('Happy Path: actualiza y retorna el pedido', async () => {
      const dto = { total: 200 } as any;
      const mockPedido = { id: 'abc-123', ...dto };
      mockPedidoService.update.mockResolvedValue(mockPedido);
      const result = await controller.update('abc-123', dto);
      expect(result.data).toEqual(mockPedido);
      expect(mockPedidoService.update).toHaveBeenCalledWith('abc-123', dto);
    });

    test('Sad Path: lanza NotFoundException si no encuentra el pedido', async () => {
      mockPedidoService.update.mockResolvedValue(null);
      await expect(controller.update('999', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    test('Happy Path: elimina y retorna el pedido eliminado', async () => {
      const mockPedido = { id: 'abc-123' };
      mockPedidoService.remove.mockResolvedValue(mockPedido);
      const result = await controller.remove('abc-123');
      expect(result.data).toEqual(mockPedido);
      expect(mockPedidoService.remove).toHaveBeenCalledWith('abc-123');
    });

    test('Sad Path: lanza NotFoundException si no existe', async () => {
      mockPedidoService.remove.mockResolvedValue(null);
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});