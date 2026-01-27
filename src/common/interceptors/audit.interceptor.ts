import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from '../../audit-logs/schemas/audit-log.schema';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    @InjectModel(AuditLog.name) private readonly auditModel: Model<AuditLog>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;

    return next.handle().pipe(
      tap(async (responseData) => {
        const log = new this.auditModel({
          action: `${method} ${url}`,
          entity: 'Pedido',
          payload: body,
          response: responseData,
          userId: user?.id || 'anonymous',
          status: 'SUCCESS',
          createdAt: new Date(),
        });

        try {
          await log.save();
        } catch (error) {
          console.error('Error guardando en Audit Logs (Mongo):', error);
        }
      }),
    );
  }
}
