import { Test, TestingModule } from '@nestjs/testing';
import { PromocionesController } from './promociones.controller';
import { PromocionesService } from './promociones.service';

describe('PromocionesController', () => {
  let controller: PromocionesController;
  let service: jest.Mocked<PromocionesService>;

  const mockPromocion = {
    _id: 'mongo-id-123',
    nombre: '2x1',
    codigo: '2X1',
    descuentoPorcentaje: 50,
    activo: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromocionesController],
      providers: [
        {
          provide: PromocionesService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockPromocion),
            findAll: jest.fn().mockResolvedValue([mockPromocion]),
            findOne: jest.fn().mockResolvedValue(mockPromocion),
            remove: jest.fn().mockResolvedValue(mockPromocion),
          },
        },
      ],
    }).compile();

    controller = module.get<PromocionesController>(PromocionesController);
    service = module.get(PromocionesService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear una promoción', async () => {
      const dto = { nombre: 'Test', codigo: 'T1' };
      const result = await controller.create(dto as any);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockPromocion);
    });
  });

  describe('findAll', () => {
    it('debe retornar lista de promociones', async () => {
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockPromocion]);
    });
  });

  describe('findOne', () => {
    it('debe retornar una promoción por ID', async () => {
      const result = await controller.findOne('mongo-id-123');
      expect(service.findOne).toHaveBeenCalledWith('mongo-id-123');
      expect(result).toEqual(mockPromocion);
    });
  });

  describe('remove', () => {
    it('debe eliminar una promoción', async () => {
      const result = await controller.remove('mongo-id-123');
      expect(service.remove).toHaveBeenCalledWith('mongo-id-123');
      expect(result).toEqual(mockPromocion);
    });
  });
});
