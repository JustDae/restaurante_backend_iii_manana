import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMetodoPagoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
