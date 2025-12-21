import { IsDateString } from 'class-validator';
import { CreateContenidoDto } from './create-contenido.dto';

export class CreateResenaDto {
  contenido: CreateContenidoDto;

  @IsDateString()
  fecha: Date; 
}
