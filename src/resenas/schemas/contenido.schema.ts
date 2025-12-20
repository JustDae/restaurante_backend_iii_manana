import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Contenido {
  @Prop({ required: true, min: 1, max: 5 })
  rating: number; 

  @Prop({ required: true })
  comentario: string; 
}

export const ContenidoSchema = SchemaFactory.createForClass(Contenido);
