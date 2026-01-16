import { Test, TestingModule } from '@nestjs/testing';
import { DetallePedidoService } from './detalle_pedido.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DetallePedido } from './entities/detalle_pedido.entity';
import { Pedido } from '../pedido/entities/pedido.entity';
import { Producto } from '../productos/entities/producto.entity';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

describe('DetallePedidoService', () => {
  let service: DetallePedidoService;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockNotificaciones = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DetallePedidoService,
        { provide: getRepositoryToken(DetallePedido), useValue: mockRepo },
        { provide: getRepositoryToken(Pedido), useValue: mockRepo },
        { provide: getRepositoryToken(Producto), useValue: mockRepo },
        { provide: NotificacionesService, useValue: mockNotificaciones },
      ],
    }).compile();

    service = module.get<DetallePedidoService>(DetallePedidoService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });
});