import { IsNumber, IsString } from 'class-validator';

export class CreateMesaDto {
  @IsString()
  nombre_cliente: string;

  @IsNumber()
  numero_mesa: number;

  @IsString()
  fecha_reserva: string;

  @IsNumber()
  cantidad: number;

  @IsString()
  telefono_cliente: string;

  @IsString()
  correo: string;

  @IsString()
  estado: string;
}
