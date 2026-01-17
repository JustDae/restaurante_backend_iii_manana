import { Test, TestingModule } from '@nestjs/testing';
import { MesaController } from './mesa.controller';
import { MesaService } from './mesa.service';

describe('MesaController', () => {
  let controller: MesaController;
  let service: MesaService;

  // Creamos un objeto simulado del servicio
  const mockMesaService = {
    // Define aquí los métodos que usa tu controlador
    create: jest.fn(dto => {
      return { id: 1, ...dto };
    }),
    findAll: jest.fn(() => []),
    findOne: jest.fn(id => {
      return { id, nombre: 'Mesa Test' };
    }),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MesaController],
      providers: [
        {
          // Cuando el controlador pida MesaService...
          provide: MesaService,
          // ...dale nuestro objeto simulado en lugar del real
          useValue: mockMesaService,
        },
      ],
    }).compile();

    controller = module.get<MesaController>(MesaController);
    service = module.get<MesaService>(MesaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});