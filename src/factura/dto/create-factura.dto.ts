import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
} from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  pedidoId: string;
}
