import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Contenido, ContenidoSchema } from './contenido.schema';

@Schema({ timestamps: true })
export class Resena {
  @Prop({ required: true })
  usuarioId: string;

  @Prop({ required: true })
  restauranteId: string;

  @Prop({ type: ContenidoSchema, required: true })
  contenido: Contenido;

  @Prop({ default: Date.now })
  fecha: Date;
}

export type ResenaDocument = Resena & Document;
export const ResenaSchema = SchemaFactory.createForClass(Resena);
