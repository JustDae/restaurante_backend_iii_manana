import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RestauranteService } from './restaurante.service';
import { Restaurante } from './restaurante.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('RestauranteService', () => {
  let service: RestauranteService;

  // Mock del repositorio (Sin QueryBuilder esta vez, porque tu servicio no lo usa)
  let repo: {
    count: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOneBy: jest.Mock;
    remove: jest.Mock;
  };

  const mockRestaurante = {
    id: 1,
    name: 'El Buen Sabor',
    direccion: 'Av. Siempre Viva',
    telefono: '0999999999',
    ruc: '1700000000001',
    slogan: 'El mejor sabor',
  };

  beforeEach(async () => {
    // Silenciar consola para errores controlados
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    repo = {
      count: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestauranteService,
        {
          provide: getRepositoryToken(Restaurante),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear el restaurante si no existe ninguno previamente', async () => {
      // Simulamos que hay 0 restaurantes
      repo.count.mockResolvedValue(0);
      repo.create.mockReturnValue(mockRestaurante);
      repo.save.mockResolvedValue(mockRestaurante);

      const dto = {
        name: 'El Buen Sabor',
        direccion: 'Av. Siempre Viva',
        telefono: '0999999999',
        ruc: '1700000000001',
        slogan: 'El mejor sabor',
      };

      const result = await service.create(dto);

      expect(repo.count).toHaveBeenCalled();
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(mockRestaurante);
    });

    it('debe lanzar BadRequestException si YA existe un restaurante', async () => {
      // Simulamos que ya existe 1 restaurante
      repo.count.mockResolvedValue(1);

      await expect(service.create({ name: 'Otro' } as any)).rejects.toThrow(
        BadRequestException,
      );

      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('debe retornar un array de restaurantes', async () => {
      repo.find.mockResolvedValue([mockRestaurante]);
      const result = await service.findAll();
      expect(result).toEqual([mockRestaurante]);
    });
  });

  describe('findOne', () => {
    it('debe retornar el restaurante si existe', async () => {
      repo.findOneBy.mockResolvedValue(mockRestaurante);
      const result = await service.findOne(1);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockRestaurante);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar y guardar', async () => {
      // findOne debe encontrarlo primero
      repo.findOneBy.mockResolvedValue({ ...mockRestaurante });
      repo.save.mockResolvedValue({ ...mockRestaurante, name: 'Nuevo Nombre' });

      const result = await service.update(1, { name: 'Nuevo Nombre' });

      expect(repo.save).toHaveBeenCalled();
      expect(result.name).toBe('Nuevo Nombre');
    });

    it('debe fallar si el restaurante no existe (NotFound)', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.update(99, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debe eliminar si existe', async () => {
      repo.findOneBy.mockResolvedValue(mockRestaurante);
      repo.remove.mockResolvedValue(mockRestaurante);

      const result = await service.remove(1);

      expect(repo.remove).toHaveBeenCalledWith(mockRestaurante);
      expect(result).toEqual(mockRestaurante);
    });

    it('debe fallar si no existe', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
