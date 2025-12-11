import { IsDate, IsNumber, IsString } from 'class-validator';

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

  @IsString()
  correo: string;

  @IsString()
  estado: string;
}
