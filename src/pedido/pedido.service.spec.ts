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
  let repoPedido; 

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn(() => Promise.resolve(null)), 
  };

  const mockRepo = {
    create: jest.fn((dto) => dto),
    save: jest.fn((data) => Promise.resolve({ id: '1', ...data })),
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
    repoPedido = module.get(getRepositoryToken(Pedido));
    jest.clearAllMocks(); 
  });

  it('debe crear un pedido exitosamente', async () => {
    const dto = { mesaId: 1, metodoPagoId: 1 } as any;


    mockQueryBuilder.getOne.mockResolvedValue({ id: 1 });

    const resultado = await service.create(dto);

    expect(resultado).toBeDefined();
    expect(mockRepo.save).toHaveBeenCalled(); 
    expect(mockNotificaciones.create).toHaveBeenCalled(); 
  });

  it('debe lanzar error si la mesa no existe', async () => {
    const dto = { mesaId: 999, metodoPagoId: 1 } as any;
    mockQueryBuilder.getOne.mockResolvedValue(null);

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
  });

  it('debe listar los pedidos paginados', async () => {
    const query = { limit: 10, page: 1 } as any;
    const resultado = await service.findAll(query);
    expect(mockRepo.createQueryBuilder).toHaveBeenCalledWith('pedido');
    expect(resultado).toHaveProperty('items'); 
  });

  it('debe encontrar un pedido por su ID', async () => {
    const pedidoSimulado = { id: 'abc-123', total: 50 };
    
    mockQueryBuilder.getOne.mockResolvedValue(pedidoSimulado);

    const resultado = await service.findOne('abc-123');

    expect(resultado).toEqual(pedidoSimulado);
    expect(mockQueryBuilder.where).toHaveBeenCalled();
  });

});