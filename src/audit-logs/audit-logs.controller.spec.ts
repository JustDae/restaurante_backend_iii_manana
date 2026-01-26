import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogsController } from './audit-logs.controller';
import { AuditLogsService } from './audit-logs.service';
import { InternalServerErrorException } from '@nestjs/common';
import { SuccessResponseDto } from '../common/dto/response.dto';

describe('AuditLogsController', () => {
  let controller: AuditLogsController;
  let service: AuditLogsService;

  const mockAuditLogsService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditLogsController],
      providers: [
        {
          provide: AuditLogsService,
          useValue: mockAuditLogsService,
        },
      ],
    }).compile();

    controller = module.get<AuditLogsController>(AuditLogsController);
    service = module.get<AuditLogsService>(AuditLogsService);
    jest.clearAllMocks();
  });

  test('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    test('Happy Path: retorna logs paginados con filtros', async () => {
      const mockResult = { items: [], meta: {} };
      mockAuditLogsService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(1, 10, 'LOGIN', 'user-123');

      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(mockResult);
      expect(mockAuditLogsService.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        filters: { action: 'LOGIN', userId: 'user-123' },
      });
    });

    test('Happy Path: usa valores por defecto si no se envían parámetros', async () => {
      const mockResult = { items: [], meta: {} };
      mockAuditLogsService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll();

      expect(result.data).toEqual(mockResult);
      expect(mockAuditLogsService.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        filters: { action: undefined, userId: undefined },
      });
    });

    test('Sad Path: lanza InternalServerErrorException si falla el servicio', async () => {
      mockAuditLogsService.findAll.mockResolvedValue(null);
      await expect(controller.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });
});