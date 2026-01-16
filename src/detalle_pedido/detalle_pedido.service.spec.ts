import { Test, TestingModule } from '@nestjs/testing';
import { DetallePedidoService } from './detalle_pedido.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DetallePedido } from './entities/detalle_pedido.entity';
import { Pedido } from '../pedido/entities/pedido.entity';
import { Producto } from '../productos/entities/producto.entity';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { NotFoundException } from '@nestjs/common';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue({ items: [], meta: {} }),
}));

describe('DetallePedidoService', () => {
  let service: DetallePedidoService;
  let detalleRepo;
  let pedidoRepo;
  let productoRepo;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const mockDetalleRepo = {
    create: jest.fn((dto) => dto),
    save: jest.fn((data) => Promise.resolve({ id: 1, ...data })),
    findOne: jest.fn(),
    remove: jest.fn((data) => Promise.resolve(data)),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockPedidoRepo = {
    findOneBy: jest.fn(),
    save: jest.fn((data) => Promise.resolve(data)),
  };

  const mockProductoRepo = {
    findOneBy: jest.fn(),
  };

  const mockNotificaciones = {
    create: jest.fn(() => Promise.resolve(true)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DetallePedidoService,
        { provide: getRepositoryToken(DetallePedido), useValue: mockDetalleRepo },
        { provide: getRepositoryToken(Pedido), useValue: mockPedidoRepo },
        { provide: getRepositoryToken(Producto), useValue: mockProductoRepo },
        { provide: NotificacionesService, useValue: mockNotificaciones },
      ],
    }).compile();

    service = module.get<DetallePedidoService>(DetallePedidoService);
    detalleRepo = module.get(getRepositoryToken(DetallePedido));
    pedidoRepo = module.get(getRepositoryToken(Pedido));
    productoRepo = module.get(getRepositoryToken(Producto));
    jest.clearAllMocks();
  });

  test('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    test('Happy Path: crea detalle, actualiza total del pedido y notifica', async () => {
      const dto = { pedidoId: 'ped-1', productoId: 1, cantidad: 2 } as any;
      const mockPedido = { id: 'ped-1', total: 10 };
      const mockProducto = { id: 1, precio: 5, nombre: 'Pizza' };

      mockPedidoRepo.findOneBy.mockResolvedValue(mockPedido);
      mockProductoRepo.findOneBy.mockResolvedValue(mockProducto);

      const result = await service.create(dto);

      expect(result).toBeDefined();
      expect(mockDetalleRepo.save).toHaveBeenCalled();
      expect(mockPedidoRepo.save).toHaveBeenCalled(); 
      expect(mockNotificaciones.create).toHaveBeenCalled();
    });

    test('Sad Path: lanza NotFoundException si el pedido no existe', async () => {
      const dto = { pedidoId: 'ped-999', productoId: 1 } as any;
      mockPedidoRepo.findOneBy.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    test('Sad Path: lanza NotFoundException si el producto no existe', async () => {
      const dto = { pedidoId: 'ped-1', productoId: 999 } as any;
      mockPedidoRepo.findOneBy.mockResolvedValue({ id: 'ped-1' });
      mockProductoRepo.findOneBy.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    test('Happy Path: retorna lista paginada de detalles', async () => {
      const query = { page: 1, limit: 10, search: 'juan' } as any;
      const result = await service.findAll(query);
      expect(mockDetalleRepo.createQueryBuilder).toHaveBeenCalledWith('detalle_pedido');
      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(result).toHaveProperty('items');
    });

    test('Sad Path: retorna null si falla el query builder', async () => {
      mockDetalleRepo.createQueryBuilder.mockImplementationOnce(() => {
        throw new Error('DB Error');
      });
      const result = await service.findAll({} as any);
      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    test('Happy Path: encuentra un detalle por ID', async () => {
      const mockDetalle = { id: 1, cantidad: 5 };
      mockDetalleRepo.findOne.mockResolvedValue(mockDetalle);
      const result = await service.findOne(1);
      expect(result).toEqual(mockDetalle);
    });

    test('Sad Path: retorna null si el detalle no existe o hay error', async () => {
      mockDetalleRepo.findOne.mockRejectedValue(new Error('Error'));
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    test('Happy Path: actualiza un detalle existente', async () => {
      const mockDetalle = { id: 1, cantidad: 1 };
      mockDetalleRepo.findOne.mockResolvedValue(mockDetalle);
      const dto = { cantidad: 2 } as any;
      const result = await service.update(1, dto);
      expect(result.cantidad).toBe(2);
      expect(mockDetalleRepo.save).toHaveBeenCalled();
    });

    test('Sad Path: retorna null si el detalle a actualizar no existe', async () => {
      mockDetalleRepo.findOne.mockResolvedValue(null);
      const result = await service.update(999, {} as any);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    test('Happy Path: elimina un detalle si existe', async () => {
      const mockDetalle = { id: 1 };
      mockDetalleRepo.findOne.mockResolvedValue(mockDetalle);
      await service.remove(1);
      expect(mockDetalleRepo.remove).toHaveBeenCalledWith(mockDetalle);
    });

    test('Sad Path: retorna null si el detalle a eliminar no existe', async () => {
      mockDetalleRepo.findOne.mockResolvedValue(null);
      const result = await service.remove(999);
      expect(result).toBeNull();
    });
  });
});