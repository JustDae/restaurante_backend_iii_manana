import {
  IsString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class UpdatePedidoDto {
  @IsString()
  @IsOptional()
  nombre_cliente?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEmail()
  @IsOptional()
  correo?: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsDateString()
  @IsOptional()
  fecha_pedido?: Date;

  @IsNumber()
  @IsOptional()
  total?: number;
}
