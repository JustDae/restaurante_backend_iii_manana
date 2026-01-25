import { Test, TestingModule } from '@nestjs/testing';
import { FacturaController } from './factura.controller';
import { FacturaService } from './factura.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

describe('FacturaController', () => {
  let controller: FacturaController;
  let service: jest.Mocked<FacturaService>;

  const mockFactura = {
    id: 1,
    razonSocial: 'Cliente',
    total: 100,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacturaController],
      providers: [
        {
          provide: FacturaService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockFactura),
            findAll: jest
              .fn()
              .mockResolvedValue({ items: [mockFactura], meta: {} }),
            findOne: jest.fn().mockResolvedValue(mockFactura),
            update: jest.fn().mockResolvedValue(mockFactura),
            remove: jest.fn().mockResolvedValue(mockFactura),
          },
        },
      ],
    }).compile();

    controller = module.get<FacturaController>(FacturaController);
    service = module.get(FacturaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear factura y retornar DTO', async () => {
      const result = await controller.create({} as any);
      expect(service.create).toHaveBeenCalled();
      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(mockFactura);
    });

    it('debe lanzar InternalServerErrorException si servicio retorna null', async () => {
      service.create.mockResolvedValue(null);
      await expect(controller.create({} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('debe retornar historial', async () => {
      const result = await controller.findAll({ page: 1 } as any);
      expect(service.findAll).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('debe limitar limit a 100', async () => {
      await controller.findAll({ limit: 200 } as any);
      expect(service.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 100 }),
      );
    });

    it('debe lanzar InternalServerErrorException si falla', async () => {
      service.findAll.mockResolvedValue(null);
      await expect(controller.findAll({} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('debe retornar factura si existe', async () => {
      const result = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result.data).toEqual(mockFactura);
    });

    it('debe lanzar NotFoundException si no existe (servicio retorna null)', async () => {
      service.findOne.mockResolvedValue(null);
      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar correctamente', async () => {
      const result = await controller.update(1, {} as any);
      expect(service.update).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('debe lanzar NotFoundException si no encuentra factura', async () => {
      service.update.mockResolvedValue(null);
      await expect(controller.update(1, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('debe eliminar correctamente', async () => {
      const result = await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result.success).toBe(true);
    });

    it('debe lanzar NotFoundException si no encuentra factura', async () => {
      service.remove.mockResolvedValue(null);
      await expect(controller.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
