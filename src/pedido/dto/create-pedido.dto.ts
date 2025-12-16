import {
  IsString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreatePedidoDto {
  @IsString()
  nombre_cliente: string;

  @IsString()
  direccion: string;

  @IsString()
  telefono: string;

  @IsEmail()
  correo: string;

  @IsString()
  estado: string;

  @IsDateString()
  fecha_pedido: Date;

  @IsNumber()
  @IsOptional()
  total?: number;
}
