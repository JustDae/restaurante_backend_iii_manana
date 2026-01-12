import { IsString, IsDateString, IsOptional, IsNotEmpty } from 'class-validator';
import { CreateContenidoDto } from './create-contenido.dto';

export class CreateNotificacioneDto {
  @IsString()
  usuarioId: string;

  @IsString()
  @IsNotEmpty()
  mensaje: string; 
  
  @IsString()
  @IsNotEmpty()
  tipo: string;
  
  @IsOptional()
  @IsDateString()
  fecha?: Date;

  contenido: CreateContenidoDto;

  @IsOptional()
  leido?: boolean;
}
