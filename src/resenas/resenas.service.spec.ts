import { Test, TestingModule } from '@nestjs/testing';
import { ResenasService } from './resenas.service';
import { getModelToken } from '@nestjs/mongoose';

describe('ResenasService', () => {
  let service: ResenasService;

  // Mock del modelo de Mongoose
  const mockResenaModel = {
    find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
    create: jest.fn().mockImplementation(dto => ({ ...dto, save: jest.fn().mockResolvedValue(dto) })),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResenasService,
        {
          // Ajusta 'Resena' al nombre exacto que usaste en tu Schema/Module
          provide: getModelToken('Resena'), 
          useValue: mockResenaModel,
        },
      ],
    }).compile();

    service = module.get<ResenasService>(ResenasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});