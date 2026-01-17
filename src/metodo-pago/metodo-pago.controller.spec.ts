import { Test, TestingModule } from '@nestjs/testing';
import { MetodoPagoController } from './metodo-pago.controller';
import { MetodoPagoService } from './metodo-pago.service';

describe('MetodoPagoController', () => {
  let controller: MetodoPagoController;

  // 1. Creamos un objeto que imita al servicio original
  const mockMetodoPagoService = {
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetodoPagoController],
      providers: [
        {
          // 2. Le decimos a Nest: "Cuando alguien pida MetodoPagoService..."
          provide: MetodoPagoService,
          // 3. "...dale nuestro objeto simulado (mock) en su lugar"
          useValue: mockMetodoPagoService,
        },
      ],
    }).compile();

    controller = module.get<MetodoPagoController>(MetodoPagoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});