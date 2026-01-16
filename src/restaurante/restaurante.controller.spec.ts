import { Test, TestingModule } from '@nestjs/testing';
import { RestauranteController } from './restaurante.controller';
import { RestauranteService } from './restaurante.service';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { NotFoundException } from '@nestjs/common';

describe('RestauranteController', () => {
  let controller: RestauranteController;
  let service: jest.Mocked<RestauranteService>;

  const mockRestaurante = {
    id: 1,
    name: 'El Buen Sabor',
    direccion: 'Av. Siempre Viva',
    telefono: '0999999999',
    ruc: '1700000000001',
    slogan: 'El mejor sabor',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestauranteController],
      providers: [
        {
          provide: RestauranteService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockRestaurante),
            findAll: jest.fn().mockResolvedValue([mockRestaurante]),
            findOne: jest.fn().mockResolvedValue(mockRestaurante),
            update: jest.fn().mockResolvedValue(mockRestaurante),
            remove: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    controller = module.get<RestauranteController>(RestauranteController);
    service = module.get(RestauranteService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear restaurante y retornar SuccessResponseDto', async () => {
      const dto = {
        name: 'Test',
        direccion: 'Dir',
        telefono: '123',
        ruc: '111',
      };
      const response = await controller.create(dto as any);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(response).toBeInstanceOf(SuccessResponseDto);
      expect(response.message).toContain('configurado exitosamente');
      expect(response.data).toEqual(mockRestaurante);
    });
  });

  describe('findAll', () => {
    it('debe retornar lista envuelta en DTO', async () => {
      const response = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(response.success).toBe(true);
      expect(response.data).toEqual([mockRestaurante]);
    });
  });

  describe('findOne', () => {
    it('debe retornar un restaurante', async () => {
      const response = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockRestaurante);
    });
  });

  describe('update', () => {
    it('debe actualizar y retornar DTO', async () => {
      const response = await controller.update(1, { name: 'Nuevo' });
      expect(service.update).toHaveBeenCalledWith(1, { name: 'Nuevo' });
      expect(response.success).toBe(true);
    });
  });

  describe('remove', () => {
    it('debe eliminar y retornar null en data', async () => {
      const response = await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(response.success).toBe(true);
      expect(response.data).toBeNull();
    });
  });
});
