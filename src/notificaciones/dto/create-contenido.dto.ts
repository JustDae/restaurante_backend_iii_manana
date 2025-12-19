import { IsString, IsOptional } from 'class-validator';

export class CreateContenidoDto {
  @IsString()
  titulo: string;

  @IsString()
  mensaje: string;

  @IsOptional()
  @IsString()
  tipo?: string; 

  @IsOptional()
  @IsString()
  referenciaId?: string;
