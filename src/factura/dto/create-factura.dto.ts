import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateFacturaDto {
  @IsString()
  @IsNotEmpty()
  razonSocial: string;

  @IsString()
  @IsNotEmpty()
  ruc_cedula: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  pedidoId: string;
}
