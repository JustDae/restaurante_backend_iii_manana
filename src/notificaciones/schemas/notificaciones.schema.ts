import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'typeorm';
import { Contenido, ContenidoSchema } from './contenido.schema';

@Schema({ timestamps: true })
export class Notificacione {
  @Prop({ required: true })
  usuarioId: string;

  @Prop({ type: ContenidoSchema, required: true })
  contenido: Contenido;

  @Prop({ default: false })
  leido: boolean;

  @Prop({ default: Date.now })
  fecha: Date;
}

export type NotificacioneDocument = Notificacione & Document;
export const NotificacioneSchema =
  SchemaFactory.createForClass(Notificacione);
