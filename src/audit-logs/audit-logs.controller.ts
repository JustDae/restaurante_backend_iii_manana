import {
  Controller,
  Get,
  Query,
  InternalServerErrorException,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { SuccessResponseDto } from '../common/dto/response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('audit-logs')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('action') action?: string,
    @Query('userId') userId?: string,
  ): Promise<SuccessResponseDto<any>> {
    const result = await this.auditLogsService.findAll({
      page,
      limit,
      filters: { action, userId },
    });

    if (!result) {
      throw new InternalServerErrorException('Could not retrieve audit logs');
    }

    return new SuccessResponseDto('Audit logs retrieved successfully', result);
  }
}
