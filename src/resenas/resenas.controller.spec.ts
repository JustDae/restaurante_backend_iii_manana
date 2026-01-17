import { Test, TestingModule } from '@nestjs/testing';
import { ResenasController } from './resenas.controller';
import { ResenasService } from './resenas.service';

describe('ResenasController', () => {
  let controller: ResenasController;

  // Mock del servicio de reseñas
  const mockResenasService = {
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResenasController],
      providers: [
        {
          provide: ResenasService,
          useValue: mockResenasService,
        },
      ],
    }).compile();

    controller = module.get<ResenasController>(ResenasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});