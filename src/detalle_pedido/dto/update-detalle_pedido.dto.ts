import { IsDate, IsNumber, IsString, IsOptional } from 'class-validator';
export class UpdateDetallePedidoDto {
  @IsOptional()
  @IsString()
  nombre_cliente?: string;

  @IsOptional()
  @IsString()
  nombre_producto?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsNumber()
  cantidad?: number;

  @IsOptional()
  @IsDate()
  fecha_pedido?: Date;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  correo?: string;

  @IsOptional()
  @IsString()
  estado?: string;
}
