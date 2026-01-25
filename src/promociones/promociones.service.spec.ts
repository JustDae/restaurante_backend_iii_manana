import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PromocionesService } from './promociones.service';
import { Promocion } from './schemas/promocion.schema';

describe('PromocionesService', () => {
  let service: PromocionesService;
  let model: any;

  const mockPromocion = {
    _id: 'mongo-id-123',
    nombre: '2x1 Jueves',
    descripcion: 'Promo de locura',
    codigo: '2X1JUE',
    descuentoPorcentaje: 50,
    fechaInicio: new Date(),
    fechaFin: new Date(),
    activo: true,
  };

  const mockExec = { exec: jest.fn() };

  beforeEach(async () => {
    const mockModel = jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue({ ...dto, _id: 'mongo-id-123' }),
    }));

    (mockModel as any).find = jest.fn().mockReturnValue(mockExec);
    (mockModel as any).findById = jest.fn().mockReturnValue(mockExec);
    (mockModel as any).findByIdAndDelete = jest.fn().mockReturnValue(mockExec);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromocionesService,
        {
          provide: getModelToken(Promocion.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<PromocionesService>(PromocionesService);
    model = module.get(getModelToken(Promocion.name));

    jest.clearAllMocks();
    mockExec.exec.mockReset(); // Limpiamos el mock de exec
  });

  describe('create', () => {
    it('debe instanciar el modelo y guardar', async () => {
      const dto = {
        nombre: '2x1',
        codigo: 'ABC',
        descuentoPorcentaje: 50,
        fechaInicio: new Date(),
        fechaFin: new Date(),
      };

      const result = await service.create(dto as any);

      // Verificamos que se llamó al constructor del modelo
      expect(model).toHaveBeenCalledWith(dto);
      // Verificamos que retornó el objeto con _id (simulando guardado)
      expect(result).toHaveProperty('_id', 'mongo-id-123');
      expect(result.codigo).toBe('ABC');
    });
  });

  describe('findAll', () => {
    it('debe retornar array de promociones usando exec()', async () => {
      // Configuramos el exec para que devuelva un array
      mockExec.exec.mockResolvedValue([mockPromocion]);

      const result = await service.findAll();

      expect(model.find).toHaveBeenCalled();
      expect(mockExec.exec).toHaveBeenCalled();
      expect(result).toEqual([mockPromocion]);
    });
  });

  describe('findOne', () => {
    it('debe buscar por ID y retornar documento', async () => {
      mockExec.exec.mockResolvedValue(mockPromocion);

      const result = await service.findOne('mongo-id-123');

      expect(model.findById).toHaveBeenCalledWith('mongo-id-123');
      expect(mockExec.exec).toHaveBeenCalled();
      expect(result).toEqual(mockPromocion);
    });
  });

  describe('remove', () => {
    it('debe eliminar y retornar documento', async () => {
      mockExec.exec.mockResolvedValue(mockPromocion);

      const result = await service.remove('mongo-id-123');

      expect(model.findByIdAndDelete).toHaveBeenCalledWith('mongo-id-123');
      expect(mockExec.exec).toHaveBeenCalled();
      expect(result).toEqual(mockPromocion);
    });
  });
});
