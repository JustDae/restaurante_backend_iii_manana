import { Test, TestingModule } from '@nestjs/testing';
import { PedidoService } from './pedido.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { Mesa } from '../mesa/entities/mesa.entity';
import { MetodoPago } from '../metodo-pago/entities/metodo-pago.entity';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { NotFoundException } from '@nestjs/common';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue({ items: [], meta: {} }),
}));

describe('PedidoService', () => {
  let service: PedidoService;
  let repo;

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const mockRepo = {
    create: jest.fn((dto) => dto),
    save: jest.fn((data) => Promise.resolve({ id: '1', ...data })),
    remove: jest.fn((data) => Promise.resolve(data)),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockNotificaciones = {
    create: jest.fn(() => Promise.resolve(true)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoService,
        { provide: getRepositoryToken(Pedido), useValue: mockRepo },
        { provide: getRepositoryToken(Mesa), useValue: mockRepo },
        { provide: getRepositoryToken(MetodoPago), useValue: mockRepo },
        { provide: NotificacionesService, useValue: mockNotificaciones },
      ],
    }).compile();

    service = module.get<PedidoService>(PedidoService);
    repo = module.get(getRepositoryToken(Pedido));
    jest.clearAllMocks();
  });

  test('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    test('Happy Path: crea un pedido exitosamente', async () => {
      const dto = { mesaId: 1, metodoPagoId: 1 } as any;
      mockQueryBuilder.getOne.mockResolvedValue({ id: 1 });
      const result = await service.create(dto);
      expect(result).toBeDefined();
      expect(mockRepo.save).toHaveBeenCalled();
      expect(mockNotificaciones.create).toHaveBeenCalled();
    });

    test('Sad Path: lanza NotFoundException si mesa o metodoPago no existen', async () => {
      const dto = { mesaId: 999, metodoPagoId: 1 } as any;
      mockQueryBuilder.getOne.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    test('Happy Path: retorna lista paginada de pedidos', async () => {
      const query = { limit: 10, page: 1 } as any;
      const result = await service.findAll(query);
      expect(mockRepo.createQueryBuilder).toHaveBeenCalledWith('pedido');
      expect(result).toHaveProperty('items');
    });

    test('Sad Path: retorna null si falla el query builder', async () => {
      mockRepo.createQueryBuilder.mockImplementationOnce(() => {
        throw new Error('Query failed');
      });
      const result = await service.findAll({} as any);
      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    test('Happy Path: encuentra un pedido por ID', async () => {
      const pedidoSimulado = { id: 'abc-123', total: 50 };
      mockQueryBuilder.getOne.mockResolvedValue(pedidoSimulado);
      const result = await service.findOne('abc-123');
      expect(result).toEqual(pedidoSimulado);
      expect(mockQueryBuilder.where).toHaveBeenCalled();
    });

    test('Sad Path: retorna null si el pedido no existe', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      const result = await service.findOne('999');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    test('Happy Path: actualiza un pedido si existe', async () => {
      const pedidoSimulado = { id: '1', nombre_cliente: 'Juan' };
      mockQueryBuilder.getOne.mockResolvedValue(pedidoSimulado);
      const dto = { nombre_cliente: 'Pedro' } as any;
      const result = await service.update('1', dto);
      expect(result.nombre_cliente).toBe('Pedro');
      expect(mockRepo.save).toHaveBeenCalled();
    });

    test('Sad Path: retorna null si el pedido a actualizar no existe', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      const result = await service.update('999', {} as any);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    test('Happy Path: elimina un pedido si existe', async () => {
      const pedidoSimulado = { id: '1' };
      mockQueryBuilder.getOne.mockResolvedValue(pedidoSimulado);
      await service.remove('1');
      expect(mockRepo.remove).toHaveBeenCalledWith(pedidoSimulado);
    });

    test('Sad Path: retorna null si el pedido a eliminar no existe', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      const result = await service.remove('999');
      expect(result).toBeNull();
    });
  });
});