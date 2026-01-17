import { Test, TestingModule } from '@nestjs/testing';
import { MesaService } from './mesa.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Mesa } from './entities/mesa.entity'; // Asegúrate de que la ruta sea correcta

describe('MesaService', () => {
  let service: MesaService;

  // Creamos una versión simulada del repositorio
  const mockMesaRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    // Agrega aquí otros métodos que uses en tu servicio (delete, update, etc.)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MesaService,
        {
          // Esto le dice a Nest: "Cuando alguien pida el repositorio de Mesa, dale el Mock"
          provide: getRepositoryToken(Mesa),
          useValue: mockMesaRepository,
        },
      ],
    }).compile();

    service = module.get<MesaService>(MesaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});