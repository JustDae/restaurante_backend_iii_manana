import { IsString, IsNotEmpty, IsNumber, IsPositive, IsInt } from 'class-validator';

export class CreateFacturaDto {
  @IsString()
  @IsNotEmpty()
  razonSocial: string;

  @IsString()
  @IsNotEmpty()
  ruc_cedula: string;

  @IsNumber()
  @IsPositive()
  total: number;

  @IsInt()
  @IsPositive()
  pedidoId: number;
}