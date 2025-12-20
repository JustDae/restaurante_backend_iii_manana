import {
  IsInt,
  IsPositive,
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateDetallePedidoDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  productoId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  cantidad: number;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  pedidoId: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
