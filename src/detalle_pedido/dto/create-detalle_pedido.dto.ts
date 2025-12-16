import { IsDate, IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateDetallePedidoDto {
  @IsString()
  nombre_cliente: string;

  @IsString()
  nombre_producto: string;

  @IsString()
  direccion: string;

  @IsNumber()
  cantidad: number;

  @IsDate()
  fecha_pedido: Date;

  @IsString()
  telefono: string;

  @IsEmail()
  correo: string;

  @IsString()
  estado: string;
}
