import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Promocion extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  descripcion: string;

  @Prop({ required: true, unique: true })
  codigo: string;

  @Prop({ required: true })
  descuentoPorcentaje: number;

  @Prop({ required: true })
  fechaInicio: Date;

  @Prop({ required: true })
  fechaFin: Date;

  @Prop({ default: true })
  activo: boolean;
}

export const PromocionSchema = SchemaFactory.createForClass(Promocion);
