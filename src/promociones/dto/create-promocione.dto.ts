import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePromocioneDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsNumber()
  @IsNotEmpty()
  descuentoPorcentaje: number;

  @IsString()
  @IsNotEmpty()
  fechaInicio: string;

  @IsString()
  @IsNotEmpty()
  fechaFin: string;
}
