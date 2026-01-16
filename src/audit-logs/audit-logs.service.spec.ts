import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogsService } from './audit-logs.service';
import { getModelToken } from '@nestjs/mongoose';
import { AuditLog } from './schemas/audit-log.schema';

describe('AuditLogsService', () => {
  let service: AuditLogsService;

  const mockQueryChain = {
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  class MockAuditLogModel {
    constructor(private data: any) {}

    save() {
      return Promise.resolve(this.data);
    }

    static find() {
      return mockQueryChain;
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogsService,
        {
          provide: getModelToken(AuditLog.name),
          useValue: MockAuditLogModel,
        },
      ],
    }).compile();

    service = module.get<AuditLogsService>(AuditLogsService);
    jest.clearAllMocks();
  });

  test('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    test('Happy Path: crea y guarda un log correctamente', async () => {
      const dto = { action: 'LOGIN', userId: 'user-123' } as any;
      const result = await service.create(dto);
      expect(result).toEqual(dto);
    });

    test('Sad Path: lanza error si falla al guardar', async () => {
      const dto = { action: 'ERROR' } as any;
      jest.spyOn(MockAuditLogModel.prototype, 'save')
        .mockRejectedValueOnce(new Error('Mongo Error'));
      await expect(service.create(dto)).rejects.toThrow('Mongo Error');
      jest.restoreAllMocks();
    });
  });

  describe('findAll', () => {
    test('Happy Path: retorna logs paginados aplicando filtros', async () => {
      const mockLogs = [{ action: 'LOGIN' }, { action: 'LOGOUT' }];
      mockQueryChain.exec.mockResolvedValue(mockLogs);
      const options = { page: 1, limit: 10, filters: { action: 'LOGIN' } };
      const result = await service.findAll(options);
      expect(mockQueryChain.skip).toHaveBeenCalled();
      expect(mockQueryChain.limit).toHaveBeenCalled();
      expect(mockQueryChain.sort).toHaveBeenCalled();
      expect(mockQueryChain.exec).toHaveBeenCalled();
      expect(result).toHaveProperty('items', mockLogs);
    });

    test('Sad Path: retorna null si falla la consulta', async () => {
      mockQueryChain.exec.mockRejectedValueOnce(new Error('Query Error'));
      const options = { page: 1, limit: 10, filters: {} };
      const result = await service.findAll(options);
      expect(result).toBeNull();
    });
  });
});