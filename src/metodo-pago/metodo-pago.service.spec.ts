import { Test, TestingModule } from '@nestjs/testing';
import { MetodoPagoService } from './metodo-pago.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MetodoPago } from './entities/metodo-pago.entity';

describe('MetodoPagoService', () => {
  let service: MetodoPagoService;

  // 1. Definimos una simulación del repositorio
  const mockMetodoPagoRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetodoPagoService,
        // 2. Le decimos a Nest que use el Mock en lugar del repositorio real
        {
          provide: getRepositoryToken(MetodoPago),
          useValue: mockMetodoPagoRepository,
        },
      ],
    }).compile();

    service = module.get<MetodoPagoService>(MetodoPagoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});