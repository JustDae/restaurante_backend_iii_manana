import { IsString, IsDateString, IsOptional } from 'class-validator';
import { CreateContenidoDto } from './create-contenido.dto';

export class CreateNotificacioneDto {
  @IsString()
  usuarioId: string;

  @IsOptional()
  @IsDateString()
  fecha?: Date;

  contenido: CreateContenidoDto;

  @IsOptional()
  leido?: boolean;
}
