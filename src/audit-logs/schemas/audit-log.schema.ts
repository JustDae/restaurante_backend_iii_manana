import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ required: true })
  action: string; 

  @Prop({ required: true })
  entity: string; 

  @Prop()
  entityId?: string; 

  @Prop()
  userId?: string; 

  @Prop()
  description?: string; 
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
