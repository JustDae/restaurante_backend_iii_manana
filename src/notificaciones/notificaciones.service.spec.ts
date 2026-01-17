import { Test, TestingModule } from '@nestjs/testing';
import { NotificacionesService } from './notificaciones.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotificacionesGateway } from './notificaciones.gateway';

describe('NotificacionesService', () => {
  let service: NotificacionesService;

  const mockNotificacionModel = {
    find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
    create: jest.fn().mockImplementation(dto => ({ ...dto, save: jest.fn().mockResolvedValue(dto) })),
  };

  const mockGateway = {
    server: {
      emit: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificacionesService,
        {
          // CAMBIO AQUÍ: Usamos el nombre exacto que el error reportó: 'Notificacione'
          provide: getModelToken('Notificacione'), 
          useValue: mockNotificacionModel,
        },
        {
          provide: NotificacionesGateway,
          useValue: mockGateway,
        },
      ],
    }).compile();

    service = module.get<NotificacionesService>(NotificacionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});