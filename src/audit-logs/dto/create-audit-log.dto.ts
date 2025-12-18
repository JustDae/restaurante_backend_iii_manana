export class CreateAuditLogDto {
  action: string;
  entity: string;
  entityId?: string;
  userId?: string;
  description?: string;
}
