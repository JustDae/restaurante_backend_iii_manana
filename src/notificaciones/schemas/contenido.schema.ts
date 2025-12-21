import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'typeorm';

@Schema({ _id: false })
export class Contenido {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  mensaje: string;

  @Prop({ default: 'sistema' })
  tipo: string;

  @Prop()
  referenciaId: string;
}

export type ContenidoDocument = Contenido & Document;
export const ContenidoSchema = SchemaFactory.createForClass(Contenido);
