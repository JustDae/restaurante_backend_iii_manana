import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryDto } from 'src/common/dto/query.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  const mockUser = {
    id: 'uuid-1',
    username: 'testuser',
    email: 'test@test.com',
    password: 'hashed',
    isActive: true,
    rol: { id: 1, nombre: 'ADMIN' },
    profile: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
            findAll: jest.fn().mockResolvedValue({
              items: [mockUser],
              meta: {
                totalItems: 1,
                itemCount: 1,
                itemsPerPage: 10,
                totalPages: 1,
                currentPage: 1,
              },
            }),
            findOne: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockResolvedValue(mockUser),
            remove: jest.fn().mockResolvedValue(mockUser),
            updateProfile: jest
              .fn()
              .mockResolvedValue({ ...mockUser, profile: 'img.png' }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear usuario y devolver SuccessResponseDto', async () => {
      const dto: CreateUserDto = {
        username: 'juan',
        email: 'juan@test.com',
        password: '123',
        rolId: 1,
      };

      const response = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockUser);
      expect(response.message).toBe('User created successfully');
    });
  });

  describe('findAll', () => {
    it('debe devolver usuarios paginados', async () => {
      const query: QueryDto = { page: 1, limit: 10 } as any;
      const response = await controller.findAll(query, 'true');

      expect(service.findAll).toHaveBeenCalledWith(query, true);
      expect(response.success).toBe(true);
      expect(response.data.items.length).toBe(1);
    });

    it('debe limitar el limit a 100 si viene mayor', async () => {
      const query: QueryDto = { page: 1, limit: 500 } as any;

      await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 100 }),
        undefined,
      );
    });

    it('debe lanzar BadRequestException si isActive no es válido', async () => {
      const query: QueryDto = { page: 1, limit: 10 } as any;

      await expect(controller.findAll(query, 'yes')).rejects.toThrow(
        BadRequestException,
      );
      expect(service.findAll).not.toHaveBeenCalled();
    });

    it('debe lanzar InternalServerErrorException si el servicio retorna null', async () => {
      service.findAll.mockResolvedValueOnce(null);
      const query: QueryDto = { page: 1, limit: 10 } as any;

      await expect(controller.findAll(query)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('debe devolver un usuario si existe', async () => {
      const response = await controller.findOne('uuid-1');
      expect(service.findOne).toHaveBeenCalledWith('uuid-1');
      expect(response.data).toEqual(mockUser);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      service.findOne.mockResolvedValueOnce(null);
      await expect(controller.findOne('uuid-fake')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('debe actualizar y devolver usuario', async () => {
      const dto: UpdateUserDto = { username: 'updated' };
      const response = await controller.update('uuid-1', dto);

      expect(service.update).toHaveBeenCalledWith('uuid-1', dto);
      expect(response.success).toBe(true);
    });

    it('debe lanzar NotFoundException si usuario no existe', async () => {
      service.update.mockResolvedValueOnce(null);
      await expect(controller.update('uuid-1', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('debe eliminar y devolver usuario eliminado', async () => {
      const response = await controller.remove('uuid-1');
      expect(service.remove).toHaveBeenCalledWith('uuid-1');
      expect(response.success).toBe(true);
    });

    it('debe lanzar NotFoundException si usuario no existe', async () => {
      service.remove.mockResolvedValueOnce(null);
      await expect(controller.remove('uuid-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('uploadProfile', () => {
    const mockFile = {
      filename: '123-image.png',
      originalname: 'image.png',
      mimetype: 'image/png',
    } as Express.Multer.File;

    it('debe subir imagen y actualizar profile', async () => {
      const response = await controller.uploadProfile('uuid-1', mockFile);

      expect(service.updateProfile).toHaveBeenCalledWith(
        'uuid-1',
        '123-image.png',
      );
      expect(response.success).toBe(true);
      expect(response.data.profile).toBe('img.png');
    });

    it('debe lanzar BadRequestException si no se envía archivo', async () => {
      await expect(
        controller.uploadProfile('uuid-1', undefined),
      ).rejects.toThrow(BadRequestException);
    });

    it('debe lanzar NotFoundException si el usuario no existe al actualizar imagen', async () => {
      service.updateProfile.mockResolvedValueOnce(null);
      await expect(
        controller.uploadProfile('uuid-1', mockFile),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
