import { IsString, IsOptional, IsInt, IsPositive } from 'class-validator';
export class UpdateDetallePedidoDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  productoId?: number;

  @IsInt()
  @IsPositive()
  cantidad?: number;

  @IsOptional()
  @IsString()
  pedidoId?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
