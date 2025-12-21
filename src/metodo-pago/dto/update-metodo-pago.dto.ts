import { IsString, IsOptional } from 'class-validator';

export class UpdateMetodoPagoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
