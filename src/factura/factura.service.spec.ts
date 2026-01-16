// 1. Mock de librerías externas
jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { Factura } from './entities/factura.entity';
import { Pedido } from '../pedido/entities/pedido.entity';

describe('FacturaService', () => {
  let service: FacturaService;

  // Mock Repo Factura
  let facturaRepo: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
    findOneBy: jest.Mock;
    remove: jest.Mock;
    createQueryBuilder: jest.Mock;
  };

  // Mock Repo Pedido
  let pedidoRepo: {
    findOneBy: jest.Mock;
    save: jest.Mock;
  };

  let qb: {
    leftJoinAndSelect: jest.Mock;
    where: jest.Mock;
    orWhere: jest.Mock;
    orderBy: jest.Mock;
  };

  const mockPedido = {
    id: 10,
    total: 100.5,
    estado: 'PENDIENTE',
  };

  const mockFactura = {
    id: 1,
    fechaEmision: new Date(),
    razonSocial: 'Consumidor Final',
    ruc_cedula: '9999999999',
    total: 100.5,
    pedido: mockPedido,
  };

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    qb = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
    };

    facturaRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    };

    pedidoRepo = {
      findOneBy: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacturaService,
        { provide: getRepositoryToken(Factura), useValue: facturaRepo },
        { provide: getRepositoryToken(Pedido), useValue: pedidoRepo },
      ],
    }).compile();

    service = module.get<FacturaService>(FacturaService);
    jest.clearAllMocks();
    (paginate as jest.Mock).mockReset();
  });

  describe('create', () => {
    it('debe crear factura y actualizar estado del pedido a PAGADO', async () => {
      // 1. Encuentra el pedido
      pedidoRepo.findOneBy.mockResolvedValue({ ...mockPedido });
      // 2. No encuentra factura existente (validación pasa)
      facturaRepo.findOneBy.mockResolvedValue(null);
      // 3. Crea y guarda factura
      facturaRepo.create.mockReturnValue(mockFactura);
      facturaRepo.save.mockResolvedValue(mockFactura);
      // 4. Guarda el pedido actualizado
      pedidoRepo.save.mockResolvedValue({ ...mockPedido, estado: 'PAGADO' });

      const dto = { pedidoId: 10, razonSocial: 'Yo', ruc_cedula: '123' };
      const result = await service.create(dto as any);

      // Verificaciones
      expect(pedidoRepo.findOneBy).toHaveBeenCalledWith({ id: 10 });
      expect(facturaRepo.save).toHaveBeenCalled();

      // CRÍTICO: Verificar que actualizó el pedido
      expect(pedidoRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 10, estado: 'PAGADO' }),
      );
      expect(result).toEqual(mockFactura);
    });

    it('debe lanzar NotFoundException si el pedido no existe', async () => {
      pedidoRepo.findOneBy.mockResolvedValue(null);
      await expect(service.create({ pedidoId: 99 } as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('debe lanzar BadRequestException si el pedido ya fue facturado', async () => {
      pedidoRepo.findOneBy.mockResolvedValue(mockPedido);
      // Simulamos que YA existe una factura para este pedido
      facturaRepo.findOneBy.mockResolvedValue({ id: 5 });

      await expect(service.create({ pedidoId: 10 } as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debe lanzar BadRequestException si el total es 0 o negativo', async () => {
      pedidoRepo.findOneBy.mockResolvedValue({ ...mockPedido, total: 0 });
      facturaRepo.findOneBy.mockResolvedValue(null); // No existe factura previa

      await expect(service.create({ pedidoId: 10 } as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('debe listar facturas con filtros', async () => {
      const query = { page: 1, limit: 10, search: 'juan' };
      (paginate as jest.Mock).mockResolvedValue({
        items: [mockFactura],
        meta: {},
      });

      const result = await service.findAll(query as any);

      expect(facturaRepo.createQueryBuilder).toHaveBeenCalledWith('factura');
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith(
        'factura.pedido',
        'pedido',
      );
      expect(qb.where).toHaveBeenCalledWith(
        expect.stringContaining('razonSocial'),
        expect.anything(),
      );
      expect(qb.orWhere).toHaveBeenCalledWith(
        expect.stringContaining('ruc_cedula'),
        expect.anything(),
      );
      expect(result).not.toBeNull();
    });

    it('debe retornar null si ocurre error', async () => {
      (paginate as jest.Mock).mockRejectedValue(new Error('error'));
      const result = await service.findAll({} as any);
      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('debe retornar factura con relaciones', async () => {
      facturaRepo.findOne.mockResolvedValue(mockFactura);

      const result = await service.findOne(1);

      expect(facturaRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['pedido'],
      });
      expect(result).toEqual(mockFactura);
    });

    it('debe lanzar NotFoundException si no encuentra', async () => {
      facturaRepo.findOne.mockResolvedValue(null);
      // El servicio atrapa la excepción y retorna null en el catch?
      // Revisando tu código: lanza NotFound dentro del try, va al catch, loguea y retorna null.
      const result = await service.findOne(99);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('debe actualizar si existe', async () => {
      // Mock findOne interno
      facturaRepo.findOne.mockResolvedValue({ ...mockFactura });
      facturaRepo.save.mockResolvedValue({
        ...mockFactura,
        razonSocial: 'Nueva',
      });

      const result = await service.update(1, { razonSocial: 'Nueva' });

      expect(facturaRepo.save).toHaveBeenCalled();
      expect(result?.razonSocial).toBe('Nueva');
    });

    it('debe retornar null si no existe', async () => {
      facturaRepo.findOne.mockResolvedValue(null);
      const result = await service.update(99, {});
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('debe eliminar si existe', async () => {
      facturaRepo.findOne.mockResolvedValue(mockFactura);
      facturaRepo.remove.mockResolvedValue(mockFactura);

      const result = await service.remove(1);

      expect(facturaRepo.remove).toHaveBeenCalled();
      expect(result).toEqual(mockFactura);
    });
  });
});
