import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateContenidoDto {
  @IsInt()
  @Min(1)
  @Max(5)
  calificacion: number; // 1 a 5 estrellas

  @IsOptional()
  @IsString()
  comentario?: string;

  @IsOptional()
  @IsString()
  categoria?: string; 

  @IsOptional()
  @IsString()
  pedidoId?: string; 
}
