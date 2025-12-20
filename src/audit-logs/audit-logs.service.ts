import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  async create(dto: CreateAuditLogDto): Promise<AuditLog> {
    const log = new this.auditLogModel(dto);
    return log.save();
  }

  async findAll(options: {
    page: number;
    limit: number;
    filters: { action?: string; userId?: string };
  }): Promise<any | null> {
    try {
      const { page, limit, filters } = options;
      const query: any = {};

      if (filters.action) {
        query.action = filters.action;
      }

      if (filters.userId) {
        query.userId = filters.userId;
      }

      const logs = await this.auditLogModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      return { items: logs, page, limit };
    } catch (err) {
      console.error('Error retrieving audit logs:', err);
      return null;
    }
  }
}
