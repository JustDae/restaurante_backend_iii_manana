import { Test, TestingModule } from '@nestjs/testing';
import { RolController } from './rol.controller';
import { RolService } from './rol.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

describe('RolController', () => {
  let controller: RolController;
  let service: jest.Mocked<RolService>;

  const mockRol = {
    id: 1,
    nombre: 'ADMIN',
    descripcion: 'Admin Role',
    activo: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolController],
      providers: [
        {
          provide: RolService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockRol),
            findAll: jest.fn().mockResolvedValue({
              items: [mockRol],
              meta: {
                totalItems: 1,
                itemCount: 1,
                itemsPerPage: 10,
                totalPages: 1,
                currentPage: 1,
              },
            }),
            findOne: jest.fn().mockResolvedValue(mockRol),
            update: jest.fn().mockResolvedValue(mockRol),
            remove: jest.fn().mockResolvedValue(mockRol),
          },
        },
      ],
    }).compile();

    controller = module.get<RolController>(RolController);
    service = module.get(RolService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear un rol y retornar success DTO', async () => {
      const dto = { nombre: 'CAJERO' };
      const response = await controller.create(dto as any);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(response).toBeInstanceOf(SuccessResponseDto);
      expect(response.data).toEqual(mockRol);
    });

    it('debe lanzar InternalServerErrorException si falla el servicio', async () => {
      service.create.mockResolvedValue(null);
      await expect(controller.create({ nombre: 'X' } as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('debe obtener lista paginada', async () => {
      const query = { page: 1, limit: 10 };
      const response = await controller.findAll(query as any);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(response.success).toBe(true);
    });

    it('debe limitar el query limit a 100', async () => {
      const query = { page: 1, limit: 500 };
      await controller.findAll(query as any);

      expect(service.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 100 }),
      );
    });

    it('debe lanzar InternalServerErrorException si servicio devuelve null', async () => {
      service.findAll.mockResolvedValue(null);
      await expect(controller.findAll({} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('debe devolver un rol si existe', async () => {
      const response = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(response.data).toEqual(mockRol);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      service.findOne.mockResolvedValue(null);
      await expect(controller.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar y devolver el rol', async () => {
      const response = await controller.update(1, { nombre: 'NUEVO' });
      expect(service.update).toHaveBeenCalledWith(1, { nombre: 'NUEVO' });
      expect(response.success).toBe(true);
    });

    it('debe lanzar NotFoundException si no encuentra el rol', async () => {
      service.update.mockResolvedValue(null);
      await expect(controller.update(99, {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('debe eliminar y devolver el rol eliminado', async () => {
      const response = await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(response.success).toBe(true);
    });

    it('debe lanzar NotFoundException si no encuentra el rol', async () => {
      service.remove.mockResolvedValue(null);
      await expect(controller.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
